"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { metricsService } from "@/lib/services";

const Login: React.FC = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(true);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await metricsService.login({ email, password });
            
            // Store tokens
            localStorage.setItem('access_token', response.access);
            localStorage.setItem('refresh_token', response.refresh);
            localStorage.setItem('user', JSON.stringify(response.user));

            // Redirect to dashboard
            router.push('/admin-dashboard');
        } catch (err: any) {
            console.error('Login failed:', err);
            const message = err.response?.data?.detail || err.response?.data?.message || 'Invalid email or password';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#f0f2f5]">
            <div className="bg-white rounded-2xl shadow-md px-10 py-10 w-full max-w-[500px]">

                {/* Logo */}
                <div className="flex justify-center items-center gap-3 mb-6">
                    {/* Icon — two overlapping rounded squares */}
                    <div className="relative w-10 h-10 flex-shrink-0">
                        <div className="absolute top-0 left-0 w-7 h-7 bg-[#2d2d2d] rounded-md rotate-[-10deg]" />
                        <div className="absolute bottom-0 right-0 w-7 h-7 bg-[#9ca3af] rounded-md rotate-[-10deg] opacity-80" />
                    </div>
                    {/* Text */}
                    <div className="leading-tight">
                        <div className="text-[22px] text-[#2d2d2d] font-normal tracking-tight">Business</div>
                        <div className="text-[22px] text-[#2d2d2d] font-bold tracking-tight">Intelligence</div>
                    </div>
                </div>

                {/* Heading */}
                <h2 className="text-[30px] font-semibold text-[#1a1a1a] text-center mb-2">
                    Login to Account
                </h2>
                <p className="text-center text-[#555555] text-[15px] mb-7">
                    Please enter your email and password to continue
                </p>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center font-medium">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate>

                    {/* Email */}
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-[15px] font-medium text-[#1a1a1a] mb-1.5"
                        >
                            Email address:
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email..."
                            className="w-full border border-[#d1d5db] rounded-md px-4 py-2.5 text-[15px] text-[#222] placeholder-[#c0c0c0] outline-none focus:border-[#1e4d8c] focus:ring-2 focus:ring-[#1e4d8c]/20 transition bg-white"
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-5">
                        <label
                            htmlFor="password"
                            className="block text-[15px] font-medium text-[#1a1a1a] mb-1.5"
                        >
                            Password:
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password..."
                                className="w-full border border-[#d1d5db] rounded-md px-4 py-2.5 pr-11 text-[15px] text-[#222] placeholder-[#c0c0c0] outline-none focus:border-[#1e4d8c] focus:ring-2 focus:ring-[#1e4d8c]/20 transition bg-white"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#1e4d8c] transition"
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between mb-6">
                        <label
                            className="flex items-center gap-2 cursor-pointer select-none"
                            onClick={() => setRemember((v) => !v)}
                        >
                            <div
                                className={`w-[18px] h-[18px] rounded-[4px] border-2 flex items-center justify-center transition-colors ${remember
                                    ? "bg-[#1e4d8c] border-[#1e4d8c]"
                                    : "bg-white border-[#d1d5db]"
                                    }`}
                            >
                                {remember && (
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                            <span className="text-[14px] text-[#444]">Remember me</span>
                        </label>

                        <a
                            href="/forget-password"
                            className="text-[14px] text-[#2563a8] hover:underline"
                        >
                            Forget Password?
                        </a>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#1e4d8c] hover:bg-[#1a4278] active:bg-[#163869] text-white font-semibold text-[16px] py-3 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                Signing in...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;