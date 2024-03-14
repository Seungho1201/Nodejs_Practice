const router = require('express').Router()
let connectDB = require('./../database.js')
// mongodb 연결 코드
let db
connectDB.then((client)=>{
  console.log('write.js DB연결성공')
  db = client.db('forum')
}).catch((err)=>{
  console.log(err)
})

router.get('/write', async (req, res) => {
  if(req.user === null){
    console.log('로그인 하셈')
  } else{
    console.log(req.user)
    res.render('write.ejs')
  }
  
})

router.post('/add', async(req, res) => {
  // DB에 저장
  await db.collection('post').insertOne({
      title: req.body.title, 
      content: req.body.content,
      user : req.user._id,
      username : req.user.username 
    })
    console.log("데이터 추가 완료")
  res.redirect('/list/1')
})

module.exports = router 