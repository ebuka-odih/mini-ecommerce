import React, { useState } from 'react';
import { LoaderCircle, Eye, EyeOff, Mail, Lock } from 'lucide-react';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
}

interface LoginPageProps {
    canResetPassword?: boolean;
    status?: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ canResetPassword = true, status }) => {
    const [formData, setFormData] = useState<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            const form = new FormData();
            form.append('email', formData.email);
            form.append('password', formData.password);
            form.append('remember', formData.remember ? '1' : '0');
            form.append('_token', document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '');

            const response = await fetch('/login', {
                method: 'POST',
                body: form,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (response.ok) {
                // Check if response is a redirect
                if (response.redirected) {
                    window.location.href = response.url;
                } else {
                    // Handle JSON response
                    const data = await response.json();
                    if (data.success) {
                        window.location.href = data.redirect || '/admin';
                    } else {
                        setErrors(data.errors || { general: 'Login failed' });
                    }
                }
            } else {
                // Handle validation errors
                const data = await response.json();
                setErrors(data.errors || { general: 'Login failed' });
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrors({ general: 'Network error. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl font-bold text-white">G</span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-white">
                        Welcome to GNOSIS
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Sign in to your admin account
                    </p>
                </div>

                {/* Status Message */}
                {status && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        {status}
                    </div>
                )}

                {/* Error Messages */}
                {errors.general && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {errors.general}
                    </div>
                )}

                {/* Login Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.email ? 'border-red-500' : 'border-gray-600'
                                    }`}
                                    placeholder="Enter your email"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 pr-10 border bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        errors.password ? 'border-red-500' : 'border-gray-600'
                                    }`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                            )}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    name="remember"
                                    type="checkbox"
                                    checked={formData.remember}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-800"
                                />
                                <label htmlFor="remember" className="ml-2 block text-sm text-gray-300">
                                    Remember me
                                </label>
                            </div>

                            {canResetPassword && (
                                <div className="text-sm">
                                    <a
                                        href="/forgot-password"
                                        className="font-medium text-blue-400 hover:text-blue-300"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? (
                                <>
                                    <LoaderCircle className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </div>

                    {/* Register Link */}
                    <div className="text-center">
                        <p className="text-sm text-gray-400">
                            Don't have an account?{' '}
                            <a
                                href="/register"
                                className="font-medium text-blue-400 hover:text-blue-300"
                            >
                                Sign up here
                            </a>
                        </p>
                    </div>
                </form>

                {/* Footer */}
                <div className="text-center">
                    <p className="text-xs text-gray-500">
                        © 2025 GNOSIS Brand. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
