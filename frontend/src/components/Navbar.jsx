import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'; // For the hamburger and close icons

const Navbar = ({ isAuthenticated, handleLogout }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State for opening/closing menu

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="navbar bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white shadow-md p-4 relative">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold">
                    BookBazaar
                </Link>

                <div className="auth-buttons flex items-center">
                    <Link to='/' className='px-10 text-white font-semibold hidden md:block'>Home</Link>
                    {isAuthenticated ? (
                        <button
                            className="bg-gray-700 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-3xl hidden md:block"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    ) : (
                        <div className="auth-toggle hidden md:flex items-center">
                            <div className="toggle-button flex items-center rounded-full p-1 relative w-38">
                                <Link
                                    to='/login'
                                    className={`${isLogin ? 'bg-gray-600 text-white' : 'bg-gray-300 text-gray-600'} w-full py-2 px-4 rounded-l-full transition-colors duration-400`}
                                    onClick={() => setIsLogin(true)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to='/register'
                                    className={`${isLogin ? 'bg-gray-300 text-gray-600' : 'bg-gray-600 text-white'} w-full py-2 px-2 rounded-r-full transition-colors duration-400`}
                                    onClick={() => setIsLogin(false)}
                                >
                                    Register
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Hamburger Icon for mobile */}
                    <div className="md:hidden cursor-pointer" onClick={toggleMenu}>
                        {isMenuOpen ? <FaTimes size={26} /> : <FaBars size={26} />}
                    </div>
                </div>

                {/* Slide-in Menu for mobile */}
                <div className={`md:hidden fixed top-0 right-0 h-full w-64 bg-gray-100 shadow-md transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="p-4 relative">
                        {/* Close button */}
                        <button
                            className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
                            onClick={closeMenu}
                        >
                            <FaTimes size={24} />
                        </button>
                        <div className="mt-10"> {/* Adjusting margin for menu links */}
                            <Link
                                to="/"
                                className="block text-lg font-medium text-gray-700 py-2 px-4 hover:bg-gray-200 rounded-md"
                                onClick={closeMenu}
                            >
                                Home
                            </Link>
                            <hr className="border-gray-300 my-2" />
                            {isAuthenticated ? (
                                <>
                                    <button
                                        className="block w-full text-left bg-gray-700 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md"
                                        onClick={() => { handleLogout(); closeMenu(); }}
                                    >
                                        Logout
                                    </button>
                                    <hr className="border-gray-300 my-2" />
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="block text-lg font-medium text-gray-700 py-2 px-4 hover:bg-gray-200 rounded-md"
                                        onClick={() => { setIsLogin(true); closeMenu(); }}
                                    >
                                        Login
                                    </Link>
                                    <hr className="border-gray-300 my-2" />
                                    <Link
                                        to="/register"
                                        className="block text-lg font-medium text-gray-700 py-2 px-4 hover:bg-gray-200 rounded-md"
                                        onClick={() => { setIsLogin(false); closeMenu(); }}
                                    >
                                        Register
                                    </Link>
                                    <hr className="border-gray-300 my-2" />
                                </>
                            )}
                            {/* <Link
                                to="/about"
                                className="block text-lg font-medium text-gray-700 py-2 px-4 hover:bg-gray-200 rounded-md"
                                onClick={closeMenu}
                            >
                                About
                            </Link>
                            <hr className="border-gray-300 my-2" />
                            <Link
                                to="/contact"
                                className="block text-lg font-medium text-gray-700 py-2 px-4 hover:bg-gray-200 rounded-md"
                                onClick={closeMenu}
                            >
                                Contact
                            </Link> */}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
