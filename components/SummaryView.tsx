import React, { useState } from 'react';
import { InterviewSession, UserRole, SiteArea, SiteType } from '../types';
import { formConfig } from '../config';

interface SummaryViewProps {
    userRole: UserRole;
    siteArea: SiteArea;
    siteType: SiteType;
    sessions: InterviewSession[];
    summary: string;
    isLoading: boolean;
    error: string | null;
    onRestart: () => void;
    onRestartForNewSite: () => void;
    onBack: () => void;
}

type SubmissionStatus = 'idle' | 'submitting' | 'submitted' | 'error';

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center h-full">
        <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-slate-300">Analyzing the conversation and generating summary...</p>
    </div>
);

const SummaryView: React.FC<SummaryViewProps> = ({ userRole, siteArea, siteType, sessions, summary, isLoading, error, onRestart, onRestartForNewSite, onBack }) => {
    
    const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('idle');
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const isFormConfigured = !formConfig.googleWebAppUrl.includes('PASTE_YOUR_DEPLOYED_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE');

    const generateFullTranscriptText = () => {
        let transcriptText = '';
        sessions.forEach(session => {
            transcriptText += `Topic: ${session.topic.name}\n--------------------\n`;
            session.transcript.forEach(message => {
                transcriptText += `User: ${message.content}\n`;
            });
            transcriptText += '\n';
        });
        return transcriptText;
    };

    const handleSubmitFeedback = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!isFormConfigured || submissionStatus === 'submitting' || submissionStatus === 'submitted') {
            return;
        }

        setSubmissionStatus('submitting');
        setSubmissionError(null);

        const submissionData = {
            role: userRole,
            siteArea: siteArea,
            siteType: siteType,
            summary: summary,
            transcript: generateFullTranscriptText(),
        };

        const payload = {
            action: 'submit',
            payload: submissionData
        };

        try {
            const response = await fetch(formConfig.googleWebAppUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            
            if (!response.ok) {
                throw new Error(`The server responded with status: ${response.status}`);
            }

            const result = await response.json();

            if (result.result !== 'success') {
                throw new Error(result.message || 'The server indicated a submission error.');
            }
            
            setSubmissionStatus('submitted');

        } catch (err) {
            console.error("Submission error:", err);
            setSubmissionError(err instanceof Error ? err.message : "An unknown error occurred.");
            setSubmissionStatus('error');
        }
    };
    
    const getSubmitButtonContent = () => {
        if (!isFormConfigured) return 'Submission Not Configured';
        switch (submissionStatus) {
            case 'idle':
                return 'Submit Anonymously';
            case 'submitting':
                return 'Submitting...';
            case 'submitted':
                return '✓ Submitted Successfully!';
            case 'error':
                return 'Error! Try Again.';
            default:
                return 'Submit Anonymously';
        }
    };

    const fullTranscript = sessions.flatMap(s => s.transcript);

    return (
        <div className="flex flex-col h-full">
            <header className="p-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0 gap-4">
                 <button
                    onClick={onBack}
                    className="py-2 px-4 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-colors"
                >
                    &larr; Back
                </button>
                 <h2 className="text-xl font-bold text-cyan-400 text-center">Feedback Summary</h2>
                 <div>
                    <button
                        onClick={onRestart}
                        className="py-2 px-4 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-500 transition-colors"
                    >
                        Start Over
                    </button>                 
                 </div>
            </header>
            <main className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Summary Section */}
                <div className="bg-slate-900/50 rounded-lg p-6 flex flex-col min-h-0">
                    <h3 className="text-lg font-bold text-indigo-400 mb-4 flex-shrink-0">Summary of Pain Points</h3>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {isLoading && <LoadingSpinner />}
                        {error && <div className="p-4 bg-red-900/50 text-red-300 rounded-lg">{error}</div>}
                        {!isLoading && !error && (
                            <div className="prose prose-invert prose-sm max-w-none text-slate-200 whitespace-pre-wrap">
                               {summary}
                            </div>
                        )}
                    </div>
                </div>

                {/* Transcript Section */}
                <div className="bg-slate-900/50 rounded-lg p-6 flex flex-col min-h-0">
                     <h3 className="text-lg font-bold text-indigo-400 mb-4 flex-shrink-0">Full Transcript</h3>
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                        {fullTranscript.length > 0 ? fullTranscript.map((msg, index) => (
                            <div key={index} className="flex flex-col items-end">
                                <div className="text-xs text-slate-400 mb-1 capitalize">User</div>
                                <div className="max-w-md px-3 py-2 rounded-lg text-sm bg-cyan-800 text-white">
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                </div>
                            </div>
                        )) : <p className="text-slate-400 italic">No conversation transcript available.</p>}
                    </div>
                </div>
            </main>
             <footer className="p-4 border-t border-slate-700 flex-shrink-0 bg-slate-800">
                <div className="max-w-4xl mx-auto text-center">
                    <h3 className="text-lg font-semibold text-cyan-300">Submit Your Anonymous Feedback</h3>
                    <p className="text-sm text-slate-400 mt-2 mb-4">
                       Thank you for your input! Click the button below to submit your feedback anonymously. 
                       Your response will be sent directly to our secure collection sheet.
                    </p>
                    
                    <form onSubmit={handleSubmitFeedback}>
                         <button
                            type="submit"
                            className={`py-3 px-6 font-bold rounded-lg transition-colors w-full max-w-md ${
                                submissionStatus === 'submitted' ? 'bg-green-600 text-white cursor-default' :
                                submissionStatus === 'error' ? 'bg-red-600 text-white hover:bg-red-500' :
                                submissionStatus === 'submitting' ? 'bg-indigo-400 text-white cursor-wait' :
                                'bg-indigo-600 text-white hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed'
                            }`}
                            disabled={sessions.length === 0 || isLoading || !isFormConfigured || submissionStatus === 'submitted' || submissionStatus === 'submitting'}
                        >
                            {getSubmitButtonContent()}
                        </button>
                    </form>
                     {!isFormConfigured && <p className="text-xs text-yellow-400 mt-2">Note to admin: Please follow the setup instructions in the config.ts file to enable submissions.</p>}
                     {submissionError && <p className="text-xs text-red-400 mt-2">Submission Failed: {submissionError}</p>}

                     { submissionStatus === 'submitted' && (
                         <div className="mt-4">
                             <button
                                onClick={onRestartForNewSite}
                                className="text-sm text-cyan-400 hover:text-cyan-300 underline"
                            >
                                Provide Feedback for Another Site
                            </button>
                         </div>
                     )}
                </div>
            </footer>
        </div>
    );
};

export default SummaryView;
