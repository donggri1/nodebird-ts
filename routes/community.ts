import express from 'express';
import { isLoggedIn } from '../middlewares';
import { createCommunityPost, updateCommunityPost, deleteCommunityPost } from '../controllers/community';

const router = express.Router(); // 커뮤니티 관련 라우터

// POST /community - 새 글 작성
router.post('/', isLoggedIn, createCommunityPost); // 커뮤니티 글 작성

// PUT /community/:id - 게시글 수정
router.put('/:id', isLoggedIn, updateCommunityPost); // 특정 ID의 커뮤니티 글 수정

// DELETE /community/:id - 게시글 삭제
router.delete('/:id', isLoggedIn, deleteCommunityPost); // 특정 ID의 커뮤니티 글 삭제

export default router; // 커뮤니티 라우터
