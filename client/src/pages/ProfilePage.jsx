import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
    const { user, updateProfile, logout } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await updateProfile(formData);
        setMessage(result.message);
    };

    return (
        <div className="container mx-auto px-4 py-8 mt-16 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-6 flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{user?.name}</h2>
                        <p className="text-gray-500">{user?.email}</p>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">{user?.role}</span>
                    </div>
                </div>

                {message && (
                    <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">Phone Number</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            placeholder="Add your phone number"
                        />
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Update Profile
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t">
                    <button onClick={logout} className="text-red-600 hover:text-red-800 font-medium">
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
