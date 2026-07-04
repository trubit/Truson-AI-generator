import { PromptCategory, PromptType, TechStackId } from '../../../../../shared/index';

export interface IPromptTemplate {
  id: string;
  category: PromptCategory;
  promptType: PromptType;
  techStack: TechStackId[];
  systemRole: string;
  instructions: string[];
  constructPrompt(params: {
    requirements: string;
    architectureDetails?: string;
    techStack: TechStackId;
  }): string;
}
