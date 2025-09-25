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
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
                <div className="space-y-1 flex-1">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{title}</h1>
                    {description && (
                        <p className="text-gray-400">{description}</p>
                    )}
                </div>
                {children && (
                    <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:gap-2 sm:flex-shrink-0">
                        {children}
                    </div>
                )}
            </div>
            <Separator className="bg-gray-700" />
        </div>
    );
};

export default PageHeader;
