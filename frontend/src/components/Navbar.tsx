import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Briefcase, LogOut, Menu, X, UserCircle } from 'lucide-react';

const Navbar: React.FC = () => {
    const { auth, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate('/login');
    };

    const activeLinkStyle = {
        color: '#ffffff',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    };

    const navLinkClass = "px-3 py-2 rounded-md text-sm font-medium text-blue-100 hover:bg-white hover:bg-opacity-10 transition-colors";

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
                            <Briefcase className="h-6 w-6" />
                            <span>JobPortal</span>
                        </Link>
                        <div className="hidden md:flex items-center space-x-2">
                            <NavLink to="/" className={navLinkClass} style={({ isActive }) => isActive ? activeLinkStyle : {}}>Jobs</NavLink>
                            {auth.isAuthenticated && (
                                <>
                                    <NavLink to="/ask-ai" className={navLinkClass} style={({ isActive }) => isActive ? activeLinkStyle : {}}>Ask AI</NavLink>
                                    <NavLink to="/my-applications" className={navLinkClass} style={({ isActive }) => isActive ? activeLinkStyle : {}}>My Applications</NavLink>
                                    <NavLink to="/my-profile" className={navLinkClass} style={({ isActive }) => isActive ? activeLinkStyle : {}}>My Profile</NavLink>
                                    {auth.user?.roles.includes('recruiter') && (
                                        <>
                                            <NavLink to="/create-job" className={navLinkClass} style={({ isActive }) => isActive ? activeLinkStyle : {}}>Post Job</NavLink>
                                            <NavLink to="/my-jobs" className={navLinkClass} style={({ isActive }) => isActive ? activeLinkStyle : {}}>My Jobs</NavLink>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        {auth.isAuthenticated ? (
                            <>
                                <div className="flex items-center space-x-2">
                                    <UserCircle className="h-5 w-5 text-blue-200" />
                                    <span className="text-blue-100 text-sm">Welcome, {auth.user?.name}</span>
                                </div>
                                <button onClick={handleLogout} className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-blue-100 hover:bg-white hover:bg-opacity-10 transition-colors">
                                    <LogOut className="h-4 w-4" />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <div className="space-x-2">
                                <NavLink to="/login" className={navLinkClass}>Login</NavLink>
                                <NavLink to="/register" className="bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors">Register</NavLink>
                            </div>
                        )}
                    </div>

                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2">
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-blue-500 space-y-2">
                        {auth.isAuthenticated ? (
                            <>
                                <NavLink to="/" className="block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Jobs</NavLink>
                                <NavLink to="/ask-ai" className="block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Ask AI</NavLink>
                                <NavLink to="/my-applications" className="block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>My Applications</NavLink>
                                <NavLink to="/my-profile" className="block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>My Profile</NavLink>
                                {auth.user?.roles.includes('recruiter') && (
                                    <>
                                        <NavLink to="/create-job" className="block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Post Job</NavLink>
                                        <NavLink to="/my-jobs" className="block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>My Jobs</NavLink>
                                    </>
                                )}
                                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <NavLink to="/login" className="block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Login</NavLink>
                                <NavLink to="/register" className="block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>Register</NavLink>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
