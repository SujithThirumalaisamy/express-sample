import React, { useState, useMemo } from "react";
import { Order, Product } from "../../services/api";
import { useToast } from "../../contexts/ToastContext";
import {
  formatCompactPrice,
  formatPrice,
  calculateTotalRevenue,
  calculateAverageOrderValue,
} from "../../utils/formatters";
import OrderForm from "./OrderForm";
import {
  useOrders,
  useCreateOrder,
  useUpdateOrder,
  useDeleteOrder,
} from "../../hooks";
import { useProducts } from "../../hooks";

const OrderList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { showError, showSuccess } = useToast();

  // React Query hooks
  const {
    data: orders = [],
    isLoading: ordersLoading,
    error: ordersError,
  } = useOrders();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const createOrderMutation = useCreateOrder();
  const updateOrderMutation = useUpdateOrder();
  const deleteOrderMutation = useDeleteOrder();

  // Filter orders based on search term
  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) {
      return orders;
    }
    return orders.filter((order: Order) => {
      const product = products.find(
        (p: Product) => p.ROWID === order.PRODUCTID,
      );
      const productName = product?.NAME || order.PRODUCTID;

      const productMatch = productName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const statusMatch = order.STATUS.toLowerCase().includes(
        searchTerm.toLowerCase(),
      );

      return productMatch || statusMatch;
    });
  }, [orders, products, searchTerm]);

  const getProductName = (productId: string): string => {
    const product = products.find((p: Product) => p.ROWID === productId);
    return product?.NAME || productId;
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteOrderMutation.mutateAsync(id);
        showSuccess("Order deleted successfully");
      } catch (err) {
        showError("Failed to delete order");
        console.error("Error deleting order:", err);
      }
    }
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setShowForm(true);
  };

  const handleFormSubmit = async (
    orderData: Omit<
      Order,
      "ROWID" | "CREATORID" | "CREATEDTIME" | "MODIFIEDTIME"
    >,
  ) => {
    try {
      if (editingOrder) {
        await updateOrderMutation.mutateAsync({
          id: editingOrder.ROWID!,
          orderData,
        });
        showSuccess("Order updated successfully");
      } else {
        await createOrderMutation.mutateAsync(orderData);
        showSuccess("Order created successfully");
      }
      setShowForm(false);
      setEditingOrder(null);
    } catch (err) {
      showError("Failed to save order");
      console.error("Error saving order:", err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingOrder(null);
  };

  const getTotalRevenue = () => {
    return calculateTotalRevenue(filteredOrders);
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (ordersLoading || productsLoading) {
    return (
      <div className="flex justify-center items-center h-[85vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (ordersError) {
    return (
      <div className="flex justify-center items-center h-[85vh]">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-2">Error loading orders</div>
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
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
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
              Add Order
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mb-6">
        <div className="bg-white shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {filteredOrders.length}
              </div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {formatCompactPrice(getTotalRevenue())}
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {formatCompactPrice(calculateAverageOrderValue(filteredOrders))}
              </div>
              <div className="text-sm text-gray-600">Average Order Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {
                  filteredOrders.filter((o: Order) => o.STATUS === "PENDING")
                    .length
                }
              </div>
              <div className="text-sm text-gray-600">Pending Orders</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="max-w-md">
          <label htmlFor="search" className="sr-only">
            Search orders
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
              placeholder="Search orders by product or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-none block w-full pl-10 pr-3 py-2 border border-gray-300 leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredOrders.map((order: Order) => (
            <div key={order.ROWID} className="bg-white overflow-hidden shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {getProductName(order.PRODUCTID)}
                    </h3>
                    <div className="flex items-center mb-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.STATUS)}`}
                      >
                        {order.STATUS}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      <strong>Quantity:</strong> {Number(order.QUANTITY)}
                    </p>
                    <div className="text-2xl font-bold text-green-600">
                      {formatPrice(order.ORDERPRICE)}
                    </div>
                    {order.CREATEDTIME && (
                      <p className="text-xs text-gray-500 mt-2">
                        Created:{" "}
                        {new Date(order.CREATEDTIME).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="px-6 py-3">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(order)}
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
                    onClick={() => handleDelete(order.ROWID!)}
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
          ))}
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No orders found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? "Try adjusting your search terms."
              : "Get started by creating a new order."}
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
                Add Order
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-[600px] max-w-[90vw] max-h-[80vh] md:max-h-[80vh] h-[100vh] md:h-auto shadow-lg bg-white overflow-y-auto">
            <OrderForm
              order={editingOrder}
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
