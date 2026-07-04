import { PromptCategory, PromptType, TechStackId, PromptGeneratorResult } from '../../../../../shared/index';
import { IPromptTemplate } from '../templates/prompt-template.interface';

export abstract class BasePromptGenerator {
  public abstract readonly category: PromptCategory;

  protected templates: Map<string, IPromptTemplate> = new Map();

  public registerTemplate(template: IPromptTemplate): void {
    this.templates.set(`${template.category}:${template.promptType}`, template);
  }

  public abstract preparePrompt(options: {
    promptType: PromptType;
    techStack: TechStackId;
    requirements: string;
    architectureDetails?: string;
  }): Promise<PromptGeneratorResult>;
}
