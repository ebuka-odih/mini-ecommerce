@extends('admin.layout.app')

@section('content')
<div class="nk-content ">
    <div class="container-fluid">
        <div class="nk-content-inner">
            <div class="nk-content-body">
                <div class="nk-block-head nk-block-head-sm">
                    <div class="nk-block-between">
                        <div class="nk-block-head-content">
                            <h3 class="nk-block-title page-title">Coming Soon Settings</h3>
                        </div>
                    </div>
                </div>

                @if(session('success'))
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <em class="icon ni ni-check-circle"></em>
                    {{ session('success') }}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
                @endif

                <div class="nk-block">
                    <div class="card">
                        <div class="card-inner">
                            <h5 class="card-title">Coming Soon Popup Control</h5>
                            <p>Manage the coming soon popup that appears on your website.</p>
                            <form action="{{ route('admin.coming-soon.update') }}" method="POST" class="gy-3 form-settings">
                                @csrf
                                @method('PUT')
                                
                                <div class="row g-3 align-center">
                                    <div class="col-lg-5">
                                        <div class="form-group">
                                            <label class="form-label">Enable Coming Soon</label>
                                            <span class="form-note">Turn on or off the coming soon popup.</span>
                                        </div>
                                    </div>
                                    <div class="col-lg-7">
                                        <div class="form-group">
                                            <div class="custom-control custom-switch">
                                                <input type="checkbox" class="custom-control-input" id="enabled" name="enabled" value="1" {{ $settings['enabled'] ? 'checked' : '' }}>
                                                <label class="custom-control-label" for="enabled">Enable</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="row g-3 align-center">
                                    <div class="col-lg-5">
                                        <div class="form-group">
                                            <label class="form-label" for="message">Popup Message</label>
                                            <span class="form-note">The message displayed in the coming soon popup.</span>
                                        </div>
                                    </div>
                                    <div class="col-lg-7">
                                        <div class="form-group">
                                            <div class="form-control-wrap">
                                                <textarea class="form-control" id="message" name="message" rows="4" placeholder="Enter your coming soon message">{{ $settings['message'] }}</textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="row g-3 align-center">
                                    <div class="col-lg-5">
                                        <div class="form-group">
                                            <label class="form-label" for="password">Bypass Password</label>
                                            <span class="form-note">Optional password to allow users to bypass the popup.</span>
                                        </div>
                                    </div>
                                    <div class="col-lg-7">
                                        <div class="form-group">
                                            <div class="form-control-wrap">
                                                <input type="text" class="form-control" id="password" name="password" value="{{ $settings['password'] }}" placeholder="Enter bypass password (optional)">
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="row g-3">
                                    <div class="col-lg-7 offset-lg-5">
                                        <div class="form-group mt-2">
                                            <button type="submit" class="btn btn-lg btn-primary">Update Settings</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection 