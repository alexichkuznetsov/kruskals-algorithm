// Юзер интерфейс
let closeButton = document.querySelector("#close-modal");
let openButton = document.querySelector("#show-modal");
let modal = document.querySelector(".modal");
let main = document.querySelector('main');
let header = document.querySelector('nav');
let footer = document.querySelector('footer');
let sigmaContainer = document.querySelector('#container');
let checkResultButton = document.querySelector('#task-check');
let resultModal = document.querySelector('.result-modal');

// При клике закрывает модальное окно
closeButton.addEventListener("click", closeModal);
document.addEventListener('mousedown', function (e) {
  if (modal.classList.contains('hidden') === false) {
    if (e.target !== modal) {
      closeModal();
    }
  }
});

// Функция, отвечающая за закрытие модального окна
function closeModal() {
  if (modal.classList.contains("hidden") === false) {
    modal.classList.add("hidden");
    main.setAttribute('style', '-webkit-filter: blur(0)');
    header.setAttribute('style', '-webkit-filter: blur(0)');
    footer.setAttribute('style', '-webkit-filter: blur(0)');
  }
}

// Обработчик на кнопку для открытия модального окна
openButton.addEventListener("click", function () {
  if (modal.classList.contains("hidden") === true) {
    openModal();
  }
});

// Функция, отвечающая за открытие модального окна
function openModal() {
  modal.classList.remove("hidden");
  main.setAttribute('style', '-webkit-filter:blur(5px)');
  header.setAttribute('style', '-webkit-filter:blur(5px)');
  footer.setAttribute('style', '-webkit-filter:blur(5px)');
}

// Функция чекает установлены ли куки и возвращает куки (или undefined если их нет)
function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));

  return matches ? decodeURIComponent(matches[1]) : undefined;
}

// Функция, которая устанавливает куки на какой-то промежуток времени
function setCookie(name, value, days) {
  let expires = '';
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = `; expires=${date.toUTCString()};`
  }

  document.cookie = name + '=' + (value || '') + expires + '; path=/';
}

// Когда страница полностью загружена проверяется есть ли куки на открытие модального окна
// Если куков нет (страница открыта впервые) - при открытие появится окно с теорией
// И будут установлены куки, чтобы при открытии страницы не появлялось окно с теорией
document.addEventListener('DOMContentLoaded', function () {
  let check = getCookie('firstOpen');

  if (check == undefined) {
    openModal();
    setCookie('firstOpen', 'true', 1);
  }
})

/* Работа с графом */

// Узлы и ребра
let data = {
  "nodes": [
    {
      "id": "A",
      "label": "A",
      "x": 0,
      "y": 0,
      "size": 3
    },
    {
      "id": "B",
      "label": "B",
      "x": -0.1,
      "y": 0.3,
      "size": 3
    },
    {
      "id": "C",
      "label": "С",
      "x": 0.5,
      "y": 0.5,
      "size": 3
    },
    {
      "id": "D",
      "label": "D",
      "x": 1,
      "y": 0.3,
      "size": 3
    },
    {
      "id": "E",
      "label": "E",
      "x": 0.4,
      "y": -0.1,
      "size": 3
    }
  ],

  "edges": [
    {
      "id": "AB",
      "label": "3",
      "source": "A",
      "target": "B",
      "size": 1,
      "color": "#ccc",
      "hover_color": "#000"
    },
    {
      "id": "AE",
      "source": "A",
      "target": "E",
      "label": "1",
      "size": 1,
      "color": "#ccc",
      "hover_color": "#000"
    },
    {
      "id": "BE",
      "source": "B",
      "target": "E",
      "label": "4",
      "size": 1,
      "color": "#ccc",
      "hover_color": "#000"
    },
    {
      "id": "BC",
      "source": "B",
      "target": "C",
      "label": "5",
      "size": 1,
      "color": "#ccc",
      "hover_color": "#000"
    },
    {
      "id": "EC",
      "source": "E",
      "target": "C",
      "label": "6",
      "size": 1,
      "color": "#ccc",
      "hover_color": "#000"
    },
    {
      "id": "ED",
      "source": "E",
      "target": "D",
      "label": "7",
      "size": 1,
      "color": "#ccc",
      "hover_color": "#000"
    },
    {
      "id": "CD",
      "source": "C",
      "target": "D",
      "label": "2",
      "size": 1,
      "color": "#ccc",
      "hover_color": "#000"
    }
  ]
}

// Инициализируем нашу сигму для работы с графом
s = new sigma({
  graph: data,
  renderer: {
    container: document.getElementById('container'),
    type: 'canvas'
  },
  settings: {
    doubleClickEnabled: false,
    minEdgeSize: 0.5,
    maxEdgeSize: 4,
    enableEdgeHovering: true,
    edgeHoverColor: 'edge',
    defaultEdgeHoverColor: '#000',
    edgeHoverSizeRatio: 1,
    edgeHoverExtremities: true,
    mouseWheelEnabled: false,
    enableCamera: false,
  }
});

// Массив для ребер, выбранных пользователем
let chosenEdges = [];
// Массив с оставным деревом для проверки
let result = [
  {
    "id": "AE",
    "label": "1"
  },
  {
    "id": "CD",
    "label": "2"
  },
  {
    "id": "AB",
    "label": "3"
  },
  {
    "id": "BC",
    "label": "5"
  }
];

// Биндим функционал к разным ивентам
s.bind('clickEdge', function (e) {
  let index = chosenEdges.findIndex(item => item.id === e.data.edge.id);

  if (index === -1) {
    chosenEdges.push(e.data.edge);
    highlightEdges();
  } else {
    chosenEdges.splice(index, 1);
    e.data.edge.color = '#ccc';
  }

  s.refresh();
});

function highlightEdges() {
  chosenEdges.forEach((edge) => {
    edge.color = '#4db6acc2';
  })
}

function sortArrayOfEdges(arr) {
  arr.sort(function (item1, item2) {
    return Number(item1.label) - Number(item2.label);
  });

  return arr;
}

function checkResult() {
  let userInput = sortArrayOfEdges(chosenEdges);

  // Проверяем, что массив с данными пользователя и массив с результатом равны по длине
  if (userInput.length !== result.length) {
    return false;
  }

  for (let i = 0; i < result.length; i++) {
    if (userInput[i].id !== result[i].id) {
      return false;
    }
  }

  return true;
}

// Функция для показа окна с результатом
function showResult() {
  resultModal.classList.remove('hidden');
  main.setAttribute('style', '-webkit-filter:blur(5px)');
  header.setAttribute('style', '-webkit-filter:blur(5px)');
  footer.setAttribute('style', '-webkit-filter:blur(5px)');
}

function check() {
  let check = checkResult();

  if (chosenEdges.length === 0) {
    alert("Сначала постройте дерево.")
  } else if (check === false) {
    alert("У вас где-то ошибка. Проверьте правильно ли вы построили остовное дерево.");
  } else {
    showResult();
  }

}

checkResultButton.addEventListener('click', check);