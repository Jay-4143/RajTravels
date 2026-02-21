import React, { useState } from 'react';
import { FaShieldAlt, FaCreditCard, FaLock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import api from '../api/axios';
import { useGlobal } from '../context/GlobalContext';

const PaymentModal = ({ isOpen, onClose, bookingId, bookingType, amount, onPaymentSuccess }) => {
    const [step, setStep] = useState('selection'); // selection, processing, success, fail
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { formatPrice } = useGlobal();

    if (!isOpen) return null;

    const handleSimulatedPayment = async (status = 'success') => {
        setLoading(true);
        setError('');
        setStep('processing');

        try {
            // Step 1: Create Payment Order
            const orderRes = await api.post('/payments/create-order', {
                bookingId,
                bookingType,
                amount
            }, {
                headers: { 'x-simulate-payment': 'true' }
            });

            const { paymentId } = orderRes.data;

            // Simulated Delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Step 2: Verify Payment
            const verifyRes = await api.post('/payments/verify', {
                paymentId,
                status,
                razorpayPaymentId: status === 'success' ? 'pay_sim_12345' : null
            });

            if (verifyRes.data.success) {
                setStep('success');
                setTimeout(() => {
                    onPaymentSuccess(verifyRes.data.payment);
                }, 2000);
            } else {
                setStep('fail');
                setError(verifyRes.data.message || 'Payment failed');
            }
        } catch (err) {
            setStep('fail');
            setError(err.response?.data?.message || 'Something went wrong during payment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">

                {/* Header */}
                <div className="bg-blue-600 p-6 text-white text-center relative">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-white/80 hover:text-white"
                    >
                        <FaTimesCircle size={24} />
                    </button>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FaShieldAlt size={32} />
                    </div>
                    <h2 className="text-xl font-bold uppercase tracking-wider">Secure Checkout</h2>
                    <p className="text-blue-100 text-sm mt-1">Payment for Order #{bookingId.slice(-6).toUpperCase()}</p>
                </div>

                <div className="p-8">
                    {step === 'selection' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <span className="font-medium">Total Amount</span>
                                <span className="text-2xl font-black text-blue-600">{formatPrice(amount)}</span>
                            </div>

                            <div className="space-y-3">
                                <p className="text-sm font-semibold text-gray-500 uppercase">Select Payment Method (Simulated)</p>
                                <button
                                    onClick={() => handleSimulatedPayment('success')}
                                    className="w-full flex items-center gap-4 p-4 border-2 border-gray-100 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all text-left"
                                >
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                        <FaCreditCard size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">Card / NetBanking / UPI</p>
                                        <p className="text-xs text-gray-500">Pay securely via Razorpay Simulation</p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleSimulatedPayment('fail')}
                                    className="w-full flex items-center gap-4 p-4 border-2 border-gray-100 rounded-xl hover:border-red-600 hover:bg-red-50 transition-all text-left grayscale hover:grayscale-0"
                                >
                                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                                        <FaTimesCircle size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">Simulate Failure</p>
                                        <p className="text-xs text-gray-500">Test the payment failure flow</p>
                                    </div>
                                </button>
                            </div>

                            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                                <FaLock />
                                <span>128-bit SSL Encrypted Payment</span>
                            </div>
                        </div>
                    )}

                    {step === 'processing' && (
                        <div className="text-center py-12 space-y-4">
                            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <h3 className="text-lg font-bold text-gray-800">Processing Payment</h3>
                            <p className="text-sm text-gray-500">Please do not refresh the page...</p>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="text-center py-12 space-y-4 animate-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                <FaCheckCircle size={48} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-800">Payment Successful!</h3>
                            <p className="text-sm text-gray-500">Your booking is being confirmed.</p>
                        </div>
                    )}

                    {step === 'fail' && (
                        <div className="text-center py-12 space-y-4">
                            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                                <FaTimesCircle size={48} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-800">Payment Failed</h3>
                            <p className="text-sm text-red-500 font-medium">{error}</p>
                            <button
                                onClick={() => setStep('selection')}
                                className="mt-6 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Powered By</span>
                        <img src="https://img.icons8.com/color/48/000000/razorpay.png" className="h-6" alt="Razorpay" />
                    </div>
                    <div className="flex items-center gap-2 opacity-50 grayscale">
                        <img src="https://img.icons8.com/color/48/000000/visa.png" className="h-4" alt="Visa" />
                        <img src="https://img.icons8.com/color/48/000000/mastercard.png" className="h-4" alt="Mastercard" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
