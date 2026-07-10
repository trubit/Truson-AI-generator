import { PromptLibraryModel } from '../src/modules/prompts/models/prompt-library.model';
import { connectDatabase } from '../src/database/connection';
import mongoose from 'mongoose';

// Set timeout to 30s
jest.setTimeout(30000);

describe('Prompt Library Database Integrations Suite', () => {
  const mockUserId = new mongoose.Types.ObjectId().toString();
  let cardId = '';

  beforeAll(async () => {
    await connectDatabase();
    await PromptLibraryModel.deleteMany({});
  });

  afterAll(async () => {
    await PromptLibraryModel.deleteMany({});
    await mongoose.connection.close();
  });

  it('should save a compiled prompt to library cards with tags', async () => {
    const card = await PromptLibraryModel.create({
      user: new mongoose.Types.ObjectId(mockUserId),
      prompt: 'Refactor NestJS controllers filters to catch validation errors',
      category: 'Backend',
      programmingLanguage: 'TypeScript',
      framework: 'NestJS',
      tags: ['clean-code', 'nestjs'],
    });

    expect(card._id).toBeDefined();
    expect(card.prompt).toContain('Refactor NestJS');
    expect(card.tags).toContain('nestjs');

    cardId = card._id.toString();
  });

  it('should search and filter saved prompt cards by tags, languages, and frameworks', async () => {
    const results = await PromptLibraryModel.find({
      user: new mongoose.Types.ObjectId(mockUserId),
      programmingLanguage: 'TypeScript',
      tags: 'nestjs',
    });

    expect(results.length).toBe(1);
    expect(results[0].framework).toBe('NestJS');
  });

  it('should delete a prompt card from library successfully', async () => {
    const deleteResult = await PromptLibraryModel.deleteOne({
      _id: new mongoose.Types.ObjectId(cardId),
      user: new mongoose.Types.ObjectId(mockUserId),
    });

    expect(deleteResult.deletedCount).toBe(1);
  });
});
