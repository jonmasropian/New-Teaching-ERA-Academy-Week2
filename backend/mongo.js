require('dotenv').config();
const { MongoClient } = require('mongodb');
 
const client = new MongoClient(process.env.MONGO_URI);
let db;
 
async function connectMongo() {
  await client.connect();
  db = client.db('helpdesk_db');
  console.log('Connected to MongoDB — helpdesk_db');
}
 
function getMongo() {
  return db;
}
 
module.exports = { connectMongo, getMongo };