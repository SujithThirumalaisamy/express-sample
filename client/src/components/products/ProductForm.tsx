import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Product } from "../../services/api";
import {
  convertDbPriceToDisplay,
  convertDisplayPriceToDb,
} from "../../utils/formatters";

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

const schema = z.object({
  NAME: z.string().min(1, "Name is required"),
  DISCRIPTION: z.string().min(1, "Description is required"),
  PRICE: z.number().min(0.01, "Price must be greater than 0"),
  AVAILABLITY: z.number().min(0, "Availability cannot be negative"),
});

type ProductFormData = z.infer<typeof schema>;

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      NAME: "",
      DISCRIPTION: "",
      PRICE: 0,
      AVAILABLITY: 0,
    },
  });

  useEffect(() => {
    if (product) {
      const displayPriceValue = convertDbPriceToDisplay(product.PRICE);
      reset({
        NAME: product.NAME,
        DISCRIPTION: product.DISCRIPTION,
        PRICE: displayPriceValue,
        AVAILABLITY: product.AVAILABLITY,
      });
    }
  }, [product, reset]);

  const onSubmitForm = (data: ProductFormData) => {
    const dbPrice = convertDisplayPriceToDb(data.PRICE);
    onSubmit({
      ...data,
      PRICE: dbPrice,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
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
        <Controller
          name="NAME"
          control={control}
          render={({ field }) => (
            <input
              autoFocus={true}
              {...field}
              type="text"
              className={`rounded-none mt-1 block w-full border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm transition-colors duration-200 ${
                errors.NAME ? "border-red-500" : ""
              }`}
            />
          )}
        />
        {errors.NAME && (
          <p className="mt-1 text-sm text-red-600">{errors.NAME.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="DISCRIPTION"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <Controller
          name="DISCRIPTION"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              rows={3}
              className={`rounded-none mt-1 block w-full border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm transition-colors duration-200 ${
                errors.DISCRIPTION ? "border-red-500" : ""
              }`}
            />
          )}
        />
        {errors.DISCRIPTION && (
          <p className="mt-1 text-sm text-red-600">
            {errors.DISCRIPTION.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="PRICE"
          className="block text-sm font-medium text-gray-700"
        >
          Price ($)
        </label>
        <Controller
          name="PRICE"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              value={field.value.toString()}
              onChange={(e) => field.onChange(Number(e.target.value))}
              type="number"
              min="0"
              step="0.01"
              className={`rounded-none mt-1 block w-full border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm transition-colors duration-200 ${
                errors.PRICE ? "border-red-500" : ""
              }`}
            />
          )}
        />
        <p className="mt-1 text-xs text-gray-500">
          Enter price in dollars (e.g., 10.99)
        </p>
        {errors.PRICE && (
          <p className="mt-1 text-sm text-red-600">{errors.PRICE.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="AVAILABLITY"
          className="block text-sm font-medium text-gray-700"
        >
          Availability (units in stock)
        </label>
        <Controller
          name="AVAILABLITY"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              value={field.value}
              onChange={(e) => field.onChange(Number(e.target.value))}
              type="number"
              min="0"
              className={`rounded-none mt-1 block w-full border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm transition-colors duration-200 ${
                errors.AVAILABLITY ? "border-red-500" : ""
              }`}
            />
          )}
        />
        {errors.AVAILABLITY && (
          <p className="mt-1 text-sm text-red-600">
            {errors.AVAILABLITY.message}
          </p>
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
