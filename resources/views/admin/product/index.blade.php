@extends('admin.layout.app')
@section('content')

    <div class="nk-content ">
        <div class="container-fluid">
            <div class="nk-content-inner">
                <div class="nk-content-body">
                    <!-- Success/Error Messages -->
                    @if(session('success'))
                        <div class="alert alert-success alert-dismissible fade show" role="alert">
                            <em class="icon ni ni-check-circle"></em>
                            {{ session('success') }}
                            <button type="button" class="close" data-bs-dismiss="alert" aria-label="Close">
                                <em class="icon ni ni-cross"></em>
                            </button>
                        </div>
                    @endif

                    @if(session('error'))
                        <div class="alert alert-danger alert-dismissible fade show" role="alert">
                            <em class="icon ni ni-cross-circle"></em>
                            {{ session('error') }}
                            <button type="button" class="close" data-bs-dismiss="alert" aria-label="Close">
                                <em class="icon ni ni-cross"></em>
                            </button>
                        </div>
                    @endif

                    @if($errors->any())
                        <div class="alert alert-danger alert-dismissible fade show" role="alert">
                            <em class="icon ni ni-cross-circle"></em>
                            <ul class="mb-0">
                                @foreach($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                            <button type="button" class="close" data-bs-dismiss="alert" aria-label="Close">
                                <em class="icon ni ni-cross"></em>
                            </button>
                        </div>
                    @endif

                    <div class="nk-block-head nk-block-head-sm">
                        <div class="nk-block-between">
                            <div class="nk-block-head-content">
                                <h3 class="nk-block-title page-title">Products</h3>
                            </div><!-- .nk-block-head-content -->
                            <div class="nk-block-head-content">
                                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addProductModal">
                                    <em class="icon ni ni-plus"></em><span>Add Product</span>
                                </button>
                            </div><!-- .nk-block-head-content -->
                        </div><!-- .nk-block-between -->
                    </div><!-- .nk-block-head -->
                    <div class="nk-block">
                        <div class="table-responsive">
                            <div class="nk-tb-list is-separate mb-3">
                            <div class="nk-tb-item nk-tb-head">
{{--                                <div class="nk-tb-col nk-tb-col-check">--}}
{{--                                    <div class="custom-control custom-control-sm custom-checkbox notext">--}}
{{--                                        <input type="checkbox" class="custom-control-input" id="pid">--}}
{{--                                        <label class="custom-control-label" for="pid"></label>--}}
{{--                                    </div>--}}
{{--                                </div>--}}
                                <div class="nk-tb-col tb-col-sm"><span>Name</span></div>
                                <div class="nk-tb-col"><span>Image</span></div>
                                <div class="nk-tb-col"><span>Price</span></div>
                                <div class="nk-tb-col tb-col-md"><span>Category</span></div>
                                <div class="nk-tb-col"><span>Stock</span></div>
                                <div class="nk-tb-col"><span>Status</span></div>
                                <div class="nk-tb-col nk-tb-col-tools"><span>Actions</span></div>
                            </div><!-- .nk-tb-item -->

                            @forelse($products as $product)
                            <div class="nk-tb-item">
                                <div class="nk-tb-col tb-col-sm">
                                    <span class="tb-product">
                                        <span class="title">{{ $product->name }}</span>
                                    </span>
                                </div>
                                <div class="nk-tb-col">
                                    @php
                                        $firstImage = $product->images()->first();
                                    @endphp
                                    @if($firstImage)
                                        <img src="{{ $firstImage->url }}" alt="{{ $product->name }}" class="img-thumbnail" style="width: 60px; height: 60px; object-fit: cover;">
                                    @else
                                        <img src="{{ asset('assets/images/product/placeholder.svg') }}" alt="No Image" class="img-thumbnail" style="width: 60px; height: 60px; object-fit: cover;">
                                    @endif
                                </div>
                                <div class="nk-tb-col">
                                    <span class="tb-lead">$ {{ number_format($product->price, 2) }}</span>
                                </div>
                                <div class="nk-tb-col tb-col-md">
                                    <span class="tb-sub">{{ $product->category->name ?? 'Uncategorized' }}</span>
                                </div>
                                <div class="nk-tb-col">
                                    <span class="tb-sub {{ $product->stock <= 10 ? 'text-warning' : '' }}">{{ $product->stock }}</span>
                                </div>
                                <div class="nk-tb-col">
                                    <span class="badge bg-{{ $product->stock > 0 ? 'success' : 'danger' }}">
                                        {{ $product->stock > 0 ? 'In Stock' : 'Out of Stock' }}
                                    </span>
                                </div>
                                <div class="nk-tb-col nk-tb-col-tools">
                                    <ul class="nk-tb-actions gx-1 my-n1">
                                        <li>
                                            @php
                                                $productImages = $product->images()->get()->pluck('url', 'id');
                                            @endphp
                                            <button class="btn btn-sm btn-icon btn-primary edit-product-btn" data-id="{{ $product->id }}" data-name="{{ $product->name }}" data-price="{{ $product->price }}" data-category_id="{{ $product->category_id }}" data-stock="{{ $product->stock }}" data-status="{{ $product->is_active }}" data-images="{{ json_encode($productImages) }}" data-bs-toggle="modal" data-bs-target="#editProductModal"><em class="icon ni ni-edit"></em></button>
                                        </li>
                                        <li>
                                            <button class="btn btn-sm btn-icon btn-danger delete-product-btn" data-id="{{ $product->id }}" data-name="{{ $product->name }}" data-bs-toggle="modal" data-bs-target="#deleteProductModal"><em class="icon ni ni-trash"></em></button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            @empty
                            <div class="nk-tb-item">
                                <div class="nk-tb-col" colspan="8">
                                    <div class="text-center py-4">
                                        <em class="icon ni ni-package text-muted" style="font-size: 3rem;"></em>
                                        <p class="mt-2 text-muted">No products found. Add your first product!</p>
                                    </div>
                                </div>
                            </div>
                            @endforelse

                            </div><!-- .nk-tb-list -->
                        </div><!-- .table-responsive -->

                        @if($products->hasPages())
                        <div class="card">
                            <div class="card-inner">
                                <div class="nk-block-between-md g-3">
                                    <div class="g">
                                        {{ $products->links() }}
                                    </div>
                                </div><!-- .nk-block-between -->
                            </div>
                        </div>
                        @endif
                    </div><!-- .nk-block -->

                    <!-- Add Product Modal -->
                    <div class="modal fade" id="addProductModal" tabindex="-1" aria-labelledby="addProductModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <form action="{{ route('admin.products.store') }}" method="POST" enctype="multipart/form-data">
                                    @csrf
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="addProductModalLabel">Add Product</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <div class="mb-3">
                                            <label for="name" class="form-label">Product Name *</label>
                                            <input type="text" class="form-control" id="name" name="name" required>
                                        </div>
                                        <div class="mb-3">
                                            <label for="images" class="form-label">Product Images</label>
                                            <input type="file" class="form-control" id="images" name="images[]" accept="image/*" multiple>
                                            <div class="form-text">You can select multiple images. First image will be the featured image.</div>
                                            <div id="imagePreview" class="image-preview"></div>
                                        </div>
                                        <div class="mb-3">
                                            <label for="price" class="form-label">Price *</label>
                                            <input type="number" step="0.01" min="0" class="form-control" id="price" name="price" required>
                                        </div>
                                        <div class="mb-3">
                                            <label for="cost_price" class="form-label">Cost Price (Optional)</label>
                                            <input type="number" step="0.01" min="0" class="form-control" id="cost_price" name="cost_price">
                                        </div>
                                        <div class="mb-3">
                                            <label for="category_id" class="form-label">Category *</label>
                                            <select class="form-select" id="category_id" name="category_id" required>
                                                <option value="">Select Category</option>
                                                @foreach($categories ?? [] as $category)
                                                    <option value="{{ $category->id }}">{{ $category->name }}</option>
                                                @endforeach
                                            </select>
                                        </div>
                                        <div class="mb-3">
                                            <label for="stock" class="form-label">Stock *</label>
                                            <input type="number" min="0" class="form-control" id="stock" name="stock" required>
                                        </div>
                                        <div class="form-check form-switch mb-3">
                                            <input class="form-check-input" type="checkbox" id="is_active" name="is_active" value="1" checked>
                                            <label class="form-check-label" for="is_active">Active</label>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                        <button type="submit" class="btn btn-primary">Add Product</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <!-- Edit Product Modal -->
                    <div class="modal fade" id="editProductModal" tabindex="-1" aria-labelledby="editProductModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <form id="editProductForm" method="POST" enctype="multipart/form-data">
                                    @csrf
                                    @method('PUT')
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="editProductModalLabel">Edit Product</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <div class="mb-3">
                                            <label for="edit_name" class="form-label">Product Name *</label>
                                            <input type="text" class="form-control" id="edit_name" name="name" required>
                                        </div>
                                        <div class="mb-3">
                                            <label for="edit_images" class="form-label">Product Images</label>
                                            <input type="file" class="form-control" id="edit_images" name="images[]" accept="image/*" multiple>
                                            <div class="form-text">You can select multiple images. First image will be the featured image.</div>
                                            <div id="edit_current_images" class="mt-2">
                                                <!-- Current images will be displayed here -->
                                            </div>
                                            <div id="editImagePreview" class="image-preview"></div>
                                        </div>
                                        <div class="mb-3">
                                            <label for="edit_price" class="form-label">Price *</label>
                                            <input type="number" step="0.01" min="0" class="form-control" id="edit_price" name="price" required>
                                        </div>
                                        <div class="mb-3">
                                            <label for="edit_category_id" class="form-label">Category *</label>
                                            <select class="form-select" id="edit_category_id" name="category_id" required>
                                                <option value="">Select Category</option>
                                                @foreach($categories ?? [] as $category)
                                                    <option value="{{ $category->id }}">{{ $category->name }}</option>
                                                @endforeach
                                            </select>
                                        </div>
                                        <div class="mb-3">
                                            <label for="edit_stock" class="form-label">Stock *</label>
                                            <input type="number" min="0" class="form-control" id="edit_stock" name="stock" required>
                                        </div>
                                        <div class="form-check form-switch mb-3">
                                            <input class="form-check-input" type="checkbox" id="edit_is_active" name="is_active" value="1">
                                            <label class="form-check-label" for="edit_is_active">Active</label>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                        <button type="submit" class="btn btn-primary">Save Changes</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <!-- Delete Product Modal -->
                    <div class="modal fade" id="deleteProductModal" tabindex="-1" aria-labelledby="deleteProductModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <form id="deleteProductForm" method="POST">
                                    @csrf
                                    @method('DELETE')
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="deleteProductModalLabel">Delete Product</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <p>Are you sure you want to delete <strong id="deleteProductName"></strong>?</p>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                        <button type="submit" class="btn btn-danger">Delete</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <style>
                        @media (max-width: 768px) {
                            .nk-tb-list {
                                font-size: 0.875rem;
                            }
                            .nk-tb-col {
                                padding: 0.5rem 0.25rem;
                            }
                            .tb-product .title {
                                font-size: 0.875rem;
                                word-break: break-word;
                            }
                            .img-thumbnail {
                                width: 40px !important;
                                height: 40px !important;
                            }
                            .btn-sm {
                                padding: 0.25rem 0.5rem;
                                font-size: 0.75rem;
                            }
                        }
                        .image-preview {
                            display: flex;
                            flex-wrap: wrap;
                            gap: 10px;
                            margin-top: 10px;
                        }
                        .image-preview img {
                            width: 60px;
                            height: 60px;
                            object-fit: cover;
                            border: 1px solid #ddd;
                            border-radius: 4px;
                        }
                    </style>
                    <script>
                        // Edit Product Modal
                        document.querySelectorAll('.edit-product-btn').forEach(function(btn) {
                            btn.addEventListener('click', function() {
                                var id = this.getAttribute('data-id');
                                var name = this.getAttribute('data-name');
                                var price = this.getAttribute('data-price');
                                var category_id = this.getAttribute('data-category_id');
                                var stock = this.getAttribute('data-stock');
                                var status = this.getAttribute('data-status');
                                var images = JSON.parse(this.getAttribute('data-images') || '{}');
                                var form = document.getElementById('editProductForm');
                                form.action = '/admin/products/' + id;
                                document.getElementById('edit_name').value = name;
                                document.getElementById('edit_price').value = price;
                                document.getElementById('edit_category_id').value = category_id;
                                document.getElementById('edit_stock').value = stock;
                                document.getElementById('edit_is_active').checked = status == '1';
                                
                                // Display current images
                                var currentImagesContainer = document.getElementById('edit_current_images');
                                currentImagesContainer.innerHTML = '';
                                if (Object.keys(images).length > 0) {
                                    currentImagesContainer.innerHTML = '<p class="text-muted mb-2">Current images:</p>';
                                    Object.entries(images).forEach(function([imageId, imageUrl]) {
                                        var imgDiv = document.createElement('div');
                                        imgDiv.className = 'd-inline-block me-2 mb-2 position-relative';
                                        imgDiv.innerHTML = `
                                            <img src="${imageUrl}" alt="Product Image" class="img-thumbnail" style="width: 60px; height: 60px; object-fit: cover;">
                                            <button type="button" class="btn btn-sm btn-danger btn-delete-image position-absolute top-0 end-0" data-image-id="${imageId}" style="position:absolute;top:0;right:0;padding:0.1rem 0.4rem;font-size:0.8rem;line-height:1;z-index:2;">
                                                &times;
                                            </button>
                                        `;
                                        currentImagesContainer.appendChild(imgDiv);
                                    });
                                }
                            });
                        });
                        // Delete Product Modal
                        document.querySelectorAll('.delete-product-btn').forEach(function(btn) {
                            btn.addEventListener('click', function() {
                                var id = this.getAttribute('data-id');
                                var name = this.getAttribute('data-name');
                                var form = document.getElementById('deleteProductForm');
                                form.action = '/admin/products/' + id;
                                document.getElementById('deleteProductName').textContent = name;
                            });
                        });

                        // Image preview functionality
                        function handleImagePreview(input, previewId) {
                            const preview = document.getElementById(previewId);
                            preview.innerHTML = '';
                            
                            if (input.files) {
                                Array.from(input.files).forEach(file => {
                                    const reader = new FileReader();
                                    reader.onload = function(e) {
                                        const img = document.createElement('img');
                                        img.src = e.target.result;
                                        img.alt = 'Preview';
                                        preview.appendChild(img);
                                    };
                                    reader.readAsDataURL(file);
                                });
                            }
                        }

                        // Add Product Modal image preview
                        document.getElementById('images').addEventListener('change', function() {
                            handleImagePreview(this, 'imagePreview');
                        });

                        // Edit Product Modal image preview
                        document.getElementById('edit_images').addEventListener('change', function() {
                            handleImagePreview(this, 'editImagePreview');
                        });

                        // Clear previews when modals are closed
                        document.getElementById('addProductModal').addEventListener('hidden.bs.modal', function() {
                            document.getElementById('imagePreview').innerHTML = '';
                            document.getElementById('images').value = '';
                        });

                        document.getElementById('editProductModal').addEventListener('hidden.bs.modal', function() {
                            document.getElementById('editImagePreview').innerHTML = '';
                            document.getElementById('edit_images').value = '';
                        });

                        // Handle image delete in edit modal
                        document.addEventListener('click', function(e) {
                            if (e.target.classList.contains('btn-delete-image')) {
                                var imageId = e.target.getAttribute('data-image-id');
                                var productId = document.getElementById('editProductForm').action.split('/').pop();
                                if (confirm('Are you sure you want to delete this image?')) {
                                    console.log('Deleting image:', imageId, 'from product:', productId);
                                    
                                    fetch(`/admin/products/${productId}/images`, {
                                        method: 'DELETE',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                                        },
                                        body: JSON.stringify({ image_id: imageId })
                                    })
                                    .then(response => {
                                        console.log('Response status:', response.status);
                                        return response.json();
                                    })
                                    .then(data => {
                                        console.log('Response data:', data);
                                        if (data.success) {
                                            e.target.parentElement.remove();
                                            console.log('Image removed from UI');
                                            
                                            // Refresh the current images list
                                            var currentImagesContainer = document.getElementById('edit_current_images');
                                            var remainingImages = currentImagesContainer.querySelectorAll('.img-thumbnail');
                                            if (remainingImages.length === 0) {
                                                currentImagesContainer.innerHTML = '<p class="text-muted">No images uploaded yet.</p>';
                                            }
                                        } else {
                                            alert('Failed to delete image: ' + (data.message || 'Unknown error'));
                                        }
                                    })
                                    .catch(error => {
                                        console.error('Error:', error);
                                        alert('Failed to delete image. Check console for details.');
                                    });
                                }
                            }
                        });
                    </script>
                </div>
            </div>
        </div>
    </div>

@endsection
