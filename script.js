const data = Array.from({ length: 100 })
  .map((_,i) => `item ${(i + 1)}`)

const selectors = {
  $list: '[data-paginate="list"]',
  $prev: '[data-paginate="prev"]',
  $next: '[data-paginate="next"]',
  $last: '[data-paginate="last"]',
  $first: '[data-paginate="first"]',
  $numbers: '[data-paginate="numbers"]'
}

const html = {
  get(element) {
    return document.querySelector(element)
  }
}

let perPage = 10
const state = {
  page: 1,
  perPage,
  totalPage: Math.ceil(data.length / perPage),
  maxVisibleButtons: 5
}



const controls = {
  next() {
    state.page++;
    const lastPage = state.page >= state.totalPage
    if(lastPage) {
      state.page--;
      if(state.page < 1) {
        state.page++;
      }
    }
  },
  prev() {
    state.page--
    if(state.page < 1) {
      state.page = 1
    }
  },
  goTo(page) {
    state.page = Number(page)
    
    if(page > state.totalPage) {
      state.page = state.totalPage;
    }
  },
  createListeners() {
    html.get(selectors.$first).addEventListener('click', ()=> {
      controls.goTo(1)
      update();
    })
    
    html.get(selectors.$last).addEventListener('click', ()=> {
      controls.goTo(state.totalPage)
      update();
    })
    html.get(selectors.$next).addEventListener('click', ()=> {
      controls.next()
      update();
    })
    html.get(selectors.$prev).addEventListener('click', ()=> {
      controls.prev()
      update();
    })
  }
}

const list = {
  create(item) {
    const $li = document.createElement('li')
    Object.assign($li, {
      className: "paginate__item",
      textContent: item
    })

    html.get(selectors.$list).appendChild($li)

  },
  update() {
    html.get(selectors.$list).innerHTML = ''
    let page = state.page - 1
    let start = page * state.perPage
    let end = start + state.perPage
    const paginatedItems = data.slice(start, end)
    paginatedItems.forEach(list.create)
  
  }
}

const buttons = {
  create(number) {
    const $button = document.createElement('div')  
    $button.innerHTML = number

    if(state.page === number) {
      $button.classList.add('active')
    }

    html.get(selectors.$numbers).appendChild($button)
    .addEventListener('click', (event) => {
      const page = event.target.innerText

      controls.goTo(page)
      update()
    })
  },
  update(){
    html.get(selectors.$numbers).innerHTML = ""
    const { maxLeft, maxRight } = buttons.calculateMaxVisible()
    console.log(maxLeft, maxRight)
    for (let page = maxLeft; page <= maxRight;  page++) {
      buttons.create(page)
    }
  },
  calculateMaxVisible() {
    const { maxVisibleButtons } = state
    let maxLeft = (state.page - Math.floor(maxVisibleButtons / 2))
    let maxRight = (state.page + Math.floor(maxVisibleButtons / 2))

    if(maxLeft < 1) {
      maxLeft = 1
      maxRight = maxVisibleButtons
    }

    if(maxRight > state.totalPage) {
      maxLeft = state.totalPage - (maxVisibleButtons - 1)
      maxRight = state.totalPage

      if(maxLeft< 1) maxLeft = 1
    }
    return { maxLeft, maxRight }
  }
}



function update() {
  list.update()
  buttons.update()
}
function init() {
  update()
  controls.createListeners()

}



document.addEventListener('DOMContentLoaded', init)