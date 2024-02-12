const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
// import "reflect-metadata";
// import { createConnection } from 'typeorm';
// import { Product } from './entity/Product';
// 크롤링이 실패할 경우 개발자에게 연락을 취하는 로직 구현해야할 듯
// 크롤링이 실패할 경우 -> 고사기의 html 구성이 바뀌어 값들을 제대로 가져오지 못 할 때가 예상됨

// 상품 목록에서 상품 코드 크롤링하기

// 상품 상세 정보 추출
async function putProductDetail(page, productCode) {
  // 상품 상세 페이지로 이동
  await page.goto(
    `https://ilovegohyang.go.kr/items/details-main.html?code=G${productCode}`,
    { waitUntil: 'networkidle2' },
  );

  // $eval, $$eval : puppeteer의 메소드, 웹 페이지 내부의 DOM 요소에 접근함 / querySelector, querySelectorAll
  // 태그(id, class, a 등) 값으로 textContent, innerHTML 등 값 추출
  const thumbnailImages = await page.$$eval('.swiper_img img', (imgs) =>
    imgs.map((img) => img.src),
  ); // 썸네일 이미지
  const name = await page.$eval('.info_title h2 span', (name) =>
    name.textContent.trim(),
  ); // 상품명
  const description = await page.$eval('.info_title p span', (description) =>
    description.textContent.trim(),
  ); // 상품 설명
  const category = await page.$eval('.ali_breadcrumb a:nth-child(2)', (a) =>
    a.textContent.trim() ? a.textContent.trim() : null,
  ); // 카데고리
  const price = await page.$eval('.op_price, .price, .present_price', (price) =>
    price.textContent.trim().replace('P', ''),
  ); // 가격
  const origin = await page.$eval('.d_area', (content) => [
    content.innerText.trim(),
  ]);
  const business_code = await page.$eval(
    '#nav-buyer > div > div.buyer_area > div:nth-child(1) > span.ta_data > ul > li:nth-child(4) > span.data_con',
    (element) => {
      return element.textContent;
    },
  );

  const content = await page.$eval('.item_detail', (content) => [
    content.innerHTML,
  ]); // 본문 HTML

  // 상품 저장하기
  await axios
    .post('https://back.gosagi.com/goods/crawling', {
      code: Number(productCode),
      name,
      description,
      location: origin,
      category,
      point: Number(price.replace(',', '')),
      price: 0,
      business_code,
      thumbnail_image: thumbnailImages[0],
      productThumbnails: thumbnailImages.map((imageUrl) => ({
        image_url: imageUrl,
      })),
      productContents: content.map((content) => ({ content })),
    })
    .then((res) => {
      console.log('상품 저장 성공');
    })
    .catch((err) => {
      console.log(err);
    });
}

async function getProductDetail() {
  const browser = await puppeteer.launch({
    headless: true, // 브라우저를 화면이 없는 모드로 실행 -> 백그라운드에서 브라우저가 열림
    // --no-sandbox : Chromium 브라우저의 Sandbox 옵션 비활성화
    // --disable-dev-shm-usage : Chromium 브라우저의 Shared Memory 비활성화
    // Chromium 브라우저 : Chrome의 오픈 소스 버전, Puppeteer를 실행했을 때 사용됨(Puppeteer 아니어도 사용!!)
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });

  const context = await browser.createIncognitoBrowserContext(); // 시크릿 모드 설정
  const page = await context.newPage(); // 새로운 페이지 실행

  const fs = require('fs');
  fs.readFile('data.json', 'utf8', async (err, data) => {
    if (err) throw err;
    let productList = JSON.parse(data);
    for (let a = 1; a <= 1; a++) {
      for (let b = 1; b <= 12; b++) {
        try {
          await putProductDetail(page, productList[a][b]);
          await delay(1000);
        } catch (err) {
          console.log('상품 하나 터짐ㅋ');
          await delay(1000);
          continue;
        }
      }
    }
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

getProductDetail();
