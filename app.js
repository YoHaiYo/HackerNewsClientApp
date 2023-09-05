// Hacker News API Client App lecture

const container = document.getElementById('root'); // 재사용을 위해 변수로 뺀것뿐임.
const ajax = new XMLHttpRequest();
const content = document.createElement('div');
// v0/show/뒤에 숫자가 페이지임. 실제 사이트로 보기 : https://news.ycombinator.com/show
const NEWS_URL = 'https://api.hnpwa.com/v0/show/1.json';
const CONTENT_URL = 'https://api.hnpwa.com/v0/item/@id.json';

function getData(url) {
  ajax.open('GET', url, false); 
  ajax.send();
  return JSON.parse(ajax.response);
}

const newsFeed = getData(NEWS_URL);

// console.log(newsFeed);
const ul = document.createElement('ul');

window.addEventListener('hashchange', function() { // url의 #이 변할때
  const id = location.hash.substring(1); // location : 주소와 관련된 기능제공
  
  const newsContent = getData(CONTENT_URL.replace('@id', id))
  const title = this.document.createElement('h1');

  title.innerHTML = newsContent.title;

  content.appendChild(title);
  console.log(newsContent);
});

for (let i = 0; i<10; i++) {
  const div = document.createElement('div');
  
  div.innerHTML = `
  <li>
    <a href="#${newsFeed[i].id}">
    ${newsFeed[i].title} (${newsFeed[i].comments_count})
    </a>
  </li>
  `;

  ul.appendChild(div.firstElementChild); 
}
// appendChild : 하위요소에 태그추가
container.appendChild(ul);
container.appendChild(content);

