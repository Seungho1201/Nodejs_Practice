const router = require('express').Router()
const { ObjectId } = require('mongodb')
let connectDB = require('./../database.js')
// mongodb 연결 코드
let db
connectDB.then((client)=>{
  console.log('edit.js DB연결성공')
  db = client.db('forum')
}).catch((err)=>{
  console.log(err)
})

// 게시글 수정
router.get('/edit/:id', async (req, res) => {
    let result = await db.collection('post').findOne({ _id : new ObjectId(req.params.id) })
    res.render('edit.ejs', {result: result})
})
router.post('/edit', async (req, res) => {
    // updateOne({수정할 DB}, {$set{바꿀거}}) (DB ID를 가져와서 수정 ))
    await db.collection('post').updateOne({ _id : new ObjectId(req.body.id)},
    {$set : { title : req.body.title, 
            content : req.body.content}})
    console.log("데이터 수정 완료")
    res.redirect('/list/1')
})

module.exports = router 