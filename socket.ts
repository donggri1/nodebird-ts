
import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import session from 'express-session';

// Socket.io를 이용한 실시간 채팅 서버 설정
export default (server: HttpServer, app: any, sessionMiddleware: session.Store) => {
    // Socket.io 서버 인스턴스 생성
    const io = new Server(server, {
        path: '/socket.io', // 소켓 연결 경로 설정
        cors: {
            origin: '*', // 모든 도메인에서의 접근 허용
            credentials: true, // 인증 정보 전달 허용
        }
    });
    app.set('io', io); // app 객체에 Socket.io 인스턴스 저장

    // 세션 미들웨어를 Socket.io에서 사용할 수 있도록 래핑
    const wrap = (middleware: any) => (socket: any, next: any) => middleware(socket.request, {}, next);
    io.use(wrap(sessionMiddleware));

    // 클라이언트 연결 이벤트 처리
    io.on('connection', (socket: any) => {
        console.log('새로운 클라이언트 접속', socket.id);
        const req = socket.request;

        // 로그인 체크
        if (!req.session.user) {
            socket.emit('error', '로그인이 필요합니다.');
            socket.disconnect();
            return;
        }

        // 사용자 입장 처리
        console.log(`${req.session.user.nick}님이 입장하셨습니다.`);
        io.emit('join', {
            user: 'system',
            chat: `${req.session.user.nick}님이 입장하셨습니다.`,
        });

        // 연결 종료 이벤트 처리
        socket.on('disconnect', () => {
            console.log('클라이언트 접속 해제', socket.id);
            if (req.session && req.session.user) {
                io.emit('exit', {
                    user: 'system',
                    chat: `${req.session.user.nick}님이 퇴장하셨습니다.`,
                });
            }
        });

        // 채팅 메시지 이벤트 처리
        socket.on('chat', (data: any) => {
            if (req.session && req.session.user) {
                io.emit('chat', {
                    user: req.session.user,
                    chat: data.chat,
                });
            }
        });
    });
};