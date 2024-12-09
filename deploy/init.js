const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();

    const db = client.db(process.env.MONGO_INITDB_DATABASE);
    const initDir = path.resolve(__dirname, 'mongodb-init');

    // Get all JSON files from the 'mongodb-init' directory
    const jsonFiles = fs.readdirSync(initDir).filter(file => file.endsWith('.json'));

    for (const file of jsonFiles) {
      const filePath = path.join(initDir, file);
      const data = require(filePath);
      const collectionName = file.replace('.json', '');
      await db.collection(collectionName).insertMany(data);
    }
  } finally {
    await client.close();
  }
}

run().catch(console.error);
