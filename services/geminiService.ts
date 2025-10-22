import { ChatMessage } from '../types';
import { formConfig } from '../config';

export const summarizeConversation = async (chatHistory: ChatMessage[]): Promise<string> => {
    if (chatHistory.length === 0) {
        return "No feedback was provided during the session.";
    }

    const payload = {
        action: 'summarize',
        transcript: chatHistory
    };

    try {
        const response = await fetch(formConfig.googleWebAppUrl, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("Error from backend:", errorBody);
            throw new Error(`The server responded with status: ${response.status}`);
        }

        const result = await response.json();

        if (result.result === 'error') {
            throw new Error(result.message || 'An unknown error occurred on the server.');
        }

        return result.summary;

    } catch (error) {
        console.error("Failed to fetch summary from the backend proxy:", error);
        throw new Error("Could not generate summary. This might be due to a misconfiguration of the backend script or a network issue. Check the console for details.");
    }
};
