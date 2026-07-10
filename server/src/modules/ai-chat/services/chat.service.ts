import { ConversationModel, IConversationDocument } from '../models/conversation.model';
import { MessageModel, IMessageDocument } from '../models/message.model';
import { aiRegistryService } from '../../ai/services/ai-registry.service';
import { AppError } from '../../../middleware/error.middleware';
import mongoose from 'mongoose';
import { AIProviderId } from '../../../../../shared/index';

export class ChatService {
  /**
   * Create a new conversation session
   */
  public async createConversation(userId: string, data: {
    title: string;
    provider?: string;
    category?: string;
  }): Promise<IConversationDocument> {
    return await ConversationModel.create({
      user: new mongoose.Types.ObjectId(userId),
      title: data.title,
      provider: data.provider || 'openai',
      category: data.category || 'General Writing',
      status: 'active',
      isPinned: false,
      isFavorite: false,
    });
  }

  /**
   * Fetch conversations list for user with search and filtering
   */
  public async listConversations(userId: string, query: {
    search?: string;
    provider?: string;
    category?: string;
    status?: 'active' | 'archived';
    isFavorite?: boolean;
  }): Promise<IConversationDocument[]> {
    const filter: any = { user: new mongoose.Types.ObjectId(userId) };

    if (query.status) {
      filter.status = query.status;
    } else {
      filter.status = 'active'; // Default active
    }

    if (query.provider) {
      filter.provider = query.provider;
    }

    if (query.category) {
      filter.category = query.category;
    }

    if (query.isFavorite !== undefined) {
      filter.isFavorite = query.isFavorite;
    }

    if (query.search) {
      filter.title = { $regex: query.search, $options: 'i' };
    }

    // Sort pinned conversations first, then by updated date
    return await ConversationModel.find(filter).sort({ isPinned: -1, updatedAt: -1 });
  }

  /**
   * Update conversation (rename, pin, favorite, archive, provider)
   */
  public async updateConversation(
    userId: string,
    conversationId: string,
    updates: Partial<Pick<IConversationDocument, 'title' | 'status' | 'isPinned' | 'isFavorite' | 'provider'>>
  ): Promise<IConversationDocument> {
    const conversation = await ConversationModel.findOne({
      _id: new mongoose.Types.ObjectId(conversationId),
      user: new mongoose.Types.ObjectId(userId),
    });

    if (!conversation) {
      throw new AppError('Conversation not found or unauthorized', 404);
    }

    Object.assign(conversation, updates);
    return await conversation.save();
  }

  /**
   * Delete conversation and all its messages
   */
  public async deleteConversation(userId: string, conversationId: string): Promise<void> {
    const conversation = await ConversationModel.findOne({
      _id: new mongoose.Types.ObjectId(conversationId),
      user: new mongoose.Types.ObjectId(userId),
    });

    if (!conversation) {
      throw new AppError('Conversation not found or unauthorized', 404);
    }

    // Delete conversation and messages
    await ConversationModel.deleteOne({ _id: conversation._id });
    await MessageModel.deleteMany({ conversation: conversation._id });
  }

  /**
   * Fetch thread messages
   */
  public async listMessages(
    userId: string,
    conversationId: string,
    pagination: { limit?: number; before?: string }
  ): Promise<IMessageDocument[]> {
    // Ownership check
    const conversation = await ConversationModel.findOne({
      _id: new mongoose.Types.ObjectId(conversationId),
      user: new mongoose.Types.ObjectId(userId),
    });

    if (!conversation) {
      throw new AppError('Conversation not found or unauthorized', 404);
    }

    const filter: any = { conversation: conversation._id };
    if (pagination.before) {
      filter._id = { $lt: new mongoose.Types.ObjectId(pagination.before) };
    }

    return await MessageModel.find(filter)
      .sort({ createdAt: 1 })
      .limit(pagination.limit || 50);
  }

  /**
   * Delete single message log
   */
  public async deleteMessage(userId: string, conversationId: string, messageId: string): Promise<void> {
    const conversation = await ConversationModel.findOne({
      _id: new mongoose.Types.ObjectId(conversationId),
      user: new mongoose.Types.ObjectId(userId),
    });

    if (!conversation) {
      throw new AppError('Conversation not found or unauthorized', 404);
    }

    await MessageModel.deleteOne({
      _id: new mongoose.Types.ObjectId(messageId),
      conversation: conversation._id,
    });
  }

  /**
   * Send a user message and trigger AI Generation
   */
  public async sendMessage(
    userId: string,
    conversationId: string,
    params: {
      content: string;
      retryMessageId?: string;
      regenerate?: boolean;
    }
  ): Promise<{ userMessage?: IMessageDocument; aiResponse: IMessageDocument }> {
    const conversation = await ConversationModel.findOne({
      _id: new mongoose.Types.ObjectId(conversationId),
      user: new mongoose.Types.ObjectId(userId),
    });

    if (!conversation) {
      throw new AppError('Conversation not found or unauthorized', 404);
    }

    let userMessage: IMessageDocument | undefined;

    // If regenerating, we do not create a new user message
    if (!params.regenerate) {
      userMessage = await MessageModel.create({
        conversation: conversation._id,
        sender: 'user',
        content: params.content,
        generationStatus: 'SUCCESS',
      });
    }

    // Prepare system role prompt context based on conversation category
    const categoryInfo = conversation.category || 'General Writing';
    const systemPrompt = `You are a helpful AI Assistant specialized in ${categoryInfo}. 
    Provide comprehensive, structured, professional explanations. 
    Ensure formatting is beautiful using clear Markdown headers, bold titles, lists, tables, or formatted code blocks.`;

    const providerId = conversation.provider as AIProviderId;
    const startTime = Date.now();
    let aiResponse: IMessageDocument;

    try {
      // Execute live generation using registry's robust failover fallback loop
      const result = await aiRegistryService.generateCompletion(params.content, {
        providerId,
        systemPrompt,
        userId,
        category: `Chat: ${categoryInfo}`,
      });

      aiResponse = await MessageModel.create({
        conversation: conversation._id,
        sender: 'ai',
        content: result.text,
        generationStatus: 'SUCCESS',
        tokenUsage: result.usage || {
          promptTokens: Math.ceil(params.content.length / 4),
          completionTokens: Math.ceil(result.text.length / 4),
          totalTokens: Math.ceil((params.content.length + result.text.length) / 4),
        },
        processingTime: Date.now() - startTime,
      });

      // Update conversation updated timestamp
      conversation.updatedAt = new Date();
      await conversation.save();

    } catch (err: any) {
      // Create failure message in logs so history tracks it
      aiResponse = await MessageModel.create({
        conversation: conversation._id,
        sender: 'ai',
        content: `Error generating response: ${err.message || 'AI timeout or rate limits reached'}`,
        generationStatus: 'FAILED',
        processingTime: Date.now() - startTime,
      });
    }

    return { userMessage, aiResponse };
  }

  /**
   * Export conversation logs
   */
  public async exportConversation(
    userId: string,
    conversationId: string,
    format: 'md' | 'txt' | 'pdf' | 'docx'
  ): Promise<{ filename: string; contentType: string; data: any }> {
    const conversation = await ConversationModel.findOne({
      _id: new mongoose.Types.ObjectId(conversationId),
      user: new mongoose.Types.ObjectId(userId),
    });

    if (!conversation) {
      throw new AppError('Conversation not found or unauthorized', 404);
    }

    const messages = await MessageModel.find({ conversation: conversation._id }).sort({ createdAt: 1 });

    let data: any = '';
    let filename = `conversation-${conversationId}-${Date.now()}`;
    let contentType = 'text/plain';

    if (format === 'md') {
      contentType = 'text/markdown';
      filename += '.md';
      data += `# Conversation: ${conversation.title}\n`;
      data += `Category: ${conversation.category} | Provider: ${conversation.provider.toUpperCase()}\n`;
      data += `Date: ${conversation.createdAt.toLocaleDateString()}\n\n---\n\n`;

      messages.forEach((msg) => {
        const senderLabel = msg.sender === 'user' ? '### User' : '### AI Assistant';
        data += `${senderLabel} (${msg.createdAt.toLocaleTimeString()})\n\n${msg.content}\n\n`;
      });
    } else if (format === 'pdf') {
      const PDFDocument = (await import('pdfkit')).default;
      contentType = 'application/pdf';
      filename += '.pdf';

      const doc = new PDFDocument();
      const buffers: Buffer[] = [];
      doc.on('data', (chunk) => buffers.push(chunk));

      const pdfPromise = new Promise<Buffer>((resolve, reject) => {
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);
      });

      doc.fontSize(20).text(`Conversation: ${conversation.title}`, { underline: true });
      doc.fontSize(12).text(`Category: ${conversation.category} | Provider: ${conversation.provider.toUpperCase()}`);
      doc.moveDown();

      messages.forEach((msg) => {
        const senderLabel = msg.sender === 'user' ? 'User' : 'AI Assistant';
        doc.font('Helvetica-Bold').fontSize(12).text(`${senderLabel} (${msg.createdAt.toLocaleTimeString()}):`);
        doc.font('Helvetica').fontSize(10).text(msg.content);
        doc.moveDown();
      });

      doc.end();
      data = await pdfPromise;
    } else if (format === 'docx') {
      const { Document, Packer, Paragraph, TextRun } = await import('docx');
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      filename += '.docx';

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Conversation: ${conversation.title}`,
                    bold: true,
                    size: 32,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Category: ${conversation.category} | Provider: ${conversation.provider.toUpperCase()}`,
                    size: 24,
                  }),
                ],
              }),
              new Paragraph({ text: "" }),
              ...messages.flatMap((msg) => {
                const senderLabel = msg.sender === 'user' ? 'User' : 'AI Assistant';
                return [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `${senderLabel} (${msg.createdAt.toLocaleTimeString()}):`,
                        bold: true,
                        size: 22,
                      }),
                    ],
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: msg.content,
                        size: 20,
                      }),
                    ],
                  }),
                  new Paragraph({ text: "" }),
                ];
              }),
            ],
          },
        ],
      });

      data = await Packer.toBuffer(doc);
    } else {
      contentType = 'text/plain';
      filename += '.txt';
      data += `Conversation: ${conversation.title}\n\n`;
      messages.forEach((msg) => {
        data += `${msg.sender.toUpperCase()}: ${msg.content}\n\n`;
      });
    }

    return { filename, contentType, data };
  }
}

export const chatService = new ChatService();
