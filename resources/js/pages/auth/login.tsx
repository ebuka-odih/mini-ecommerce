import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
// import Honeypot from '@/components/Honeypot';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
    website_url?: string;
    _form_start_time?: number;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    settings?: {
        site_name?: string;
        site_logo?: string;
    };
}

export default function Login({ status, canResetPassword, settings }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
        website_url: '',
        _form_start_time: Math.floor(Date.now() / 1000),
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="Log in to your account" description="Enter your email and password below to log in" settings={settings}>
            <Head title="Log in" />

            <form className="flex flex-col gap-6" onSubmit={submit}>
                {/* <Honeypot onFormStart={(startTime) => setData('_form_start_time', startTime)} /> */}
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-gray-300">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@example.com"
                            className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password" className="text-gray-300">Password</Label>
                            {canResetPassword && (
                                <TextLink href={route('password.request')} className="ml-auto text-sm text-blue-400 hover:text-blue-300" tabIndex={5}>
                                    Forgot password?
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Password"
                            className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onClick={() => setData('remember', !data.remember)}
                            tabIndex={3}
                            className="border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                        <Label htmlFor="remember" className="text-gray-300">Remember me</Label>
                    </div>

                    <Button type="submit" className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white" tabIndex={4} disabled={processing}>
                        <div className="flex items-center justify-center gap-2">
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin flex-shrink-0" />}
                            <span className="flex-shrink-0">{processing ? 'Signing in...' : 'Log in'}</span>
                        </div>
                    </Button>
                </div>

                <div className="text-center text-sm text-gray-400">
                    Don't have an account?{' '}
                    <TextLink href={route('register')} className="text-blue-400 hover:text-blue-300" tabIndex={5}>
                        Sign up
                    </TextLink>
                </div>
            </form>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
