import React, { useState } from 'react';
import { AlertConfig } from '../types';
import { Save, RefreshCw } from 'lucide-react';

interface SettingsProps {
  config: AlertConfig;
  onSave: (newConfig: AlertConfig) => void;
}

const Settings: React.FC<SettingsProps> = ({ config, onSave }) => {
  const [formData, setFormData] = useState<AlertConfig>(config);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: e.target.type === 'number' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleReset = () => {
      setFormData(config);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-800">Report Configuration</h2>
          <p className="text-slate-500 text-sm mt-1">Adjust thresholds for triggering alerts on the dashboard.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          
          {/* Time Thresholds */}
          <section>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Time Thresholds (Days)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Unassigned Submission Alert
                </label>
                <input
                  type="number"
                  name="unassignedThresholdDays"
                  value={formData.unassignedThresholdDays}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Trigger alert if submission is unassigned for more than X days.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Stalled Review Follow-up Alert
                </label>
                <input
                  type="number"
                  name="reviewStalledThresholdDays"
                  value={formData.reviewStalledThresholdDays}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Trigger alert if review is complete but no editor decision for X days.
                </p>
              </div>
            </div>
          </section>

          {/* Color Coding */}
          <section>
             <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Status Indicators</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Critical Color</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            name="criticalColor"
                            value={formData.criticalColor}
                            onChange={handleChange}
                            className="h-10 w-10 rounded border border-slate-200 cursor-pointer"
                        />
                        <span className="text-sm text-slate-600 font-mono">{formData.criticalColor}</span>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Warning Color</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            name="warningColor"
                            value={formData.warningColor}
                            onChange={handleChange}
                            className="h-10 w-10 rounded border border-slate-200 cursor-pointer"
                        />
                        <span className="text-sm text-slate-600 font-mono">{formData.warningColor}</span>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Healthy Color</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            name="healthyColor"
                            value={formData.healthyColor}
                            onChange={handleChange}
                            className="h-10 w-10 rounded border border-slate-200 cursor-pointer"
                        />
                        <span className="text-sm text-slate-600 font-mono">{formData.healthyColor}</span>
                    </div>
                </div>
             </div>
          </section>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Reset
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-all"
            >
              <Save className="w-4 h-4" /> Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
