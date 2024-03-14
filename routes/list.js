const router = require('express').Router()
const { ObjectId } = require('mongodb')
let connectDB = require('./../database.js')
// mongodb 연결 코드
let db
connectDB.then((client)=>{
  console.log('list.js DB연결성공')
  db = client.db('forum')
}).catch((err)=>{
  console.log(err)
})

// list 페이지 랜더
// router.get('/list', async (req, res) => {
//     // DB 'post' 데이터 result 변수를 list에 적용
//     let result = await db.collection('post').find().toArray()
//     res.render('list.ejs', {list : result})
// })

router.get('/list/:id', async (req, res) => {
    // 1번부터 5번 글 찾아서 result 변수 저장
    let result = await db.collection('post').find().skip(5*(req.params.id - 1)).limit(5).toArray()
    let pagelength = await db.collection('post').find().toArray()
    let login_user = req.user

    res.render('list.ejs', {list : result, page: pagelength, login_user : login_user})
})

module.exports = router 