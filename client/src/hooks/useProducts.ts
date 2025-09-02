import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsAPI, Product } from "../services/api";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await productsAPI.getAll();
      return response.data;
    },
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      productData: Omit<
        Product,
        "ROWID" | "CREATORID" | "CREATEDTIME" | "MODIFIEDTIME"
      >,
    ) => {
      const response = await productsAPI.create(productData);
      return response.data;
    },
    onSuccess: (newProduct) => {
      queryClient.setQueryData(
        ["products"],
        (oldData: Product[] | undefined) => {
          if (!oldData) return [newProduct];
          return [
            ...oldData,
            { ...newProduct, AVAILABLITY: Number(newProduct.AVAILABLITY) },
          ];
        },
      );
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      productData,
    }: {
      id: string;
      productData: Omit<
        Product,
        "ROWID" | "CREATORID" | "CREATEDTIME" | "MODIFIEDTIME"
      >;
    }) => {
      const response = await productsAPI.update(id, productData);
      return response.data;
    },
    onSuccess: (updatedProduct, { id }) => {
      queryClient.setQueryData(
        ["products"],
        (oldData: Product[] | undefined) => {
          if (!oldData) return [updatedProduct];
          return oldData.map((product) =>
            product.ROWID === id
              ? {
                  ...updatedProduct,
                  ROWID: product.ROWID,
                  CREATORID: product.CREATORID,
                  CREATEDTIME: product.CREATEDTIME,
                  MODIFIEDTIME: product.MODIFIEDTIME,
                }
              : product,
          );
        },
      );
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await productsAPI.delete(id);
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData(
        ["products"],
        (oldData: Product[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter((product) => product.ROWID !== deletedId);
        },
      );
    },
  });
};
