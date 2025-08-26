const swaggerDocument = {
  swagger: "2.0",
  info: {
    title: "Sample API",
    description: "A simple API to demonstrate Swagger UI Express",
    version: "1.0.0",
  },
  host: "localhost:3000",
  basePath: "/api",
  schemes: ["http"],
  paths: {
    "/hello": {
      get: {
        summary: "Returns a greeting",
        description: "A simple GET endpoint that returns a greeting message",
        responses: {
          "200": {
            description: "Successful response",
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Hello, world!",
                },
              },
            },
          },
        },
      },
    },
  },
};

export default swaggerDocument;
