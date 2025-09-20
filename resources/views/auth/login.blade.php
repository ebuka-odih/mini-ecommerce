<!DOCTYPE html>
<html lang="zxx" class="js">

<head>
    <base href="../../../">
    <meta charset="utf-8">
    <meta name="author" content="Softnio">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description"
          content="A powerful and conceptual apps base dashboard template that especially build for developers and programmers.">
    <!-- Fav Icon  -->
    <link rel="shortcut icon" href="{{ asset('images/favicon.png') }}">
    <!-- Page Title  -->
    <title>Login | {{ env('APP_NAME') }}</title>
    <!-- StyleSheets  -->
    <link rel="stylesheet" href="{{ asset('admin/assets/css/dashlite.css?ver=3.2.0') }}">
    <link id="skin-default" rel="stylesheet" href="{{ asset('admin/assets/css/theme.css?ver=3.2.0') }}">
</head>

<body class=" pg-auth nk-body bg-lighter npc-default has-sidebar no-touch nk-nio-theme dark-mode">
<div class="nk-app-root">
    <!-- main @s -->
    <div class="nk-main ">
        <!-- wrap @s -->
        <div class="nk-wrap nk-wrap-nosidebar">
            <!-- content @s -->
            <div class="nk-content card">
                <div class="nk-block nk-block-middle nk-auth-body  wide-xs">
                    <div class="brand-logo pb-4 text-center">
                        <a href="{{ route('index') }}" class="logo-link">
                            <h3>{{ env('APP_NAME') }}</h3>
                            {{--                                <img class="logo-light logo-img logo-img-lg" src="./images/logo.png" srcset="./images/logo2x.png 2x" alt="logo">--}}
                            {{--                                <img class="logo-dark logo-img logo-img-lg" src="./images/logo-dark.png" srcset="./images/logo-dark2x.png 2x" alt="logo-dark">--}}
                        </a>
                    </div>
                    <div class="card">
                        <div class="card-inner card-inner-lg">
                            <div class="nk-block-head">
                                <div class="nk-block-head-content">
                                    <h4 class="nk-block-title">Sign-In</h4>
                                </div>
                            </div>
                            <form action="{{ route('login') }}" method="POST">
                                @csrf
                                <x-honeypot />
                                @if ($errors->any())
                                    <div class="alert alert-danger">
                                        <ul>
                                            @foreach ($errors->all() as $error)
                                                <li>{{ $error }}</li>
                                            @endforeach
                                        </ul>
                                    </div>
                                @endif
                                <div class="form-group">
                                    <div class="form-label-group">
                                        <label class="form-label" for="default-01">Email</label>
                                    </div>
                                    <div class="form-control-wrap">
                                        <input type="text" name="email" class="form-control form-control-lg" id="default-01"
                                               placeholder="Enter your email address or username">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="form-label-group">
                                        <label class="form-label" for="password">Passcode</label>
                                        <a class="link link-primary link-sm" href="html/pages/auths/auth-reset-v2.html">Forgot
                                            Code?</a>
                                    </div>
                                    <div class="form-control-wrap">
                                        <a href="#" class="form-icon form-icon-right passcode-switch lg"
                                           data-target="password">
                                            <em class="passcode-icon icon-show icon ni ni-eye"></em>
                                            <em class="passcode-icon icon-hide icon ni ni-eye-off"></em>
                                        </a>
                                        <input type="password" name="password" class="form-control form-control-lg" id="password"
                                               placeholder="Enter your passcode">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <button class="btn btn-lg btn-primary btn-block">Sign in</button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>

            </div>
            <!-- wrap @e -->
        </div>
        <!-- content @e -->
    </div>
    <!-- main @e -->
</div>
<!-- app-root @e -->
<!-- JavaScript -->
<script src="{{ asset('admin/assets/js/bundle.js?ver=3.2.0') }}"></script>
<script src="{{ asset('admin/assets/js/scripts.js?ver=3.2.0') }}"></script>
</body>
</html>
