import React, { useState } from 'react';
import { AIProviderSelector } from '../components/AIProviderSelector';
import { AIChatPanel } from '../components/AIChatPanel';
import { AIPromptInput } from '../components/AIPromptInput';
import { AIOutputPanel } from '../components/AIOutputPanel';
import { AIGenerationHistory } from '../components/AIGenerationHistory';

export const AIWorkspacePage: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [outputContent, setOutputContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSendPrompt = (promptText: string) => {
    const userMsg = { id: `u_${Date.now()}`, sender: 'user', text: promptText, timestamp: 'Just now' };
    setMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);

    setTimeout(() => {
      const aiMsg = {
        id: `a_${Date.now()}`,
        sender: 'ai',
        text: `Architecture analysis completed for:\n"${promptText}"\n\nGenerated output is displayed in the Output Panel on the right.`,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, aiMsg]);
      setOutputContent(`// Enterprise Architecture Generated Code\n// Requirement: ${promptText}\n\nexport const generatedModule = () => {\n  return {\n    status: 'online',\n    timestamp: new Date().toISOString(),\n  };\n};`);
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <div className="container-fluid px-0 h-100 d-flex flex-column">
      {/* Top Controls Bar */}
      <div className="d-flex align-items-center justify-content-between p-3 glass-card rounded-4 mb-3">
        <h4 className="fw-bold mb-0 gradient-text">AI Workspace</h4>
        <AIProviderSelector />
      </div>

      {/* Split Screen Grid */}
      <div className="row g-3 flex-grow-1 overflow-hidden">
        {/* Left Column: Chat & Input */}
        <div className="col-lg-7 d-flex flex-column h-100">
          <AIChatPanel messages={messages} />
          <AIPromptInput onSend={handleSendPrompt} isLoading={isGenerating} />
        </div>

        {/* Right Column: Output Panel & History */}
        <div className="col-lg-5 d-flex flex-column gap-3 h-100 overflow-auto">
          <div className="flex-grow-1">
            <AIOutputPanel content={outputContent} />
          </div>
          <AIGenerationHistory />
        </div>
      </div>
    </div>
  );
};
