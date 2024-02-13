import * as winston from 'winston'; // 로깅 라이브러리
import { utilities as nestWinstonModuleUtilities } from 'nest-winston'; // nest에서 winston 사용하게 해주는 유틸리티
import * as fs from 'fs'; // 파일 시스템
import * as path from 'path'; // 파일 경로 설정

// 로그 파일을 저장할 폴더가 없는 경우 생성
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// 로그 포맷 정의
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // 시간
  winston.format.errors({ stack: true }), //
  winston.format.printf(
    (info) =>
      `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`, // 시간, 로그 레벨, 메시지
  ),
);

// 에러 레벨의 로그 저장
const transports: winston.transport[] = [
  new winston.transports.File({
    filename: path.join(logDir, 'error.log'),
    level: 'error',
  }),
];

// 개발 환경에서 콘솔로도 로그 출력
if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // 로그 색상 설정
        nestWinstonModuleUtilities.format.nestLike(), // nest 스타일로 로그 포맷
      ),
    }),
  );
}

// 로거 옵션 내보내기
const loggerOptions: winston.LoggerOptions = {
  level: 'debug',
  format: logFormat,
  transports,
};

export default loggerOptions;
