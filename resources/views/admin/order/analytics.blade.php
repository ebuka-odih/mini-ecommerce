@extends('admin.layout.app')

@section('title', 'Order Analytics')

@section('content')
<div class="container-fluid">
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 mb-0 text-gray-800">Order Analytics</h1>
        <a href="{{ route('admin.orders.index') }}" class="btn btn-secondary">
            <i class="fas fa-arrow-left"></i> Back to Orders
        </a>
    </div>

    <!-- Summary Cards -->
    <div class="row mb-4">
        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-primary shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Total Orders</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">{{ number_format($dailyOrders->sum('count')) }}</div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-shopping-cart fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-success shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-success text-uppercase mb-1">Total Revenue</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">₦{{ number_format($dailyOrders->sum('revenue'), 2) }}</div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-dollar-sign fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-info shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-info text-uppercase mb-1">Average Order Value</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">
                                ₦{{ $dailyOrders->sum('count') > 0 ? number_format($dailyOrders->sum('revenue') / $dailyOrders->sum('count'), 2) : '0.00' }}
                            </div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-chart-line fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-warning shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">Top Product</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">
                                {{ $topProducts->first() ? Str::limit($topProducts->first()->name, 20) : 'N/A' }}
                            </div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-star fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Charts Row -->
    <div class="row">
        <!-- Daily Orders Chart -->
        <div class="col-xl-8 col-lg-7">
            <div class="card shadow mb-4">
                <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 class="m-0 font-weight-bold text-primary">Daily Orders (Last 30 Days)</h6>
                </div>
                <div class="card-body">
                    <div class="chart-area">
                        <canvas id="dailyOrdersChart"></canvas>
                    </div>
                </div>
            </div>
        </div>

        <!-- Order Status Distribution -->
        <div class="col-xl-4 col-lg-5">
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Order Status Distribution</h6>
                </div>
                <div class="card-body">
                    <div class="chart-pie pt-4 pb-2">
                        <canvas id="statusDistributionChart"></canvas>
                    </div>
                    <div class="mt-4 text-center small">
                        @foreach($statusDistribution as $status)
                            <span class="mr-2">
                                <i class="fas fa-circle text-{{ $status->status === 'pending' ? 'warning' : ($status->status === 'processing' ? 'info' : ($status->status === 'shipped' ? 'primary' : ($status->status === 'delivered' ? 'success' : 'danger'))) }}"></i>
                                {{ ucfirst($status->status) }} ({{ $status->count }})
                            </span>
                        @endforeach
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Monthly Revenue Chart -->
    <div class="row">
        <div class="col-xl-8 col-lg-7">
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Monthly Revenue (Last 12 Months)</h6>
                </div>
                <div class="card-body">
                    <div class="chart-area">
                        <canvas id="monthlyRevenueChart"></canvas>
                    </div>
                </div>
            </div>
        </div>

        <!-- Payment Status Distribution -->
        <div class="col-xl-4 col-lg-5">
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Payment Status Distribution</h6>
                </div>
                <div class="card-body">
                    <div class="chart-pie pt-4 pb-2">
                        <canvas id="paymentStatusChart"></canvas>
                    </div>
                    <div class="mt-4 text-center small">
                        @foreach($paymentStatusDistribution as $payment)
                            <span class="mr-2">
                                <i class="fas fa-circle text-{{ $payment->payment_status === 'paid' ? 'success' : ($payment->payment_status === 'pending' ? 'warning' : 'danger') }}"></i>
                                {{ ucfirst($payment->payment_status) }} ({{ $payment->count }})
                            </span>
                        @endforeach
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Top Products Table -->
    <div class="row">
        <div class="col-12">
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Top Products by Sales</h6>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-bordered" width="100%" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Product Name</th>
                                    <th>Total Quantity Sold</th>
                                    <th>Total Revenue</th>
                                    <th>Average Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($topProducts as $index => $product)
                                    <tr>
                                        <td>
                                            <span class="badge badge-{{ $index < 3 ? 'primary' : 'secondary' }}">
                                                #{{ $index + 1 }}
                                            </span>
                                        </td>
                                        <td>{{ $product->name }}</td>
                                        <td>{{ number_format($product->total_quantity) }}</td>
                                        <td>₦{{ number_format($product->total_revenue, 2) }}</td>
                                        <td>₦{{ number_format($product->total_revenue / $product->total_quantity, 2) }}</td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="5" class="text-center">No products found</td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Chart.js -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<script>
// Daily Orders Chart
const dailyOrdersCtx = document.getElementById('dailyOrdersChart').getContext('2d');
new Chart(dailyOrdersCtx, {
    type: 'line',
    data: {
        labels: {!! json_encode($dailyOrders->pluck('date')) !!},
        datasets: [{
            label: 'Orders',
            data: {!! json_encode($dailyOrders->pluck('count')) !!},
            borderColor: 'rgb(78, 115, 223)',
            backgroundColor: 'rgba(78, 115, 223, 0.1)',
            tension: 0.1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Status Distribution Chart
const statusCtx = document.getElementById('statusDistributionChart').getContext('2d');
new Chart(statusCtx, {
    type: 'doughnut',
    data: {
        labels: {!! json_encode($statusDistribution->pluck('status')) !!},
        datasets: [{
            data: {!! json_encode($statusDistribution->pluck('count')) !!},
            backgroundColor: [
                '#f6c23e', // warning (pending)
                '#36b9cc', // info (processing)
                '#4e73df', // primary (shipped)
                '#1cc88a', // success (delivered)
                '#e74a3b'  // danger (cancelled)
            ]
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});

// Monthly Revenue Chart
const monthlyRevenueCtx = document.getElementById('monthlyRevenueChart').getContext('2d');
new Chart(monthlyRevenueCtx, {
    type: 'bar',
    data: {
        labels: {!! json_encode($monthlyOrders->map(function($order) {
            return date('M Y', mktime(0, 0, 0, $order->month, 1, $order->year));
        })) !!},
        datasets: [{
            label: 'Revenue (₦)',
            data: {!! json_encode($monthlyOrders->pluck('revenue')) !!},
            backgroundColor: 'rgba(28, 200, 138, 0.8)',
            borderColor: 'rgb(28, 200, 138)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Payment Status Chart
const paymentCtx = document.getElementById('paymentStatusChart').getContext('2d');
new Chart(paymentCtx, {
    type: 'doughnut',
    data: {
        labels: {!! json_encode($paymentStatusDistribution->pluck('payment_status')) !!},
        datasets: [{
            data: {!! json_encode($paymentStatusDistribution->pluck('count')) !!},
            backgroundColor: [
                '#1cc88a', // success (paid)
                '#f6c23e', // warning (pending)
                '#e74a3b'  // danger (failed)
            ]
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});
</script>
@endsection 