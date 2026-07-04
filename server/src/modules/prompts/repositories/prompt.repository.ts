import { PromptGeneratorResult } from '../../../../../shared/index';

export class PromptRepository {
  private inMemoryStore: PromptGeneratorResult[] = [];

  public async save(result: PromptGeneratorResult): Promise<PromptGeneratorResult> {
    this.inMemoryStore.push(result);
    return result;
  }

  public async findAll(): Promise<PromptGeneratorResult[]> {
    return this.inMemoryStore;
  }
}

export const promptRepository = new PromptRepository();
