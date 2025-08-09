import express, { ErrorRequestHandler } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';   
import path from 'path';   
import session from 'express-session'; 
import nunjucks from 'nunjucks';
import dotenv from 'dotenv';
import passport from 'passport';

dotenv.config(); // .env 파일을 읽어서 process.env 로 만듬
import pageRouter from './routes/page';
import authRouter from './routes/auth';
import passportConfig from './passport';
import postRouter from './routes/post';
import {sequelize} from './models';
import userRouter from './routes/user';

import communityRouter from './routes/community';

const app = express();
passportConfig();
app.set('port',process.env.PORT || 8001);
app.set('view engine','html');
nunjucks.configure('views',{
    express:app,
    watch:true,
});
// 데이터베이스 연결
// sequelize.sync()는 데이터베이스와 모델을 동기화합니다.
// force: true 옵션을 사용하면 기존 테이블을 삭제하고 새로 생성합니다.
// 개발 중에는 유용하지만, 배포 시에는 false로 설정해야 합니다.
// sequelize.sync()는 비동기 함수이므로, then()과 catch()를 사용
sequelize.sync({ force: false }) // force: true로 설정하면 기존 테이블을 삭제하고 새로 생성합니다. 배포시에는 false로 설정해야 합니다. 하는 이유는 개발 중에만 테이블을 새로 만들기 위함입니다.
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan('dev')); // 로그를 남김, dev, combined, common, short, tiny , morgan(format) 형식으로도 가능, 개발시 dev, 배포시 combined
app.use(express.static(path.join(__dirname,'public'))); // 정적 파일 제공
// app.use('/img',express.static(path.join(__dirname,'uploads'))); // 정적 파일 제공
app.use('/uploads',express.static(path.join(__dirname,'uploads'))); // 정적 파일 제공
app.use(express.json());//   body-parser 대체, json 형식으로 데이터를 받음
app.use(express.urlencoded({extended:false})); // body-parser 대체
app.use(cookieParser(process.env.COOKIE_SECRET)); // 쿠키를 암호화 하기 위한 키값

app.use(session({
    resave:false,
    saveUninitialized:false,// 세션에 저장할 내역이 없어도 저장할지 물어봄
    secret:process.env.COOKIE_SECRET!, // 쿠키를 암호화 req 하기 위한 키값
    cookie:{
        httpOnly:true,
        secure:false,
        
    }
}));
app.use(passport.initialize()) ;// passport를 초기화, req 객체에 passport 설정을 심음
app.use(passport.session()); // express-session 보다 아래에 있어야함, 세션을 사용하기 때문에

import methodOverride from 'method-override'; // 추가
app.use(methodOverride('_method')); // 추가: _method 쿼리 파라미터 또는 폼 필드를 사용하여 HTTP 메서드를 오버라이드

app.use('/',pageRouter);
app.use('/auth',authRouter);
app.use('/post',postRouter);
app.use('/user',userRouter);
app.use('/community', communityRouter);

app.use((req,res,next)=>{
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다..`);
    error.status = 404;
    next(error);
});

const errorHandler :ErrorRequestHandler = (err,req,res,next)=>{
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};// 개발환경일때만 에러를 보여줌, 배포시에는 에러를 보여주지 않음
    res.status(err.status ||500);
    res.render('error');
}
app.use(errorHandler); // 에러 핸들러 미들웨어, 마지막에 위치해야함


export default app; // app.js를 모듈로 내보냄, 서버를 실행하기 위해서 사용함


