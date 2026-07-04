import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <ul className="nav nav-pills border-bottom border-secondary pb-2 gap-2 mb-3">
      {tabs.map((tab) => (
        <li key={tab.id} className="nav-item">
          <button
            className={`nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-3 ${
              activeTab === tab.id
                ? 'bg-purple text-white fw-bold'
                : 'text-secondary hover-text-white bg-transparent'
            }`}
            onClick={() => onChange(tab.id)}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        </li>
      ))}
    </ul>
  );
};
