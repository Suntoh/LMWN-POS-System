const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "POS System API Documentation",
      version: "1.0.0",
      description: "API documentation for the POS System application",
    },
  },
  apis: ["./src/controllers/*.js", "./src/models/*.js"], // Path to the API docs
  // You can also specify other options here
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/docs.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
  console.log("Swagger docs available at /docs");
}

module.exports = { setupSwagger };
