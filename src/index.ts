import Fastify from "fastify";
 import { sequelize } from "./config/db.config.js";
 import userRoutes from "./routes/user.routes.js";
 import addressRoutes from "./routes/address.routes.js";
 import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

const app = Fastify({ logger: true });


app.get("/", async () => {
    return { message: "Welcome to the Fastify Sequelize API" };
});

async function f(){

    await app.register(swagger, { 
        openapi: {
            info: {
                title: "CRUD Operations API  Fastify + MySQL",
                description: "API documentation for Users and Addresses CRUD",
                version: "1.0.0",
            },
            servers: [{ url: "http://localhost:3000", description: "Local Server" }],
        },
    });
}

await f();

await app.register(swaggerUI, {
 routePrefix: "/docs",
 uiConfig: {
   docExpansion: "full",
   deepLinking: false,
   },
});
app.register(userRoutes);
app.register(addressRoutes);
const start = async () => {
  try {
    // Connect & sync DB
    await sequelize.authenticate();
    await sequelize.sync();
    console.log(" Database connected and synchronized!");

    // Start server correctly for Fastify v5
    const port = Number(process.env.PORT) || 5000;
    await app.listen({ port: Number(process.env.PORT) || 5000 });
    console.log(` Server running at http://localhost:${port}`);
  } catch (err) {
    console.error(" Error starting server:", err);
    process.exit(1);
  }
};

// Call start()
start();
