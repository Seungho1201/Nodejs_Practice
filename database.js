const { MongoClient } = require('mongodb')

// mongodb 연결 코드
let db
const url = process.env.DB_URL  // env 
let connectDB = new MongoClient(url).connect()

module.exports = connectDB
