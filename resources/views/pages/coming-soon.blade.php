<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>{{ env('APP_NAME') }} - Coming Soon</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <style>
        /* NUCLEAR RESET - Force black background everywhere */
        * {
            background-color: #000000 !important;
            color: #ffffff !important;
        }
        
        /* CRITICAL: Override Bootstrap with higher specificity */
        html, body {
            background-color: #000000 !important;
            color: #ffffff !important;
            min-height: 100vh !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
        }
       *{
            background-color: #000000 !important;
            color: #ffffff !important;
        }
        
        /* Force black background on all elements */
        html, body, .container-fluid, .row, .col-12, .coming-soon-container {
            background-color: #000000 !important;
        }
        
        /* Force white text on all elements */
        html, body, .coming-soon-container, .coming-soon-container * {
            color: #ffffff !important;
        }
        /* Custom styles */
        body {
            background-color: #000000 !important;
            color: #ffffff !important;
            font-family: 'Courier New', monospace !important;
            overflow: hidden !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
        }
        
        /* Force all text to be white */
        * {
            color: #ffffff !important;
        }
        
        /* Ensure all text elements are white */
        h1, h2, h3, h4, h5, h6, p, span, div, button, input, textarea {
            color: #ffffff !important;
        }
        
        .coming-soon-container {
            min-height: 100vh;
            background-color: #000000 !important;
            color: #ffffff !important;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 80px 20px 20px 20px;
            text-align: center;
            position: relative;
        }
        
        .logo-section {
            position: absolute;
            top: 20px;
            left: 20px;
            margin: 0;
        }
        
        .logo {
            height: 25px;
            width: auto;
            object-fit: contain;
        }
        
        .content-section {
            max-width: 320px;
            width: 100%;
        }
        
        .message {
            font-size: 14px !important;
            font-weight: 300 !important;
            font-family: 'Arial', 'Helvetica Neue', Helvetica, sans-serif !important;
            line-height: 1.6 !important;
            letter-spacing: 0.03em !important;
            margin-bottom: 30px !important;
        }
        
        /* Additional specific override for h4.message */
        h4.message {
            font-family: 'Arial', 'Helvetica Neue', Helvetica, sans-serif !important;
            font-weight: 300 !important;
            font-size: 14px !important;
        }
        
        /* Ensure all elements with message class get the same styling */
        .message, .password-toggle .message, .email-title.message {
            font-family: 'Arial', 'Helvetica Neue', Helvetica, sans-serif !important;
            font-weight: 300 !important;
            font-size: 14px !important;
            line-height: 1.6 !important;
            letter-spacing: 0.03em !important;
        }
        
        .password-toggle {
            color: #ffffff;
            text-decoration: underline;
            font-size: 14px;
            margin-bottom: 15px;
            cursor: pointer;
            background: none;
            border: none;
            padding: 0;
        }
        
        .password-toggle:hover {
            color: #ffffff;
            text-decoration: underline;
        }
        
        .form-control {
            background-color: #000000 !important;
            border: 1px solid #ffffff !important;
            color: #ffffff !important;
            padding: 12px 16px;
            border-radius: 6px;
            font-size: 14px;
            font-family: 'Courier New', monospace;
        }
        
        /* Override Bootstrap form control colors */
        .form-control::placeholder {
            color: rgba(255, 255, 255, 0.7) !important;
        }
        
        /* Force input text to be white */
        input, input::placeholder {
            color: #ffffff !important;
        }
        
        .form-control:focus {
            background-color: #000000 !important;
            border-color: #65644A !important;
            color: #ffffff !important;
            box-shadow: 0 0 0 0.2rem rgba(101, 100, 74, 0.25) !important;
        }
        
        .form-control::placeholder {
            color: rgba(255, 255, 255, 0.7) !important;
        }
        
        .btn-primary {
            --bs-btn-color: #fff;
            --bs-btn-bg: #65644A;
            --bs-btn-border-color: #65644A;
            --bs-btn-hover-color: #fff;
            --bs-btn-hover-bg: #5a5940;
            --bs-btn-hover-border-color: #5a5940;
            --bs-btn-focus-shadow-rgb: 101, 100, 74;
            --bs-btn-active-color: #fff;
            --bs-btn-active-bg: #5a5940;
            --bs-btn-active-border-color: #5a5940;
            --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
            --bs-btn-disabled-color: #fff;
            --bs-btn-disabled-bg: #65644A;
            --bs-btn-disabled-border-color: #65644A;
            
            /* Fallback styles */
            background-color: #65644A !important;
            border-color: #65644A !important;
            color: #ffffff !important;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: bold;
            font-size: 14px;
            font-family: 'Courier New', monospace;
            min-width: 100px;
        }
        
        .btn-primary:hover {
            background-color: #5a5940 !important;
            border-color: #5a5940 !important;
            color: #ffffff !important;
        }
        
        .btn-primary:focus {
            background-color: #65644A !important;
            border-color: #65644A !important;
            color: #ffffff !important;
            box-shadow: 0 0 0 0.2rem rgba(101, 100, 74, 0.25) !important;
        }
        
        /* Override all buttons to use army green with higher specificity */
        .coming-soon-container button,
        .coming-soon-container .btn,
        .coming-soon-container .btn-primary {
            background-color: #65644A !important;
            border-color: #65644A !important;
            color: #ffffff !important;
        }
        
        .coming-soon-container button:hover,
        .coming-soon-container .btn:hover,
        .coming-soon-container .btn-primary:hover {
            background-color: #5a5940 !important;
            border-color: #5a5940 !important;
            color: #ffffff !important;
        }
        
        .coming-soon-container button:focus,
        .coming-soon-container .btn:focus,
        .coming-soon-container .btn-primary:focus {
            background-color: #65644A !important;
            border-color: #65644A !important;
            color: #ffffff !important;
            box-shadow: 0 0 0 0.2rem rgba(101, 100, 74, 0.25) !important;
        }
        
        .email-title {
            font-size: 12px;
            margin-bottom: 15px;
            line-height: 1.4;
        }
        
        .success-message {
            color: #10b981;
            font-size: 12px;
            margin-top: 8px;
        }
        
        /* Mobile optimizations */
        @media (max-width: 480px) {
            .logo {
                height: 20px;
            }
            
            .logo-section {
                top: 15px;
                left: 15px;
            }
            
            .message {
                font-size: 13px !important;
                font-weight: 300 !important;
                font-family: 'Arial', 'Helvetica Neue', Helvetica, sans-serif !important;
            }
            
            .content-section {
                padding: 0 20px;
            }
        }
        
        /* Override Bootstrap defaults */
        .container-fluid {
            padding: 0;
        }
        
        .row {
            margin: 0;
        }
        
        .col-12 {
            padding: 0;
        }
        
        /* Additional overrides to ensure black background and white text */
        html {
            background-color: #000000 !important;
            color: #ffffff !important;
        }
        
        .coming-soon-container * {
            color: #ffffff !important;
        }
        
        /* Force all containers to have black background */
        .container-fluid, .row, .col-12 {
            background-color: #000000 !important;
        }
        
        /* CRITICAL: Override Bootstrap form controls */
        .coming-soon-container .form-control {
            background-color: #000000 !important;
            border: 1px solid #ffffff !important;
            color: #ffffff !important;
        }
        
        .coming-soon-container .form-control:focus {
            background-color: #000000 !important;
            border-color: #65644A !important;
            color: #ffffff !important;
            box-shadow: 0 0 0 0.2rem rgba(101, 100, 74, 0.25) !important;
        }
        
        .coming-soon-container .form-control::placeholder {
            color: rgba(255, 255, 255, 0.7) !important;
        }
    </style>
</head>
<body>
    <div style="background-color: #000000 !important; color: #ffffff !important; text-align: center;" class="coming-soon-container">
        <div class="container-fluid">
            <div class="row justify-content-center">
                <div class="col-12">
                    <!-- Logo -->
                    <div class="logo-section" style="position: absolute !important; top: 20px !important; left: 20px !important; margin: 0 !important; z-index: 1000 !important;">
                        <img src="/img/logo.png" alt="Logo" class="logo" style="height: 110px !important; width: auto !important; object-fit: contain !important;">
                    </div>
                    <br><br><br>
                    
                    <!-- Main Content -->
                    <div sty class="content-section mx-auto" style="margin-top: 160px !important;">
                        <div class="message-container">
                            <h4 class="message" style="font-family: 'Arial', 'Helvetica Neue', Helvetica, sans-serif !important; font-weight: 300 !important; font-size: 14px !important;">{{ strtoupper($settings['message']) }}</h4>
                        </div>
                        <br><br>
                        
                        <!-- Password Section -->
                        <div class="password-section mb-3">
                            <button id="password-toggle" class="password-toggle">
                                <span class="arrow message" style="font-family: 'Arial', 'Helvetica Neue', Helvetica, sans-serif !important; font-weight: 300 !important; font-size: 14px !important;">► ENTER USING PASSWORD</span>
                            </button>
                            
                            <form id="password-form" class="password-form" action="{{ route('coming-soon.verify') }}" method="POST" style="display: none;">
                                @csrf
                                <div class="mb-2">
                                    <input id="password-input" name="password" type="password" placeholder="Enter password" class="form-control @error('password') is-invalid @enderror" required>
                                    @error('password')
                                        <div class="invalid-feedback">
                                            {{ $message }}
                                        </div>
                                    @enderror
                                </div>
                                <div class="d-grid">
                                    <button style="background-color: #65644A !important; border-color: #65644A !important; color: #ffffff !important;" type="submit" class="btn btn-primary">Access Site</button>
                                </div>
                            </form>
                        </div>
                        <br>
                        
                        <!-- Email Signup -->
                        <div style="margin-top: 30px;" class="email-section">
                                                         <p class="email-title message" style="font-family: 'Arial', 'Helvetica Neue', Helvetica, sans-serif !important; font-weight: 300 !important; font-size: 14px !important;">BE THE FIRST TO RECEIVE THE PASSWORD WHEN '{{ strtoupper(config('app.name', 'PaperView Online')) }}' DROPS</p>
                            <div class="email-form">
                                <div class="mb-2">
                                    <input id="email-input" type="email" placeholder="EMAIL" class="form-control">
                                </div>
                                <div class="d-grid">
                                    <button style="background-color: #65644A !important; border-color: #65644A !important; color: #ffffff !important;" id="send-button" class="btn btn-primary">SEND</button>
                                </div>
                            </div>
                            <div id="email-success" class="success-message" style="display: none;">Thank you! You will be notified.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <script>
        // IMMEDIATE STYLE APPLICATION - Run before DOM is ready
        (function() {
            // Force black background and white text immediately
            document.documentElement.style.backgroundColor = '#000000';
            document.body.style.backgroundColor = '#000000';
            document.documentElement.style.color = '#ffffff';
            document.body.style.color = '#ffffff';
            
            // Force ALL elements to have black background
            const allElements = document.querySelectorAll('*');
            allElements.forEach(element => {
                element.style.backgroundColor = '#000000';
                element.style.color = '#ffffff';
            });
            
            // Force all buttons to be army green immediately
            const buttons = document.querySelectorAll('button, .btn, .btn-primary');
            buttons.forEach(button => {
                button.style.backgroundColor = '#65644A';
                button.style.borderColor = '#65644A';
                button.style.color = '#ffffff';
            });
            
            // Force all form controls to be black with white text
            const inputs = document.querySelectorAll('input, .form-control');
            inputs.forEach(input => {
                input.style.backgroundColor = '#000000';
                input.style.borderColor = '#ffffff';
                input.style.color = '#ffffff';
            });
        })();
        
        document.addEventListener('DOMContentLoaded', function() {
            // Password toggle functionality
            const passwordToggle = document.getElementById('password-toggle');
            const passwordForm = document.getElementById('password-form');
            const passwordInput = document.getElementById('password-input');
            
            passwordToggle.addEventListener('click', function() {
                if (passwordForm.style.display === 'none') {
                    passwordForm.style.display = 'block';
                    passwordInput.focus();
                } else {
                    passwordForm.style.display = 'none';
                }
            });
            
            // Email signup functionality
            const emailInput = document.getElementById('email-input');
            const sendButton = document.getElementById('send-button');
            const emailSuccess = document.getElementById('email-success');
            
            sendButton.addEventListener('click', function() {
                const email = emailInput.value;
                if (email && email.includes('@')) {
                    // Here you would typically send the email to your backend
                    emailSuccess.style.display = 'block';
                    emailInput.value = '';
                    setTimeout(() => {
                        emailSuccess.style.display = 'none';
                    }, 3000);
                } else {
                    alert('Please enter a valid email address');
                    emailInput.focus();
                }
            });
            
            // Enter key support for email
            emailInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendButton.click();
                }
            });
        });
    </script>
</body>
</html> 