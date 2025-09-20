@extends('admin.layout.app')
@section('content')

    <div class="nk-content ">
                <div class="container-fluid">
                    <div class="nk-content-inner">
                        <div class="nk-content-body">
                            <div class="nk-block-head nk-block-head-sm">
                                <div class="nk-block-between">
                                    <div class="nk-block-head-content"><h4 class="nk-block-title page-title">
                                            Dashboard</h4></div>
                                </div>
                            </div>
                            <div class="nk-block">
                                <div class="row g-gs">
                                    <div class="col-xxl-4 col-md-6">
                                        <div class="card is-dark h-100">
                                            <div class="nk-ecwg nk-ecwg1">
                                                <div class="card-inner">
                                                    <div class="card-title-group">
                                                        <div class="card-title"><h6 class="title">Total Sales</h6></div>
                                                        <div class="card-tools"><a href="#" class="link">View Report</a>
                                                        </div>
                                                    </div>
                                                    <div class="data">
                                                        <div class="amount">₦{{ number_format($totalSales, 2) }}</div>
                                                        <div class="info"><strong>₦{{ number_format($lastMonthSales, 2) }}</strong> in last month</div>
                                                    </div>
                                                    <div class="data"><h6 class="sub-title">This week so far</h6>
                                                        <div class="data-group">
                                                            <div class="amount">₦{{ number_format($thisWeekSales, 2) }}</div>
                                                            <div class="info text-end"><span
                                                                    class="change {{ $salesGrowth >= 0 ? 'up text-danger' : 'down text-success' }}"><em
                                                                        class="icon ni ni-arrow-long-{{ $salesGrowth >= 0 ? 'up' : 'down' }}"></em>{{ number_format(abs($salesGrowth), 1) }}%</span><br><span>vs. last week</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="nk-ck-wrap mt-auto overflow-hidden rounded-bottom">
                                                    <div class="nk-ecwg1-ck">
                                                        <canvas class="ecommerce-line-chart-s1"
                                                                id="totalSales"></canvas>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xxl-4 col-md-6">
                                        <div class="card h-100">
                                            <div class="nk-ecwg nk-ecwg2">
                                                <div class="card-inner">
                                                    <div class="card-title-group mt-n1">
                                                        <div class="card-title"><h6 class="title">Average order</h6>
                                                        </div>
                                                        <div class="card-tools me-n1">
                                                            <div class="dropdown"><a href="#"
                                                                                     class="dropdown-toggle btn btn-icon btn-trigger"
                                                                                     data-bs-toggle="dropdown"><em
                                                                        class="icon ni ni-more-h"></em></a>
                                                                <div
                                                                    class="dropdown-menu dropdown-menu-sm dropdown-menu-end">
                                                                    <ul class="link-list-opt no-bdr">
                                                                        <li><a href="#"
                                                                               class="active"><span>15 Days</span></a>
                                                                        </li>
                                                                        <li><a href="#"><span>30 Days</span></a></li>
                                                                        <li><a href="#"><span>3 Months</span></a></li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="data">
                                                        <div class="data-group">
                                                            <div class="amount">₦{{ number_format($averageOrderValue, 2) }}</div>
                                                            <div class="info text-end"><span
                                                                    class="change {{ $avgOrderGrowth >= 0 ? 'up text-danger' : 'down text-success' }}"><em
                                                                        class="icon ni ni-arrow-long-{{ $avgOrderGrowth >= 0 ? 'up' : 'down' }}"></em>{{ number_format(abs($avgOrderGrowth), 1) }}%</span><br><span>vs. last week</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <h6 class="sub-title">Orders over time</h6></div>
                                                <div class="nk-ecwg2-ck">
                                                    <canvas class="ecommerce-bar-chart-s1" id="averargeOrder"></canvas>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xxl-4">
                                        <div class="row g-gs">
                                            <div class="col-xxl-12 col-md-6">
                                                <div class="card">
                                                    <div class="nk-ecwg nk-ecwg3">
                                                        <div class="card-inner pb-2">
                                                            <div class="card-title-group">
                                                                <div class="card-title"><h6 class="title">Orders</h6>
                                                                </div>
                                                            </div>
                                                            <div class="data">
                                                                <div class="data-group">
                                                                    <div class="amount">{{ $totalOrders }}</div>
                                                                    <div class="info text-end"><span
                                                                            class="change {{ $ordersGrowth >= 0 ? 'up text-danger' : 'down text-success' }}"><em
                                                                                class="icon ni ni-arrow-long-{{ $ordersGrowth >= 0 ? 'up' : 'down' }}"></em>{{ number_format(abs($ordersGrowth), 1) }}%</span><br><span>vs. last week</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="nk-ck-wrap mt-auto overflow-hidden rounded-bottom">
                                                            <div class="nk-ecwg3-ck">
                                                                <canvas class="ecommerce-line-chart-s1"
                                                                        id="totalOrders"></canvas>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xxl-12 col-md-6">
                                                <div class="card">
                                                    <div class="nk-ecwg nk-ecwg3">
                                                        <div class="card-inner pb-2">
                                                            <div class="card-title-group">
                                                                <div class="card-title"><h6 class="title">Customers</h6>
                                                                </div>
                                                            </div>
                                                            <div class="data">
                                                                <div class="data-group">
                                                                    <div class="amount">{{ $totalCustomers }}</div>
                                                                    <div class="info text-end"><span
                                                                            class="change {{ $customersGrowth >= 0 ? 'up text-danger' : 'down text-success' }}"><em
                                                                                class="icon ni ni-arrow-long-{{ $customersGrowth >= 0 ? 'up' : 'down' }}"></em>{{ number_format(abs($customersGrowth), 1) }}%</span><br><span>vs. last week</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="nk-ck-wrap mt-auto overflow-hidden rounded-bottom">
                                                            <div class="nk-ecwg3-ck">
                                                                <canvas class="ecommerce-line-chart-s1"
                                                                        id="totalCustomers"></canvas>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xxl-8">
                                        <div class="card card-full">
                                            <div class="card-inner">
                                                <div class="card-title-group">
                                                    <div class="card-title"><h6 class="title">Recent Orders</h6></div>
                                                </div>
                                            </div>
                                            <div class="nk-tb-list mt-n2">
                                                <div class="nk-tb-item nk-tb-head">
                                                    <div class="nk-tb-col"><span>Order No.</span></div>
                                                    <div class="nk-tb-col tb-col-sm"><span>Customer</span></div>
                                                    <div class="nk-tb-col tb-col-md"><span>Date</span></div>
                                                    <div class="nk-tb-col"><span>Amount</span></div>
                                                    <div class="nk-tb-col"><span
                                                            class="d-none d-sm-inline">Status</span></div>
                                                </div>
                                                @forelse($recentOrders as $order)
                                                <div class="nk-tb-item">
                                                    <div class="nk-tb-col"><span class="tb-lead"><a href="{{ route('admin.orders.show', $order) }}">#{{ $order->order_number }}</a></span>
                                                    </div>
                                                    <div class="nk-tb-col tb-col-sm">
                                                        <div class="user-card">
                                                            <div class="user-avatar sm bg-purple-dim">
                                                                <span>{{ strtoupper(substr($order->shipping_name ?? 'GUEST', 0, 2)) }}</span>
                                                            </div>
                                                            <div class="user-name"><span class="tb-lead">{{ $order->shipping_name ?? 'Guest User' }}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="nk-tb-col tb-col-md"><span
                                                            class="tb-sub">{{ $order->created_at->format('M d, Y') }}</span></div>
                                                    <div class="nk-tb-col"><span
                                                            class="tb-sub tb-amount">{{ number_format($order->total, 2) }} <span>₦</span></span>
                                                    </div>
                                                    <div class="nk-tb-col">
                                                        @if($order->payment_status === 'paid')
                                                            <span class="badge badge-dot badge-dot-xs bg-success">Paid</span>
                                                        @elseif($order->payment_status === 'pending')
                                                            <span class="badge badge-dot badge-dot-xs bg-warning">Pending</span>
                                                        @elseif($order->payment_status === 'failed')
                                                            <span class="badge badge-dot badge-dot-xs bg-danger">Failed</span>
                                                        @else
                                                            <span class="badge badge-dot badge-dot-xs bg-secondary">{{ ucfirst($order->payment_status) }}</span>
                                                        @endif
                                                    </div>
                                                </div>
                                                @empty
                                                <div class="nk-tb-item">
                                                    <div class="nk-tb-col" colspan="5">
                                                        <span class="tb-sub">No orders found</span>
                                                    </div>
                                                </div>
                                                @endforelse
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xxl-4 col-md-6">
                                        <div class="card h-100">
                                            <div class="card-inner">
                                                <div class="card-title-group mb-2">
                                                    <div class="card-title"><h6 class="title">Top products</h6></div>
                                                    <div class="card-tools">
                                                        <div class="dropdown"><a href="#"
                                                                                 class="dropdown-toggle link link-light link-sm dropdown-indicator"
                                                                                 data-bs-toggle="dropdown">Weekly</a>
                                                            <div
                                                                class="dropdown-menu dropdown-menu-sm dropdown-menu-end">
                                                                <ul class="link-list-opt no-bdr">
                                                                    <li><a href="#"><span>Daily</span></a></li>
                                                                    <li><a href="#"
                                                                           class="active"><span>Weekly</span></a></li>
                                                                    <li><a href="#"><span>Monthly</span></a></li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <ul class="nk-top-products">
                                                    @forelse($topProducts as $topProduct)
                                                    <li class="item">
                                                        <div class="thumb">
                                                            @if($topProduct->product && $topProduct->product->images->first())
                                                                <img src="{{ $topProduct->product->images->first()->url }}" alt="{{ $topProduct->product->name }}">
                                                            @else
                                                                <img src="{{ asset('assets/images/product/placeholder.svg') }}" alt="No Image">
                                                            @endif
                                                        </div>
                                                        <div class="info">
                                                            <div class="title">{{ $topProduct->product->name ?? 'Product Not Found' }}</div>
                                                            <div class="price">₦{{ number_format($topProduct->product->price ?? 0, 2) }}</div>
                                                        </div>
                                                        <div class="total">
                                                            <div class="amount">₦{{ number_format($topProduct->total_revenue, 2) }}</div>
                                                            <div class="count">{{ $topProduct->total_sold }} Sold</div>
                                                        </div>
                                                    </li>
                                                    @empty
                                                    <li class="item">
                                                        <div class="info">
                                                            <div class="title">No products sold yet</div>
                                                        </div>
                                                    </li>
                                                    @endforelse
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-xxl-3 col-md-6">
                                        <div class="card h-100">
                                            <div class="card-inner">
                                                <div class="card-title-group mb-2">
                                                    <div class="card-title"><h6 class="title">Store Statistics</h6>
                                                    </div>
                                                </div>
                                                <ul class="nk-store-statistics">
                                                    <li class="item">
                                                        <div class="info">
                                                            <div class="title">Orders</div>
                                                            <div class="count">{{ number_format($totalOrders) }}</div>
                                                        </div>
                                                        <em class="icon bg-primary-dim ni ni-bag"></em></li>
                                                    <li class="item">
                                                        <div class="info">
                                                            <div class="title">Customers</div>
                                                            <div class="count">{{ number_format($totalCustomers) }}</div>
                                                        </div>
                                                        <em class="icon bg-info-dim ni ni-users"></em></li>
                                                    <li class="item">
                                                        <div class="info">
                                                            <div class="title">Products</div>
                                                            <div class="count">{{ number_format($totalProducts) }}</div>
                                                        </div>
                                                        <em class="icon bg-pink-dim ni ni-box"></em></li>
                                                    <li class="item">
                                                        <div class="info">
                                                            <div class="title">Categories</div>
                                                            <div class="count">{{ number_format($totalCategories) }}</div>
                                                        </div>
                                                        <em class="icon bg-purple-dim ni ni-server"></em></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

@endsection
