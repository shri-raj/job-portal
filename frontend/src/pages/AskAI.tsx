import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '../api';
import { Bot, Send, Loader, FileText } from 'lucide-react';

interface QAResponse {
    answer: string;
    sources: string[];
}

const AskAI: React.FC = () => {
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState<QAResponse | null>(null);

    const { mutate, isPending, error } = useMutation<QAResponse, Error, string>({
        mutationFn: async (newQuestion: string) => {
            const { data } = await api.post('/api/rag/qa', { question: newQuestion });
            return data;
        },
        onSuccess: (data) => {
            setResponse(data);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) return;
        mutate(question);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <Bot className="h-16 w-16 mx-auto text-blue-600" />
                    <h1 className="text-4xl font-bold text-gray-900 mt-4">Ask Our AI Assistant</h1>
                    <p className="text-lg text-gray-600 mt-2">
                        Get insights from job descriptions or ask about company policies.
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    {/* Response Display */}
                    <div className="mb-6 min-h-[150px]">
                        {isPending && (
                            <div className="flex items-center justify-center h-full">
                                <Loader className="h-8 w-8 animate-spin text-blue-600" />
                            </div>
                        )}
                        {error && (
                            <div className="text-red-600 bg-red-50 p-4 rounded-md">
                                <p>Sorry, something went wrong: {error.message}</p>
                            </div>
                        )}
                        {response && (
                            <div className="space-y-4">
                                <p className="text-gray-800 whitespace-pre-wrap">{response.answer}</p>
                                {response.sources.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-gray-600">Sources:</h4>
                                        <ul className="list-disc list-inside text-sm text-gray-500 mt-2">
                                            {response.sources.map((source, index) => (
                                                <li key={index} className="flex items-center">
                                                    <FileText className="h-4 w-4 mr-2" /> {source}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Input Form */}
                    <form onSubmit={handleSubmit} className="flex items-center gap-4">
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="e.g., What are the requirements for the Senior Engineer role?"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isPending}
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            disabled={isPending || !question.trim()}
                        >
                            <Send className="h-5 w-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AskAI;