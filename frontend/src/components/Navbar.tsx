import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Briefcase, LogOut, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
    const { auth, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
                        <Briefcase className="h-6 w-6" />
                        <span>JobPortal</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        {auth.isAuthenticated ? (
                            <>
                                <Link to="/" className="hover:text-blue-200 transition-colors">Jobs</Link>
                                <Link to="/my-applications" className="hover:text-blue-200 transition-colors">My Applications</Link>
                                {auth.user?.roles.includes('recruiter') && (
                                    <>
                                        <Link to="/create-job" className="hover:text-blue-200 transition-colors">Post Job</Link>
                                        <Link to="/my-jobs" className="hover:text-blue-200 transition-colors">My Jobs</Link>
                                    </>
                                )}
                                <div className="flex items-center space-x-4">
                                    <span className="text-blue-200">Welcome, {auth.user?.name}</span>
                                    <button onClick={handleLogout} className="flex items-center space-x-1 hover:text-blue-200 transition-colors">
                                        <LogOut className="h-4 w-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="space-x-4">
                                <Link to="/login" className="hover:text-blue-200 transition-colors">Login</Link>
                                <Link to="/register" className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">Register</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2"
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-blue-500">
                        {auth.isAuthenticated ? (
                            <div className="space-y-2">
                                <Link to="/" className="block hover:text-blue-200 transition-colors">Jobs</Link>
                                <Link to="/my-applications" className="block hover:text-blue-200 transition-colors">My Applications</Link>
                                {auth.user?.roles.includes('recruiter') && (
                                    <>
                                        <Link to="/create-job" className="block hover:text-blue-200 transition-colors">Post Job</Link>
                                        <Link to="/my-jobs" className="block hover:text-blue-200 transition-colors">My Jobs</Link>
                                    </>
                                )}
                                <button onClick={handleLogout} className="block w-full text-left hover:text-blue-200 transition-colors">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Link to="/login" className="block hover:text-blue-200 transition-colors">Login</Link>
                                <Link to="/register" className="block hover:text-blue-200 transition-colors">Register</Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;