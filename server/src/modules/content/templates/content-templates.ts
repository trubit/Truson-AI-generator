export interface IContentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  contentType: string;
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'select';
    options?: string[];
    default?: string;
  }>;
  systemPrompt: string;
  userPromptTemplate: string;
}

export const CONTENT_TEMPLATES: IContentTemplate[] = [
  {
    id: 'blog-post',
    name: 'SEO Optimized Blog Post',
    description: 'Generate high-ranking, engaging long-form blog articles.',
    category: 'Blog Writing',
    contentType: 'Blog Post',
    fields: [
      { name: 'topic', label: 'Article Topic', type: 'text', default: 'Artificial Intelligence in Healthcare' },
      { name: 'tone', label: 'Tone of Voice', type: 'select', options: ['Professional', 'Informative', 'Casual', 'Witty', 'Empathetic'], default: 'Professional' },
      { name: 'keywords', label: 'Target Keywords (comma separated)', type: 'text', default: 'ai healthcare, medical diagnostics, machine learning' },
      { name: 'outline', label: 'Outline Details (Optional)', type: 'textarea', default: '' }
    ],
    systemPrompt: 'You are an elite SEO copywriter and expert blog post generator. You write high-precision, long-form content optimized for search intent and readability.',
    userPromptTemplate: 'Write a comprehensive, engaging SEO optimized blog post about: "{topic}".\nTone: {tone}.\nTarget Keywords to naturally integrate: {keywords}.\nOutline instructions: {outline}.\nWrite the content in Markdown format, including headings (H2, H3), paragraphs, and key takeaways.'
  },
  {
    id: 'product-desc',
    name: 'E-commerce Product Description',
    description: 'Create high-converting copy that describes product features and benefits.',
    category: 'Product Writing',
    contentType: 'Product Description',
    fields: [
      { name: 'productName', label: 'Product Name', type: 'text' },
      { name: 'features', label: 'Key Features / Bullet Points', type: 'textarea' },
      { name: 'audience', label: 'Target Audience', type: 'text', default: 'Tech-savvy professionals' }
    ],
    systemPrompt: 'You are an e-commerce copywriting specialist. You write compelling product descriptions that emphasize both features and benefits to drive conversions.',
    userPromptTemplate: 'Write a persuasive product description for: "{productName}".\nTarget Audience: {audience}.\nKey Features/Specs:\n{features}.\nInclude a catchy title, a short emotional hook paragraph, 4-5 bulleted benefits, and a call-to-action.'
  },
  {
    id: 'seo-meta',
    name: 'SEO Meta Titles & Descriptions',
    description: 'Generate CTR-optimized meta tags for search results.',
    category: 'SEO Writing',
    contentType: 'Meta Tags',
    fields: [
      { name: 'urlTopic', label: 'Page Topic or URL', type: 'text' },
      { name: 'keywords', label: 'Target Keywords', type: 'text' }
    ],
    systemPrompt: 'You are an SEO specialist. You generate highly optimized Meta Titles (under 60 chars) and Meta Descriptions (under 160 chars) to maximize CTR on SERPs.',
    userPromptTemplate: 'Generate 3 alternative CTR-optimized Meta Titles and Meta Descriptions for a page about: "{urlTopic}".\nPrimary Keywords: {keywords}.\nFormat clearly.'
  },
  {
    id: 'landing-page',
    name: 'Landing Page Hero Copy',
    description: 'Create hero section titles, subtitles, and CTA buttons.',
    category: 'Marketing Content',
    contentType: 'Landing Page',
    fields: [
      { name: 'product', label: 'Product or Service name', type: 'text' },
      { name: 'valueProp', label: 'Core Value Proposition', type: 'textarea' }
    ],
    systemPrompt: 'You are a high-conversion landing page copywriting architect. You write bold, clear, and action-oriented hero section content.',
    userPromptTemplate: 'Write landing page copy for: "{product}".\nCore Value Prop: {valueProp}.\nProvide 3 variations of: Hero Headline, Subheadline, Primary CTA Button Text, and Secondary CTA Button Text.'
  },
  {
    id: 'linkedin-post',
    name: 'LinkedIn Thought Leadership Post',
    description: 'Craft viral, engaging posts for professional networks.',
    category: 'Social Media',
    contentType: 'LinkedIn Post',
    fields: [
      { name: 'insight', label: 'Core Insight / Takeaway', type: 'textarea' },
      { name: 'style', label: 'Format style', type: 'select', options: ['Storytelling', 'Bulleted List', 'Hook-Heavy', 'Short-form'], default: 'Storytelling' }
    ],
    systemPrompt: 'You are a professional brand manager and LinkedIn content creator. You write highly engaging, readable thought leadership posts.',
    userPromptTemplate: 'Write a LinkedIn post based on this insight:\n"{insight}".\nFormat Style: {style}.\nInclude a strong hook line, formatted body paragraphs, 3 bulleted key takeaways, relevant hashtags, and a prompt for reader comments.'
  },
  {
    id: 'business-proposal',
    name: 'Executive Summary',
    description: 'Draft a professional executive summary for proposals and reports.',
    category: 'Business Writing',
    contentType: 'Business Proposal',
    fields: [
      { name: 'projectName', label: 'Project / Business Name', type: 'text' },
      { name: 'summary', label: 'Key Objectives & Details', type: 'textarea' }
    ],
    systemPrompt: 'You are a corporate business writer. You write formal, polished executive summaries for investors, executives, and clients.',
    userPromptTemplate: 'Draft a professional Executive Summary for "{projectName}".\nKey Details & Context:\n{summary}.\nStructure it with sections for: Objective, Problem Statement, Solution, and Expected Outcomes.'
  },
  {
    id: 'cold-email',
    name: 'Sales Cold Email',
    description: 'Generate high-response-rate cold outreach sales emails.',
    category: 'Email Writing',
    contentType: 'Email Content',
    fields: [
      { name: 'targetName', label: 'Recipient Name / Role', type: 'text', default: 'Marketing Director' },
      { name: 'myValue', label: 'Our Offer / Value Pitch', type: 'textarea' }
    ],
    systemPrompt: 'You are a sales outreach expert. You write brief, personalized, non-spammy cold outreach emails that focus on solving problems and booking calls.',
    userPromptTemplate: 'Write a high-converting cold email to: "{targetName}".\nOur Core Offering / Value: {myValue}.\nKeep it under 150 words. Include a curiosity-inducing subject line, a personalized hook, a clear low-friction call-to-action, and a professional signature block.'
  }
];
