const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Real Estate Listing Platform API",
      version: "1.0.0",
      description:
        "API documentation for Real Estate backend (Auth, Properties, Inquiries)",
    },
    servers: [
      {
        // url: "5000",
        // url: "http://localhost:5000",
        url: `http://localhost:${process.env.API_URL}`,
        // process.env.API_URL
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("Swagger Docs available at http://localhost:5000/api-docs");
};

module.exports = swaggerDocs;
