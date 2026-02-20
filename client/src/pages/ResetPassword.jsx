import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return alert("Passwords don't match");
        }

        try {
            const res = await axios.post('http://localhost:5000/api/auth/reset-password', {
                token,
                password
            });
            alert(res.data.message);
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.message || 'Error resetting password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="New Password"
                        className="w-full p-3 border rounded mb-4"
                        required
                        minLength="6"
                    />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm New Password"
                        className="w-full p-3 border rounded mb-4"
                        required
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700">
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
