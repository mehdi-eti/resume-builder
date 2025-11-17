
import React, { useState, useEffect } from 'react';
// FIX: Added .js extension to satisfy module resolution
import Dashboard from './components/Dashboard.js';
// FIX: Added .js extension to satisfy module resolution
import Editor from './components/Editor.js';
// FIX: Added .js extension to satisfy module resolution
import TemplateEditor from './components/TemplateEditor.js';
import { initDB } from './services/db.js';
// FIX: Added .js extension to satisfy module resolution
import type { ItemType } from './types.js';

const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'editor' | 'templateEditor'>('dashboard');
  const [editingItem, setEditingItem] = useState<{ id: string; type: ItemType } | null>(null);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    initDB().then(() => {
      setDbInitialized(true);
    });
  }, []);

  const handleEditItem = (id: string, type: ItemType) => {
    setEditingItem({ id, type });
    setView('editor');
  };

  const handleEditTemplate = (id: string) => {
    setEditingTemplateId(id);
    setView('templateEditor');
  };
  
  const handleCreateTemplate = () => {
    setEditingTemplateId(null);
    setView('templateEditor');
  };

  const handleBackToDashboard = () => {
    setEditingItem(null);
    setEditingTemplateId(null);
    setView('dashboard');
  };

  if (!dbInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-xl font-semibold text-slate-700">Initializing...</div>
      </div>
    );
  }

  const renderView = () => {
    switch (view) {
      case 'editor':
        return editingItem ? (
          <Editor
            itemId={editingItem.id}
            itemType={editingItem.type}
            onBack={handleBackToDashboard}
          />
        ) : null;
      case 'templateEditor':
        return <TemplateEditor templateId={editingTemplateId} onBack={handleBackToDashboard} />;
      case 'dashboard':
      default:
        return (
          <Dashboard
            onEditItem={handleEditItem}
            onEditTemplate={handleEditTemplate}
            onCreateTemplate={handleCreateTemplate}
          />
        );
    }
  };

  return <div className="min-h-screen bg-slate-50">{renderView()}</div>;
};

export default App;