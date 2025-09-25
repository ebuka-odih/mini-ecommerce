// import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
    settings?: {
        site_name?: string;
        site_logo?: string;
    };
}

export default function AuthSimpleLayout({ children, title, description, settings }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-gray-900 p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link href="/" className="flex flex-col items-center gap-2 font-medium">
                            <div className="mb-1 flex h-12 w-auto items-center justify-center">
                                <img 
                                    src={settings?.site_logo || '/brand/GNOSIS3.png'} 
                                    alt={settings?.site_name || 'GNOSIS'} 
                                    className="h-10 w-auto object-contain"
                                    onError={(e) => {
                                        e.currentTarget.src = '/brand/GNOSIS3.png';
                                        e.currentTarget.alt = 'GNOSIS';
                                    }}
                                />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium text-white">{title}</h1>
                            <p className="text-center text-sm text-gray-400">{description}</p>
                        </div>
                    </div>
                    
                    {/* Card container for the form */}
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
