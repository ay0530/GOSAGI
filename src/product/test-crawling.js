const puppeteer = require('puppeteer');
const axios = require('axios');
// import "reflect-metadata";
// import { createConnection } from 'typeorm';
// import { Product } from './entity/Product';
// 크롤링이 실패할 경우 개발자에게 연락을 취하는 로직 구현해야할 듯
// 크롤링이 실패할 경우 -> 고사기의 html 구성이 바뀌어 값들을 제대로 가져오지 못 할 때가 예상됨

// 상품 목록에서 상품 코드 크롤링하기
async function scrapeProductCode(url) {
  const browser = await puppeteer.launch({
    headless: true, // 브라우저를 화면이 없는 모드로 실행 -> 백그라운드에서 브라우저가 열림
    // --no-sandbox : Chromium 브라우저의 Sandbox 옵션 비활성화
    // --disable-dev-shm-usage : Chromium 브라우저의 Shared Memory 비활성화
    // Chromium 브라우저 : Chrome의 오픈 소스 버전, Puppeteer를 실행했을 때 사용됨(Puppeteer 아니어도 사용!!)
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });

  const context = await browser.createIncognitoBrowserContext(); // 시크릿 모드 설정
  const page = await context.newPage(); // 새로운 페이지 실행

  await page.goto(
    'https://ilovegohyang.go.kr/users/login.html?target=%2Fmain.html', // 로그인 페이지
    // waitUntil : 페이지가 ''의 상태일 때 까지 기다림
    // networkidle2 : 네트워크 활동이 없을 때 까지 기다림
    { waitUntil: 'networkidle2' },
  );

  // 로그인
  await page.type('#id', 'hwt4oxh00v8'); // page.type : 입력
  await page.type('#pw', 'as49265504!'); // page.type : 입력
  const loginButton = await page.$x(
    '/html/body/div[1]/div/div[3]/section/div/form/div[2]/button',
  ); // 로그인 버튼의 xpath 위치
  if (loginButton.length > 0) {
    try {
      await Promise.all([
        await loginButton[0].click(), // 로그인 버튼 클릭
        await page.waitForNavigation({ waitUntil: 'networkidle2' }),
      ]);
      console.log("로그인 성공");
    } catch (e) {
      console.log(e);
    }
  }

  await page.goto('https://ilovegohyang.go.kr/goods/index-main.html', { waitUntil: 'networkidle2' }); // 상품 목록 페이지로 이동
  await page.waitForSelector('.item_img'); // .item_img가 로딩될 때 까지 대기

  const productCodeList = await page.evaluate(() => {
    const goodsItems = document.querySelectorAll('.goods-list-items');
    const productCodeList = [];

    goodsItems.forEach(item => {
      const img = item.querySelector('.item_img');
      if (img) {
        const imgSrc = img.getAttribute('src');
        const match = imgSrc.match(/G(\d+)/);
        const productCode = match[1];
        productCodeList.push(productCode);
      }
    });

    return productCodeList;
  });

  // 목록에서 크롤링 한 데이터들 상품 코드들로 반복문 돌려서 뽑아내기!
  // 일단 12개만 하자
  for (const productCode of productCodeList) {
    // 로그인 후 지정된 URL로 이동
    await page.goto(`https://ilovegohyang.go.kr/items/details-main.html?code=G${productCode}`, { waitUntil: 'networkidle2' });

    // 데이터를 가져올 때 에는 html의 id, class 태그의 textContent나 innerHTML과 같은 값을 가져와서 사용
    // 썸네일 이미지 가져오기
    // evaluate : puppeteer의 메소드, 웹 페이지 내부의 DOM 요소에 접근함
    const imageSrc = await page.evaluate(() => {
      const imgs = document.querySelectorAll('.swiper_img img');
      return Array.from(imgs).map(img => img.src);
    });


    // 상품 카테고리 가져오기
    // 카테고리가 고민인게 답례품 > 소고기 도 있고 답례품 > 고기 > 소고기 도 있음..
    const categorySrc = await page.evaluate(() => {
      const categoryElement = document.querySelector('.ali_breadcrumb');
      const spanElements = categoryElement ? categoryElement.querySelectorAll('span') : [];

      // 두 번째 span 요소의 텍스트를 반환합니다. 인덱스는 0부터 시작하므로 두 번째 요소는 인덱스 1입니다.
      return spanElements[1] ? spanElements[1].textContent.trim() : '';
    });

    // 지역 정보 가져오기
    const areaSrc = await page.evaluate(() => {
      const areaElement = document.querySelector('.brand_mall');
      if (areaElement) {
        const areaHtml = areaElement.innerHTML;
        const area = areaHtml.split('>', 2);
        return area[1];
      } else {
        return null;
      }
    });

    // 상품명 가져오기
    const nameSrc = await page.evaluate(() => {
      const nameHtml = document.querySelector('.info_title h2 span');
      return nameHtml ? nameHtml.textContent.trim() : null;
    });

    // 안내 문구 가져오기
    const descriptionSrc = await page.evaluate(() => {
      const descriptionHtml = document.querySelector('.info_title p span');
      return descriptionHtml ? descriptionHtml.textContent : null;
    });

    // 가격 가져오기
    const priceSrc = await page.evaluate(() => {
      // 가격에서 사용하는 class : op_price, price, present_price
      let priceHtml = document.querySelector('.op_price, .price, .present_price');
      return priceHtml ? priceHtml.textContent.trim().replace("P", "") : null;
    });


    // 판매자 가져오기
    const seller = await page.evaluate(() => {
      const shopInfoElements = document.querySelectorAll('.shop_info');

      let seller = null;
      let origin = null; // 원산지가 없을 수 있음

      shopInfoElements.forEach((element) => {
        const titleColElement = element.querySelector('.title_col');
        const title = titleColElement.querySelector('p').textContent;

        if (title === '판매자') {
          const paraColElement = element.querySelector('.para_col');
          seller = paraColElement.querySelector('p').textContent;
        }
        if (title === '원산지') {
          // 원산지는 없을 수 있음
          const paraColElement = element.querySelector('.para_col');
          origin = paraColElement.querySelector('p').textContent;
        }
        return seller, origin;
      });

      return [seller, origin];
    });

    // // 상품 이미지/텍스트 가져오기
    // const contentSrc = await page.evaluate(() => {
    //   const contentElements = document.querySelectorAll('div#nav-detail img, #nav-detail .item_detail p');
    //   return Array.from(contentElements).map(el => {
    //     if (el.tagName !== 'br') {
    //       if (el.tagName.toLowerCase() === 'img') {
    //         return `https://ilovegohyang.go.kr${el.getAttribute('src')}`;
    //       } else if (el.tagName.toLowerCase() === 'p') {
    //         const textContent = el.textContent.trim();
    //         if (textContent.length > 0) {
    //           return textContent;
    //         }
    //       }
    //     }
    //   }).filter(el => el != null && el !== '');
    // });

    // 상품 이미지/텍스트 가져오기
    const contentSrc = await page.evaluate(() => {
      const contentElements = document.querySelector('.item_detail');
      return contentElements ? [contentElements.innerHTML] : null;
    });

    // console.log('categorySrc: ', categorySrc);
    // console.log('img: ', imageSrc);
    // console.log('Area:', areaSrc);
    // console.log('Name:', nameSrc);
    // console.log('description:', descriptionSrc);
    // console.log('Price:', Number(priceSrc.replace(',', '')));
    // console.log('Seller:', seller);
    // console.log('contentSrc: ', contentSrc);


    await axios.post(
      'http://localhost:3000/goods/1',
      {
        code: Number(productCode),
        name: nameSrc,
        description: descriptionSrc,
        location: areaSrc,
        category: categorySrc,
        point: Number(priceSrc.replace(',', '')),
        price: 0,
        thumbnail_image: imageSrc[0],
        productThumbnails: imageSrc.map(url => ({ image_url: url })),
        productContents: contentSrc.map(content => ({ content }))
      }
    ).then(res => {
      console.log("성공!");
    }).catch(err => {
      console.log("엘어발생");
    });
  };
  await browser.close();
}

// 업데이트 로직도 필요함

scrapeProductCode('https://ilovegohyang.go.kr/goods/index-main.html');
