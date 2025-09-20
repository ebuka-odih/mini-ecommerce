import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface PageHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, children }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
                    {description && (
                        <p className="text-gray-400">{description}</p>
                    )}
                </div>
                {children && (
                    <div className="flex items-center gap-2">
                        {children}
                    </div>
                )}
            </div>
            <Separator className="bg-gray-700" />
        </div>
    );
};

export default PageHeader;
