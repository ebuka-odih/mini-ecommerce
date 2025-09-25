import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    Package, 
    ShoppingCart, 
    Users, 
    Settings, 
    LogOut,
    Menu,
    Bell,
    Home,
    Tag,
    Image,
    Shield,
    Eye,
    Grid3X3,
    Layers,
    Lock,
    User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
    stats?: {
        total_orders: number;
        pending_orders?: number;
    };
}

interface NavItem {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    children?: NavItem[];
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title = 'Admin Dashboard', stats }) => {
    const { auth, flash } = usePage().props as any;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [showFlash, setShowFlash] = React.useState(true);

    // Auto-dismiss flash messages after 5 seconds
    React.useEffect(() => {
        if (flash?.success || flash?.error) {
            setShowFlash(true);
            const timer = setTimeout(() => {
                setShowFlash(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const navigationItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/admin',
            icon: Home,
        },
        {
            title: 'Products',
            href: '/admin/products',
            icon: Package,
            children: [
                { title: 'All Products', href: '/admin/products', icon: Package },
                { title: 'Categories', href: '/admin/categories', icon: Tag },
                { title: 'Variations', href: '/admin/variations', icon: Layers },
            ]
        },
        {
            title: 'Orders',
            href: '/admin/orders',
            icon: ShoppingCart,
            badge: stats?.total_orders?.toString() || '0',
        },
        {
            title: 'Customers',
            href: '/admin/customers',
            icon: Users,
        },
        {
            title: 'Media',
            href: '/admin/media',
            icon: Image,
        },
        {
            title: 'Settings',
            href: '/admin/settings',
            icon: Settings,
            children: [
                { title: 'General Settings', href: '/admin/settings', icon: Settings },
                { title: 'Profile', href: '/admin/profile', icon: User },
                { title: 'Slider Settings', href: '/admin/slider-settings', icon: Image },
                { title: 'Coming Soon', href: '/admin/coming-soon', icon: Lock },
                { title: 'Page Layout', href: '/admin/homepage-layout', icon: Grid3X3 },
            ]
        },
    ];

    const Sidebar = ({ className = '' }: { className?: string }) => (
        <div className={`pb-12 ${className}`}>
            <div className="space-y-4 py-4">
                {/* Logo - Only show on desktop sidebar */}
                <div className="px-3 py-2 md:block hidden">
                    <Link href="/admin" className="flex items-center pl-3">
                        <div className="flex items-center gap-3">
                            <img 
                                src="/brand/GNOSIS4.png" 
                                alt="GNOSIS" 
                                className="h-8 w-auto object-contain"
                            />
                            <Badge className="bg-blue-500 text-white text-xs">Admin</Badge>
                        </div>
                    </Link>
                </div>
                
                {/* Navigation */}
                <div className="px-3">
                    <div className="space-y-1">
                        {navigationItems.map((item, index) => (
                            <div key={item.title}>
                                {/* Add separator before Settings */}
                                {item.title === 'Settings' && (
                                    <>
                                        <Separator className="my-4 bg-gray-700" />
                                        <div className="px-3 py-2">
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Configuration</p>
                                        </div>
                                    </>
                                )}
                                <Link
                                    href={item.href}
                                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-gray-300 transition-all hover:text-white hover:bg-gray-700 font-medium"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span className="font-medium">{item.title}</span>
                                    {item.badge && (
                                        <Badge className="ml-auto bg-red-500 text-white text-xs">
                                            {item.badge}
                                        </Badge>
                                    )}
                                </Link>
                                {item.children && (
                                    <div className="ml-6 mt-1 space-y-1">
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.title}
                                                href={child.href}
                                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 transition-all hover:text-gray-200 hover:bg-gray-700"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                <span>{child.title}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Head title={title} />
            
            {/* Flash Messages */}
            {flash?.success && showFlash && (
                <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{flash.success}</span>
                    <button 
                        onClick={() => setShowFlash(false)}
                        className="ml-2 text-white hover:text-gray-200"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}
            
            {flash?.error && showFlash && (
                <div className="fixed top-4 right-4 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>{flash.error}</span>
                    <button 
                        onClick={() => setShowFlash(false)}
                        className="ml-2 text-white hover:text-gray-200"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}
            
            <div className="flex min-h-screen w-full bg-gray-900">
                {/* Desktop Sidebar - Dark Theme */}
                <div className="hidden md:block fixed left-0 top-0 h-full w-[220px] lg:w-[280px] border-r border-gray-700 bg-gray-800 z-40">
                    <div className="flex h-full flex-col gap-2 overflow-y-auto">
                        <Sidebar />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 md:ml-[220px] lg:ml-[280px]">
                    <div className="flex flex-col min-h-screen">
                    {/* Header - Same as Sidebar */}
                    <header className="flex h-14 items-center gap-4 border-b border-gray-700 bg-gray-800 px-4 lg:h-[60px] lg:px-6">
                        {/* Mobile Menu */}
                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon" className="shrink-0 md:hidden border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle navigation menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="flex flex-col w-80 bg-gray-800 border-r border-gray-700 shadow-lg">
                                <SheetHeader>
                                    <SheetTitle className="sr-only">Admin Navigation Menu</SheetTitle>
                                </SheetHeader>
                                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                                    <div className="flex items-center gap-3">
                                        <img 
                                            src="/brand/GNOSIS4.png" 
                                            alt="GNOSIS" 
                                            className="h-6 w-auto object-contain"
                                        />
                                    <Badge className="bg-blue-500 text-white text-xs">Admin</Badge>
                                    </div>
                                    {/* Close button is automatically added by SheetContent */}
                                </div>
                                <div className="flex-1 overflow-auto">
                                    <Sidebar className="border-none bg-transparent" />
                                </div>
                            </SheetContent>
                        </Sheet>

                        {/* Spacer */}
                        <div className="flex-1"></div>

                        {/* Header Actions */}
                        <div className="flex items-center gap-4">
                            {/* Notifications */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button 
                                        variant="outline" 
                                        size="icon" 
                                        className="relative border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700 hover:border-gray-500 transition-all duration-200 hover:shadow-lg hover:shadow-red-500/20 group overflow-visible"
                                    >
                                        <Bell className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold flex items-center justify-center border-2 border-gray-800 shadow-lg animate-pulse hover:animate-none transition-all duration-200 group-hover:scale-110 min-w-[20px] z-10">
                                            3
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-80 bg-gray-800 border-gray-700 shadow-xl" align="end">
                                    <div className="space-y-4 p-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-semibold text-white">Notifications</h4>
                                            <Button variant="ghost" size="sm" className="text-xs text-blue-400 hover:text-blue-300 hover:bg-gray-700">
                                                Mark all read
                                            </Button>
                                        </div>
                                        <Separator className="bg-gray-700" />
                                        <div className="space-y-3 max-h-64 overflow-y-auto">
                                            {/* Sample notifications */}
                                            <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                                                <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-white font-medium">New order received</p>
                                                    <p className="text-xs text-gray-400">Order #1234 from John Doe</p>
                                                    <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                                                <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0"></div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-white font-medium">Low stock alert</p>
                                                    <p className="text-xs text-gray-400">3 products need restocking</p>
                                                    <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                                                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-white font-medium">Payment received</p>
                                                    <p className="text-xs text-gray-400">₦25,000 from Sarah Wilson</p>
                                                    <p className="text-xs text-gray-500 mt-1">3 hours ago</p>
                                                </div>
                                            </div>
                                        </div>
                                        <Separator className="bg-gray-700" />
                                        <Button variant="ghost" className="w-full text-center text-blue-400 hover:text-blue-300 hover:bg-gray-700">
                                            View all notifications
                            </Button>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* User Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="secondary" size="icon" className="rounded-full bg-gray-700 hover:bg-gray-600">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="bg-gray-600 text-white">
                                                {auth?.user?.name?.charAt(0)?.toUpperCase() || 'A'}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64 bg-gray-800 border-gray-700 shadow-lg z-50">
                                    <DropdownMenuLabel className="p-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarFallback className="bg-gray-700 text-white font-medium">
                                                    {auth?.user?.name?.charAt(0)?.toUpperCase() || 'A'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none text-white">
                                                    {auth?.user?.name || 'Admin User'}
                                                </p>
                                                <p className="text-xs leading-none text-gray-400">
                                                    {auth?.user?.email || 'admin@gnosis.com'}
                                                </p>
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild className="cursor-pointer text-gray-300 hover:text-white hover:bg-gray-700">
                                        <Link href="/admin/profile" className="flex items-center gap-2 px-4 py-2">
                                            <Users className="h-4 w-4" />
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="cursor-pointer text-gray-300 hover:text-white hover:bg-gray-700">
                                        <Link href="/admin/settings" className="flex items-center gap-2 px-4 py-2">
                                            <Settings className="h-4 w-4" />
                                            Settings
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-gray-700" />
                                    <DropdownMenuItem asChild className="cursor-pointer text-blue-400 hover:text-blue-300 hover:bg-gray-700">
                                        <Link href="/" className="flex items-center gap-2 px-4 py-2">
                                            <Eye className="h-4 w-4" />
                                            View Website
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-gray-700" />
                                    <DropdownMenuItem asChild className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-gray-700">
                                        <Link 
                                            href="/logout" 
                                            method="post" 
                                            as="button"
                                            className="flex items-center gap-2 px-4 py-2 w-full"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Log out
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </header>

                    {/* Main Content Area - Dark Theme */}
                        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-gray-900">
                        {children}
                    </main>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminLayout;
