import React, { useState } from 'react';
import { Building, Calendar, MapPin, Edit, Trash2 } from 'lucide-react';
import type { Job } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface JobCardProps {
    job: Job;
    onApply?: (jobId: string) => void;
    showActions?: boolean;
    onEdit?: (job: Job) => void;
    onDelete?: (jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onApply, showActions = false, onEdit, onDelete }) => {
    const { auth } = useAuth();
    const [isApplying, setIsApplying] = useState(false);

    const handleApply = async () => {
        if (!onApply) return;
        setIsApplying(true);
        try {
            await onApply(job.id);
        } finally {
            setIsApplying(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                        <Building className="h-4 w-4 mr-2" />
                        <span>{job.company}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{job.location}</span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
                {showActions && auth.user?.roles.includes('recruiter') && (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => onEdit?.(job)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
                        >
                            <Edit className="h-4 w-4" />
                            <span>Edit</span>
                        </button>
                        <button
                            onClick={() => onDelete?.(job.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center space-x-1"
                        >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                        </button>
                    </div>
                )}
            </div>

            <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>

            {job.tags && job.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {job.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {!showActions && auth.isAuthenticated && (
                <button
                    onClick={handleApply}
                    disabled={isApplying}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isApplying ? 'Applying...' : 'Apply Now'}
                </button>
            )}
        </div>
    );
};

export default JobCard;