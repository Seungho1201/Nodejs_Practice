const router = require('express').Router()
const { ObjectId } = require('mongodb')
let connectDB = require('./../database.js')
// mongodb 연결 코드
let db
connectDB.then((client)=>{
  console.log('delete.js DB연결성공')
  db = client.db('forum')
}).catch((err)=>{
  console.log(err)
})

//게시글 삭제
router.get('/delete/:id', async (req, res) => {
    await db.collection('post').deleteOne({ 
        _id : new ObjectId(req.params.id),
    user : req.user._id })
    res.redirect('/list/1')
  })

module.exports = router 