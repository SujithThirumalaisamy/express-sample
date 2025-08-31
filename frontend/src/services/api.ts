import axios from "axios";

const API_BASE_URL = "/server";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  },
);

export interface Product {
  ROWID?: string;
  NAME: string;
  DISCRIPTION: string;
  PRICE: number;
  AVAILABLITY: number;
  CREATORID?: string;
  CREATEDTIME?: string;
  MODIFIEDTIME?: string;
}

export interface Order {
  ROWID?: string;
  CREATORID?: string;
  MODIFIEDTIME?: string;
  STATUS: string;
  ORDERPRICE: number;
  QUANTITY: number;
  CREATEDTIME?: string;
  PRODUCTID: string;
}

export interface OrderItem {
  product_id: string;
  quantity: number;
  product_name: string;
  price: number;
}

export interface OrderWithItems {
  ROWID?: string;
  customer_name: string;
  items: OrderItem[];
  total_amount: number;
}

export const productsAPI = {
  getAll: () => api.get("/products"),
  getById: (id: string) => api.get(`/products?product_id=${id}`),
  create: (
    product: Omit<
      Product,
      "ROWID" | "CREATORID" | "CREATEDTIME" | "MODIFIEDTIME"
    >,
  ) => api.post("/products", product),
  update: (
    id: string,
    product: Omit<
      Product,
      "ROWID" | "CREATORID" | "CREATEDTIME" | "MODIFIEDTIME"
    >,
  ) => api.put(`/products?product_id=${id}`, product),
  delete: (id: string) => api.delete(`/products?product_id=${id}`),
};

export const ordersAPI = {
  getAll: () => api.get("/orders"),
  getById: (id: string) => api.get(`/orders?order_id=${id}`),
  create: (
    order: Omit<Order, "ROWID" | "CREATORID" | "CREATEDTIME" | "MODIFIEDTIME">,
  ) => api.post("/orders", order),
  update: (
    id: string,
    order: Omit<Order, "ROWID" | "CREATORID" | "CREATEDTIME" | "MODIFIEDTIME">,
  ) => api.put(`/orders?order_id=${id}`, order),
  delete: (id: string) => api.delete(`/orders?order_id=${id}`),
};

export default api;
