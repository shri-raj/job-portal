import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Building, Calendar, MapPin, User } from 'lucide-react';
import api from '../api';
import type { Application } from '../types';

const MyApplications: React.FC = () => {
    const { data: applications, isLoading, error } = useQuery<Application[]>({
        queryKey: ['my-applications'],
        queryFn: async () => {
            const { data } = await api.get('/users/me/applications');
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
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Applications</h1>

                {applications?.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <User className="h-16 w-16 mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h3>
                        <p className="text-gray-600 mb-4">Start applying to jobs to see them here</p>
                        <Link
                            to="/"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Browse Jobs
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {applications?.map((application) => (
                            <div key={application.id} className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {application.job?.title}
                                </h3>
                                <div className="flex items-center text-gray-600 mb-2">
                                    <Building className="h-4 w-4 mr-2" />
                                    <span>{application.job?.company}</span>
                                </div>
                                <div className="flex items-center text-gray-600 mb-2">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    <span>{application.job?.location}</span>
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

export default MyApplications;