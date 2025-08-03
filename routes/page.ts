import express from  'express';
import {renderJoin,renderMain,renderProfile,renderHashtag ,renderCommunity} from  '../controllers/page';
import { isLoggedIn, isNotLoggedIn } from  '../middlewares';
const  router =  express.Router();

router.use((req,res,next)=>{
    res.locals.user = req.user;
    res.locals.followerCount = req.user?.Followers?.length;
    res.locals.followingCount = req.user?.Followings?.length;
    res.locals.followingIdList = req.user?.Followings?.map(f=>f.id) || [];
    next();
});

router.get('/profile',isLoggedIn,renderProfile);
router.get('/join',isNotLoggedIn,renderJoin);
router.get('/',renderMain);
router.get('/hashtag',renderHashtag); // hashtag?hashtag=고양이이
router.get('/community',renderCommunity); // 커뮤니티 페이지

export default router;