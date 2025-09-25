import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';

export default function AuthLayout({ children, title, description, settings, ...props }: { 
    children: React.ReactNode; 
    title: string; 
    description: string;
    settings?: {
        site_name?: string;
        site_logo?: string;
    };
}) {
    return (
        <AuthLayoutTemplate title={title} description={description} settings={settings} {...props}>
            {children}
        </AuthLayoutTemplate>
    );
}
