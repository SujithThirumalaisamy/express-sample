import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Order, Product } from "../../services/api";
import { productsAPI } from "../../services/api";
import {
  convertDbPriceToDisplay,
  convertDisplayPriceToDb,
} from "../../utils/formatters";
import CustomDropdown from "../common/CustomDropdown";

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

const schema = z.object({
  PRODUCTID: z.string().min(1, "Product is required"),
  QUANTITY: z.number().min(1, "Quantity must be greater than 0"),
  ORDERPRICE: z.number().min(0.01, "Order price must be greater than 0"),
  STATUS: z.string().min(1, "Status is required"),
});

type OrderFormData = z.infer<typeof schema>;

const OrderForm: React.FC<OrderFormProps> = ({ order, onSubmit, onCancel }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<OrderFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      PRODUCTID: "",
      QUANTITY: 1,
      ORDERPRICE: 0,
      STATUS: "PENDING",
    },
  });

  const watchedProductId = watch("PRODUCTID");
  const watchedQuantity = watch("QUANTITY");

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (order) {
      const displayPriceValue = convertDbPriceToDisplay(order.ORDERPRICE);
      reset({
        PRODUCTID: order.PRODUCTID,
        QUANTITY: Number(order.QUANTITY),
        ORDERPRICE: displayPriceValue,
        STATUS: order.STATUS,
      });
    }
  }, [order, reset]);

  // Auto-calculate order price when product or quantity changes
  useEffect(() => {
    if (watchedProductId && watchedQuantity > 0) {
      const selectedProduct = products.find(
        (p) => p.ROWID === watchedProductId,
      );
      if (selectedProduct) {
        const productDisplayPrice = convertDbPriceToDisplay(
          selectedProduct.PRICE,
        );
        const totalPrice = productDisplayPrice * watchedQuantity;
        setValue("ORDERPRICE", totalPrice);
      }
    }
  }, [watchedProductId, watchedQuantity, products, setValue]);

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

  const onSubmitForm = (data: OrderFormData) => {
    const dbPrice = convertDisplayPriceToDb(data.ORDERPRICE);
    const orderData = {
      ...data,
      ORDERPRICE: dbPrice,
      QUANTITY: Number(data.QUANTITY),
    };
    console.log("orderData", orderData);
    onSubmit(orderData);
  };

  const getSelectedProduct = () => {
    return products.find((p) => p.ROWID === watchedProductId);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
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
        <Controller
          name="PRODUCTID"
          control={control}
          render={({ field }) => (
            <CustomDropdown
              autoFocus={true}
              options={products.map((product) => ({
                value: product.ROWID!,
                label: product.NAME,
              }))}
              value={field.value}
              onChange={field.onChange}
              placeholder="Select a product..."
              disabled={loading}
              error={!!errors.PRODUCTID}
              searchable={true}
              className="mt-1"
            />
          )}
        />
        {errors.PRODUCTID && (
          <p className="mt-1 text-sm text-red-600">
            {errors.PRODUCTID.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="QUANTITY"
          className="block text-sm font-medium text-gray-700"
        >
          Quantity
        </label>
        <Controller
          name="QUANTITY"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              value={field.value.toString()}
              onChange={(e) => field.onChange(Number(e.target.value))}
              type="number"
              min="1"
              className={`rounded-none mt-1 block w-full border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm ${
                errors.QUANTITY ? "border-red-500" : ""
              }`}
            />
          )}
        />
        {errors.QUANTITY && (
          <p className="mt-1 text-sm text-red-600">{errors.QUANTITY.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="ORDERPRICE"
          className="block text-sm font-medium text-gray-700"
        >
          Order Price ($)
        </label>
        <Controller
          name="ORDERPRICE"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              value={field.value.toString()}
              onChange={(e) => field.onChange(Number(e.target.value))}
              type="number"
              min="0"
              step="0.01"
              className={`rounded-none mt-1 block w-full border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm ${
                errors.ORDERPRICE ? "border-red-500" : ""
              }`}
            />
          )}
        />
        {errors.ORDERPRICE && (
          <p className="mt-1 text-sm text-red-600">
            {errors.ORDERPRICE.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="STATUS"
          className="block text-sm font-medium text-gray-700"
        >
          Status
        </label>
        <Controller
          name="STATUS"
          control={control}
          render={({ field }) => (
            <CustomDropdown
              options={[
                { value: "PENDING", label: "Pending" },
                { value: "PROCESSING", label: "Processing" },
                { value: "COMPLETED", label: "Completed" },
                { value: "CANCELLED", label: "Cancelled" },
              ]}
              value={field.value}
              onChange={field.onChange}
              placeholder="Select status..."
              error={!!errors.STATUS}
              searchable={false}
              className="mt-1"
            />
          )}
        />
        {errors.STATUS && (
          <p className="mt-1 text-sm text-red-600">{errors.STATUS.message}</p>
        )}
      </div>

      {/* Order Summary */}
      {watchedProductId && (
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
                  Qty: {watchedQuantity} × $
                  {getSelectedProduct()
                    ? convertDbPriceToDisplay(
                        getSelectedProduct()!.PRICE,
                      ).toFixed(2)
                    : "0.00"}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">
                  ${watch("ORDERPRICE")?.toFixed(2) || "0.00"}
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
                ${watch("ORDERPRICE")?.toFixed(2) || "0.00"}
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
