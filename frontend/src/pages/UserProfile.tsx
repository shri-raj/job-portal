import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import api from '../api';
import type { User } from '../types';
import { Mail, Calendar, User as UserIcon } from 'lucide-react';

const UserProfile: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();

    const { data: user, isLoading, error } = useQuery<User>({
        queryKey: ['user', userId],
        queryFn: async () => {
            const { data } = await api.get(`/users/${userId}`);
            return data;
        },
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading profile...</div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl text-red-600">Error loading profile.</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="flex items-center space-x-6 mb-8">
                        <div className="bg-blue-600 rounded-full h-24 w-24 flex items-center justify-center text-white">
                            <UserIcon size={48} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">{user.name}</h1>
                            <p className="text-gray-600">{user.roles.join(', ')}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center">
                            <Mail className="h-5 w-5 text-gray-500 mr-4" />
                            <span className="text-gray-700">{user.email}</span>
                        </div>
                        <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-gray-500 mr-4" />
                            <span className="text-gray-700">
                                Member since {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;