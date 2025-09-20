@extends('admin.layout.app')
@section('content')

    <div class="nk-content ">
        <div class="container-fluid">
            <div class="nk-content-inner">
                <div class="nk-content-body">
                    <div class="nk-block-head nk-block-head-sm">
                        <div class="nk-block-between">
                            <div class="nk-block-head-content">
                                <h3 class="nk-block-title page-title">Categories</h3>
                            </div><!-- .nk-block-head-content -->
                            <div class="nk-block-head-content">
                              <a href="#" data-bs-toggle="modal" data-bs-target="#addCategoryModal" class="toggle btn btn-primary "><em class="icon ni ni-plus"></em><span>Add Category</span></a>


                            </div><!-- .nk-block-head-content -->
                        </div><!-- .nk-block-between -->
                    </div><!-- .nk-block-head -->

                    <!-- Flash Messages -->
                    @if(session('success'))
                        <div class="alert alert-success alert-dismissible fade show" role="alert">
                            <div class="alert-icon">
                                <em class="icon ni ni-check-circle"></em>
                            </div>
                            <div class="alert-text">
                                {{ session('success') }}
                            </div>
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    @endif

                    @if(session('error'))
                        <div class="alert alert-danger alert-dismissible fade show" role="alert">
                            <div class="alert-icon">
                                <em class="icon ni ni-cross-circle"></em>
                            </div>
                            <div class="alert-text">
                                {{ session('error') }}
                            </div>
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    @endif

                    <div class="nk-block">
                        <div class="table-responsive">
                            <table class="table table-striped table-hover">
                                <thead class=" text-black">
                                    <tr>
                                        <th>Name</th>
                                        <th>Slug</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach($categories as $category)
                                    <tr>
                                        <td>{{ $category->name }}</td>
                                        <td>{{ $category->slug }}</td>
                                        <td>{{ Str::limit($category->description, 50) }}</td>
                                        <td>
                                            <span class="badge {{ $category->is_active ? 'bg-success' : 'bg-danger' }}">
                                                {{ $category->is_active ? 'Active' : 'Inactive' }}
                                            </span>
                                        </td>
                                        <td>{{ $category->created_at->format('M d, Y') }}</td>
                                        <td>
                                            <button class="btn btn-sm btn-primary edit-category"
                                                    data-category-id="{{ $category->id }}"
                                                    data-category-name="{{ $category->name }}"
                                                    data-category-description="{{ $category->description }}"
                                                    data-category-active="{{ $category->is_active }}"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#editCategoryModal">
                                                <em class="icon ni ni-edit"></em> Edit
                                            </button>
                                            <form action="{{ route('admin.categories.destroy', $category) }}" method="POST" style="display: inline;" onsubmit="return confirm('Are you sure you want to delete this category?');">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit" class="btn btn-sm btn-danger">
                                                    <em class="icon ni ni-trash"></em> Delete
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>

                        @if($categories->isEmpty())
                        <div class="text-center py-4">
                            <p class="text-muted">No categories found.</p>
                        </div>
                        @endif
                    </div><!-- .nk-block -->
                </div>
            </div>
        </div>
    </div>

    <!-- Add Category Modal -->
    <div class="modal fade" id="addCategoryModal" tabindex="-1" aria-labelledby="addCategoryModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addCategoryModalLabel">Add New Category</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form action="{{ route('admin.categories.store') }}" method="POST">
                    @csrf
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="categoryName" class="form-label">Category Name *</label>
                            <input type="text" class="form-control @error('name') is-invalid @enderror" id="categoryName" name="name" value="{{ old('name') }}" required>
                            @error('name')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>
                        <div class="form-group">
                            <label for="categoryDescription" class="form-label">Description</label>
                            <textarea class="form-control @error('description') is-invalid @enderror" id="categoryDescription" name="description" rows="3">{{ old('description') }}</textarea>
                            @error('description')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary">Add Category</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Edit Category Modal -->
    <div class="modal fade" id="editCategoryModal" tabindex="-1" aria-labelledby="editCategoryModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editCategoryModalLabel">Edit Category</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="editCategoryForm" method="POST">
                    @csrf
                    @method('PUT')
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="editCategoryName" class="form-label">Category Name *</label>
                            <input type="text" class="form-control @error('name') is-invalid @enderror" id="editCategoryName" name="name" required>
                            @error('name')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>
                        <div class="form-group">
                            <label for="editCategoryDescription" class="form-label">Description</label>
                            <textarea class="form-control @error('description') is-invalid @enderror" id="editCategoryDescription" name="description" rows="3"></textarea>
                            @error('description')
                                <div class="invalid-feedback">{{ $message }}</div>
                            @enderror
                        </div>
                        <div class="form-group">
                            <div class="custom-control custom-switch">
                                <input type="checkbox" class="custom-control-input" id="editCategoryActive" name="is_active">
                                <label class="custom-control-label" for="editCategoryActive">Active</label>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary">Update Category</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    @push('scripts')
    <script>
        $(document).ready(function() {
            // Handle edit category button click
            $('.edit-category').on('click', function() {
                const categoryId = $(this).data('category-id');
                const categoryName = $(this).data('category-name');
                const categoryDescription = $(this).data('category-description');
                const categoryActive = $(this).data('category-active');

                // Set the form action URL
                $('#editCategoryForm').attr('action', `/admin/categories/${categoryId}`);

                // Populate the form fields
                $('#editCategoryName').val(categoryName);
                $('#editCategoryDescription').val(categoryDescription);
                $('#editCategoryActive').prop('checked', categoryActive == 1);
            });
        });
    </script>
    @endpush

@endsection
