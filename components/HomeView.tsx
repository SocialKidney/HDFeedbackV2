import React from 'react';
import { Topic, UserRole, SiteArea, SiteType } from '../types';

interface HomeViewProps {
    userRole: UserRole;
    siteArea: SiteArea;
    siteType: SiteType;
    onTopicSelect: (topic: Topic) => void;
    onSummarize: () => void;
    hasTranscript: boolean;
    onBack: () => void;
}

const TOPICS: Topic[] = [
    { id: 'rounds', name: 'Dialysis Rounds', emoji: '🔄' },
    { id: 'labs', name: 'Lab Review', emoji: '🔬' },
    { id: 'transplant', name: 'Transplant Status', emoji: '⚕️' },
    { id: 'new_patient', name: 'New Patient Starts', emoji: '🧑‍⚕️' },
    { id: 'orders', name: 'Ordering Medications/Orders', emoji: '💊' },
    { id: 'comm', name: 'Unit/MD Communications', emoji: '💬' },
    { id: 'handover', name: 'Handover Issues', emoji: '🤝' },
    { id: 'anemia', name: 'Anemia Protocol', emoji: '🩸' },
    { id: 'other', name: 'Other', emoji: '📋' },
];

const HomeView: React.FC<HomeViewProps> = ({ userRole, siteArea, siteType, onTopicSelect, onSummarize, hasTranscript, onBack }) => {
    return (
        <div className="flex flex-col h-full p-6 text-center">
             <header className="flex justify-between items-center mb-4 flex-shrink-0">
                 <button onClick={onBack} className="py-2 px-4 text-sm bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-colors">
                    &larr; Change Site
                </button>
                <div className="text-xs text-slate-400 text-right">
                    <div>Role: <span className="font-semibold text-cyan-400">{userRole}</span></div>
                    <div>Site: <span className="font-semibold text-cyan-400">{siteArea} - {siteType}</span></div>
                </div>
            </header>
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-full max-w-3xl mb-6">
                    <h2 className="text-2xl font-semibold text-indigo-300 mb-4">Select a topic to discuss:</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {TOPICS.map(topic => (
                            <button
                                key={topic.id}
                                onClick={() => onTopicSelect(topic)}
                                className="p-4 bg-slate-700 rounded-lg text-left hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            >
                                <span className="text-2xl mr-2">{topic.emoji}</span>
                                <span className="font-semibold">{topic.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={onSummarize}
                    disabled={!hasTranscript}
                    className="w-full max-w-3xl mt-4 py-3 px-6 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                >
                    {hasTranscript ? "Exit and Summarize My Feedback" : "Complete at least one topic to summarize"}
                </button>
                 <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-200 px-4 py-2 rounded-lg mt-6 max-w-3xl text-xs">
                    <p><span className="font-semibold text-red-400">Remember:</span> Do not mention any patient names, medical record numbers, or other Personal Health Information (PHI).</p>
                </div>
            </div>
        </div>
    );
};

export default HomeView;
