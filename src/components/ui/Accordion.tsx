import React from 'react';
import { Accordion as BootstrapAccordion } from 'react-bootstrap';

export interface AccordionItem {
  id: string;
  header: React.ReactNode;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultActiveKey?: string;
}

export const Accordion: React.FC<AccordionProps> = ({ items, defaultActiveKey }) => {
  return (
    <BootstrapAccordion defaultActiveKey={defaultActiveKey} data-bs-theme="dark" className="custom-accordion">
      {items.map((item) => (
        <BootstrapAccordion.Item key={item.id} eventKey={item.id} className="border-secondary bg-dark mb-2 rounded-3 overflow-hidden">
          <BootstrapAccordion.Header className="bg-dark text-light">{item.header}</BootstrapAccordion.Header>
          <BootstrapAccordion.Body className="bg-dark text-secondary">{item.content}</BootstrapAccordion.Body>
        </BootstrapAccordion.Item>
      ))}
    </BootstrapAccordion>
  );
};
