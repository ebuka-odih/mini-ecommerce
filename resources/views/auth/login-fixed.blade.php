<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Login - GNOSIS Brand</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'gnosis-blue': '#2563eb',
                        'gnosis-dark': '#1f2937',
                        'gnosis-gray': '#374151'
                    }
                }
            }
        }
    </script>
    <style>
        body {
            background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .login-card {
            background: rgba(31, 41, 55, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(75, 85, 99, 0.3);
        }
        .form-input {
            transition: all 0.3s ease;
        }
        .form-input:focus {
            transform: translateY(-1px);
            box-shadow: 0 10px 25px rgba(37, 99, 235, 0.2);
        }
        .btn-primary {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            transition: all 0.3s ease;
        }
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 35px rgba(37, 99, 235, 0.4);
        }
        .btn-primary:active {
            transform: translateY(0);
        }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
        <!-- Logo and Header -->
        <div class="text-center mb-8">
            <div class="mx-auto w-20 h-20 bg-gradient-to-br from-gnosis-blue to-blue-700 rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
                <span class="text-3xl font-bold text-white">G</span>
            </div>
            <h1 class="text-3xl font-bold text-white mb-2">Welcome to GNOSIS</h1>
            <p class="text-gray-400">Sign in to your admin account</p>
        </div>

        <!-- Login Card -->
        <div class="login-card rounded-2xl p-8 shadow-2xl">
            <!-- Status Messages -->
            @if (session('status'))
                <div class="mb-6 p-4 bg-green-900/50 border border-green-500/50 text-green-300 rounded-lg">
                    {{ session('status') }}
                </div>
            @endif

            @if ($errors->any())
                <div class="mb-6 p-4 bg-red-900/50 border border-red-500/50 text-red-300 rounded-lg">
                    <ul class="space-y-1">
                        @foreach ($errors->all() as $error)
                            <li class="text-sm">• {{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <!-- Login Form -->
            <form method="POST" action="{{ route('login') }}" id="loginForm" class="space-y-6">
                @csrf
                
                <!-- Email Field -->
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                    </label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <input 
                            id="email" 
                            name="email" 
                            type="email" 
                            value="{{ old('email') }}"
                            required 
                            autocomplete="email"
                            class="form-input w-full pl-10 pr-4 py-3 bg-gnosis-gray/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gnosis-blue focus:border-transparent"
                            placeholder="Enter your email address"
                        >
                    </div>
                </div>

                <!-- Password Field -->
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
                        Password
                    </label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                        </div>
                        <input 
                            id="password" 
                            name="password" 
                            type="password" 
                            required 
                            autocomplete="current-password"
                            class="form-input w-full pl-10 pr-12 py-3 bg-gnosis-gray/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gnosis-blue focus:border-transparent"
                            placeholder="Enter your password"
                        >
                        <button 
                            type="button" 
                            id="togglePassword"
                            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                        >
                            <svg id="eyeIcon" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                            <svg id="eyeOffIcon" class="h-5 w-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Remember Me & Forgot Password -->
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input 
                            id="remember" 
                            name="remember" 
                            type="checkbox" 
                            class="h-4 w-4 text-gnosis-blue bg-gnosis-gray border-gray-600 rounded focus:ring-gnosis-blue focus:ring-2"
                        >
                        <label for="remember" class="ml-2 text-sm text-gray-300">
                            Remember me
                        </label>
                    </div>
                    <div class="text-sm">
                        <a href="{{ route('password.request') }}" class="text-gnosis-blue hover:text-blue-400 font-medium transition-colors">
                            Forgot password?
                        </a>
                    </div>
                </div>

                <!-- Submit Button -->
                <button 
                    type="submit" 
                    id="submitBtn"
                    class="btn-primary w-full py-3 px-4 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-gnosis-blue focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                    <span id="btnText">Sign In</span>
                    <svg id="loadingIcon" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white hidden" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </button>
            </form>

            <!-- Register Link -->
            <div class="mt-6 text-center">
                <p class="text-sm text-gray-400">
                    Don't have an account? 
                    <a href="{{ route('register') }}" class="text-gnosis-blue hover:text-blue-400 font-medium transition-colors">
                        Sign up here
                    </a>
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div class="text-center mt-8">
            <p class="text-xs text-gray-500">
                © 2025 GNOSIS Brand. All rights reserved.
            </p>
        </div>
    </div>

    <script>
        // Password visibility toggle
        document.getElementById('togglePassword').addEventListener('click', function() {
            const passwordField = document.getElementById('password');
            const eyeIcon = document.getElementById('eyeIcon');
            const eyeOffIcon = document.getElementById('eyeOffIcon');
            
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                eyeIcon.classList.add('hidden');
                eyeOffIcon.classList.remove('hidden');
            } else {
                passwordField.type = 'password';
                eyeIcon.classList.remove('hidden');
                eyeOffIcon.classList.add('hidden');
            }
        });

        // Form submission with loading state
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            const submitBtn = document.getElementById('submitBtn');
            const btnText = document.getElementById('btnText');
            const loadingIcon = document.getElementById('loadingIcon');
            
            // Show loading state
            submitBtn.disabled = true;
            btnText.textContent = 'Signing in...';
            loadingIcon.classList.remove('hidden');
            submitBtn.classList.add('opacity-75');
        });

        // Form validation feedback
        const inputs = document.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.value.trim() === '') {
                    this.classList.add('border-red-500');
                    this.classList.remove('border-gray-600');
                } else {
                    this.classList.remove('border-red-500');
                    this.classList.add('border-gray-600');
                }
            });

            input.addEventListener('input', function() {
                if (this.value.trim() !== '') {
                    this.classList.remove('border-red-500');
                    this.classList.add('border-gray-600');
                }
            });
        });
    </script>
</body>
</html>
