import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { createCommunityPost, getCommunityPost, updateCommunityPost, deleteCommunityPost, renderEditForm, createComment, deleteComment } from '../controllers/community';
import { isLoggedIn } from '../middlewares';

const router = express.Router(); // 커뮤니티 관련 라우터
console.log('community router loaded');
try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// GET /community/:id/edit - 게시글 수정 페이지
router.get('/:id/edit', isLoggedIn, renderEditForm);

// GET /community/:id - 특정 게시글 조회
router.get('/:id', getCommunityPost);

// POST /community - 새 글 작성
router.post('/', isLoggedIn, upload.single('img'), createCommunityPost); // 커뮤니티 글 작성

// PUT /community/:id - 게시글 수정
router.put('/:id', isLoggedIn, updateCommunityPost); // 특정 ID의 커뮤니티 글 수정

// DELETE /community/:id - 게시글 삭제
router.delete('/:id', isLoggedIn, deleteCommunityPost); // 특정 ID의 커뮤니티 글 삭제

// POST /community/:id/comment - 댓글 작성
router.post('/:id/comment', isLoggedIn, createComment);

// DELETE /community/:id/comment/:commentId - 댓글 삭제
router.delete('/:id/comment/:commentId', isLoggedIn, deleteComment);

export default router; // 커뮤니티 라우터
