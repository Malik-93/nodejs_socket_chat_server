const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
main().then(res => console.log("Database connected successfully...!!!"))
main().catch(err => console.log(`An error accured during database connection:`, err));

async function main() {
  const DATABASE_URL = process.env.NODE_ENV === 'development' ? `mongodb://0.0.0.0:27017/chatbes_server` : `${process.env.CLOUD_DATABASE_URL}`
  await mongoose.connect(DATABASE_URL);
}