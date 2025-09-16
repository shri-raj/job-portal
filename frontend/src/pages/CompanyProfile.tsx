import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import api from '../api';
import type { Company } from '../types';
import JobCard from '../components/JobCard';
import { Bot, Send, Loader, Briefcase, MapPin, ExternalLink } from 'lucide-react';

const AICompanyChat: React.FC<{ companyId: string; companyName: string }> = ({ companyId, companyName }) => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState<{ text: string, sources: string[] } | null>(null);

    const { mutate, isPending, error } = useMutation({
        mutationFn: async (newQuestion: string) => {
            const { data } = await api.post('/rag/company-qa', { question: newQuestion, companyId });
            return data;
        },
        onSuccess: (data) => {
            setAnswer({ text: data.answer, sources: data.sources });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) return;
        setAnswer(null);
        mutate(question);
    };

    return (
        <div className="bg-gray-50 rounded-lg p-6 mt-8 border">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><Bot className="mr-2" /> Ask AI about {companyName}</h3>
            <div className="mb-4 min-h-[60px] bg-white p-4 rounded-md border">
                {isPending && <Loader className="h-6 w-6 animate-spin text-blue-500" />}
                {error && <p className="text-red-600 text-sm">Sorry, an error occurred.</p>}
                {answer && (
                    <div>
                        <p className="text-gray-700 whitespace-pre-wrap">{answer.text}</p>
                        {answer.sources.length > 0 && <p className="text-xs text-gray-400 mt-2">Source: {answer.sources.join(', ')}</p>}
                    </div>
                )}
            </div>
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g., What is the company culture like?"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    disabled={isPending}
                />
                <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50" disabled={isPending || !question.trim()}>
                    <Send className="h-5 w-5" />
                </button>
            </form>
        </div>
    );
};


const CompanyProfile: React.FC = () => {
    const { companyId } = useParams<{ companyId: string }>();

    const { data: company, isLoading, error } = useQuery<Company>({
        queryKey: ['company', companyId],
        queryFn: async () => {
            const { data } = await api.get(`/jobs/companies/${companyId}`);
            return data;
        },
    });

    if (isLoading) return <div className="text-center py-12"><Loader className="h-10 w-10 animate-spin mx-auto" /></div>;
    if (error || !company) return <div className="text-center py-12 text-red-600">Could not load company profile.</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{company.name}</h1>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-600 mb-4">
                        <span className="flex items-center"><MapPin className="h-4 w-4 mr-2" />{company.location}</span>
                        {company.website && (
                            <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:underline">
                                <ExternalLink className="h-4 w-4 mr-2" />Visit Website
                            </a>
                        )}
                    </div>
                    <p className="text-gray-700">{company.description}</p>
                </div>

                <AICompanyChat companyId={company.id} companyName={company.name} />

                <div className="mt-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center"><Briefcase className="mr-3" />Open Positions at {company.name}</h2>
                    {company.jobs && company.jobs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {company.jobs.map(job => <JobCard key={job.id} job={job} />)}
                        </div>
                    ) : (
                        <p className="text-gray-600 bg-white p-6 rounded-lg shadow-sm">This company has no open positions at the moment.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompanyProfile;
