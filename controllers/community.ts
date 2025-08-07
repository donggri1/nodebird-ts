import { RequestHandler } from 'express';
import Community from '../models/community';
import { User } from '../models';

const createCommunityPost: RequestHandler = async (req, res, next) => {
    const { title, content } = req.body;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(403).send('로그인이 필요합니다.');
    }

    try {
        await Community.create({
            title,
            content,
            UserId: userId,
        });
        res.redirect('/community');
    } catch (error) {
        console.error(error);
        next(error);
    }
};
const updateCommunityPost: RequestHandler = async (req, res, next) => {
    // URL 파라미터에서 게시글 ID를 가져옵니다. (예: /community/123 에서 123)
    const postId = req.params.id;
    // 요청 본문(body)에서 수정할 게시글의 제목과 내용을 가져옵니다.
    const { title, content } = req.body;
    // 현재 로그인한 사용자의 ID를 가져옵니다. (req.user는 passport 미들웨어를 통해 설정됩니다.)
    const userId = req.user?.id;

    try {
        // 데이터베이스에서 해당 ID의 게시글을 찾습니다.
        const post = await Community.findOne({ where: { id: postId } });

        // 게시글이 존재하지 않으면 404 에러를 응답합니다.
        if (!post) {
            return res.status(404).send('게시글을 찾을 수 없습니다.');
        }

        // 게시글 작성자와 현재 로그인한 사용자가 다른 경우, 수정 권한이 없으므로 403 에러를 응답합니다.
        if (post.UserId !== userId) {
            return res.status(403).send('게시글을 수정할 권한이 없습니다.');
        }

        // 게시글의 제목과 내용을 업데이트합니다.
        // 첫 번째 인자는 업데이트할 필드와 값, 두 번째 인자는 업데이트할 레코드를 찾는 조건입니다.
        await Community.update({ title, content }, { where: { id: postId } });
        // 수정이 완료되면 자유게시판 목록 페이지로 리다이렉트합니다.
        res.redirect('/community');
    } catch (error) {
        // 에러 발생 시 콘솔에 에러를 기록하고 다음 미들웨어로 에러를 전달합니다.
        console.error(error);
        next(error);
    }
};

const deleteCommunityPost: RequestHandler = async (req, res, next) => {
    // URL 파라미터에서 게시글 ID를 가져옵니다.
    const postId = req.params.id;
    // 현재 로그인한 사용자의 ID를 가져옵니다.
    const userId = req.user?.id;

    try {
        // 데이터베이스에서 해당 ID의 게시글을 찾습니다.
        const post = await Community.findOne({ where: { id: postId } });

        // 게시글이 존재하지 않으면 404 에러를 응답합니다.
        if (!post) {
            return res.status(404).send('게시글을 찾을 수 없습니다.');
        }

        // 게시글 작성자와 현재 로그인한 사용자가 다른 경우, 삭제 권한이 없으므로 403 에러를 응답합니다.
        if (post.UserId !== userId) {
            return res.status(403).send('게시글을 삭제할 권한이 없습니다.');
        }

        // 데이터베이스에서 해당 ID의 게시글을 삭제합니다.
        await Community.destroy({ where: { id: postId } });
        // 삭제가 완료되면 자유게시판 목록 페이지로 리다이렉트합니다.
        res.redirect('/community');
    } catch (error) {
        // 에러 발생 시 콘솔에 에러를 기록하고 다음 미들웨어로 에러를 전달합니다.
        console.error(error);
        next(error);
    }
};

export  { createCommunityPost, updateCommunityPost, deleteCommunityPost };
