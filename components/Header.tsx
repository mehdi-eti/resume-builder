import React from 'react';

export type SaveStatus = 'unsaved' | 'saving' | 'saved';

interface HeaderProps {
  children?: React.ReactNode;
  saveStatus?: SaveStatus;
}

const SaveStatusIndicator: React.FC<{ status: SaveStatus }> = ({ status }) => {
  const statusMap = {
    unsaved: { text: 'Unsaved changes', color: 'text-amber-600', icon: '●' },
    saving: { text: 'Saving...', color: 'text-slate-600', icon: '...' },
    saved: { text: 'All changes saved', color: 'text-green-600', icon: '✓' },
  };

  const currentStatus = statusMap[status];

  return (
    <div className={`flex items-center text-sm font-medium ${currentStatus.color}`}>
      <span className="mr-2">{currentStatus.icon}</span>
      <span>{currentStatus.text}</span>
    </div>
  );
};


const Header: React.FC<HeaderProps> = ({ children, saveStatus }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center gap-x-4">
            <h1 className="text-2xl font-bold text-slate-800">
              <span role="img" aria-label="document" className="mr-2">📄</span>
              AI Resume Architect
            </h1>
            {saveStatus && <SaveStatusIndicator status={saveStatus} />}
          </div>
          <div className="flex items-center space-x-4">
            {children}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
