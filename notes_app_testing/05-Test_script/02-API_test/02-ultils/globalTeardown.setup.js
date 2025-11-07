import mongoose from "mongoose";

export default async function globalTeardown() {
    console.log("Global MongoServer object:", globalThis.__MONGO_SERVER__);
    console.log("=== JEST TEARDOWN STARTING ===");

    if (globalThis.__MONGO_SERVER__) {
        console.log("Stopping global MongoServer...");
        await globalThis.__MONGO_SERVER__.stop();
        console.log("Global test DB stopped");
    }

    console.log("Global MongoServer object:", globalThis.__MONGO_SERVER__);
    console.log("=== JEST TEARDOWN COMPLETE ===");
    await new Promise(resolve => setTimeout(resolve, 100));
}