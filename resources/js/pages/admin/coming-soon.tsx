import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Lock, Eye, EyeOff, Save } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';

interface ComingSoonSettings {
  enabled: boolean;
  message: string;
  password: string;
}

interface ComingSoonPageProps {
  settings: ComingSoonSettings;
  success?: string;
  error?: string;
  site_settings?: {
    site_name: string;
    site_logo: string;
  };
}

export default function ComingSoonPage({ settings, success, error, site_settings }: ComingSoonPageProps) {
  const { data, setData, put, processing, errors, reset } = useForm({
    enabled: settings.enabled,
    message: settings.message,
    password: settings.password,
  });

  // Debug initial state
  console.log('Initial settings:', settings);
  console.log('Form data enabled:', data.enabled);

  const [showSuccess, setShowSuccess] = useState(!!success);
  const [showError, setShowError] = useState(!!error);
  const [showPassword, setShowPassword] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    if (success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    }
  }, [error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('admin.coming-soon.update'), {
      onSuccess: () => {
        reset();
      },
    });
  };

  const handleToggle = async () => {
    setIsToggling(true);
    try {
      const response = await fetch(route('admin.coming-soon.toggle'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        setData('enabled', result.enabled);
        console.log('Toggle result:', result.enabled);
      }
    } catch (error) {
      console.error('Error toggling coming soon:', error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <AdminLayout title="Coming Soon Settings" site_settings={site_settings}>
      <Head title="Coming Soon Settings" />
      
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Coming Soon Settings</h1>
            <p className="text-gray-400">
              Configure the coming soon page and lock screen functionality
            </p>
          </div>
        </div>

        {/* Flash Messages */}
        {showSuccess && (
          <Alert className="mb-6 border-green-500 bg-green-900/20">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-300">
              Coming soon settings updated successfully!
            </AlertDescription>
          </Alert>
        )}

        {showError && (
          <Alert className="mb-6 border-red-500 bg-red-900/20">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          {/* Quick Toggle */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Lock className="h-5 w-5" />
                Quick Toggle
              </CardTitle>
              <CardDescription className="text-gray-400">
                Enable or disable the coming soon page instantly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Coming Soon Page</p>
                  <p className="text-sm text-gray-400">
                    {data.enabled 
                      ? 'Website is currently locked with coming soon page' 
                      : 'Website is currently accessible to all visitors'
                    }
                  </p>
                </div>
                  <Button
                    onClick={handleToggle}
                    disabled={isToggling}
                    variant={data.enabled ? "destructive" : "default"}
                    className={`min-w-[100px] font-semibold ${
                      data.enabled 
                        ? 'bg-red-600 hover:bg-red-700 text-white border-red-600' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                    }`}
                  >
                    {isToggling ? 'Toggling...' : data.enabled ? 'Disable' : 'Enable'}
                  </Button>
              </div>
            </CardContent>
          </Card>

          {/* Settings Form */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
            </CardHeader>
            <CardContent>
              <form id="coming-soon-form" onSubmit={handleSubmit} className="space-y-6">
                {/* Enable/Disable Toggle */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="enabled"
                      checked={data.enabled}
                      onChange={(e) => setData('enabled', e.target.checked)}
                      className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <label htmlFor="enabled" className="text-base font-medium text-white cursor-pointer">
                      Enable Coming Soon Page
                    </label>
                  </div>
                  <p className="text-sm text-gray-400 ml-7">
                    When enabled, visitors will see the coming soon page instead of your website
                  </p>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-white">Coming Soon Message</Label>
                  <Textarea
                    id="message"
                    value={data.message}
                    onChange={(e) => setData('message', e.target.value)}
                    placeholder="Enter your coming soon message..."
                    className="min-h-[100px] bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    required
                  />
                  {errors.message && (
                    <p className="text-sm text-red-400">{errors.message}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Access Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                      placeholder="Enter password for bypassing coming soon page"
                      className="pr-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-400">
                    Visitors can use this password to bypass the coming soon page
                  </p>
                  {errors.password && (
                    <p className="text-sm text-red-400">{errors.password}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={processing}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {processing ? 'Saving...' : 'Save Settings'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Preview Card */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Preview</CardTitle>
              <CardDescription className="text-gray-400">
                See how your coming soon page will look to visitors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-black text-white p-6 rounded-lg">
                <div className="text-center">
                  <h2 className="text-2xl font-light mb-4">
                    {data.message || 'Your coming soon message will appear here...'}
                  </h2>
                  <div className="text-sm text-gray-300">
                    Password entry form and email subscription will be shown below
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
