import * as winston from 'winston'; // 로깅 라이브러리
import * as path from 'path'; // 파일 경로 설정
import DailyRotateFile from 'winston-daily-rotate-file'; // 로그를 일 별 정리하는 winston 플러그인

const logDir = path.join(__dirname, '../../logs'); // 로그를 저장할 경로

// 레벨별 로그파일 생성
const dailyOptions = (level: string) => {
  return {
    level: level,
    datePattern: 'YYYY-MM-DD',
    dirname: path.join(logDir, level), // 로그 레벨별로 디렉토리 분리
    filename: `%DATE%.${level}.csv`,
    maxFiles: '30d', // 로그 파일 저장 일 수
    zippedArchive: true, // 오래된 로그파일 압축
  };
};

// 로그 출력 위치 설정
const transports = [
  new DailyRotateFile(dailyOptions('error')),
  new DailyRotateFile(dailyOptions('info')),

  // 콘솔에 로그 출력
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(), // 로그 레벨에 따라 색상 추가
      winston.format.printf(
        (info) => `${info.timestamp} [ ${info.level} ]: ${info.message}`,
      ),
    ),
  }),
];

// 로그 기본 포맷 정의
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // 시간
  winston.format.errors({ stack: true }), //
  winston.format.printf(
    (info) =>
      `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`,
  ),
);

// 로거 옵션 내보내기
export const winstonOptions: winston.LoggerOptions = {
  format: logFormat,
  transports,
};
