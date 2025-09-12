import React, { useState } from 'react';
import { Building, MapPin, Edit, Trash2, Users } from 'lucide-react';
import type { Job } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

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
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 p-6 flex flex-col h-full">
            <div className="flex-grow">
                <div className="flex justify-between items-start mb-4">
                    {/* Job Title and Details */}
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                        <div className="flex items-center text-gray-600 text-sm mb-2">
                            <Building className="h-4 w-4 mr-2" />
                            <span>{job.company}</span>
                        </div>
                        <div className="flex items-center text-gray-600 text-sm mb-2">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>{job.location}</span>
                        </div>
                    </div>
                    {/* Action Buttons */}
                    {showActions && auth.user?.roles.includes('recruiter') && (
                        <div className="flex items-center space-x-2 flex-shrink-0">
                            <Link
                                to={`/jobs/${job.id}/applications`}
                                title="View Applications"
                                className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                            >
                                <Users className="h-5 w-5" />
                            </Link>
                            <button
                                onClick={() => onEdit?.(job)}
                                title="Edit Job"
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                            >
                                <Edit className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => onDelete?.(job.id)}
                                title="Delete Job"
                                className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                    )}
                </div>

                <p className="text-gray-700 mb-4 line-clamp-3 text-sm">{job.description}</p>
            </div>

            {/* Tags and Apply Button */}
            <div className="mt-auto">
                {job.tags && job.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {job.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
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
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                    >
                        {isApplying ? 'Applying...' : 'Apply Now'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default JobCard;