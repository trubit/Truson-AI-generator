import { PromptGeneratorResult } from '../../../../../shared/index';
import { PromptHistoryModel } from '../models/prompt-history.model';
import mongoose from 'mongoose';

export class PromptRepository {
  public async save(result: PromptGeneratorResult & { userId?: string }): Promise<PromptGeneratorResult> {
    if (result.userId && mongoose.connection.readyState === 1) {
      const historyDoc = await PromptHistoryModel.create({
        user: new mongoose.Types.ObjectId(result.userId),
        promptCategory: result.category,
        programmingLanguage: result.techStack,
        framework: result.meta?.bestPractices?.[0] || 'Generic',
        promptType: result.promptType,
        generatedPrompt: result.generatedPrompt,
        favoriteStatus: false,
      });
      result.id = historyDoc._id.toString();
    }
    return result;
  }

  public async findAll(): Promise<PromptGeneratorResult[]> {
    if (mongoose.connection.readyState !== 1) {
      return [];
    }
    const docs = await PromptHistoryModel.find().sort({ createdAt: -1 });
    return docs.map(doc => ({
      id: doc._id.toString(),
      category: doc.promptCategory as any,
      promptType: doc.promptType as any,
      techStack: doc.programmingLanguage as any,
      generatedPrompt: doc.generatedPrompt,
      meta: {
        recommendedModel: 'claude-3-5-sonnet-latest',
        estimatedTokens: Math.ceil(doc.generatedPrompt.length / 4),
        bestPractices: [
          'Adhere to enterprise SOLID principles',
          'Enforce strict input validation schemas (e.g. Zod)',
          'Ensure robust error boundaries, structured logging, and operational observability',
        ],
      },
      createdAt: doc.createdAt.toISOString(),
    }));
  }
}

export const promptRepository = new PromptRepository();
