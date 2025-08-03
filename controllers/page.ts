import  Post from  '../models/post';
import  User from  '../models/user';
import  Hashtag from  '../models/hashtag';
import { RequestHandler } from 'express';
import { title } from 'process';

const renderProfile:RequestHandler  = (req,res,next)=>{
    // 서비스를 호출출
    res.render('profile',{title : '내 정보 - NodeBird'});
};

const renderJoin :RequestHandler  = (req,res,next)=>{
    res.render('join', {title : '회원 가입 - NodeBird'});
};

const renderMain :RequestHandler  = async (req,res,next)=>{
    try{
        const posts = await Post.findAll({
            include:{
                model:User,
                attributes:['id','nick'],
            },
            order : [['createdAt','DESC']],
        })
        res.render('main',{
            title : 'NodeBird',
            twits : posts,
        });// 서비스를 호출 twits = posts  -> twits로 넘겨줌
    }catch(error){
        console.error(error);
        next(error);
    }
};

//라우터 -> 컨트롤러 -> 서비스(요청,응답 모름)


const renderHashtag :RequestHandler  = async(req,res,next)=>{
    const query = req.query.hashtag as string; // 쿼리스트링에서 hashtag를 가져옴   // hashtag?hashtag=고양이
    if(!query){
        return res.redirect('/');
    }

    try{
        const hashtag = await Hashtag.findOne({where : {title:query}});
        let posts : Post[] = [];
        if(hashtag){
            posts =  await hashtag.getPosts({
                include :[{model: User, attributes:['id','nick']}],
                order : [['createdAt','DESC']]
            });
        }
        res.render('main',{
            title: `${query} | NodeBird`,
            twits : posts,
        })
    }catch(error){
        console.error(error);
        next(error);
    }
}

const renderCommunity:RequestHandler = async(req,res,next)=>{
    // 커뮤니티 페이지 렌더링
    // 실제로는 커뮤니티 관련 데이터를 가져와야 하지만, 여기서는 단순
    res.render('community',{
        title : 'Test page - NodeBird',
    });

}

export { renderProfile, renderJoin, renderMain, renderHashtag ,renderCommunity};