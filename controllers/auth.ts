
import  User from '../models/user';
import  bcrypt from 'bcrypt';
import  passport from 'passport';
import { RequestHandler } from 'express';


const  join :RequestHandler = async (req,res,next)=>{
 const { nick, email,password} = req.body;

 try{
    const exUser = await User.findOne({where:{email}});
    if(exUser){
        return res.redirect('/join?error=exist');
    }   
    const hash = await bcrypt.hash(password,12);
    await User.create({
        email,
        nick,
        password:hash,
    });
    return res.redirect('/');
 }catch(error){
     console.error(error);
     next(error);
 }  ;
}
const login :RequestHandler= (req,res,next)=>{
 passport.authenticate('local',(authError:any ,user :Express.User,info:{message?:string})=>{
    if(authError){
        console.error(authError);
        return next(authError);
    }
    if(!user){ //서버실패
        return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user,(loginError)=>{ // 로그인성공
        if(loginError){
            console.error(loginError);
            return next(loginError);
        }
        return res.redirect('/');
    })
 })(req,res,next);
}
const logout :RequestHandler = (req,res,error)=>{ //로그아웃, req.logout() 메서드를 사용 
    req.logout(()=>{ // req.logout() 메서드를 사용, 세션을 제거
        res.redirect('/');
    })
}

export { join, login, logout };