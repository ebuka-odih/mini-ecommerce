<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Login - GNOSIS Brand</title>
    <link rel="stylesheet" href="{{ asset('build/assets/app.css') }}">
</head>
<body>
    <div id="app">
        <!-- Login form will be rendered here by JavaScript -->
    </div>
    
    <script src="{{ asset('build/assets/app.js') }}"></script>
</body>
</html>
