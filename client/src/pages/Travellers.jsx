import React from 'react';
import { FaUsers, FaPlus, FaTrash, FaEdit, FaUserCircle } from 'react-icons/fa';

const Travellers = () => {
    const travellers = [
        { name: 'Hardik Shah', type: 'Self', gender: 'Male', dob: '12 Jan 1995', email: 'hardik@gmail.com' },
        { name: 'Riya Shah', type: 'Family', gender: 'Female', dob: '05 Mar 1998', email: 'riyashah@gmail.com' }
    ];

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                        <FaUsers className="text-orange-500" /> Saved Travellers
                    </h1>
                    <button className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-orange-100 flex items-center gap-2 hover:bg-orange-600 transition-all">
                        <FaPlus /> Add New
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {travellers.map(traveller => (
                        <div key={traveller.name} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative group hover:shadow-md transition-all">
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 text-3xl">
                                    <FaUserCircle />
                                </div>
                                <div className="flex-1">
                                    <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded mb-1">
                                        {traveller.type}
                                    </span>
                                    <h3 className="text-lg font-black text-slate-800">{traveller.name}</h3>
                                    <p className="text-slate-400 text-xs font-medium">Born: {traveller.dob} • {traveller.gender}</p>
                                    <p className="text-slate-500 text-[11px] mt-2 font-bold">{traveller.email}</p>
                                </div>
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 bg-slate-50 text-slate-400 hover:text-blue-500 rounded-lg"><FaEdit /></button>
                                    <button className="p-2 bg-slate-50 text-slate-400 hover:text-red-500 rounded-lg"><FaTrash /></button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="bg-slate-100/50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:bg-white transition-all group">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-500 transition-all shadow-sm">
                            <FaPlus />
                        </div>
                        <p className="mt-3 text-xs font-bold text-slate-400">Save new traveller for faster bookings</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Travellers;
