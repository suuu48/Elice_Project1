/**
 * Node.js 프로세스(어플리케이션)을 실행하는 데에 있어서 필요한 설정 변수들의 하나의 객체로 모아주는 모듈
 * 각 모듈들은 이 모듈을 require하여 필요한 설정 변수들을 사용한다.
 * 중앙 설정 변수 관리소 개념.
 */
const dotenv = require('dotenv'); //?
const AppError = require('../misc/AppError');
const commonErrors = require('../misc/commonErrors');

process.env.NODE_ENV = process.env.NODE_ENV ?? 'development';
console.log(
  `어플리케이션 서버를 다음 환경으로 시작합니다: ${process.env.NODE_ENV}`
);

const envFound = dotenv.config(); // dotenv를 사용하여 환경 변수도 읽어온다.
// .env 파일이 없으면 에러를 던진다
if (envFound.error) {
  throw new AppError(
    commonErrors.configError,
    "Couldn't find .env file",
    false
  );
}

// mongoDB 연결을 위한 URI값이 있는 지 체크
if (process.env.MONGODB_URI === undefined) {
  throw new AppError(
    commonErrors.configError,
    500,
    '어플리케이션을 시작하려면 Mongo DB URI(MONGODB_URI) 환경변수가 필요합니다.'
  );
}

module.exports = {
  // applicationName: process.env.APPLICATION_NAME ?? "app", // 어플리케이션 이름

  port: parseInt(process.env.PORT ?? '3000', 10), // 어플리케이션이 바인딩되는 포트

  mongoDBUri: process.env.MONGODB_URI, // mongoDB 연결 주소
};
