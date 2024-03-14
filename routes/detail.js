const router = require('express').Router()
const { ObjectId } = require('mongodb')
let connectDB = require('./../database.js')
// mongodb 연결 코드
let db
connectDB.then((client)=>{
  console.log('detail.js DB연결성공')
  db = client.db('forum')
}).catch((err)=>{
  console.log(err)
})

// 상세페이지
router.get('/detail/:id', async (req, res) => {
    let result = await db.collection('post').findOne({ _id : new ObjectId(req.params.id) })
    let login_user = req.user
    res.render('detail.ejs', {result: result, login_user:login_user})
})

module.exports = router 