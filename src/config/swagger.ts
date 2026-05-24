import swaggerJSDoc from "swagger-jsdoc";
import { Options } from "swagger-jsdoc";

const options: Options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Ecommerce API",
      version: "1.0.0",
      description:
        "Ecommerce Backend API Documentation",
    },

    servers: [
      {
        url: "http://localhost:8000",
      },
    ],
  },

  apis: ["./src/modules/**/*.ts"],
};

export const swaggerSpec =
  swaggerJSDoc(options);