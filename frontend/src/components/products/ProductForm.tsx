import React, { useState, useEffect } from "react";
import { Product } from "../../services/api";

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (
    productData: Omit<
      Product,
      "ROWID" | "CREATORID" | "CREATEDTIME" | "MODIFIEDTIME"
    >,
  ) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    NAME: "",
    DISCRIPTION: "",
    PRICE: 0,
    AVAILABLITY: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        NAME: product.NAME,
        DISCRIPTION: product.DISCRIPTION,
        PRICE: product.PRICE,
        AVAILABLITY: product.AVAILABLITY,
      });
    }
  }, [product]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.NAME.trim()) {
      newErrors.NAME = "Name is required";
    }

    if (!formData.DISCRIPTION.trim()) {
      newErrors.DISCRIPTION = "Description is required";
    }

    if (formData.PRICE <= 0) {
      newErrors.PRICE = "Price must be greater than 0";
    }

    if (formData.AVAILABLITY < 0) {
      newErrors.AVAILABLITY = "Availability cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "PRICE" || name === "AVAILABLITY"
          ? parseInt(value) || 0
          : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {product ? "Edit Product" : "Add New Product"}
        </h2>
      </div>

      <div>
        <label
          htmlFor="NAME"
          className="block text-sm font-medium text-gray-700"
        >
          Product Name
        </label>
        <input
          type="text"
          id="NAME"
          name="NAME"
          value={formData.NAME}
          onChange={handleChange}
          className={`rounded-none mt-1 block w-full border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm transition-colors duration-200 ${
            errors.NAME ? "border-red-500" : ""
          }`}
        />
        {errors.NAME && (
          <p className="mt-1 text-sm text-red-600">{errors.NAME}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="DISCRIPTION"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="DISCRIPTION"
          name="DISCRIPTION"
          value={formData.DISCRIPTION}
          onChange={handleChange}
          rows={3}
          className={`rounded-none mt-1 block w-full border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm transition-colors duration-200 ${
            errors.DISCRIPTION ? "border-red-500" : ""
          }`}
        />
        {errors.DISCRIPTION && (
          <p className="mt-1 text-sm text-red-600">{errors.DISCRIPTION}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="PRICE"
          className="block text-sm font-medium text-gray-700"
        >
          Price (in cents)
        </label>
        <input
          type="number"
          id="PRICE"
          name="PRICE"
          value={formData.PRICE}
          onChange={handleChange}
          min="0"
          className={`rounded-none mt-1 block w-full border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm transition-colors duration-200 ${
            errors.PRICE ? "border-red-500" : ""
          }`}
        />
        <p className="mt-1 text-xs text-gray-500">
          Display price:{" "}
          <span className="text-orange-600 font-medium">
            ${(formData.PRICE / 100).toFixed(2)}
          </span>
        </p>
        {errors.PRICE && (
          <p className="mt-1 text-sm text-red-600">{errors.PRICE}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="AVAILABLITY"
          className="block text-sm font-medium text-gray-700"
        >
          Availability (units in stock)
        </label>
        <input
          type="number"
          id="AVAILABLITY"
          name="AVAILABLITY"
          value={formData.AVAILABLITY}
          onChange={handleChange}
          min="0"
          className={`rounded-none mt-1 block w-full border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm transition-colors duration-200 ${
            errors.AVAILABLITY ? "border-red-500" : ""
          }`}
        />
        {errors.AVAILABLITY && (
          <p className="mt-1 text-sm text-red-600">{errors.AVAILABLITY}</p>
        )}
      </div>

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
          {product ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
