// Fashion Brand Specific Types

export interface ProductImage {
    id: string;
    url: string;
    thumbnail_url: string;
    alt_text: string;
    sort_order: number;
    is_featured: boolean;
    path: string;
}

export interface ProductVariant {
    id: string;
    size_id?: string;
    color_id?: string;
    price?: number;
    stock_quantity: number;
    sku?: string;
    is_active: boolean;
    size?: {
        id: string;
        name: string;
        display_name: string;
    };
    color?: {
        id: string;
        name: string;
        display_name: string;
        hex_code: string;
    };
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    parent_id?: string;
    is_active: boolean;
    products_count?: number;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    short_description?: string;
    price: number;
    sale_price?: number;
    sku: string;
    stock_quantity: number;
    is_active: boolean;
    is_featured: boolean;
    weight?: number;
    dimensions?: {
        length: number;
        width: number;
        height: number;
    };
    category: Category;
    images: ProductImage[];
    variations: ProductVariant[];
    tags: string[];
    created_at: string;
    updated_at: string;
}

export interface CartItem {
    id: string;
    product: Product;
    variant?: ProductVariant;
    quantity: number;
    price: number;
    total: number;
}

export interface ShoppingCart {
    items: CartItem[];
    total_items: number;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
}

export interface Address {
    id?: string;
    first_name: string;
    last_name: string;
    company?: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone?: string;
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone?: string;
    date_of_birth?: string;
    gender?: 'male' | 'female' | 'other';
    addresses: Address[];
    created_at: string;
}

export interface OrderItem {
    id: string;
    product: Product;
    variant?: ProductVariant;
    quantity: number;
    price: number;
    total: number;
}

export interface Order {
    id: string;
    order_number: string;
    customer?: Customer;
    guest_email?: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
    items: OrderItem[];
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    billing_address: Address;
    shipping_address: Address;
    payment_method: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}

// UI Component Types
export interface NavigationItem {
    name: string;
    href: string;
    hasDropdown?: boolean;
    children?: NavigationItem[];
}

export interface BreadcrumbItem {
    title: string;
    href?: string;
}

export interface FilterOption {
    id: string;
    name: string;
    value: string;
    count?: number;
}

export interface ProductFilter {
    type: 'category' | 'price' | 'size' | 'color' | 'brand';
    name: string;
    options: FilterOption[];
}

export interface SortOption {
    value: string;
    label: string;
}

// Page Props Types (for Inertia.js)
export interface HomePageProps {
    products: Product[];
    featured_categories: Category[];
    hero_banner?: {
        title: string;
        subtitle: string;
        image: string;
        link: string;
    };
}

export interface ShopPageProps {
    products: Product[];
    categories: Category[];
    filters: ProductFilter[];
    sort_options: SortOption[];
    current_filters: Record<string, string[]>;
    current_sort: string;
    pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export interface ProductPageProps {
    product: Product;
    related_products: Product[];
    reviews?: Review[];
}

export interface Review {
    id: string;
    customer_name: string;
    rating: number;
    comment: string;
    created_at: string;
    verified_purchase: boolean;
}

// Form Types
export interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export interface NewsletterFormData {
    email: string;
}

export interface CheckoutFormData {
    email: string;
    billing_address: Address;
    shipping_address: Address;
    same_as_billing: boolean;
    payment_method: 'card' | 'paystack' | 'bank_transfer';
    notes?: string;
}

// API Response Types
export interface ApiResponse<T> {
    data: T;
    message?: string;
    errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

// Settings Types
export interface SiteSettings {
    site_name: string;
    site_description: string;
    logo: string;
    favicon: string;
    contact_email: string;
    contact_phone: string;
    address: Address;
    social_media: {
        instagram?: string;
        facebook?: string;
        twitter?: string;
        youtube?: string;
    };
    coming_soon: {
        enabled: boolean;
        message: string;
        password?: string;
    };
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
    data: T | null;
    loading: LoadingState;
    error: string | null;
}
