const { MongoClient } = require('mongodb');
require("dotenv").config();
const client = new MongoClient(process.env.URL_MONGOSE);

const connectToDatabase = async () => {
    try {
        await client.connect();
        return client.db(process.env.DATABASE_NAME);
    } catch (error) {
        console.error('Gagal terhubung ke DB ');
        throw error;
    }
}

module.exports = { connectToDatabase };
