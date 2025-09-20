@extends('admin.layout.app')

@section('title', 'Order Management')

@section('content')
<div class="container-fluid mt-5 pt-4">
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 mb-0 text-gray-800">Order Management</h1>
        <div class="d-flex gap-2">
            <a href="{{ route('admin.orders.analytics') }}" class="btn btn-info">
                <em class="icon ni ni-chart-bar"></em> Analytics
            </a>
            <a href="{{ route('admin.orders.export') }}?{{ http_build_query(request()->all()) }}" class="btn btn-success">
                <em class="icon ni ni-download"></em> Export CSV
            </a>
        </div>
    </div>

    <!-- Statistics Cards -->
    <div class="row mb-4">
        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card border-left-primary shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Total Orders</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">{{ number_format($stats['total_orders']) }}</div>
                        </div>
                        <div class="col-auto">
                            <em class="icon ni ni-bag-fill fa-2x text-gray-300"></em>
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
                            <div class="h5 mb-0 font-weight-bold text-gray-800">₦{{ number_format($stats['total_revenue'], 2) }}</div>
                        </div>
                        <div class="col-auto">
                            <em class="icon ni ni-coins fa-2x text-gray-300"></em>
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
                            <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">Pending Orders</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">{{ number_format($stats['pending_orders']) }}</div>
                        </div>
                        <div class="col-auto">
                            <em class="icon ni ni-clock fa-2x text-gray-300"></em>
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
                            <div class="text-xs font-weight-bold text-info text-uppercase mb-1">This Month</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800">{{ number_format($stats['this_month_orders']) }} orders</div>
                        </div>
                        <div class="col-auto">
                            <em class="icon ni ni-calendar fa-2x text-gray-300"></em>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Filters -->
    <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Filters</h6>
        </div>
        <div class="card-body">
            <form method="GET" action="{{ route('admin.orders.index') }}" class="row g-3">
                <div class="col-md-3">
                    <label class="form-label">Search</label>
                    <input type="text" name="search" class="form-control" value="{{ request('search') }}" 
                           placeholder="Order #, Customer, Email...">
                </div>
                <div class="col-md-2">
                    <label class="form-label">Status</label>
                    <select name="status" class="form-control">
                        <option value="all">All Statuses</option>
                        <option value="pending" {{ request('status') == 'pending' ? 'selected' : '' }}>Pending</option>
                        <option value="processing" {{ request('status') == 'processing' ? 'selected' : '' }}>Processing</option>
                        <option value="shipped" {{ request('status') == 'shipped' ? 'selected' : '' }}>Shipped</option>
                        <option value="delivered" {{ request('status') == 'delivered' ? 'selected' : '' }}>Delivered</option>
                        <option value="cancelled" {{ request('status') == 'cancelled' ? 'selected' : '' }}>Cancelled</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <label class="form-label">Payment Status</label>
                    <select name="payment_status" class="form-control">
                        <option value="all">All Payments</option>
                        <option value="pending" {{ request('payment_status') == 'pending' ? 'selected' : '' }}>Pending</option>
                        <option value="paid" {{ request('payment_status') == 'paid' ? 'selected' : '' }}>Paid</option>
                        <option value="failed" {{ request('payment_status') == 'failed' ? 'selected' : '' }}>Failed</option>
                        <option value="refunded" {{ request('payment_status') == 'refunded' ? 'selected' : '' }}>Refunded</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <label class="form-label">Date From</label>
                    <input type="date" name="date_from" class="form-control" value="{{ request('date_from') }}">
                </div>
                <div class="col-md-2">
                    <label class="form-label">Date To</label>
                    <input type="date" name="date_to" class="form-control" value="{{ request('date_to') }}">
                </div>
                <div class="col-md-1">
                    <label class="form-label">&nbsp;</label>
                    <button type="submit" class="btn btn-primary w-100">
                        <em class="icon ni ni-search"></em>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Orders Table -->
    <div class="card shadow mb-4">
        <div class="card-header py-3 d-flex justify-content-between align-items-center">
            <h6 class="m-0 font-weight-bold text-primary">Orders ({{ $orders->total() }})</h6>
            <div class="d-flex gap-2">
                <button type="button" class="btn btn-sm btn-outline-primary" onclick="selectAll()">
                    Select All
                </button>
                <button type="button" class="btn btn-sm btn-outline-secondary" onclick="deselectAll()">
                    Deselect All
                </button>
            </div>
        </div>
        <div class="card-body">
            <!-- Bulk Actions -->
            <div id="bulkActions" class="mb-3" style="display: none;">
                <div class="d-flex gap-2 align-items-center">
                    <span class="text-muted">Selected: <span id="selectedCount">0</span></span>
                    <select id="bulkAction" class="form-select form-select-sm" style="width: auto;">
                        <option value="">Choose Action</option>
                        <option value="update_status">Update Status</option>
                        <option value="update_payment_status">Update Payment Status</option>
                        <option value="delete">Delete</option>
                    </select>
                    <select id="bulkStatus" class="form-select form-select-sm" style="width: auto; display: none;">
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <select id="bulkPaymentStatus" class="form-select form-select-sm" style="width: auto; display: none;">
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                    </select>
                    <button type="button" class="btn btn-sm btn-primary" onclick="executeBulkAction()">
                        Apply
                    </button>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table table-bordered" id="ordersTable" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th width="30">
                                <input type="checkbox" id="selectAllCheckbox" onchange="toggleSelectAll()">
                            </th>
                            <th>Order #</th>
                            <th>Customer</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Payment</th>
                            <th>Date</th>
                            <th width="150">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($orders as $order)
                            <tr>
                                <td>
                                    <input type="checkbox" class="order-checkbox" value="{{ $order->id }}" onchange="updateBulkActions()">
                                </td>
                                <td>
                                    <strong>{{ $order->order_number }}</strong>
                                    <br>
                                    <small class="text-muted">{{ $order->items_count }} items</small>
                                </td>
                                <td>
                                    <div>{{ $order->customer_name }}</div>
                                    <small class="text-muted">{{ $order->customer_email }}</small>
                                </td>
                                <td>
                                    <strong>{{ $order->formatted_total }}</strong>
                                </td>
                                <td>
                                    <span class="badge {{ $order->status_badge }}">
                                        {{ ucfirst($order->status) }}
                                    </span>
                                </td>
                                <td>
                                    <span class="badge {{ $order->payment_status_badge }}">
                                        {{ ucfirst($order->payment_status) }}
                                    </span>
                                </td>
                                <td>
                                    <div>{{ $order->created_at->format('M d, Y') }}</div>
                                    <small class="text-muted">{{ $order->created_at->format('H:i') }}</small>
                                </td>
                                <td>
                                    <div class="btn-group" role="group">
                                        <a href="{{ route('admin.orders.show', $order) }}" 
                                           class="btn btn-sm btn-outline-primary" title="View">
                                            <em class="icon ni ni-eye"></em>
                                        </a>
                                        <a href="{{ route('admin.orders.edit', $order) }}" 
                                           class="btn btn-sm btn-outline-secondary" title="Edit">
                                            <em class="icon ni ni-edit"></em>
                                        </a>
                                        <button type="button" class="btn btn-sm btn-outline-success dropdown-toggle" 
                                                data-bs-toggle="dropdown" title="Quick Actions">
                                            <em class="icon ni ni-setting"></em>
                                        </button>
                                        <ul class="dropdown-menu">
                                            @if($order->canBeShipped())
                                                <li>
                                                    <form action="{{ route('admin.orders.update-status', $order) }}" method="POST" class="d-inline">
                                                        @csrf
                                                        <input type="hidden" name="status" value="shipped">
                                                        <button type="submit" class="dropdown-item">
                                                            <em class="icon ni ni-truck"></em> Mark as Shipped
                                                        </button>
                                                    </form>
                                                </li>
                                            @endif
                                            @if($order->canBeDelivered())
                                                <li>
                                                    <form action="{{ route('admin.orders.update-status', $order) }}" method="POST" class="d-inline">
                                                        @csrf
                                                        <input type="hidden" name="status" value="delivered">
                                                        <button type="submit" class="dropdown-item">
                                                            <em class="icon ni ni-check-circle"></em> Mark as Delivered
                                                        </button>
                                                    </form>
                                                </li>
                                            @endif
                                            @if($order->canBeCancelled())
                                                <li>
                                                    <form action="{{ route('admin.orders.update-status', $order) }}" method="POST" class="d-inline">
                                                        @csrf
                                                        <input type="hidden" name="status" value="cancelled">
                                                        <button type="submit" class="dropdown-item text-danger">
                                                            <em class="icon ni ni-cross-circle"></em> Cancel Order
                                                        </button>
                                                    </form>
                                                </li>
                                            @endif
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="8" class="text-center py-4">
                                    <div class="text-muted">
                                        <em class="icon ni ni-bag-fill fa-3x mb-3"></em>
                                        <p>No orders found</p>
                                    </div>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            @if($orders->hasPages())
                <div class="d-flex justify-content-center">
                    {{ $orders->appends(request()->query())->links() }}
                </div>
            @endif
        </div>
    </div>
</div>

<!-- Bulk Action Form -->
<form id="bulkActionForm" action="{{ route('admin.orders.bulk-update') }}" method="POST" style="display: none;">
    @csrf
    <input type="hidden" name="order_ids" id="bulkOrderIds">
    <input type="hidden" name="action" id="bulkActionType">
    <input type="hidden" name="status" id="bulkStatusValue">
    <input type="hidden" name="payment_status" id="bulkPaymentStatusValue">
</form>

<script>
function selectAll() {
    document.querySelectorAll('.order-checkbox').forEach(checkbox => {
        checkbox.checked = true;
    });
    document.getElementById('selectAllCheckbox').checked = true;
    updateBulkActions();
}

function deselectAll() {
    document.querySelectorAll('.order-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    document.getElementById('selectAllCheckbox').checked = false;
    updateBulkActions();
}

function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    const orderCheckboxes = document.querySelectorAll('.order-checkbox');
    
    orderCheckboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
    
    updateBulkActions();
}

function updateBulkActions() {
    const checkedBoxes = document.querySelectorAll('.order-checkbox:checked');
    const bulkActions = document.getElementById('bulkActions');
    const selectedCount = document.getElementById('selectedCount');
    
    if (checkedBoxes.length > 0) {
        bulkActions.style.display = 'block';
        selectedCount.textContent = checkedBoxes.length;
    } else {
        bulkActions.style.display = 'none';
    }
}

document.getElementById('bulkAction').addEventListener('change', function() {
    const bulkStatus = document.getElementById('bulkStatus');
    const bulkPaymentStatus = document.getElementById('bulkPaymentStatus');
    
    bulkStatus.style.display = 'none';
    bulkPaymentStatus.style.display = 'none';
    
    if (this.value === 'update_status') {
        bulkStatus.style.display = 'inline-block';
    } else if (this.value === 'update_payment_status') {
        bulkPaymentStatus.style.display = 'inline-block';
    }
});

function executeBulkAction() {
    const action = document.getElementById('bulkAction').value;
    const checkedBoxes = document.querySelectorAll('.order-checkbox:checked');
    
    if (!action) {
        alert('Please select an action');
        return;
    }
    
    if (checkedBoxes.length === 0) {
        alert('Please select at least one order');
        return;
    }
    
    const orderIds = Array.from(checkedBoxes).map(cb => cb.value);
    
    document.getElementById('bulkOrderIds').value = JSON.stringify(orderIds);
    document.getElementById('bulkActionType').value = action;
    document.getElementById('bulkStatusValue').value = document.getElementById('bulkStatus').value;
    document.getElementById('bulkPaymentStatusValue').value = document.getElementById('bulkPaymentStatus').value;
    
    if (confirm(`Are you sure you want to ${action.replace('_', ' ')} ${checkedBoxes.length} order(s)?`)) {
        document.getElementById('bulkActionForm').submit();
    }
}
</script>
@endsection
