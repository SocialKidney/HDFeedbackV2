import React, { useState, useCallback } from 'react';
import HomeView from './components/HomeView';
import InterviewView from './components/InterviewView';
import SummaryView from './components/SummaryView';
import RoleSelectionView from './components/RoleSelectionView';
import SiteSelectionView from './components/SiteSelectionView';
import { AppState, ChatMessage, Topic, UserRole, InterviewSession, SiteArea, SiteType } from './types';
import { summarizeConversation } from './services/geminiService';

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>('roleSelection');
    
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [siteArea, setSiteArea] = useState<SiteArea | null>(null);
    const [siteType, setSiteType] = useState<SiteType | null>(null);
    const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
    const [interviewSessions, setInterviewSessions] = useState<InterviewSession[]>([]);
    const [summary, setSummary] = useState<string>('');
    const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleRoleSelect = (role: UserRole) => {
        setUserRole(role);
        setAppState('siteSelection');
    };

    const handleSiteSelect = (area: SiteArea, type: SiteType) => {
        setSiteArea(area);
        setSiteType(type);
        setAppState('home');
    };

    const handleTopicSelect = (topic: Topic) => {
        setCurrentTopic(topic);
        setAppState('feedback');
    };

    const handleFeedbackFinish = useCallback((topicFeedback: ChatMessage[]) => {
        if (currentTopic && topicFeedback.length > 0) {
             setInterviewSessions(prev => [...prev, { topic: currentTopic, transcript: topicFeedback }]);
        }
        setCurrentTopic(null);
        setAppState('home');
    }, [currentTopic]);
    
    const handleGenerateSummary = useCallback(async () => {
        setAppState('summary');
        setIsLoadingSummary(true);
        setError(null);

        const fullTranscriptForSummary: ChatMessage[] = interviewSessions.flatMap(session => session.transcript);

        try {
            const summaryResult = await summarizeConversation(fullTranscriptForSummary);
            setSummary(summaryResult);
        } catch (err) {
            console.error("Error summarizing conversation:", err);
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            setError(`Sorry, there was an error generating the summary. ${errorMessage} Please check the backend script configuration.`);
        } finally {
            setIsLoadingSummary(false);
        }
    }, [interviewSessions]);

    const handleBackToHome = () => {
        setAppState('home');
        setCurrentTopic(null);
    };
    
    const handleBackToSiteSelection = () => {
        setAppState('siteSelection');
        setSiteArea(null);
        setSiteType(null);
        setInterviewSessions([]);
        setSummary('');
    };
    
    const handleBackToRoleSelection = () => {
        setAppState('roleSelection');
        setUserRole(null);
    };
    
    const handleRestartForNewSite = () => {
        setInterviewSessions([]);
        setSummary('');
        setCurrentTopic(null);
        setSiteArea(null);
        setSiteType(null);
        setAppState('siteSelection');
    };

    const handleRestart = () => {
        setAppState('roleSelection');
        setCurrentTopic(null);
        setInterviewSessions([]);
        setUserRole(null);
        setSiteArea(null);
        setSiteType(null);
        setSummary('');
        setError(null);
    };

    const renderContent = () => {
        switch (appState) {
            case 'roleSelection':
                return <RoleSelectionView onRoleSelect={handleRoleSelect} />;
            case 'siteSelection':
                 return <SiteSelectionView onSiteSelect={handleSiteSelect} onBack={handleBackToRoleSelection} />;
            case 'home':
                if (!userRole || !siteArea || !siteType) { // Fallback
                    handleBackToRoleSelection();
                    return null;
                }
                return <HomeView 
                          userRole={userRole}
                          siteArea={siteArea}
                          siteType={siteType} 
                          onTopicSelect={handleTopicSelect} 
                          onSummarize={handleGenerateSummary} 
                          hasTranscript={interviewSessions.length > 0}
                          onBack={handleBackToSiteSelection} 
                        />;
            case 'feedback':
                if (!currentTopic) {
                    // Fallback in case state is inconsistent
                    handleBackToHome();
                    return null;
                }
                return <InterviewView topic={currentTopic} onFinish={handleFeedbackFinish} />;
            case 'summary':
                if (!userRole || !siteArea || !siteType) { // Fallback
                    handleBackToRoleSelection();
                    return null;
                }
                return <SummaryView 
                          userRole={userRole}
                          siteArea={siteArea}
                          siteType={siteType}
                          sessions={interviewSessions}
                          summary={summary} 
                          isLoading={isLoadingSummary} 
                          error={error}
                          onRestart={handleRestart}
                          onRestartForNewSite={handleRestartForNewSite}
                          onBack={handleBackToHome} 
                        />;
            default:
                return <RoleSelectionView onRoleSelect={handleRoleSelect} />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-900">
            <div className="w-full max-w-4xl h-[90vh] bg-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                {renderContent()}
            </div>
             <footer className="text-center text-slate-500 mt-4 text-sm">
                Powered by Gemini
            </footer>
        </div>
    );
};

export default App;
