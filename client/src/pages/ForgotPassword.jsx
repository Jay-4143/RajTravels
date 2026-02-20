import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setMessage(res.data.message);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
            setMessage('');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
                <p className="text-gray-600 mb-6 text-center text-sm">Enter your email and we'll send you a link to reset your password.</p>

                {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center">{message}</div>}
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full p-3 border rounded mb-4"
                        required
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700">
                        Send Reset Link
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
