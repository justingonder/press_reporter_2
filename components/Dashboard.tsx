import React, { useState, useMemo } from 'react';
import { AlertConfig, Journal, ProcessedJournalStats, Stage } from '../types';
import { AlertTriangle, CheckCircle, Clock, FileText, UserX, Sparkles } from 'lucide-react';
import { generateExecutiveSummary } from '../services/geminiService';

interface DashboardProps {
  journals: Journal[];
  config: AlertConfig;
}

const Dashboard: React.FC<DashboardProps> = ({ journals, config }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const processedData: ProcessedJournalStats[] = useMemo(() => {
    const now = new Date();

    return journals.map((journal) => {
      let unassignedCount = 0;
      let oldestUnassignedDays = 0;
      let stalledReviewCount = 0;
      let oldestStalledReviewDays = 0;

      journal.articles.forEach((article) => {
        // Check Unassigned
        if (article.stage === Stage.UNASSIGNED || article.stage === Stage.UNSUBMITTED) {
          const submittedDate = new Date(article.date_submitted);
          const diffTime = Math.abs(now.getTime() - submittedDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays > config.unassignedThresholdDays) {
            unassignedCount++;
            if (diffDays > oldestUnassignedDays) oldestUnassignedDays = diffDays;
          }
        }

        // Check Stalled Reviews
        // Logic: Review is complete, but Article is still UNDER_REVIEW and no action taken since completion
        if (article.stage === Stage.UNDER_REVIEW) {
             const completedReviews = article.reviews.filter(r => r.is_complete && r.date_complete);
             
             completedReviews.forEach(review => {
                if (!review.date_complete) return;
                const completeDate = new Date(review.date_complete);
                const diffTime = Math.abs(now.getTime() - completeDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays > config.reviewStalledThresholdDays) {
                    stalledReviewCount++;
                    if (diffDays > oldestStalledReviewDays) oldestStalledReviewDays = diffDays;
                }
             });
        }
      });

      // Determine Status
      let status: ProcessedJournalStats['status'] = 'healthy';
      const maxDelay = Math.max(oldestUnassignedDays, oldestStalledReviewDays);
      
      // Heuristic for status - if we have items significantly over the threshold
      if (maxDelay > config.unassignedThresholdDays * 2 || maxDelay > config.reviewStalledThresholdDays * 2) {
        status = 'critical';
      } else if (unassignedCount > 0 || stalledReviewCount > 0) {
        status = 'warning';
      }

      return {
        journalId: journal.id,
        journalName: journal.name,
        unassignedCount,
        stalledReviewCount,
        oldestUnassignedDays,
        oldestStalledReviewDays,
        status,
      };
    });
  }, [journals, config]);

  const handleGenerateSummary = async () => {
    setLoadingSummary(true);
    const result = await generateExecutiveSummary(processedData);
    setSummary(result || "No response generated.");
    setLoadingSummary(false);
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'critical': return config.criticalColor;
          case 'warning': return config.warningColor;
          default: return config.healthyColor;
      }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Critical Journals</p>
              <p className="text-3xl font-bold text-slate-800">
                {processedData.filter(d => d.status === 'critical').length}
              </p>
            </div>
            <div className="p-3 bg-red-50 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
                <div>
                <p className="text-sm font-medium text-slate-500">Warnings</p>
                <p className="text-3xl font-bold text-slate-800">
                    {processedData.filter(d => d.status === 'warning').length}
                </p>
                </div>
                <div className="p-3 bg-amber-50 rounded-full">
                <Clock className="w-6 h-6 text-amber-500" />
                </div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
                <div>
                <p className="text-sm font-medium text-slate-500">On Track</p>
                <p className="text-3xl font-bold text-slate-800">
                    {processedData.filter(d => d.status === 'healthy').length}
                </p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-full">
                <CheckCircle className="w-6 h-6 text-emerald-500" />
                </div>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">Workflow Latency Report</h2>
          <button 
            onClick={handleGenerateSummary}
            disabled={loadingSummary}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {loadingSummary ? 'Analyzing...' : 'AI Analysis'}
          </button>
        </div>

        {summary && (
             <div className="p-6 bg-indigo-50 border-b border-indigo-100">
                <h3 className="text-sm font-bold text-indigo-900 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4"/> Gemini Executive Summary
                </h3>
                <p className="text-indigo-800 text-sm leading-relaxed whitespace-pre-wrap">{summary}</p>
             </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Journal</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">
                    <div className="flex items-center gap-1">
                        <UserX className="w-3 h-3" /> Unassigned ({'>'}{config.unassignedThresholdDays}d)
                    </div>
                </th>
                <th className="px-6 py-4">Max Delay (Unassigned)</th>
                <th className="px-6 py-4">
                    <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Stalled Reviews ({'>'}{config.reviewStalledThresholdDays}d)
                    </div>
                </th>
                <th className="px-6 py-4">Max Delay (Reviews)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {processedData.map((stat) => (
                <tr key={stat.journalId} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{stat.journalName}</td>
                  <td className="px-6 py-4">
                    <span 
                        className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: getStatusColor(stat.status) }}
                    >
                        {stat.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-mono">{stat.unassignedCount}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">
                    {stat.unassignedCount > 0 ? `${stat.oldestUnassignedDays} days` : '-'}
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-mono">{stat.stalledReviewCount}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">
                    {stat.stalledReviewCount > 0 ? `${stat.oldestStalledReviewDays} days` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
