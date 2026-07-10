import { chatService } from '../src/modules/ai-chat/services/chat.service';
import { ConversationModel } from '../src/modules/ai-chat/models/conversation.model';
import { MessageModel } from '../src/modules/ai-chat/models/message.model';
import { connectDatabase } from '../src/database/connection';
import mongoose from 'mongoose';

// Set timeout to 30s
jest.setTimeout(30000);

describe('AI Chat & Conversation Service Suite', () => {
  const mockUserId = new mongoose.Types.ObjectId().toString();
  let conversationId = '';

  beforeAll(async () => {
    await connectDatabase();
    await ConversationModel.deleteMany({});
    await MessageModel.deleteMany({});
  });

  afterAll(async () => {
    await ConversationModel.deleteMany({});
    await MessageModel.deleteMany({});
    await mongoose.connection.close();
  });

  it('should create a new conversation session correctly', async () => {
    const conv = await chatService.createConversation(mockUserId, {
      title: 'Design Review: Hexagonal Architecture',
      category: 'Architecture',
      provider: 'gemini',
    });

    expect(conv._id).toBeDefined();
    expect(conv.title).toBe('Design Review: Hexagonal Architecture');
    expect(conv.category).toBe('Architecture');
    expect(conv.provider).toBe('gemini');
    expect(conv.status).toBe('active');

    conversationId = conv._id.toString();
  });

  it('should update conversation configurations successfully', async () => {
    const updated = await chatService.updateConversation(mockUserId, conversationId, {
      isPinned: true,
      isFavorite: true,
      title: 'Refactored Design Review',
    });

    expect(updated.isPinned).toBe(true);
    expect(updated.isFavorite).toBe(true);
    expect(updated.title).toBe('Refactored Design Review');
  });

  it('should list conversations correctly and apply search regex filters', async () => {
    const list = await chatService.listConversations(mockUserId, {
      search: 'Refactored',
    });

    expect(list.length).toBe(1);
    expect(list[0].title).toBe('Refactored Design Review');
  });

  it('should export conversation logs into markdown, plain text, and word formatting structures', async () => {
    // Add user and assistant mock messages first
    await MessageModel.create([
      { conversation: new mongoose.Types.ObjectId(conversationId), sender: 'user', content: 'What is hexagonal arch?' },
      { conversation: new mongoose.Types.ObjectId(conversationId), sender: 'ai', content: 'A decoupling pattern...' },
    ]);

    const exportMD = await chatService.exportConversation(mockUserId, conversationId, 'md');
    expect(exportMD.filename).toContain('.md');
    expect(exportMD.data).toContain('# Conversation:');
    expect(exportMD.data).toContain('What is hexagonal arch?');

    const exportTXT = await chatService.exportConversation(mockUserId, conversationId, 'txt');
    expect(exportTXT.filename).toContain('.txt');
    expect(exportTXT.data).toContain('USER: What is hexagonal');
  });
});
