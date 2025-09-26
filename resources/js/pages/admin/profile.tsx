import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { User, Lock, Save, Eye, EyeOff } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import PageHeader from '@/components/admin/page-header';

interface AdminProfileProps {
  user: {
    id: number;
    name: string;
    email: string;
  };
  flash?: {
    success?: string;
    error?: string;
  };
  site_settings?: {
    site_name: string;
    site_logo: string;
  };
}

export default function AdminProfile({ user, flash, site_settings }: AdminProfileProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(!!flash?.success);
  const [showError, setShowError] = useState(!!flash?.error);

  // Profile form
  const { data: profileData, setData: setProfileData, put: updateProfile, processing: profileProcessing, errors: profileErrors } = useForm({
    name: user.name,
    email: user.email,
  });

  // Password form
  const { data: passwordData, setData: setPasswordData, put: updatePassword, processing: passwordProcessing, errors: passwordErrors, reset: resetPasswordForm } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(route('admin.profile.update'), {
      onSuccess: () => {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
      },
      onError: () => {
        setShowError(true);
        setTimeout(() => setShowError(false), 5000);
      },
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePassword(route('admin.profile.password'), {
      onSuccess: () => {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
        resetPasswordForm();
      },
      onError: () => {
        setShowError(true);
        setTimeout(() => setShowError(false), 5000);
      },
    });
  };

  return (
    <AdminLayout title="Profile Settings" site_settings={site_settings}>
      <Head title="Profile Settings" />
      
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <PageHeader
          title="Profile Settings"
          description="Manage your admin profile information and security settings"
        />

        {/* Success/Error Messages */}
        {showSuccess && (
          <Alert className="bg-green-900/20 border-green-500/50 text-green-400">
            <AlertDescription>
              {flash?.success || 'Settings updated successfully!'}
            </AlertDescription>
          </Alert>
        )}

        {showError && (
          <Alert className="bg-red-900/20 border-red-500/50 text-red-400">
            <AlertDescription>
              {flash?.error || 'An error occurred. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Profile Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="border-b border-gray-700">
            <TabsList className="grid w-full grid-cols-2 bg-transparent p-0 h-auto">
              <TabsTrigger 
                value="profile" 
                className="flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 data-[state=active]:bg-gray-700 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-none border-b-2 border-transparent"
              >
                <User className="h-4 w-4" />
                Profile Information
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 data-[state=active]:bg-gray-700 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-none border-b-2 border-transparent"
              >
                <Lock className="h-4 w-4" />
                Security
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Profile Information Tab */}
          <TabsContent value="profile">
            <Card className="bg-gray-800 border-gray-700 w-full">
              <CardHeader>
                <CardTitle className="text-white">Profile Information</CardTitle>
                <CardDescription className="text-gray-400">
                  Update your personal information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData('name', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      placeholder="Enter your full name"
                    />
                    {profileErrors.name && (
                      <p className="text-sm text-red-400">{profileErrors.name}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData('email', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      placeholder="Enter your email address"
                    />
                    {profileErrors.email && (
                      <p className="text-sm text-red-400">{profileErrors.email}</p>
                    )}
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={profileProcessing} 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {profileProcessing ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card className="bg-gray-800 border-gray-700 w-full">
              <CardHeader>
                <CardTitle className="text-white">Change Password</CardTitle>
                <CardDescription className="text-gray-400">
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <Label htmlFor="current_password" className="text-white">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="current_password"
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordData.current_password}
                        onChange={(e) => setPasswordData('current_password', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 pr-10"
                        placeholder="Enter your current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    {passwordErrors.current_password && (
                      <p className="text-sm text-red-400">{passwordErrors.current_password}</p>
                    )}
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">New Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.password}
                        onChange={(e) => setPasswordData('password', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 pr-10"
                        placeholder="Enter your new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    {passwordErrors.password && (
                      <p className="text-sm text-red-400">{passwordErrors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password_confirmation" className="text-white">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="password_confirmation"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordData.password_confirmation}
                        onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 pr-10"
                        placeholder="Confirm your new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    {passwordErrors.password_confirmation && (
                      <p className="text-sm text-red-400">{passwordErrors.password_confirmation}</p>
                    )}
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={passwordProcessing} 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      {passwordProcessing ? 'Updating...' : 'Update Password'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

