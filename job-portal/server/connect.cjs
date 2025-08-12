const { MongoClient } = require('mongodb');
require('dotenv').config({ path: './config.env' });

async function main() {
    const DB = process.env.ATLAS_URL;
    console.log("🔌 Connecting to MongoDB...");

    const client = new MongoClient(DB);

    try {
        await client.connect();
        console.log("✅ Connected successfully to MongoDB");

        const collections = await client.db('PersonalDetails').collections();

        if (collections.length === 0) {
            console.log("⚠️ No collections found in 'PersonalDetails' database.");
        } else {
            collections.forEach((collection) => {
                console.log(`📄 Collection Name: ${collection.collectionName}`);
            });
        }
    } catch (error) {
        console.error('❌ Error connecting to the database:', error);
    } finally {
        await client.close();
        console.log("🔒 MongoDB connection closed.");
    }
}

main();
