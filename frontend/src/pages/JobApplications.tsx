import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import type { Application } from '../types';
import { User as UserIcon, Mail, Calendar } from 'lucide-react';

const JobApplications: React.FC = () => {
    const { jobId } = useParams<{ jobId: string }>();

    const { data: applications, isLoading, error } = useQuery<Application[]>({
        queryKey: ['job-applications', jobId],
        queryFn: async () => {
            const { data } = await api.get(`/api/jobs/${jobId}/applications`);
            return data;
        },
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading applications...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl text-red-600">Error loading applications.</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Job Applications</h1>

                {applications?.length === 0 ? (
                    <div className="text-center py-12">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h3>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {applications?.map((application) => (
                            <div key={application.id} className="bg-white rounded-lg shadow-md p-6">
                                <Link to={`/users/${application.userId}`}>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600">
                                        <UserIcon className="inline-block h-5 w-5 mr-2" />
                                        {application.user?.name}
                                    </h3>
                                </Link>
                                <div className="flex items-center text-gray-600 mb-2">
                                    <Mail className="h-4 w-4 mr-2" />
                                    <span>{application.user?.email}</span>
                                </div>
                                <div className="flex items-center text-gray-500 text-sm">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    <span>Applied {new Date(application.appliedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobApplications;