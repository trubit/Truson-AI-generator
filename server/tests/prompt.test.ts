import { promptEngineService } from '../src/modules/prompts/services/prompt-engine.service';
import { getTemplateForRequest } from '../src/modules/prompts/templates/templates';

describe('Prompt Template Compilation Tests', () => {
  it('should retrieve a specialized template when exact match exists', () => {
    const template = getTemplateForRequest('Architecture', 'Architecture', 'nestjs');
    expect(template.id).toBe('clean-arch-nestjs');
    expect(template.variables).toContain('requirements');
  });

  it('should fallback to generic template when no specific match exists', () => {
    const template = getTemplateForRequest('Testing', 'Debugging', 'rust');
    expect(template.id).toBe('generic-fallback');
    expect(template.variables).toContain('requirements');
  });

  it('should compile template parameters correctly and inject requirements', async () => {
    const result = await promptEngineService.prepareDeveloperPrompt({
      category: 'Frontend',
      promptType: 'Coding',
      techStack: 'react',
      requirements: 'Create a payment integration hook',
      architectureDetails: 'Use Paystack SDK',
    });

    expect(result.generatedPrompt).toContain('Create a payment integration hook');
    expect(result.generatedPrompt).toContain('Use Paystack SDK');
    expect(result.techStack).toBe('react');
  });
});
