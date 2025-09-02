import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersAPI, Order } from "../services/api";

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await ordersAPI.getAll();
      return response.data;
    },
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      orderData: Omit<
        Order,
        "ROWID" | "CREATORID" | "CREATEDTIME" | "MODIFIEDTIME"
      >,
    ) => {
      const response = await ordersAPI.create(orderData);
      return response.data;
    },
    onSuccess: (newOrder) => {
      queryClient.setQueryData(["orders"], (oldData: Order[] | undefined) => {
        if (!oldData) return [newOrder];
        return [...oldData, newOrder];
      });
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      orderData,
    }: {
      id: string;
      orderData: Omit<
        Order,
        "ROWID" | "CREATORID" | "CREATEDTIME" | "MODIFIEDTIME"
      >;
    }) => {
      const response = await ordersAPI.update(id, orderData);
      return response.data;
    },
    onSuccess: (updatedOrder, { id }) => {
      queryClient.setQueryData(["orders"], (oldData: Order[] | undefined) => {
        if (!oldData) return [updatedOrder];
        return oldData.map((order) =>
          order.ROWID === id
            ? {
                ...updatedOrder,
                ROWID: order.ROWID,
                CREATORID: order.CREATORID,
                CREATEDTIME: order.CREATEDTIME,
                MODIFIEDTIME: order.MODIFIEDTIME,
              }
            : order,
        );
      });
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await ordersAPI.delete(id);
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData(["orders"], (oldData: Order[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter((order) => order.ROWID !== deletedId);
      });
    },
  });
};
