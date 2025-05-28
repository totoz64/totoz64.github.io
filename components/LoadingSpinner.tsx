
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
      <span className="ml-2 text-slate-700">Chargement...</span>
    </div>
  );
};

export default LoadingSpinner;
