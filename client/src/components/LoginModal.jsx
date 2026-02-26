import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HiX, HiEye, HiEyeOff } from "react-icons/hi";
import { FaCheckCircle, FaEnvelope } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { validateField } from "../utils/validationRules";
import ValidationError from "./common/ValidationError";

const PROMO_FEATURES = [
    "Easy booking",
    "Lowest price",
    "1 Million+ app downloads",
    "4.1 App rating",
];

/**
 * Google Sign-In Button using Google Identity Services (popup mode)
 */
const GoogleSignInButton = ({ onSuccess, disabled }) => {
    const btnRef = useRef(null);
    const [gsiLoaded, setGsiLoaded] = useState(false);

    useEffect(() => {
        // Load Google Identity Services script
        if (window.google?.accounts?.id) {
            setGsiLoaded(true);
            return;
        }
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => setGsiLoaded(true);
        document.head.appendChild(script);
    }, []);

    useEffect(() => {
        if (!gsiLoaded || !window.google?.accounts?.id) return;

        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        if (!clientId || clientId === "YOUR_GOOGLE_CLIENT_ID") {
            console.warn("Google Client ID not set. Google Sign-In will use fallback.");
            return;
        }

        window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response) => {
                // Decode the JWT credential
                const payload = JSON.parse(atob(response.credential.split(".")[1]));
                onSuccess({
                    credential: response.credential,
                    name: payload.name,
                    email: payload.email,
                    googleId: payload.sub,
                    picture: payload.picture,
                });
            },
        });

        window.google.accounts.id.renderButton(btnRef.current, {
            theme: "outline",
            size: "large",
            width: "100%",
            text: "continue_with",
        });
    }, [gsiLoaded, onSuccess]);

    // Fallback button if Google client ID is not configured
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === "YOUR_GOOGLE_CLIENT_ID") {
        return (
            <button
                type="button"
                disabled={disabled}
                onClick={() => alert("Google Sign-In requires a Google Client ID. Please add VITE_GOOGLE_CLIENT_ID to your .env file.")}
                className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 disabled:opacity-50"
            >
                <span className="text-lg font-bold">
                    <span className="text-blue-600">G</span>
                    <span className="text-red-500">o</span>
                    <span className="text-yellow-500">o</span>
                    <span className="text-blue-600">g</span>
                    <span className="text-green-500">l</span>
                    <span className="text-red-500">e</span>
                </span>
            </button>
        );
    }

    return <div ref={btnRef} className="w-full flex justify-center" />;
};

/**
 * OTP Verification Screen
 */
const OtpScreen = ({ email, onVerified, onResend, onBack }) => {
    const { verifyOtp, resendOtp } = useAuth();
    const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);
    const [success, setSuccess] = useState("");
    const inputRefs = useRef([]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    useEffect(() => {
        if (resendTimer <= 0) return;
        const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
        return () => clearTimeout(t);
    }, [resendTimer]);

    const handleDigitChange = (index, value) => {
        if (value.length > 1) value = value.slice(-1);
        if (value && !/^\d$/.test(value)) return;

        const updated = [...otpDigits];
        updated[index] = value;
        setOtpDigits(updated);

        // Auto-focus next
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        const updated = [...otpDigits];
        for (let i = 0; i < 6; i++) {
            updated[i] = text[i] || "";
        }
        setOtpDigits(updated);
        const lastIdx = Math.min(text.length, 5);
        inputRefs.current[lastIdx]?.focus();
    };

    const handleVerify = async () => {
        const otp = otpDigits.join("");
        if (otp.length < 6) {
            setError("Please enter the complete 6-digit OTP");
            return;
        }
        setLoading(true);
        setError("");
        const result = await verifyOtp(email, otp);
        setLoading(false);
        if (result.success) {
            onVerified();
        } else {
            setError(result.message);
        }
    };

    const handleResend = async () => {
        setError("");
        const result = await resendOtp(email);
        if (result.success) {
            setSuccess("New OTP sent!");
            setResendTimer(30);
            setOtpDigits(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
            setTimeout(() => setSuccess(""), 3000);
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="flex-1 px-8 py-8 md:px-10 md:py-10 relative flex flex-col items-center justify-center">
            <button
                type="button"
                onClick={onBack}
                className="absolute top-4 left-4 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
                ← Back
            </button>

            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <FaEnvelope className="w-7 h-7 text-blue-600" />
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-1 text-center">Verify Your Email</h2>
            <p className="text-sm text-gray-500 mb-6 text-center">
                We've sent a 6-digit code to<br />
                <strong className="text-gray-700">{email}</strong>
            </p>

            {error && (
                <div className="w-full bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 border border-red-100 text-center">
                    {error}
                </div>
            )}
            {success && (
                <div className="w-full bg-green-50 text-green-600 text-sm p-3 rounded-lg mb-4 border border-green-100 text-center">
                    {success}
                </div>
            )}

            {/* OTP Input Boxes */}
            <div className="flex gap-2 mb-6" onPaste={handlePaste}>
                {otpDigits.map((digit, i) => (
                    <input
                        key={i}
                        ref={(el) => (inputRefs.current[i] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleDigitChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        className="w-12 h-14 text-center text-xl font-bold border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        style={{ borderColor: digit ? "#3b82f6" : "#d1d5db" }}
                    />
                ))}
            </div>

            <button
                type="button"
                onClick={handleVerify}
                disabled={loading}
                className="w-full max-w-xs py-3.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg text-sm disabled:opacity-60 mb-4"
            >
                {loading ? "Verifying..." : "Verify Email"}
            </button>

            <p className="text-sm text-gray-500">
                Didn't get the code?{" "}
                {resendTimer > 0 ? (
                    <span className="text-gray-400">Resend in {resendTimer}s</span>
                ) : (
                    <button onClick={handleResend} className="text-blue-600 font-semibold hover:underline">
                        Resend OTP
                    </button>
                )}
            </p>
        </div>
    );
};

/* ================================================ */
/*        Main Login Modal Component                */
/* ================================================ */
const LoginModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, register, googleLogin } = useAuth();
    const [mode, setMode] = useState("login"); // "login" | "register" | "otp"
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [fieldErrors, setFieldErrors] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [pendingEmail, setPendingEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear error when typing
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Frontend Validation
        const errors = {};
        if (mode === "register") {
            const nameErr = validateField('name', formData.name);
            if (nameErr) errors.name = nameErr;
        }
        const emailErr = validateField('email', formData.email);
        if (emailErr) errors.email = emailErr;

        const passwordErr = validateField('password', formData.password);
        if (passwordErr) errors.password = passwordErr;

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        setLoading(true);

        try {
            if (mode === "login") {
                const result = await login(formData.email, formData.password);
                if (result.success) {
                    const returnTo = location.state?.returnTo;
                    if (returnTo) {
                        navigate(returnTo, { state: { ...location.state, returnTo: undefined }, replace: true });
                    }
                    resetAndClose();
                } else if (result.requiresVerification) {
                    setPendingEmail(result.email || formData.email);
                    setMode("otp");
                } else {
                    if (result.errors) {
                        const backendErrors = {};
                        result.errors.forEach(err => {
                            backendErrors[err.field] = err.message;
                        });
                        setFieldErrors(backendErrors);
                    } else {
                        setError(result.message);
                    }
                }
            } else if (mode === "register") {
                const result = await register(formData.name, formData.email, formData.password);
                if (result.success) {
                    if (result.requiresVerification) {
                        setPendingEmail(result.email || formData.email);
                        setMode("otp");
                    } else {
                        const returnTo = location.state?.returnTo;
                        if (returnTo) {
                            navigate(returnTo, { state: { ...location.state, returnTo: undefined }, replace: true });
                        }
                        resetAndClose();
                    }
                } else {
                    if (result.errors) {
                        const backendErrors = {};
                        result.errors.forEach(err => {
                            backendErrors[err.field] = err.message;
                        });
                        setFieldErrors(backendErrors);
                    } else {
                        setError(result.message);
                    }
                }
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (googleData) => {
        setLoading(true);
        setError("");
        const result = await googleLogin(googleData);
        setLoading(false);
        if (result.success) {
            const returnTo = location.state?.returnTo;
            if (returnTo) {
                navigate(returnTo, { state: { ...location.state, returnTo: undefined }, replace: true });
            }
            resetAndClose();
        } else {
            setError(result.message);
        }
    };

    const handleOtpVerified = () => {
        const returnTo = location.state?.returnTo;
        if (returnTo) {
            navigate(returnTo, { state: { ...location.state, returnTo: undefined }, replace: true });
        }
        resetAndClose();
    };

    const resetAndClose = () => {
        setFormData({ name: "", email: "", password: "" });
        setFieldErrors({});
        setError("");
        setMode("login");
        setPendingEmail("");
        onClose();
    };

    const switchMode = () => {
        setMode(mode === "login" ? "register" : "login");
        setFieldErrors({});
        setError("");
    };

    return (
        <>
            {/* Backdrop with blur */}
            <div
                className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
                onClick={resetAndClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
                <div
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-[820px] overflow-hidden flex animate-modal-in"
                    onClick={(e) => e.stopPropagation()}
                    style={{ minHeight: "480px" }}
                >
                    {/* Left Side: Promo */}
                    <div className="hidden md:flex flex-col justify-center w-[380px] bg-gradient-to-br from-slate-50 to-blue-50 px-10 py-10 border-r border-gray-100 flex-shrink-0">
                        <div className="mb-6">
                            <h2 className="text-2xl font-brand font-black text-blue-600 leading-none">Raj Travel</h2>
                            <p className="text-[10px] font-tagline font-bold text-gray-400 uppercase tracking-widest mt-1.5">Your Trusted Journey Partner</p>
                        </div>

                        <p className="text-gray-700 text-sm leading-relaxed mb-6">
                            Take a chill and enjoy your travel with Raj Travel
                        </p>

                        <div className="space-y-3 mb-8">
                            {PROMO_FEATURES.map((feat) => (
                                <div key={feat} className="flex items-center gap-3">
                                    <FaCheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    <span className="text-sm text-gray-700">{feat}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto">
                            <img
                                src="https://illustrations.popsy.co/amber/man-on-vacation.svg"
                                alt="Vacation"
                                className="w-full max-w-[260px] mx-auto opacity-90"
                                onError={(e) => { e.target.style.display = "none"; }}
                            />
                        </div>
                    </div>

                    {/* Right Side: Form or OTP */}
                    {mode === "otp" ? (
                        <OtpScreen
                            email={pendingEmail}
                            onVerified={handleOtpVerified}
                            onBack={() => { setMode("register"); setError(""); }}
                        />
                    ) : (
                        <div className="flex-1 px-8 py-8 md:px-10 md:py-10 relative">
                            {/* Close button */}
                            <button
                                type="button"
                                onClick={resetAndClose}
                                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                            >
                                <HiX className="w-5 h-5" />
                            </button>

                            <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                {mode === "login" ? "Login to Raj Travel" : "Create Account"}
                            </h2>
                            <p className="text-sm text-gray-500 mb-6">
                                {mode === "login"
                                    ? "Enter your email to continue"
                                    : "Sign up to start booking"}
                            </p>

                            {error && (
                                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 border border-red-100">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {mode === "register" && (
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Full Name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={`w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow ${fieldErrors.name ? 'border-red-500 bg-red-50/30' : 'border-gray-300'}`}
                                        />
                                        <ValidationError message={fieldErrors.name} />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Email ID</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email ID"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow ${fieldErrors.email ? 'border-red-500 bg-red-50/30' : 'border-gray-300'}`}
                                    />
                                    <ValidationError message={fieldErrors.email} />
                                </div>

                                <div className="relative">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Password</label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow pr-12 ${fieldErrors.password ? 'border-red-500 bg-red-50/30' : 'border-gray-300'}`}
                                    />
                                    <ValidationError message={fieldErrors.password} />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 focus:outline-none"
                                    >
                                        {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg text-sm disabled:opacity-60"
                                >
                                    {loading ? "Please wait..." : mode === "login" ? "Submit" : "Register"}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="flex items-center gap-3 my-5">
                                <div className="flex-1 h-px bg-gray-200" />
                                <span className="text-xs text-gray-400">Or continue with</span>
                                <div className="flex-1 h-px bg-gray-200" />
                            </div>

                            {/* Google sign-in */}
                            <GoogleSignInButton onSuccess={handleGoogleSuccess} disabled={loading} />

                            {/* Switch mode */}
                            <div className="mt-5 text-center text-sm text-gray-500">
                                {mode === "login" ? (
                                    <>
                                        Don't have an account?{" "}
                                        <button onClick={switchMode} className="text-red-500 font-semibold hover:underline">
                                            Sign Up
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        Already have an account?{" "}
                                        <button onClick={switchMode} className="text-blue-600 font-semibold hover:underline">
                                            Login
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Terms */}
                            <p className="mt-6 text-center text-[11px] text-gray-400 leading-relaxed">
                                By proceeding, you agree with our{" "}
                                <a href="#" className="text-blue-500 underline">Terms of service</a>,{" "}
                                <a href="#" className="text-blue-500 underline">privacy policy</a> &amp;{" "}
                                <a href="#" className="text-blue-500 underline">Master User Agreement</a>
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal-in {
          animation: modal-in 0.25s ease-out;
        }
      `}</style>
        </>
    );
};

export default LoginModal;
