const express = require('express')
const app = express()

const bcrypt = require('bcrypt')
const MongoStore = require('connect-mongo')

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs') 

app.use(express.json())
app.use(express.urlencoded({extended:true})) 

// env
require('dotenv').config() 

// 회원가입
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')
// 세션 DB 저장
app.use(passport.initialize())
app.use(session({
  secret: '암호화에 쓸 비번',
  resave : false,
  saveUninitialized : false,
  store : MongoStore.create({
    mongoUrl : process.env.DB_URL,
    dbname : 'forum'
  })
}))

app.use(passport.session()) 

const { MongoClient } = require('mongodb')
const { ObjectId } = require('mongodb')

let connectDB = require('./database.js')
// mongodb 연결 코드
let db
connectDB.then((client)=>{
  console.log('DB연결성공')
  db = client.db('forum')

  app.listen(process.env.PORT, () => {
    console.log('http://localhost:8080 에서 서버 실행중')
  })
}).catch((err)=>{
  console.log(err)
})
// 바뀌는거 테스트
// Router api 분리
app.use('/', require('./routes/list.js') )
app.use('/', require('./routes/detail.js') )
app.use('/', require('./routes/write.js') )
app.use('/', require('./routes/edit.js') )
app.use('/', require('./routes/delete.js') )


// 로그인 검사
passport.use(new LocalStrategy(async (입력한아이디, 입력한비번, cb) => {
  let result = await db.collection('user').findOne({ username : 입력한아이디})
  if (!result) {
    return cb(null, false, { message: '아이디 DB에 없음' })
  }
  if (await bcrypt.compare(입력한비번, result.password)) {
    console.log("테스트");
    return cb(null, result)
    
  } else {
    return cb(null, false, { message: '비번불일치' });
  }
}))

passport.serializeUser((user, done) => {
  // 내부코드 비동기적 처리
  process.nextTick(() => {
    done(null, { id: user._id, username: user.username })
  })
})
// 유저가 보낸 쿠키 분석
passport.deserializeUser(async(user, done) => {
  let result = await db.collection('user').findOne({_id : new ObjectId(user.id) })
  delete result.password
  process.nextTick(() => {
    return done(null, result)
  })
})

// 로그인
app.get('/login', async (req, res) => {
  res.render('login.ejs')
  console.log(req.user)
})

app.post('/login', async (req, res, next) => {
  passport.authenticate('local', (error, user, info) => {
      if (error) return res.status(500).json(error)
      if (!user) return res.status(401).json(info.message)
      req.logIn(user, (err) => {
        if (err) return next(err)
        res.redirect('/list/1')
      })
  })(req, res, next)

}) 

// 회원가입
app.get('/register', async (req, res) => {
  res.render('register.ejs')
  console.log(req.user)
})

app.post('/register', async (req, res) => {
  // 해쉬 bcrypt
  let hashData = await bcrypt.hash(req.body.password, 10)
  // 중복 데이터 검사
  let compare = await db.collection('user').findOne({
    username : req.body.username
  })
  if(compare == null){
    await db.collection('user').insertOne({
      username : req.body.username, 
      password : hashData
    })
    res.redirect('list/1')
    console.log('가입 완료')
  } else {
    console.log("중복된 ID")
  }
})



