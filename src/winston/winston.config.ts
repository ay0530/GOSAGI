import * as winston from 'winston'; // 로깅 라이브러리
import * as path from 'path'; // 파일 경로 설정
import DailyRotateFile from 'winston-daily-rotate-file';

const logDir = path.join(__dirname, '../../logs');

const dailyOptions = (level: string) => {
  return {
    level: level,
    datePattern: 'YYYY-MM-DD',
    dirname: path.join(logDir, level), // 로그 레벨별로 디렉토리 분리
    filename: `%DATE%.${level}.log`,
    maxSize: '1m', //최대 로그 파일 용량
    maxFiles: '30d', // 최대 30일치 로그 파일 저장
  };
};

const transports = [
  // 로그 레벨별로 DailyRotateFile 인스턴스 생성
  new DailyRotateFile(dailyOptions('error')),
  new DailyRotateFile(dailyOptions('info')),

  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(
        (info) =>
          `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`,
      ),
    ),
  }),
];

// 로그 포맷 정의
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // 시간
  winston.format.errors({ stack: true }), //
  winston.format.printf(
    (info) =>
      `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`, // 시간, 로그 레벨, 메시지
  ),
);

// 로거 옵션 내보내기
export const winstonOptions: winston.LoggerOptions = {
  format: logFormat,
  transports,
};
