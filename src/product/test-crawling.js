const puppeteer = require('puppeteer');

// 크롤링이 실패할 경우 개발자에게 연락을 취하는 로직 구현해야할 듯
// 크롤링이 실패할 경우 -> 고사기의 html 구성이 바뀌어 값들을 제대로 가져오지 못 할 때가 예상됨

// 이미지 크롤링하기
async function scrapeImageSrc(url) {
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
    'https://ilovegohyang.go.kr/users/login.html?target=%2Fgoods%2Findex-main.html',
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
    } catch (e) {
      console.log(e);
    }
  }

  // 2002002697
  for (let i = 2002005119; i < 2002005121; i++) {
    // 로그인 후 지정된 URL로 이동
    await page.goto(`${url}${i}`, { waitUntil: 'networkidle2' });

    // 데이터를 가져올 때 에는 html의 id, class 태그의 textContent나 innerHTML과 같은 값을 가져와서 사용
    // 썸네일 이미지 가져오기
    // evaluate : puppeteer의 메소드, 웹 페이지 내부의 DOM 요소에 접근함
    const imageSrc = await page.evaluate(() => {
      const img = document.querySelector('.swiper_img');
      return img ? img.src : null;
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
      const priceHtml = document.querySelector('.op_price');
      return priceHtml ? priceHtml.textContent.trim() : null;
    });

    // 판매자 가져오기
    const seller = await page.evaluate(() => {
      const shopInfoElements = document.querySelectorAll('.shop_info');

      let seller = null;
      let origin = null; // 원산지가 없을 수 있음
      let delivery = null;

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
        if (title === '배송') {
          const paraColElement = element.querySelector('.para_col');
          const deliverys = paraColElement.querySelectorAll('p');
          delivery = deliverys[1].textContent.trim().split(':');
          delivery = delivery[1];
        }
        return seller, origin, delivery;
      });

      return [seller, origin, delivery];
    });

    // 상품 이미지/텍스트 가져오기
    const contentSrc = await page.evaluate(() => {
      const contentImgHtml = document.querySelector('div#nav-detail img');
      if (contentImgHtml) {
        return `https://ilovegohyang.go.kr${contentImgHtml.getAttribute(
          'src',
        )}`;
      }
      if (!contentImgHtml) {
        const pElements = document.querySelectorAll(
          '#nav-detail .item_detail p',
        );
        return Array.from(pElements).map((p) => p.textContent.trim());
      }
    });

    console.log('img: ', imageSrc);
    console.log('Area:', areaSrc);
    console.log('Name:', nameSrc);
    console.log('description:', descriptionSrc);
    console.log('Price:', priceSrc);
    console.log('Seller:', seller);
    console.log('contentSrc: ', contentSrc);
  }
  await browser.close();
}

// scrapeImageSrc('https://ilovegohyang.go.kr/items/details-main.html?code=G2002002697');
scrapeImageSrc('https://ilovegohyang.go.kr/items/details-main.html?code=G');
