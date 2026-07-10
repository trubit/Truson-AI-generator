import { contentRepository } from '../repositories/content.repository';
import { CONTENT_TEMPLATES } from '../templates/content-templates';
import { aiRegistryService } from '../../ai/services/ai-registry.service';
import { AppError } from '../../../middleware/error.middleware';
import { IContentDocument } from '../models/content.model';
import { AIProviderId } from '../../../../../shared/index';
import mongoose from 'mongoose';

export class ContentService {
  public async createContent(userId: string, data: any): Promise<IContentDocument> {
    const words = data.generatedContent ? data.generatedContent.trim().split(/\s+/).filter(Boolean).length : 0;
    const readingTime = Math.max(1, Math.ceil(words / 225));

    return await contentRepository.create(userId, {
      ...data,
      wordCount: words,
      readingTime,
    });
  }

  public async getContent(userId: string, id: string): Promise<IContentDocument> {
    const doc = await contentRepository.findById(id, userId);
    if (!doc) {
      throw new AppError('Document not found or unauthorized', 404);
    }
    return doc;
  }

  public async updateContent(userId: string, id: string, updates: any): Promise<IContentDocument> {
    const doc = await this.getContent(userId, id);

    if (updates.generatedContent !== undefined && updates.generatedContent !== doc.generatedContent) {
      const versionNumber = await contentRepository.getNextVersionNumber(id);
      await contentRepository.createVersion(id, versionNumber, doc.generatedContent);
    }

    if (updates.generatedContent !== undefined) {
      const words = updates.generatedContent.trim().split(/\s+/).filter(Boolean).length;
      updates.wordCount = words;
      updates.readingTime = Math.max(1, Math.ceil(words / 225));
    }

    const updated = await contentRepository.update(id, userId, updates);
    if (!updated) {
      throw new AppError('Failed to update document', 500);
    }
    return updated;
  }

  public async deleteContent(userId: string, id: string): Promise<void> {
    const success = await contentRepository.delete(id, userId);
    if (!success) {
      throw new AppError('Document not found or unauthorized', 404);
    }
  }

  public async listContent(userId: string, query: any) {
    return await contentRepository.list(userId, query);
  }

  public async getVersions(userId: string, id: string) {
    await this.getContent(userId, id);
    return await contentRepository.getVersions(id);
  }

  public async restoreVersion(userId: string, id: string, versionNumber: number): Promise<IContentDocument> {
    await this.getContent(userId, id);
    const versions = await contentRepository.getVersions(id);
    const target = versions.find(v => v.versionNumber === versionNumber);
    if (!target) {
      throw new AppError('Version not found', 404);
    }
    return await this.updateContent(userId, id, { generatedContent: target.previousContent });
  }

  public async generateContent(userId: string, data: {
    templateId: string;
    providerId: string;
    variables: Record<string, string>;
  }): Promise<{ text: string; templateName: string; contentType: string; category: string }> {
    const template = CONTENT_TEMPLATES.find(t => t.id === data.templateId);
    if (!template) {
      throw new AppError('Selected template not found', 400);
    }

    let prompt = template.userPromptTemplate;
    for (const key in data.variables) {
      prompt = prompt.replace(new RegExp(`{${key}}`, 'g'), data.variables[key] || '');
    }

    const providerId = data.providerId as AIProviderId;
    const result = await aiRegistryService.generateCompletion(prompt, {
      providerId,
      systemPrompt: template.systemPrompt,
      userId,
      category: `Writing Studio: ${template.category}`,
    });

    return {
      text: result.text,
      templateName: template.name,
      contentType: template.contentType,
      category: template.category,
    };
  }

  public async exportContent(userId: string, id: string, format: 'md' | 'txt' | 'pdf' | 'docx') {
    const doc = await this.getContent(userId, id);
    let data: any = '';
    let filename = `${doc.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
    let contentType = 'text/plain';

    if (format === 'md') {
      contentType = 'text/markdown';
      filename += '.md';
      data = `# ${doc.title}\n\nCategory: ${doc.category} | Type: ${doc.contentType}\n\n---\n\n${doc.generatedContent}`;
    } else if (format === 'pdf') {
      const PDFDocument = (await import('pdfkit')).default;
      contentType = 'application/pdf';
      filename += '.pdf';

      const pdf = new PDFDocument();
      const buffers: Buffer[] = [];
      pdf.on('data', (chunk) => buffers.push(chunk));

      const pdfPromise = new Promise<Buffer>((resolve, reject) => {
        pdf.on('end', () => resolve(Buffer.concat(buffers)));
        pdf.on('error', reject);
      });

      pdf.fontSize(22).font('Helvetica-Bold').text(doc.title, { align: 'center' });
      pdf.fontSize(10).font('Helvetica-Oblique').text(`Category: ${doc.category} | Type: ${doc.contentType}`, { align: 'center' });
      pdf.moveDown(2);
      pdf.fontSize(12).font('Helvetica').text(doc.generatedContent);
      pdf.end();

      data = await pdfPromise;
    } else if (format === 'docx') {
      const { Document, Packer, Paragraph, TextRun } = await import('docx');
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      filename += '.docx';

      const wordDoc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: doc.title,
                    bold: true,
                    size: 36,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Category: ${doc.category} | Type: ${doc.contentType}`,
                    italics: true,
                    size: 20,
                  }),
                ],
              }),
              new Paragraph({ text: '' }),
              ...doc.generatedContent.split('\n').map(line => new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    size: 22,
                  }),
                ],
              })),
            ],
          },
        ],
      });

      data = await Packer.toBuffer(wordDoc);
    } else {
      contentType = 'text/plain';
      filename += '.txt';
      data = `${doc.title}\n\nCategory: ${doc.category} | Type: ${doc.contentType}\n\n${doc.generatedContent}`;
    }

    return { filename, contentType, data };
  }
}

export const contentService = new ContentService();
