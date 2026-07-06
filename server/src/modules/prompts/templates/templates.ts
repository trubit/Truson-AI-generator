import { PromptCategory, PromptType, TechStackId, PromptTemplateDefinition } from '../../../../../shared/index';

export const PROMPT_TEMPLATES: PromptTemplateDefinition[] = [
  {
    id: 'clean-arch-nestjs',
    title: 'NestJS Clean Architecture Template',
    category: 'Architecture',
    promptType: 'Architecture',
    techStack: ['nestjs', 'typescript'],
    description: 'Generates structured NestJS backend directories adhering to clean architecture rules',
    systemRole: 'You are an expert Principal Software Architect specialized in NestJS and Clean Architecture.',
    templateText: `Design a premium, scalable NestJS backend module.
Language: TypeScript
Architecture Style: Clean Architecture / DDD
Requirements: {requirements}
Framework Details: NestJS Controllers, Services, Repositories, Domain Entities, and use cases.
Architecture details override: {architectureDetails}`,
    variables: ['requirements', 'architectureDetails'],
  },
  {
    id: 'saas-react-query',
    title: 'React SaaS State Template',
    category: 'Frontend',
    promptType: 'Coding',
    techStack: ['react', 'typescript'],
    description: 'Generates robust React Query mutations and queries for SaaS platforms',
    systemRole: 'You are a Senior Frontend Engineer specialized in React and TanStack React Query.',
    templateText: `Write an enterprise-grade React Hook powered by React Query.
Language: {language}
Requirements: {requirements}
Details: Include proper query/mutation hooks, optimistic updates, request retry strategies, and unified error handlers.
Framework details override: {architectureDetails}`,
    variables: ['requirements', 'architectureDetails', 'language'],
  },
  {
    id: 'microservices-go-grpc',
    title: 'Go gRPC Microservice Template',
    category: 'Microservices',
    promptType: 'Architecture',
    techStack: ['go'],
    description: 'Generates gRPC proto structure and Go server setup for scalable microservices',
    systemRole: 'You are a Lead Infrastructure Engineer specialized in Go, gRPC, and Microservices.',
    templateText: `Create a Go gRPC microservice template.
Language: Go (Golang)
Architecture Style: Event-Driven Microservice
Requirements: {requirements}
Include protobuf definitions, server configuration, connection pools, and database migrations.
Architecture details override: {architectureDetails}`,
    variables: ['requirements', 'architectureDetails'],
  },
  {
    id: 'db-design-postgres',
    title: 'PostgreSQL Enterprise Design Template',
    category: 'Database',
    promptType: 'Database Design',
    techStack: ['postgresql'],
    description: 'Generates SQL DDL schemas, indexes, and performance queries for PostgreSQL',
    systemRole: 'You are a Principal Database Administrator specialized in PostgreSQL schema optimization.',
    templateText: `Create a relational database schema for PostgreSQL.
Requirements: {requirements}
Details: Include SQL DDL, necessary foreign key indexes, JSONB column indexing, audit triggers, and migration steps.
Details override: {architectureDetails}`,
    variables: ['requirements', 'architectureDetails'],
  },
];

export const getTemplateForRequest = (
  category: PromptCategory,
  promptType: PromptType,
  techStack: TechStackId
): PromptTemplateDefinition => {
  // Find match or fallback to generic template
  const match = PROMPT_TEMPLATES.find(
    (t) => t.category === category && t.promptType === promptType && t.techStack.includes(techStack)
  ) || PROMPT_TEMPLATES.find((t) => t.techStack.includes(techStack)) || PROMPT_TEMPLATES.find((t) => t.category === category);

  if (match) return match;

  return {
    id: 'generic-fallback',
    title: 'Generic Architecture Template',
    category,
    promptType,
    techStack: [techStack],
    description: 'Standard architectural prompt compiler',
    systemRole: `You are a Principal Software Engineer specialized in ${techStack}.`,
    templateText: `Build an enterprise-grade solution for:
Category: {category}
Prompt Type: {promptType}
Tech Stack: {techStack}
Requirements: {requirements}
Architecture context: {architectureDetails}`,
    variables: ['category', 'promptType', 'techStack', 'requirements', 'architectureDetails'],
  };
};
