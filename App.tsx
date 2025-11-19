import React, { useState } from 'react';
import { LayoutDashboard, Settings as SettingsIcon, BookOpen } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import { AlertConfig, Journal } from './types';
import { mockJournals } from './services/mockData';

// Default configuration
const defaultConfig: AlertConfig = {
  unassignedThresholdDays: 14,
  reviewStalledThresholdDays: 7,
  criticalColor: '#ef4444', // red-500
  warningColor: '#f59e0b', // amber-500
  healthyColor: '#10b981', // emerald-500
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'settings'>('dashboard');
  const [config, setConfig] = useState<AlertConfig>(defaultConfig);
  // In a real app, we would fetch this data from the Django API endpoint defined in urls.py
  const [journals] = useState<Journal[]>(mockJournals);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                 <h1 className="text-xl font-bold text-slate-900 leading-none">Janeway Press Manager</h1>
                 <p className="text-xs text-slate-500 mt-1">Reporting Plugin</p>
              </div>
            </div>
            
            <nav className="flex items-center gap-4">
               <button
                onClick={() => setCurrentView('dashboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'dashboard' 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('settings')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'settings' 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <SettingsIcon className="w-4 h-4" />
                Configuration
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' ? (
          <Dashboard journals={journals} config={config} />
        ) : (
          <Settings config={config} onSave={setConfig} />
        )}
      </main>
      
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-slate-400">
                &copy; {new Date().getFullYear()} Janeway Press Reporting Plugin.
            </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
