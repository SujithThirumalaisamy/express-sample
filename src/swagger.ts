const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "Sample CRUD API for Convonite",
    description: "A simple API to demonstrate CRUD operations for Convonite.",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://localhost:3000/v1",
      description: "Local development server",
    },
    {
      url: "https://convonite.isujith.dev/v1",
      description: "Production server Custom Domain",
    },
    {
      url: "https://convonite-50030735198.development.catalystappsail.in/v1",
      description: "Production server Zoho Domain",
    },
  ],
  paths: {
    "/health": {
      get: {
        tags: ["System"],
        summary: "Health Check",
        description: "Check if the server is running",
        responses: {
          "200": {
            description: "Server is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      example: "The server is healthy!",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/auth/signup": {
      post: {
        tags: ["Authentication"],
        summary: "User Signup",
        description: "Create a new user account",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: {
                    type: "string",
                    example: "John Doe",
                  },
                  email: {
                    type: "string",
                    format: "email",
                    example: "john@example.com",
                  },
                  password: {
                    type: "string",
                    minLength: 6,
                    example: "password123",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "User created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "User created",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad request - missing required fields",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Name, Email and password required",
                    },
                  },
                },
              },
            },
          },
          "409": {
            description: "Conflict - user already exists",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "User already exists",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/auth/signin": {
      post: {
        tags: ["Authentication"],
        summary: "User Signin",
        description: "Authenticate user and get JWT token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "john@example.com",
                  },
                  password: {
                    type: "string",
                    example: "password123",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Authentication successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: {
                      type: "string",
                      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad request - missing required fields",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Email and password required",
                    },
                  },
                },
              },
            },
          },
          "401": {
            description: "Unauthorized - invalid credentials",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Invalid credentials",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/products": {
      get: {
        tags: ["Products"],
        summary: "Get All Products",
        description: "Retrieve all products",
        responses: {
          "200": {
            description: "List of products",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Product",
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Products"],
        summary: "Create Product",
        description: "Create a new product",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "description", "price"],
                properties: {
                  name: {
                    type: "string",
                    example: "Laptop",
                  },
                  description: {
                    type: "string",
                    example: "High-performance laptop",
                  },
                  price: {
                    type: "number",
                    example: 99999,
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Product created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Product created successfully",
                    },
                    product: {
                      $ref: "#/components/schemas/Product",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad request - missing required fields",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Name, Description and Price are required",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get Product by ID",
        description: "Retrieve a specific product by its ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            description: "Product ID",
          },
        ],
        responses: {
          "200": {
            description: "Product found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Product",
                },
              },
            },
          },
          "404": {
            description: "Product not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Product not found",
                    },
                  },
                },
              },
            },
          },
        },
      },
      patch: {
        tags: ["Products"],
        summary: "Update Product",
        description: "Update a product by its ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            description: "Product ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    example: "Updated Laptop",
                  },
                  description: {
                    type: "string",
                    example: "Updated description",
                  },
                  price: {
                    type: "number",
                    example: 109999,
                  },
                  availableQuantity: {
                    type: "number",
                    example: 15,
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Product updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Product updated successfully",
                    },
                    product: {
                      $ref: "#/components/schemas/Product",
                    },
                  },
                },
              },
            },
          },
          "404": {
            description: "Product not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Product not found",
                    },
                  },
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Products"],
        summary: "Delete Product",
        description: "Delete a product by its ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            description: "Product ID",
          },
        ],
        responses: {
          "200": {
            description: "Product deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Product deleted successfully",
                    },
                  },
                },
              },
            },
          },
          "404": {
            description: "Product not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Product not found",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/orders": {
      post: {
        tags: ["Orders"],
        summary: "Create Order",
        description: "Create a new order",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["productId", "quantity"],
                properties: {
                  productId: {
                    type: "string",
                    example: "product-id-123",
                  },
                  userId: {
                    type: "string",
                    example: "user-id-456",
                  },
                  quantity: {
                    type: "number",
                    minimum: 1,
                    example: 2,
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Order created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Order created successfully",
                    },
                    order: {
                      $ref: "#/components/schemas/Order",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description:
              "Bad request - missing required fields or insufficient quantity",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Product ID and Quantity are required",
                    },
                  },
                },
              },
            },
          },
          "404": {
            description: "Product not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Product not found",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/orders/{id}": {
      get: {
        tags: ["Orders"],
        summary: "Get Order by ID",
        description: "Retrieve a specific order by its ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            description: "Order ID",
          },
        ],
        responses: {
          "200": {
            description: "Order found",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    {
                      $ref: "#/components/schemas/Order",
                    },
                    {
                      type: "object",
                      properties: {
                        product: {
                          $ref: "#/components/schemas/Product",
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          "404": {
            description: "Order not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Order not found",
                    },
                  },
                },
              },
            },
          },
        },
      },
      patch: {
        tags: ["Orders"],
        summary: "Update Order Status",
        description: "Update the status of an order",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            description: "Order ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: {
                    type: "string",
                    example: "shipped",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Order updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Order updated successfully",
                    },
                    order: {
                      $ref: "#/components/schemas/Order",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad request - status is required",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Status is required",
                    },
                  },
                },
              },
            },
          },
          "404": {
            description: "Order not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Order not found",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  tags: [
    {
      name: "Authentication",
      description: "User authentication and authorization endpoints",
    },
    {
      name: "Products",
      description: "Product management endpoints",
    },
    {
      name: "Orders",
      description: "Order management endpoints",
    },
    {
      name: "System",
      description: "System health and documentation endpoints",
    },
  ],
  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: "user-id-123",
          },
          name: {
            type: "string",
            example: "John Doe",
          },
          email: {
            type: "string",
            format: "email",
            example: "john@example.com",
          },
          password: {
            type: "string",
            example: "hashedpassword123",
            description: "Hashed password (not returned in responses)",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2023-01-01T00:00:00.000Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2023-01-01T00:00:00.000Z",
          },
        },
      },
      Product: {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: "product-id-123",
          },
          name: {
            type: "string",
            example: "Laptop",
          },
          description: {
            type: "string",
            example: "High-performance laptop",
          },
          price: {
            type: "number",
            example: 99999,
          },
          availableQuantity: {
            type: "number",
            example: 10,
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2023-01-01T00:00:00.000Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2023-01-01T00:00:00.000Z",
          },
        },
      },
      Order: {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: "e51306f4-82d4-4993-b7a4-e42eb6be9b87",
          },
          userId: {
            type: "string",
            example: "6da209dd-8f2a-4ee7-93d7-35aa1905ce54",
          },
          productId: {
            type: "string",
            example: "a8c2b719-17ea-40b4-a4f1-cd1fc8366f51",
          },
          qty: {
            type: "number",
            example: 2,
          },
          orderPrice: {
            type: "number",
            example: 199998,
          },
          status: {
            type: "string",
            example: "pending",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2023-01-01T00:00:00.000Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2023-01-01T00:00:00.000Z",
          },
        },
      },
    },
  },
};

export default swaggerDocument;
