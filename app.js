// Hacker News API Client App lecture

const container = document.getElementById('root'); // 재사용을 위해 변수로 뺀것뿐임.
const ajax = new XMLHttpRequest();
const content = document.createElement('div');
// v0/show/뒤에 숫자가 페이지임. 실제 사이트로 보기 : https://news.ycombinator.com/show
// git : https://github.com/tastejs/hacker-news-pwas/blob/master/docs/api.md
const NEWS_URL = 'https://api.hnpwa.com/v0/news/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';
const store = {
  currentPage : 1,
}; 

function getData(url) {
  ajax.open('GET', url, false); 
  ajax.send();
  return JSON.parse(ajax.response);
}

// newsFeed함수 : API URL를 가져와 글 목록을 보여주는 함수.
// 배열에 ul,li태그를 넣고 join으로 문자열로 바꾸는 방식을 사용.
function newsFeed() {
  const newsFeed = getData(NEWS_URL);
  const newList = [];

  newList.push('<ul>');
  
  for (let i = (store.currentPage - 1) * 10; i<store.currentPage * 10; i++) {
    newList.push(`
    <li>
      <a href="#/show/${newsFeed[i].id}">
      ${newsFeed[i].title} (${newsFeed[i].comments_count})
      </a>
    </li>
    `);
  }
  newList.push('</ul>')
  newList.push(`
    <div>
      <a href="#/page/${store.currentPage > 1 ? store.currentPage - 1 : 1}">이전페이지</a>      
      <a href="#/page/${store.currentPage + 1}">다음페이지</a>      
    </div>
  `);
  
  // join : 배열을 ,로 연결된 하나의 문자열로 바꿔줌. 
  container.innerHTML = newList.join('') ; // 빈문자열로 넣어주면 ,없이 문자열 연결.
};

// 글목록 클릭했을때 글내용 보여주는 함수
function newsDetail() { // url의 #이 변할때
  const id = location.hash.substring(7); // location : 주소와 관련된 기능제공
  
  const newsContent = getData(CONTENT_URL.replace('@id', id))

  container.innerHTML = `
    <h1>${newsContent.title}</h1>
    <div>
      <a href="#/page/${store.currentPage}">목록으로</a>
    </div>
  `;
}

function router() {
  const routePath = location.hash; //location.hash에 #만 있으면 빈값을 반환!

  if (routePath === ''){
    newsFeed();
  } else if (routePath.indexOf('#/page/') >= 0){
    store.currentPage = Number(routePath.substring(7)); 
    newsFeed();
  } else {
    newsDetail();
  }
}

window.addEventListener('hashchange', router);
router();
