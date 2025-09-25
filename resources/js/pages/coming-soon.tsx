import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

interface ComingSoonPageProps {
  settings: {
    enabled: boolean;
    message: string;
    password: string;
  };
  error?: string;
}

export default function ComingSoonPage({ settings, error }: ComingSoonPageProps) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const { data: passwordData, setData: setPasswordData, post: postPassword, processing: passwordProcessing } = useForm({
    password: '',
  });

  const { data: emailData, setData: setEmailData, post: postEmail, processing: emailProcessing } = useForm({
    email: '',
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    
    postPassword(route('coming-soon.verify'), {
      onSuccess: () => {
        // Redirect to homepage on successful password
        window.location.href = '/';
      },
      onError: (errors) => {
        setPasswordError('Invalid password. Please try again.');
      },
    });
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    postEmail(route('coming-soon.subscribe'), {
      onSuccess: () => {
        setEmailData('email', '');
        // Show success message
      },
      onError: (errors) => {
        // Handle email subscription errors
      },
    });
  };

  return (
    <>
      <Head title="Coming Soon" />
      
      <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-16">
        {/* Logo */}
        <div className="absolute top-8 left-8">
          <img 
            src="/img/paperview.png" 
            alt="PAPERVIEW Logo" 
            className="h-24 w-auto"
          />
        </div>

        {/* Main Content */}
        <div className="text-center max-w-2xl mx-auto mt-32">
          {/* Main Message */}
          <div className="mb-20">
            <h1 className="text-xl md:text-2xl font-light tracking-wide leading-relaxed">
              {settings.message}
            </h1>
          </div>

          {/* Password Entry Section */}
          <div className="mb-24">
            <div 
              className="flex items-center justify-center mb-6 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              <span className="text-base font-medium">ENTER USING PASSWORD</span>
              {showPasswordForm ? (
                <ChevronUp className="w-4 h-4 ml-2" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-2" />
              )}
            </div>
            
            {showPasswordForm && (
              <form onSubmit={handlePasswordSubmit} className="max-w-sm mx-auto">
                <div className="mb-4">
                  <Input
                    type="password"
                    value={passwordData.password}
                    onChange={(e) => setPasswordData('password', e.target.value)}
                    placeholder="Password"
                    className="bg-transparent border-white text-white placeholder-gray-400 text-center"
                    required
                  />
                </div>
                
                {passwordError && (
                  <Alert className="mb-4 border-red-500 bg-red-900/20">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-400">
                      {passwordError}
                    </AlertDescription>
                  </Alert>
                )}
                
                <Button
                  type="submit"
                  disabled={passwordProcessing}
                  className="w-full text-white font-medium py-3"
                  style={{ backgroundColor: 'oklch(0.35 0.05 114.71)' }}
                >
                  {passwordProcessing ? 'Verifying...' : 'ENTER'}
                </Button>
              </form>
            )}
          </div>

          {/* Email Subscription Section */}
          <div className="mb-16">
            <p className="text-base font-medium mb-6">
              BE THE FIRST TO RECEIVE THE PASSWORD WHEN 'PAPERVIEW' DROPS
            </p>
            
            <form onSubmit={handleEmailSubmit} className="max-w-sm mx-auto">
              <div className="mb-4">
                <Input
                  type="email"
                  value={emailData.email}
                  onChange={(e) => setEmailData('email', e.target.value)}
                  placeholder="EMAIL"
                  className="bg-transparent border-white text-white placeholder-gray-400 text-center"
                  required
                />
              </div>
              
              <Button
                type="submit"
                disabled={emailProcessing}
                className="w-full text-white font-medium py-3"
                style={{ backgroundColor: 'oklch(0.35 0.05 114.71)' }}
              >
                {emailProcessing ? 'Sending...' : 'SEND'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
