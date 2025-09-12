import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();

    return (
        <nav className="bg-gray-800 p-4 text-white">
            <div className="container mx-auto flex justify-between">
                <Link to="/">Job Portal</Link>
                <div>
                    {isAuthenticated ? (
                        <button onClick={logout}>Logout</button>
                    ) : (
                        <>
                            <Link to="/login" className="mr-4">
                                Login
                            </Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;