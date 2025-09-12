import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../api';
import JobCard from '../components/JobCard';
import EditJobModal from '../components/EditJobModal';
import { Briefcase, Plus } from 'lucide-react';
import type { Job } from '../types';

const MyJobs: React.FC = () => {
    const [editingJob, setEditingJob] = useState<Job | null>(null);
    const queryClient = useQueryClient();

    const { data: jobs, isLoading, error } = useQuery<Job[]>({
        queryKey: ['my-jobs'],
        queryFn: async () => {
            const { data } = await api.get('/jobs');
            return data.filter((job: Job) => job.postedBy === JSON.parse(localStorage.getItem('user') || '{}').id);
        },
    });

    const updateJobMutation = useMutation({
        mutationFn: async ({ jobId, data }: { jobId: string; data: any }) => {
            await api.put(`/jobs/${jobId}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
            setEditingJob(null);
            alert('Job updated successfully!');
        },
        onError: () => {
            alert('Failed to update job');
        },
    });

    const deleteJobMutation = useMutation({
        mutationFn: async (jobId: string) => {
            await api.delete(`/jobs/${jobId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
            alert('Job deleted successfully!');
        },
        onError: () => {
            alert('Failed to delete job');
        },
    });

    const handleEdit = (job: Job) => {
        setEditingJob(job);
    };

    const handleDelete = (jobId: string) => {
        if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
            deleteJobMutation.mutate(jobId);
        }
    };

    const handleSave = (jobId: string, data: any) => {
        updateJobMutation.mutate({ jobId, data });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading your jobs...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl text-red-600">Error loading jobs.</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Jobs</h1>
                    <Link
                        to="/create-job"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Post New Job
                    </Link>
                </div>

                {jobs?.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <Briefcase className="h-16 w-16 mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs posted yet</h3>
                        <p className="text-gray-600 mb-4">Start by posting your first job</p>
                        <Link
                            to="/create-job"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Post Job
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs?.map((job) => (
                            <JobCard
                                key={job.id}
                                job={job}
                                showActions={true}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}

                {editingJob && (
                    <EditJobModal
                        job={editingJob}
                        isOpen={true}
                        onClose={() => setEditingJob(null)}
                        onSave={handleSave}
                    />
                )}
            </div>
        </div>
    );
};

export default MyJobs;