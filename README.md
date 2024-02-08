<p align="center">
  <img src="https://postfiles.pstatic.net/MjAyNDAyMDFfOTcg/MDAxNzA2Nzc2MzgwODY5.o4trv2TkTycT-E_-bBYnlpI5-BPZeB0eMp7TdybUxPQg.PCetaFXlL-Jc8eieJ-OT13ooa7WEjBHDMpod1nfUxbog.PNG.dkdud530/gola.png?type=w966" width="200" alt="Nest Logo" />
</p>

<p align="center">
  <img  src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white">
  <img  src="https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=NestJS&logoColor=white">
  <img  src="https://img.shields.io/badge/Typescript-3178c6?style=flat-square&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/TypeORM-FE3A2F?style=flat-square&logo=TypeORM&logoColor=white">
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=Axios&logoColor=white">
  <img src="https://img.shields.io/badge/JWT-000000?style=flat-square&logo=JSON%20web%20tokens&logoColor=white">
  <img src="https://img.shields.io/badge/Puppeteer-40B5A4?style=flat-square&logo=Puppeteer&logoColor=white">
  <img src="https://img.shields.io/badge/JMeter-9CCA42?style=flat-square&logo=Apache%20JMeter&logoColor=white">
  <img src="https://img.shields.io/badge/Winston-FF6B6B?style=flat-square&logo=Winston&logoColor=white">
  <img src="https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=Redis&logoColor=white">
</p>
<p align="center">
  <img src="https://img.shields.io/badge/Toss%20Payment-0055FF?style=flat-square&logo=Toss&logoColor=white">
  <img src="https://img.shields.io/badge/Google%20Login-4285F4?style=flat-square&logo=Google&logoColor=white">
  <img src="https://img.shields.io/badge/Naver%20Login-03C75A?style=flat-square&logo=Naver&logoColor=white">
  <img src="https://img.shields.io/badge/Kakao%20Login-FFCD00?style=flat-square&logo=Kakao&logoColor=white">
  <img src="https://img.shields.io/badge/EC2-FF9900?style=flat-square&logo=amazon-aws&logoColor=white">
  <img src="https://img.shields.io/badge/Load%20Balancer-FF9900?style=flat-square&logo=amazon-aws&logoColor=white">
  <img src="https://img.shields.io/badge/Route%2053-FF9900?style=flat-square&logo=amazon-aws&logoColor=white">
</p>

## 👋 About

<P><a href="https://ilovegohyang.go.kr/goods/index-main.html">고향사랑 기부 제도</a>의 데이터를 기반으로 여러 기능들을 추가한 쇼핑몰 프로젝트 입니다</P>
<p><a href="https://lanlanlooo.notion.site/dfb0d709805b4ab291ace70c77fa9cbd?pvs=4">프로젝트 상세 내용 보기🕺</a></p>

## 👩‍💻 Team Members

<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://github.com/choisooyoung-dev"><img src="https://avatars.githubusercontent.com/u/146846913?v=4" width="100px;" alt=""/><br /><sub><b> 리더 : 정창일 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/0602kimminsoo"><img src="https://avatars.githubusercontent.com/u/54698039?v=4" width="100px;" alt=""/><br /><sub><b> 부리더 : 이아영 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/asdfg20564"><img src="https://avatars.githubusercontent.com/u/44521546?v=4" width="100px;" alt=""/><br /><sub><b> 팀원 : 권유진 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/smy1308"><img src="https://avatars.githubusercontent.com/u/146905861?v=4" width="100px;" alt=""/><br /><sub><b> 팀원 : 손민영 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/zmjjkk98"><img src="https://avatars.githubusercontent.com/u/146824635?v=4" width="100px;" alt=""/><br /><sub><b> 팀원 : 하정현 </b></sub></a><br /></td>
    </tr>
  </tbody>
</table>

## ✨ Preview

[![YouTube 비디오](https://img.youtube.com/vi/3P4Wx0NaEwQ/0.jpg)](https://www.youtube.com/watch?v=3P4Wx0NaEwQ)

<a href="https://visitor17564.github.io/GOSAGI_front/">직접 체험하기</a>

## 🧩 Features

- **기본적인 쇼핑몰 기능**: 로그인, 회원가입, 상품 등록, 상품 조회, 상품 결제(toss) 등

- **JWT**: 정보 보안을 위하여 JWT 토큰을 사용

- **Puppteer**: 고향 사랑 이음 페이지의 상품 정보들을 크롤링하여 사용

- **Docker**: MSA 구현, 개발 환경을 통일하여 협업 효율 증진, 가상 머신에 비해 가볍고 빠른 배포/확장 진행

- **JMeter**: 테스팅 시나리오 구현, 대용량 트래픽 처리, 테스트 결과를 그래프와 차트로 확인

- **Winston**: 에러 로깅 후 로그를 분석하여 자주 발생하는 오류 체크

## 📚 How to use

### env

```
# Database
DB_HOST = "DB URL"
DB_PORT = "DB PROT"
DB_USERNAME = "DB USERNAME"
DB_PASSWORD = "DB PASSWORD"
DB_NAME = "DB NAME"
DB_SYNC = true
PORT = 3000

# JWT Secret Key
JWT_SECRET_KEY=""

# Redis Cloud
REDIS_HOST = "DB URL"
REDIS_PORT = "DB PORT"
REDIS_USERNAME = "DB USERNAME"
REDIS_PASSWORD = "DB PASSWORD"

# Kakao Auth
KAKAO_KEY = ""
KAKAO_CLIENT_SECRET = ""
KAKAO_REDIRECT = ""

# Naver Auth
NAVER_CLIENT_ID = ""
NAVER_CLIENT_SECRET = ""
NAVER_CALLBACK_URL = ""

# Google Auth
GOOGLE_CLIENT_ID = ""
GOOGLE_CLIENT_SECRET = ""
GOOGLE_CALLBACK_URL = ""

# Toss 테스트 키
TOSS_TEST_KEY = "TOSS PAYMENT KEY"
```

### Install package

```bash
npm i
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```
