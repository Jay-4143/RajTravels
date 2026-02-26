import { FaPaperPlane, FaClock } from 'react-icons/fa';
import ValidationError from '../common/ValidationError';

const ContactInfoForm = ({
    mobile,
    email,
    onMobileChange,
    onEmailChange,
    gstin,
    onGstinChange,
    useGstin,
    onUseGstinToggle,
    gstHolderName,
    onGstHolderNameChange,
    gstAddress,
    onGstAddressChange,
    gstPincode,
    onGstPincodeChange,
    saveGst,
    onSaveGstToggle,
    errors = {}
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <h3 className="text-lg font-bold text-gray-900 border-b border-slate-50 p-6 flex items-center gap-3 uppercase tracking-tight">
                Contact Information
            </h3>
            <div className="p-6">
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
                        <FaPaperPlane className="w-4 h-4" />
                    </div>
                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-tight leading-relaxed">
                        Your ticket and flights information will be sent here..
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="relative">
                        <div className="flex bg-white border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                            <div className="bg-slate-50 px-3 py-2.5 border-r border-slate-100 flex items-center gap-2">
                                <span className="text-[10px] font-black text-slate-400">🇮🇳 +91</span>
                            </div>
                            <input
                                type="tel"
                                value={mobile}
                                onChange={(e) => onMobileChange(e.target.value)}
                                placeholder="81234 56789"
                                className="flex-1 px-4 py-2.5 text-xs font-bold text-gray-700 outline-none"
                            />
                        </div>
                        <ValidationError message={errors.mobile} />
                    </div>
                    <div className="relative">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => onEmailChange(e.target.value)}
                            placeholder="Email"
                            className={`w-full border rounded-lg px-4 py-2.5 text-xs font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none ${errors.email ? 'border-red-500 bg-red-50/30' : 'border-slate-200'}`}
                        />
                        <ValidationError message={errors.email} />
                    </div>
                </div>

                <div className="flex flex-col gap-4 p-4 bg-slate-50/30 rounded-xl border border-slate-50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-lg border border-slate-100 flex flex-col items-center justify-center p-1 shadow-sm">
                                <div className="text-[7px] font-black text-white bg-blue-600 px-1 rounded leading-none">GST</div>
                            </div>
                            <div>
                                <p className="text-[11px] font-black text-slate-700 uppercase tracking-tight">Use GSTIN for this booking <span className="text-slate-400 font-bold">(Optional)</span></p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Claim credit of GST charges. Your taxes may get updated post submitting your GST details</p>
                            </div>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="radio"
                                checked={useGstin}
                                onChange={() => onUseGstinToggle(!useGstin)}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-600 border-gray-300"
                            />
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Please include my GST number</span>
                        </label>
                    </div>

                    {useGstin && (
                        <div className="mt-4 pt-6 border-t border-slate-100 animate-fadeIn">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <div>
                                    <input
                                        type="text"
                                        value={gstin}
                                        onChange={(e) => onGstinChange(e.target.value)}
                                        placeholder="GSTIN"
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={gstHolderName}
                                        onChange={(e) => onGstHolderNameChange(e.target.value)}
                                        placeholder="GST Holder Name"
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={gstAddress}
                                        onChange={(e) => onGstAddressChange(e.target.value)}
                                        placeholder="Address"
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={gstPincode}
                                        onChange={(e) => onGstPincodeChange(e.target.value)}
                                        placeholder="Pincode"
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none"
                                    />
                                </div>
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={saveGst}
                                    onChange={(e) => onSaveGstToggle(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 focus:ring-blue-600 border-gray-300 rounded"
                                />
                                <span className="text-[11px] font-bold text-slate-500 group-hover:text-blue-600 transition-colors uppercase tracking-tight">Save GST Details</span>
                            </label>
                        </div>
                    )}
                </div>
            </div >
        </div >
    );
};

export default ContactInfoForm;
