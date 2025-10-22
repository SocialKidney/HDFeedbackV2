import React, { useState } from 'react';
import { ChatMessage, Topic } from '../types';

interface InterviewViewProps {
    topic: Topic;
    onFinish: (history: ChatMessage[]) => void;
}

const InterviewView: React.FC<InterviewViewProps> = ({ topic, onFinish }) => {
    const [currentFeedback, setCurrentFeedback] = useState('');
    const [submittedFeedback, setSubmittedFeedback] = useState<ChatMessage[]>([]);

    const handleAddFeedback = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentFeedback.trim() === '') return;
        
        const newFeedback: ChatMessage = { role: 'user', content: currentFeedback.trim() };
        setSubmittedFeedback(prev => [...prev, newFeedback]);
        setCurrentFeedback('');
    };

    const handleFinishTopic = () => {
        onFinish(submittedFeedback);
    };

    return (
        <div className="flex flex-col h-full p-6 text-center bg-slate-800">
            <header className="flex justify-between items-center mb-4">
                 <button onClick={handleFinishTopic} className="py-2 px-4 text-sm bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-colors">
                    &larr; Back to Topics
                </button>
                <h2 className="text-2xl font-bold text-cyan-400">{topic.name}</h2>
                <div className="w-36"></div>
            </header>

            <div className="flex-1 flex flex-col items-center justify-start pt-8">
                <p className="text-slate-300 mb-6 max-w-2xl">
                    Please enter your feedback about <span className="font-bold text-cyan-300">{topic.name}</span> below.
                    <br/>
                    <span className="italic text-sm text-slate-400">Please elaborate at length to fully understand the problem. You can add multiple points.</span>
                </p>
                
                <form onSubmit={handleAddFeedback} className="w-full max-w-2xl flex flex-col items-center">
                    <textarea
                        value={currentFeedback}
                        onChange={(e) => setCurrentFeedback(e.target.value)}
                        className="w-full h-32 p-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Type your feedback here..."
                        aria-label="Feedback input"
                    />
                    <button
                        type="submit"
                        className="mt-4 py-2 px-8 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                        disabled={currentFeedback.trim() === ''}
                    >
                        Add Feedback
                    </button>
                </form>

                <div className="w-full max-w-2xl mt-8">
                    <h3 className="text-lg font-bold text-indigo-400 mb-2 text-left">Your Feedback on This Topic:</h3>
                    {submittedFeedback.length > 0 ? (
                        <div className="space-y-2 text-left bg-slate-900/50 rounded-lg p-4 max-h-60 overflow-y-auto">
                            {submittedFeedback.map((msg, index) => (
                                <p key={index} className="text-slate-200 border-b border-slate-700 pb-2 mb-2">
                                   - {msg.content}
                                </p>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-400 italic text-left">Your submitted feedback will appear here.</p>
                    )}
                </div>

                 <p className="text-xs text-slate-500 mt-6 max-w-md">
                     Click "Back to Topics" when you are finished with this topic.
                 </p>
            </div>
        </div>
    );
};

export default InterviewView;
