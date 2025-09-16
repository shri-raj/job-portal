import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import type { Profile } from '../types';
import { Save, Loader } from 'lucide-react';

const MyProfile: React.FC = () => {
    const queryClient = useQueryClient();
    const [summary, setSummary] = useState('');
    const [skills, setSkills] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const { data: profile, isLoading } = useQuery<Profile | null>({
        queryKey: ['my-profile'],
        queryFn: async () => {
            try {
                const { data } = await api.get('/users/me/profile');
                return data;
            } catch (error: any) {
                if (error.response?.status === 404 || Object.keys(error.response?.data).length === 0) {
                    return null;
                }
                throw error;
            }
        },
    });

    useEffect(() => {
        if (profile) {
            setSummary(profile.summary || '');
            setSkills(profile.skills?.join(', ') || '');
            setResumeUrl(profile.resumeUrl || '');
        }
    }, [profile]);

    const mutation = useMutation({
        mutationFn: (updatedProfile: Partial<Profile>) => api.put('/users/me/profile', updatedProfile),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-profile'] });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        },
        onError: (error: any) => {
            setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to update profile.' });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
        mutation.mutate({ summary, skills: skillsArray, resumeUrl });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader className="h-10 w-10 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">My Professional Profile</h1>

                    {message && (
                        <div className={`p-4 mb-6 rounded-md text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-2">
                                Professional Summary
                            </label>
                            <textarea
                                id="summary"
                                rows={4}
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="A brief summary of your professional background..."
                            />
                        </div>

                        <div>
                            <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                                Skills (comma-separated)
                            </label>
                            <input
                                id="skills"
                                type="text"
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., React, Node.js, Project Management"
                            />
                        </div>

                        <div>
                            <label htmlFor="resumeUrl" className="block text-sm font-medium text-gray-700 mb-2">
                                Resume URL (Link to PDF)
                            </label>
                            <input
                                id="resumeUrl"
                                type="url"
                                value={resumeUrl}
                                onChange={(e) => setResumeUrl(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="https://example.com/my-resume.pdf"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={mutation.isPending}
                                className="inline-flex items-center px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                {mutation.isPending ? <Loader className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5 mr-2" />}
                                <span>Save Profile</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
