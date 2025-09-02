import React, { useState, useEffect } from "react";
import { Order, Product } from "../../services/api";
import { productsAPI } from "../../services/api";
import {
  convertDbPriceToDisplay,
  convertDisplayPriceToDb,
} from "../../utils/formatters";

interface OrderFormProps {
  order?: Order | null;
  onSubmit: (
    orderData: Omit<
      Order,
      "ROWID" | "CREATORID" | "CREATEDTIME" | "MODIFIEDTIME"
    >,
  ) => void;
  onCancel: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ order, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    PRODUCTID: "",
    QUANTITY: 1,
    ORDERPRICE: 0,
    STATUS: "PENDING",
  });
  const [displayPrice, setDisplayPrice] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (order) {
      const displayPriceValue = convertDbPriceToDisplay(order.ORDERPRICE);
      setFormData({
        PRODUCTID: order.PRODUCTID,
        QUANTITY: Number(order.QUANTITY),
        ORDERPRICE: order.ORDERPRICE,
        STATUS: order.STATUS,
      });
      setDisplayPrice(displayPriceValue);
    }
  }, [order]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.PRODUCTID.trim()) {
      newErrors.PRODUCTID = "Product is required";
    }

    if (!formData.QUANTITY || formData.QUANTITY <= 0) {
      newErrors.QUANTITY = "Quantity must be greater than 0";
    }

    if (displayPrice <= 0) {
      newErrors.ORDERPRICE = "Order price must be greater than 0";
    }

    if (!formData.STATUS.trim()) {
      newErrors.STATUS = "Status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const dbPrice = convertDisplayPriceToDb(displayPrice);
      const orderData = {
        ...formData,
        ORDERPRICE: dbPrice,
        QUANTITY: Number(formData.QUANTITY),
      };
      onSubmit(orderData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "ORDERPRICE") {
      const priceValue = parseFloat(value) || 0;
      setDisplayPrice(priceValue);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      PRODUCTID: productId,
    }));

    // Auto-calculate order price based on selected product
    if (productId) {
      const selectedProduct = products.find((p) => p.ROWID === productId);
      if (selectedProduct) {
        const quantity = formData.QUANTITY || 1;
        const productDisplayPrice = convertDbPriceToDisplay(
          selectedProduct.PRICE,
        );
        const totalPrice = productDisplayPrice * quantity;
        setFormData((prev) => ({
          ...prev,
          PRODUCTID: productId,
        }));
        setDisplayPrice(totalPrice);
      }
    }

    // Clear error when user starts typing
    if (errors.PRODUCTID) {
      setErrors((prev) => ({
        ...prev,
        PRODUCTID: "",
      }));
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = parseInt(e.target.value) || 1;
    setFormData((prev) => ({
      ...prev,
      QUANTITY: quantity,
    }));

    // Auto-calculate order price based on quantity
    if (formData.PRODUCTID) {
      const selectedProduct = products.find(
        (p) => p.ROWID === formData.PRODUCTID,
      );
      if (selectedProduct) {
        const productDisplayPrice = convertDbPriceToDisplay(
          selectedProduct.PRICE,
        );
        const totalPrice = productDisplayPrice * quantity;
        setFormData((prev) => ({
          ...prev,
          QUANTITY: quantity,
        }));
        setDisplayPrice(totalPrice);
      }
    }

    // Clear error when user starts typing
    if (errors.QUANTITY) {
      setErrors((prev) => ({
        ...prev,
        QUANTITY: "",
      }));
    }
  };

  const getSelectedProduct = () => {
    return products.find((p) => p.ROWID === formData.PRODUCTID);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {order ? "Edit Order" : "Add New Order"}
        </h2>
      </div>

      <div>
        <label
          htmlFor="PRODUCTID"
          className="block text-sm font-medium text-gray-700"
        >
          Product
        </label>
        <select
          id="PRODUCTID"
          name="PRODUCTID"
          value={formData.PRODUCTID}
          onChange={handleProductChange}
          disabled={loading}
          className={`rounded-none mt-1 block w-full border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed ${
            errors.PRODUCTID ? "border-red-500" : ""
          }`}
        >
          <option value="">Select a product...</option>
          {products.map((product) => (
            <option key={product.ROWID} value={product.ROWID}>
              {product.NAME} - ${product.PRICE}
            </option>
          ))}
        </select>
        {errors.PRODUCTID && (
          <p className="mt-1 text-sm text-red-600">{errors.PRODUCTID}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="QUANTITY"
          className="block text-sm font-medium text-gray-700"
        >
          Quantity
        </label>
        <input
          type="number"
          id="QUANTITY"
          name="QUANTITY"
          min="1"
          value={formData.QUANTITY.toString()}
          onChange={handleQuantityChange}
          className={`rounded-none mt-1 block w-full border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm ${
            errors.QUANTITY ? "border-red-500" : ""
          }`}
        />
        {errors.QUANTITY && (
          <p className="mt-1 text-sm text-red-600">{errors.QUANTITY}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="ORDERPRICE"
          className="block text-sm font-medium text-gray-700"
        >
          Order Price ($)
        </label>
        <input
          type="number"
          id="ORDERPRICE"
          name="ORDERPRICE"
          min="0"
          step="0.01"
          value={displayPrice}
          onChange={handleChange}
          className={`rounded-none mt-1 block w-full border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm ${
            errors.ORDERPRICE ? "border-red-500" : ""
          }`}
        />
        {errors.ORDERPRICE && (
          <p className="mt-1 text-sm text-red-600">{errors.ORDERPRICE}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="STATUS"
          className="block text-sm font-medium text-gray-700"
        >
          Status
        </label>
        <select
          id="STATUS"
          name="STATUS"
          value={formData.STATUS}
          onChange={handleChange}
          className={`rounded-none mt-1 block w-full border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm ${
            errors.STATUS ? "border-red-500" : ""
          }`}
        >
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        {errors.STATUS && (
          <p className="mt-1 text-sm text-red-600">{errors.STATUS}</p>
        )}
      </div>

      {/* Order Summary */}
      {formData.PRODUCTID && (
        <div className="border-t border-gray-200 pt-4 mt-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-orange-600"
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
            Order Summary
          </h3>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {getSelectedProduct()?.NAME}
                </div>
                <div className="text-sm text-gray-500">
                  Qty: {formData.QUANTITY} × $
                  {getSelectedProduct()?.PRICE.toFixed(2)}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">
                  $
                  {(convertDbPriceToDisplay(formData.ORDERPRICE) || 0).toFixed(
                    2,
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 bg-white p-3 rounded border">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">
                Total Amount
              </span>
              <span className="text-2xl font-bold text-orange-600">
                $
                {(convertDbPriceToDisplay(formData.ORDERPRICE) || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
        >
          {order ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};

export default OrderForm;
