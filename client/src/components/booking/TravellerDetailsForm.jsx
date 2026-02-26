import { useState } from 'react';
import { FaUser, FaChevronDown, FaChevronUp, FaInfoCircle, FaChevronRight } from 'react-icons/fa';
import ValidationError from '../common/ValidationError';

const TravellerDetailsForm = ({ passengers, onPassengerChange, errors = {} }) => {
    const adults = passengers.filter(p => p.type === 'Adult');
    const children = passengers.filter(p => p.type === 'Child');
    const infants = passengers.filter(p => p.type === 'Infant');

    // Accordion state
    const [openSections, setOpenSections] = useState({
        Adult: true, // Default open
        Child: false,
        Infant: false
    });

    const toggleSection = (section) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const renderPassengerInputs = (p, originalIndex) => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 last:mb-0">
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Title</p>
                <select
                    value={p.title || ""}
                    onChange={(e) => onPassengerChange(originalIndex, "title", e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none block appearance-none"
                >
                    <option value="">Title</option>
                    <option value="Mr">Mr</option>
                    <option value="Ms">Ms</option>
                    <option value="Mrs">Mrs</option>
                </select>
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">First Name/Given Name</p>
                <input
                    type="text"
                    value={p.firstName || ""}
                    placeholder="First Name/Given Name"
                    onChange={(e) => onPassengerChange(originalIndex, "firstName", e.target.value)}
                    className={`w-full border rounded-lg px-4 py-2.5 text-xs font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none ${errors[`p${originalIndex}_firstName`] ? 'border-red-500 bg-red-50/30' : 'border-slate-200'}`}
                />
                <ValidationError message={errors[`p${originalIndex}_firstName`]} />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Last Name/Surname</p>
                <input
                    type="text"
                    value={p.lastName || ""}
                    placeholder="Last Name/Surname"
                    onChange={(e) => onPassengerChange(originalIndex, "lastName", e.target.value)}
                    className={`w-full border rounded-lg px-4 py-2.5 text-xs font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none ${errors[`p${originalIndex}_lastName`] ? 'border-red-500 bg-red-50/30' : 'border-slate-200'}`}
                />
                <ValidationError message={errors[`p${originalIndex}_lastName`]} />
            </div>
            {p.type !== 'Adult' && (
                <div className="col-span-full md:col-span-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Date of Birth</p>
                    <input
                        type="date"
                        value={p.dob || ""}
                        onChange={(e) => onPassengerChange(originalIndex, "dob", e.target.value)}
                        className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                </div>
            )}
            {p.type === 'Adult' && (
                <div className="col-span-full">
                    <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">+ Add Frequent flyer number</button>
                </div>
            )}
            {/* Divider between passengers in the same section */}
            <div className="col-span-full border-b border-slate-50 last:hidden pb-4"></div>
        </div>
    );

    const renderAccordionSection = (type, list, label) => {
        if (list.length === 0) return null;
        const isOpen = openSections[type];

        return (
            <div className="mb-4 last:mb-0 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <button
                    onClick={() => toggleSection(type)}
                    className="w-full bg-slate-100/80 px-6 py-4 flex items-center justify-between hover:bg-slate-200/50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        {isOpen ? <FaChevronDown className="text-slate-400 w-3" /> : <FaChevronRight className="text-slate-400 w-3" />}
                        <span className="text-sm font-bold text-slate-800 tracking-tight">{label} x {list.length}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center bg-white shadow-sm text-blue-600">
                        {isOpen ? <FaChevronDown className="w-3.5" /> : <FaChevronRight className="w-3.5" />}
                    </div>
                </button>

                {isOpen && (
                    <div className="p-8 bg-white">
                        {/* SPECIAL CASE: Lead Adult ID Selection at the top */}
                        {type === 'Adult' && (
                            <div className="mb-10 pb-10 border-b border-slate-100">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Government ID Type</p>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {[
                                        { id: "Aadhar", label: "AADHAR CARD" },
                                        { id: "Passport", label: "PASSPORT" },
                                        { id: "PAN", label: "PAN CARD" },
                                        { id: "VoterId", label: "VOTER ID" },
                                        { id: "DrivingLicense", label: "DRIVING LICENSE" }
                                    ].map(opt => (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => {
                                                // Apply to first adult (Lead Traveller)
                                                const leadIdx = passengers.findIndex(p => p.type === 'Adult');
                                                if (leadIdx !== -1) onPassengerChange(leadIdx, "idType", opt.id);
                                            }}
                                            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${passengers.find(p => p.type === 'Adult')?.idType === opt.id
                                                ? "bg-white border-blue-600 text-blue-600 shadow-md ring-1 ring-blue-600"
                                                : "bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">ID Number</p>
                                    <input
                                        type="text"
                                        placeholder="Enter ID Number"
                                        value={passengers.find(p => p.type === 'Adult')?.idNumber || ""}
                                        onChange={(e) => {
                                            const leadIdx = passengers.findIndex(p => p.type === 'Adult');
                                            if (leadIdx !== -1) onPassengerChange(leadIdx, "idNumber", e.target.value);
                                        }}
                                        className={`w-full max-w-md border rounded-xl px-5 py-3 text-xs font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none ${errors.idNumber ? 'border-red-500 bg-red-50/30' : 'border-slate-200'}`}
                                    />
                                    <ValidationError message={errors.idNumber} />
                                </div>
                            </div>
                        )}

                        <div className="space-y-10">
                            {passengers.map((p, i) => p.type === type && renderPassengerInputs(p, i))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <h3 className="text-xl font-bold text-gray-900 p-6 flex items-center justify-between border-b border-slate-50">
                Traveller Details
            </h3>
            <div className="p-6">
                <div className="bg-cyan-50/50 p-4 rounded-xl border border-cyan-100 flex items-center gap-3 mb-8">
                    <FaInfoCircle className="text-cyan-500 w-4 h-4" />
                    <span className="text-[11px] font-bold text-cyan-700">Please make sure you enter the Name as per your Government photo id.</span>
                </div>

                <div className="space-y-4">
                    {renderAccordionSection('Adult', adults, 'Adult')}
                    {renderAccordionSection('Child', children, 'Child')}
                    {renderAccordionSection('Infant', infants, 'Infant')}
                </div>
            </div>
        </div>
    );
};

export default TravellerDetailsForm;
