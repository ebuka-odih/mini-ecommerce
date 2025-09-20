import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardProps {
    title: string;
    value: string;
    change?: number;
    icon: React.ComponentType<{ className?: string }>;
    iconColor?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    iconColor = 'text-blue-600' 
}) => {
    return (
        <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">{title}</CardTitle>
                <Icon className={`h-4 w-4 ${iconColor}`} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-white">{value}</div>
                {change !== undefined && (
                    <div className="flex items-center text-xs text-gray-400">
                        {change >= 0 ? (
                            <TrendingUp className="mr-1 h-3 w-3 text-green-400" />
                        ) : (
                            <TrendingDown className="mr-1 h-3 w-3 text-red-400" />
                        )}
                        <span className={change >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                        </span>
                        <span className="ml-1">from last month</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default StatsCard;
