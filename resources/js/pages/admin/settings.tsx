import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Upload, Settings, Palette, Globe, Save } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import AdminLayout from '@/layouts/admin-layout';

interface SettingsData {
  site_name: string;
  site_logo: string;
  currency: string;
  theme: 'light' | 'dark';
  frontpage: 'homepage' | 'homepage-second';
}

interface SettingsPageProps {
  settings: SettingsData;
  flash?: {
    success?: string;
    error?: string;
  };
  site_settings?: {
    site_name: string;
    site_logo: string;
  };
}

export default function SettingsPage({ settings, flash, site_settings }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState('general');
  const [showSuccess, setShowSuccess] = useState(!!flash?.success);
  const [showError, setShowError] = useState(!!flash?.error);
  const [logoKey, setLogoKey] = useState(0);
  const { addToast } = useToast();

  const { data, setData, put, processing, errors } = useForm({
    site_name: settings.site_name || '',
    site_logo: settings.site_logo || '',
    currency: settings.currency || 'NGN',
    theme: settings.theme || 'dark',
    frontpage: settings.frontpage || 'homepage',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('admin.settings.update'), {
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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        addToast({
          title: "Upload failed",
          description: "File size must be less than 2MB.",
          type: "error",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        addToast({
          title: "Upload failed",
          description: "Please select an image file.",
          type: "error",
        });
        return;
      }

      const formData = new FormData();
      formData.append('logo', file);

      try {
        addToast({
          title: "Uploading...",
          description: "Please wait while we upload your logo.",
          type: "info",
        });

        const response = await fetch('/admin/settings/upload-logo', {
          method: 'POST',
          body: formData,
          headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
          },
        });

        const result = await response.json();

        if (result.success) {
          setData('site_logo', result.url);
          setLogoKey(prev => prev + 1); // Force image re-render
          addToast({
            title: "Logo uploaded",
            description: "Logo has been uploaded successfully.",
            type: "success",
          });
        } else {
          addToast({
            title: "Upload failed",
            description: result.message || "Failed to upload logo. Please try again.",
            type: "error",
          });
        }
      } catch (error) {
        console.error('Logo upload error:', error);
        addToast({
          title: "Upload failed",
          description: "Failed to upload logo. Please try again.",
          type: "error",
        });
      }
    }
  };

  return (
    <AdminLayout title="Settings" site_settings={site_settings}>
      <Head title="Settings" />
      
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
            <p className="text-gray-400">
              Configure your website settings and preferences
            </p>
          </div>
        </div>

        {/* Flash Messages */}
        {showSuccess && (
          <Alert className="border-green-500 bg-green-900/20">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-300">
              Settings updated successfully!
            </AlertDescription>
          </Alert>
        )}

        {showError && (
          <Alert className="border-red-500 bg-red-900/20">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">
              {flash?.error}
            </AlertDescription>
          </Alert>
        )}

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="border-b border-gray-700">
            <TabsList className="grid w-full grid-cols-3 bg-transparent p-0 h-auto">
              <TabsTrigger 
                value="general" 
                className="flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 data-[state=active]:bg-gray-700 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-none border-b-2 border-transparent"
              >
                <Settings className="h-4 w-4" />
                General
              </TabsTrigger>
              <TabsTrigger 
                value="appearance" 
                className="flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 data-[state=active]:bg-gray-700 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-none border-b-2 border-transparent"
              >
                <Palette className="h-4 w-4" />
                Appearance
              </TabsTrigger>
              <TabsTrigger 
                value="advanced" 
                className="flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 data-[state=active]:bg-gray-700 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-none border-b-2 border-transparent"
              >
                <Settings className="h-4 w-4" />
                Advanced
              </TabsTrigger>
            </TabsList>
          </div>

          {/* General Settings */}
          <TabsContent value="general">
            <Card className="bg-gray-800 border-gray-700 w-full">
              <CardHeader>
                <CardTitle className="text-white">General Settings</CardTitle>
                <CardDescription className="text-gray-400">
                  Configure basic website information and branding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Site Name */}
                  <div className="space-y-2">
                    <Label htmlFor="site_name" className="text-white">Site Name</Label>
                    <Input
                      id="site_name"
                      value={data.site_name}
                      onChange={(e) => setData('site_name', e.target.value)}
                      placeholder="Enter your site name"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                    {errors.site_name && (
                      <p className="text-sm text-red-400">{errors.site_name}</p>
                    )}
                  </div>

                  {/* Site Logo */}
                  <div className="space-y-4">
                    <Label htmlFor="site_logo" className="text-white">Site Logo</Label>
                    
                    {/* Current Logo Preview */}
                    {data.site_logo && (
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 border border-gray-600 rounded-lg overflow-hidden bg-gray-700">
                          <img
                            key={logoKey}
                            src={data.site_logo}
                            alt="Current logo"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/img/paperview.png';
                            }}
                          />
                        </div>
                        <div className="text-sm text-gray-400">
                          Current logo preview
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-4">
                      <Input
                        id="site_logo"
                        value={data.site_logo}
                        onChange={(e) => setData('site_logo', e.target.value)}
                        placeholder="Logo URL or path"
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        onClick={() => document.getElementById('logo-upload')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </div>
                    {errors.site_logo && (
                      <p className="text-sm text-red-400">{errors.site_logo}</p>
                    )}
                  </div>

                  {/* Currency */}
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-white">Currency</Label>
                    <Select value={data.currency} onValueChange={(value) => setData('currency', value)}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="NGN" className="text-white hover:bg-gray-700">NGN - Nigerian Naira</SelectItem>
                        <SelectItem value="USD" className="text-white hover:bg-gray-700">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR" className="text-white hover:bg-gray-700">EUR - Euro</SelectItem>
                        <SelectItem value="GBP" className="text-white hover:bg-gray-700">GBP - British Pound</SelectItem>
                        <SelectItem value="CAD" className="text-white hover:bg-gray-700">CAD - Canadian Dollar</SelectItem>
                        <SelectItem value="AUD" className="text-white hover:bg-gray-700">AUD - Australian Dollar</SelectItem>
                        <SelectItem value="ZAR" className="text-white hover:bg-gray-700">ZAR - South African Rand</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.currency && (
                      <p className="text-sm text-red-400">{errors.currency}</p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Save className="mr-2 h-4 w-4" />
                      {processing ? 'Saving...' : 'Save Settings'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance">
            <Card className="bg-gray-800 border-gray-700 w-full">
              <CardHeader>
                <CardTitle className="text-white">Appearance Settings</CardTitle>
                <CardDescription className="text-gray-400">
                  Configure the visual theme, appearance, and frontend template of your website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Theme Selection */}
                  <div className="space-y-4">
                    <Label className="text-white">Theme</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div 
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          data.theme === 'light' 
                            ? 'border-blue-500 bg-blue-900/20' 
                            : 'border-gray-600 bg-gray-700'
                        }`}
                        onClick={() => setData('theme', 'light')}
                      >
                        <div className="text-center">
                          <div className="w-16 h-16 bg-white rounded-lg mx-auto mb-2"></div>
                          <p className="text-white font-medium">Light Theme</p>
                          <p className="text-gray-400 text-sm">Clean and bright appearance</p>
                        </div>
                      </div>
                      <div 
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          data.theme === 'dark' 
                            ? 'border-blue-500 bg-blue-900/20' 
                            : 'border-gray-600 bg-gray-700'
                        }`}
                        onClick={() => setData('theme', 'dark')}
                      >
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gray-800 rounded-lg mx-auto mb-2"></div>
                          <p className="text-white font-medium">Dark Theme</p>
                          <p className="text-gray-400 text-sm">Modern and sleek appearance</p>
                        </div>
                      </div>
                    </div>
                    {errors.theme && (
                      <p className="text-sm text-red-400">{errors.theme}</p>
                    )}
                  </div>

                  {/* Frontend Template Selection */}
                  <div className="space-y-4">
                    <Label className="text-white">Homepage Template</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div 
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          data.frontpage === 'homepage' 
                            ? 'border-blue-500 bg-blue-900/20' 
                            : 'border-gray-600 bg-gray-700'
                        }`}
                        onClick={() => setData('frontpage', 'homepage')}
                      >
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mx-auto mb-2"></div>
                          <p className="text-white font-medium">Homepage</p>
                          <p className="text-gray-400 text-sm">Standard e-commerce layout</p>
                        </div>
                      </div>
                      <div 
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          data.frontpage === 'homepage-second' 
                            ? 'border-blue-500 bg-blue-900/20' 
                            : 'border-gray-600 bg-gray-700'
                        }`}
                        onClick={() => setData('frontpage', 'homepage-second')}
                      >
                        <div className="text-center">
                          <div className="w-16 h-16 bg-black rounded-lg mx-auto mb-2"></div>
                          <p className="text-white font-medium">Homepage Second</p>
                          <p className="text-gray-400 text-sm">Minimalist dark design</p>
                        </div>
                      </div>
                    </div>
                    {errors.frontpage && (
                      <p className="text-sm text-red-400">{errors.frontpage}</p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Save className="mr-2 h-4 w-4" />
                      {processing ? 'Saving...' : 'Save Settings'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>


          {/* Advanced Settings */}
          <TabsContent value="advanced">
            <Card className="bg-gray-800 border-gray-700 w-full">
              <CardHeader>
                <CardTitle className="text-white">Advanced Settings</CardTitle>
                <CardDescription className="text-gray-400">
                  Advanced configuration options for your website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">Advanced settings coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}