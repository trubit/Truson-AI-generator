import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useLayoutStore } from '../../store/layout-store';

export const Breadcrumb: React.FC = () => {
  const { breadcrumbs } = useLayoutStore();

  return (
    <nav aria-label="breadcrumb" className="mb-3">
      <ol className="breadcrumb mb-0 align-items-center">
        <li className="breadcrumb-item d-flex align-items-center">
          <Link to="/" className="text-secondary hover-text-white text-decoration-none d-flex align-items-center">
            <Home size={15} />
          </Link>
        </li>
        {breadcrumbs.map((crumb, idx) => (
          <li key={idx} className="breadcrumb-item d-flex align-items-center text-secondary small">
            <ChevronRight size={14} className="mx-1" />
            {crumb.path ? (
              <Link to={crumb.path} className="text-secondary hover-text-white text-decoration-none">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-light fw-medium">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
