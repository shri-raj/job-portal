import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../api';
import JobCard from '../components/JobCard';
import { Briefcase, MapPin, Search } from 'lucide-react';
import type { Job } from '../types';

const Home: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [locationFilter, setLocationFilter] = useState('');

    const { data: jobs, isLoading, error } = useQuery<Job[]>({
        queryKey: ['jobs', searchQuery, locationFilter],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (searchQuery) params.append('q', searchQuery);
            if (locationFilter) params.append('location', locationFilter);

            const { data } = await api.get(`/jobs?${params}`);
            return data;
        },
    });

    const applyMutation = useMutation({
        mutationFn: async (jobId: string) => {
            await api.post(`/jobs/${jobId}/apply`);
        },
        onSuccess: () => {
            alert('Application submitted successfully!');
        },
        onError: (error: any) => {
            if (error.response?.status === 409) {
                alert('You have already applied for this job.');
            } else {
                alert('Failed to apply. Please try again.');
            }
        },
    });

    const handleApply = (jobId: string) => {
        applyMutation.mutate(jobId);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading jobs...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl text-red-600">Error loading jobs. Please try again.</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">Find Your Dream Job</h1>
                    <p className="text-xl md:text-2xl mb-8 opacity-90">Discover opportunities that match your skills and passion</p>

                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search jobs, companies, or keywords..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 text-gray-900 rounded-lg border-0 focus:ring-4 focus:ring-blue-300"
                            />
                        </div>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Location"
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                                className="w-full md:w-64 pl-10 pr-4 py-3 text-gray-900 rounded-lg border-0 focus:ring-4 focus:ring-blue-300"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">
                        {jobs?.length ? `${jobs.length} Jobs Available` : 'No Jobs Found'}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.isArray(jobs) && jobs.map((job) => (
                        <JobCard key={job.id} job={job} onApply={handleApply} />
                    ))}
                </div>

                {jobs?.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <Briefcase className="h-16 w-16 mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                        <p className="text-gray-600">Try adjusting your search criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;