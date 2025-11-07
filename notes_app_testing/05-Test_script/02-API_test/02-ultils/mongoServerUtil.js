import mongoose from "mongoose";

let appMongoose;

export async function connectDB() {
    const uri = process.env.MONGODB_URI;
    
    // Because app and test use seperate mongoose instance, so both instance must be connected

    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(uri);
        console.log("Test's mongoose connected");
        await mongoose.connection.asPromise();
        console.log("Test's mongoose ready");
    }

    const { default: User } = await import("../../../../notes_app/src/models/User.js");
    appMongoose = User.db.base;
    if (appMongoose.connection.readyState === 0) {
        await appMongoose.connect(uri);
        console.log("✅ App's mongoose connected!");
    }
}

export async function closeDB() {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
        console.log("Test's mongoose stopped");
    }

    if (appMongoose.connection.readyState !== 0) {
        await appMongoose.connection.close();
        console.log("App's mongoose stopped");
    }

    console.log("DB stopped");
}