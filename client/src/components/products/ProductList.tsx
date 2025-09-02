import React, { useState, useMemo } from "react";
import { Product } from "../../services/api";
import { useToast } from "../../contexts/ToastContext";
import { formatPrice } from "../../utils/formatters";
import ProductForm from "./ProductForm";
import VerificationDialog from "../common/VerificationDialog";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "../../hooks";

const ProductList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const { showError, showSuccess } = useToast();

  // React Query hooks
  const { data: products = [], isLoading, error } = useProducts();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) {
      return products;
    }
    return products.filter(
      (product: Product) =>
        product.NAME.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.DISCRIPTION.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [products, searchTerm]);

  const handleDelete = async (id: string) => {
    setProductToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await deleteProductMutation.mutateAsync(productToDelete);
      showSuccess("Product deleted successfully");
    } catch (err) {
      showError("Failed to delete product");
      console.error("Error deleting product:", err);
    } finally {
      setShowDeleteDialog(false);
      setProductToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setProductToDelete(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormSubmit = async (
    productData: Omit<
      Product,
      "ROWID" | "CREATORID" | "CREATEDTIME" | "MODIFIEDTIME"
    >,
  ) => {
    try {
      if (editingProduct) {
        await updateProductMutation.mutateAsync({
          id: editingProduct.ROWID!,
          productData,
        });
        showSuccess("Product updated successfully");
      } else {
        await createProductMutation.mutateAsync(productData);
        showSuccess("Product created successfully");
      }
      setShowForm(false);
      setEditingProduct(null);
    } catch (err) {
      showError("Failed to save product");
      console.error("Error saving product:", err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const getAvailabilityStatus = (availability: number) => {
    if (availability === 0)
      return { text: "Out of Stock", color: "bg-red-100 text-red-800" };
    if (availability < 10)
      return { text: "Low Stock", color: "bg-orange-100 text-orange-800" };
    return { text: "In Stock", color: "bg-green-100 text-green-800" };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[85vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[85vh]">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-2">
            Error loading products
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="max-w-md">
          <label htmlFor="search" className="sr-only">
            Search products
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              id="search"
              type="text"
              placeholder="Search products by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-none block w-full pl-10 pr-3 py-2 border border-gray-300 leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product: Product) => {
            const availabilityStatus = getAvailabilityStatus(
              product.AVAILABLITY,
            );
            return (
              <div
                key={product.ROWID}
                className="bg-white overflow-hidden shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.NAME}
                      </h3>
                      <div className="flex items-center mb-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${availabilityStatus.color}`}
                        >
                          {availabilityStatus.text}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.DISCRIPTION}
                      </p>
                      <div className="text-2xl font-bold text-green-600">
                        {formatPrice(product.PRICE)}
                      </div>
                      <p className="text-gray-600 text-sm mt-2">
                        <strong>Stock:</strong> {product.AVAILABLITY} units
                      </p>
                      {product.CREATEDTIME && (
                        <p className="text-xs text-gray-500 mt-2">
                          Created:{" "}
                          {new Date(product.CREATEDTIME).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="px-6 py-3">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.ROWID!)}
                      className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-xs font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No products found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? "Try adjusting your search terms."
              : "Get started by adding your first product."}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Product
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-[600px] max-w-[90vw] max-h-[80vh] md:max-h-[80vh] h-[100vh] md:h-auto shadow-lg bg-white overflow-y-auto">
            <ProductForm
              product={editingProduct}
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}

      {/* Verification Dialog */}
      <VerificationDialog
        isOpen={showDeleteDialog}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        type="danger"
      />
    </div>
  );
};

export default ProductList;
