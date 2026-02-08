import type { Express } from "express";

import logger from "@/config/logger";
import { env } from "./env-validation";

export function setupSwagger(app: Express) {
  // Only enable Swagger in development environment
  if (env.NODE_ENV === "development") {
    // Dynamic imports to avoid loading swagger packages in production
    Promise.all([
      import("swagger-jsdoc"),
      import("swagger-ui-express"),
    ]).then(([swaggerJSDoc, swaggerUi]) => {
      const options = {
        definition: {
          openapi: "3.0.0",
          info: {
            title: "Nexus API Documentation",
            version: "1.0.0",
            description: "API documentation for Nexus application",
          },
          servers: [
            {
              url: "http://localhost:3000/api",
              description: "Local Development Server",
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
        apis: ["./src/utils/swagger-docs/*.ts"],
      };

      const swaggerSpec = swaggerJSDoc.default(options);
      app.use("/api/docs", swaggerUi.default.serve, swaggerUi.default.setup(swaggerSpec));
      logger.info("Swagger Docs available at: http://localhost:3000/api/docs");
    }).catch((error) => {
      logger.error("Failed to load Swagger dependencies:", error);
    });
  } else {
    logger.info("Swagger is disabled in production environment");
  }
}
