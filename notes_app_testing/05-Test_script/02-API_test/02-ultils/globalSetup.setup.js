import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

/**
 * Setup MongoDB Memory Server before any tests run.
 * 
 * This solves the 30-second timeout issue by creating the test database
 * BEFORE the app imports and tries to connect to MongoDB.
 * 
 * Without this setup, MongoStore in app.js would try to connect to
 * process.env.MONGODB_URI before it's set, causing the connection to hang.
 * 
 * Flow:
 * 1. This file runs first (via globalSetup in jest.config.js): 
 * use process.env to shared var string for test, globalThis to shared for teardown
 * 2. Creates MongoDB Memory Server and sets process.env.MONGODB_URI
 * 3. Then test files import app.js, which uses the test database URI
 * 4. Tests run fast with proper database connection
 */
export default async function globalSetup() {
    let mongoServer;
    
    console.log("=== JEST SETUP STARTING ===");
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri("testdb");
    
    process.env.MONGODB_URI = uri;
    globalThis.__MONGO_SERVER__ = mongoServer;
    
    console.log("=== JEST SETUP COMPLETE ===");
    console.log("Global test DB setup complete:", uri);
}

