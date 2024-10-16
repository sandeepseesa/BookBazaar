import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const Login = ({ setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://bookbazaar-backend.onrender.com/login', { username, password }, { withCredentials: true })

            const token = response.data.token;

            if (token) {
                setToken(token);
                enqueueSnackbar('Login Successful!', { variant: 'success' });
                navigate('/');
            } else {
                throw new Error('Invalid response structure');
            }

        } catch (err) {
            // enqueueSnackbar(err.message, { variant: 'error' });
            
            // Check if the error is an Axios error
        if (axios.isAxiosError(err)) {
            // Check if there is a response
            if (err.response) {
                // Get the specific error message from the response
                enqueueSnackbar(err.response.data.error || 'Login failed', { variant: 'error' });
            } else {
                enqueueSnackbar('Login failed: ' + err.message, { variant: 'error' });
            }
        } else {
            enqueueSnackbar('Login failed: ' + err.message, { variant: 'error' });
        }
            console.error('Login failed', err);
        }

    };

    const handleGoogleLogin = async () => {

        window.location.href = 'http://localhost:3000/auth/google';
    };


    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
            <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-xl">
                <h2 className="text-3xl font-extrabold text-center text-gray-900">Login to Your Account</h2>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username" required
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password" required
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div className="flex justify-between items-center">
                        <button type="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700 transition">
                            Login
                        </button>
                    </div>
                </form>

                <div>
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex justify-center items-center bg-red-500 text-white p-2 rounded-md hover:bg-red-700 transition"
                    >
                        Sign in with Google
                    </button>
                    <div className="text-center text-gray-500 mt-4">
                        Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Register</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;