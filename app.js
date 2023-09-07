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
  const newsList = [];
  let template = `
    <div class="bg-gray-600 min-h-screen">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">
                Hacker News
              </h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/{{__prev_page__}}" class="text-gray-500">
                Previous
              </a>
              <a href="#/page/{{__next_page__}}" class="text-gray-500 ml-4">
                Next
              </a>
            </div>
          </div> 
        </div>
      </div>
      <div class="p-4 text-2xl text-gray-700">
        {{__news_feed__}}        
      </div>
    </div>
  `;

  for (let i = (store.currentPage - 1) * 10; i<store.currentPage * 10; i++) {
    newsList.push(`
      <div class="p-6 bg-white mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
        <div class="flex">
          <div class="flex-auto">
            <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}</a>  
          </div>
          <div class="text-center text-sm">
            <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${newsFeed[i].comments_count}</div>
          </div>
        </div>
        <div class="flex mt-3">
          <div class="grid grid-cols-3 text-sm text-gray-500">
            <div><i class="fas fa-user mr-1"></i>${newsFeed[i].user}</div>
            <div><i class="fas fa-heart mr-1"></i>${newsFeed[i].points}</div>
            <div><i class="far fa-clock mr-1"></i>${newsFeed[i].time_ago}</div>
          </div>  
        </div>
      </div>    
    `);
  }

  template = template.replace('{{__news_feed__}}', newsList.join(''));
  template = template.replace('{{__prev_page__}}', store.currentPage > 1 ? store.currentPage - 1 : 1);
  template = template.replace('{{__next_page__}}', store.currentPage + 1); // 다음페이지가 없을때 페이지+1되는 버그는 스스로 잡아보기.
  
  // join : 배열을 ,로 연결된 하나의 문자열로 바꿔줌. 
  container.innerHTML = template ; // 빈문자열로 넣어주면 ,없이 문자열 연결.
};

// 글목록 클릭했을때 글내용 보여주는 함수
function newsDetail() { // url의 #이 변할때
  const id = location.hash.substring(7); // location : 주소와 관련된 기능제공
  const newsContent = getData(CONTENT_URL.replace('@id', id))
  let template = `
    <div class="bg-gray-600 min-h-screen pb-8">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/${store.currentPage}" class="text-gray-500">
                <i class="fa fa-times"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="h-full border rounded-xl bg-white m-6 p−4 ">
        <h2>${newsContent.title}</h2>
        <div class="text-gray-400 h-20">
          ${newsContent.content}
        </div>

        {{__comments__}}

      </div>
    </div>
  `;

  function makeComment(comments, called = 0) {
    const commentString = [];

    for(let i = 0; i < comments.length; i++) {
      commentString.push(`
        <div style="padding-left: ${called * 40}px;" class="mt-4">
          <div class="text-gray-400">
            <i class="fa fa-sort-up mr-2"></i>
            <strong>${comments[i].user}</strong> ${comments[i].time_ago}
          </div>
          <p class="text-gray-700">${comments[i].content}</p>
        </div>      
      `);

      // 재귀호출 : 자기자신을 호출.대댓글을 표시할려고.
      // 대댓글이 몇개인지 알수가없으므로 이런 테크닉을 사용.
      if (comments[i].comments.length > 0) {
        commentString.push(makeComment(comments[i].comments, called + 1));
      }
    }

    return commentString.join('');
  }

  container.innerHTML = template.replace('{{__comments__}}', makeComment(newsContent.comments));
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
