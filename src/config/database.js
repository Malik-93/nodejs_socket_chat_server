const mongoose = require('mongoose');

main().then(res => console.log("Connected to database successfully...!!!"))
main().catch(err => console.log(`An error accured during database connection:`, err));

async function main() {
  const DATABASE_URL = process.env.NODE_ENV === 'development' ? `mongodb://0.0.0.0:27017/jovi_chat_server` : `${process.env.CLOUD_DATABASE_URL}`
  await mongoose.connect(DATABASE_URL);
}

