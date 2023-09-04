// Hacker News API Client App lecture

const ajax = new XMLHttpRequest();

// v0/show/뒤에 숫자가 페이지임. 실제 사이트로 보기 : https://news.ycombinator.com/show
const NEWS_URL = 'https://api.hnpwa.com/v0/show/1.json';
ajax.open('GET', NEWS_URL, false); 
ajax.send();

const newsFeed = JSON.parse(ajax.response);
console.log(newsFeed);

const ul = document.createElement('ul');

for (let i = 0; i<30; i++) {
  const li = document.createElement('li');
    li.innerHTML = newsFeed[i].title;
  ul.appendChild(li); 
}
// appendChild : 하위요소에 태그추가
document.getElementById('root').appendChild(ul);