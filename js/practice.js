// UI
let checkButton = document.querySelector('#check-button');
let resultModal = document.querySelector('#result-modal');
let main = document.querySelector('main');
let header = document.querySelector('nav');
let footer = document.querySelector('footer');
let oneMoreTimeButton = document.querySelector('#oneMoreTimeButton');

// Перезагрузка страницы при клике
oneMoreTimeButton.addEventListener('click', function () {
    location.reload();
})

/* Работа с графом */

// Узлы и ребра
let data = {
    "nodes": [
        {
            "id": "A",
            "label": "A",
            "x": 0.1,
            "y": 0,
            "size": 3
        },
        {
            "id": "B",
            "label": "B",
            "x": 1.1,
            "y": 0.2,
            "size": 3
        },
        {
            "id": "C",
            "label": "С",
            "x": 2,
            "y": 0,
            "size": 3
        },
        {
            "id": "D",
            "label": "D",
            "x": 0.2,
            "y": 1,
            "size": 3
        },
        {
            "id": "E",
            "label": "E",
            "x": 1.9,
            "y": 0.9,
            "size": 3
        },
        {
            "id": "F",
            "label": "F",
            "x": 1.1,
            "y": 1.3,
            "size": 3
        },
        {
            "id": "G",
            "label": "G",
            "x": 2,
            "y": 1.6,
            "size": 3
        }
    ],

    "edges": [
        {
            "id": "AB",
            "label": "7",
            "source": "A",
            "target": "B",
            "size": 1,
            "color": "#ccc",
            "hover_color": "#000"
        },
        {
            "id": "BC",
            "source": "B",
            "target": "C",
            "label": "8",
            "size": 1,
            "color": "#ccc",
            "hover_color": "#000"
        },
        {
            "id": "AD",
            "source": "A",
            "target": "D",
            "label": "5",
            "size": 1,
            "color": "#ccc",
            "hover_color": "#000"
        },
        {
            "id": "DB",
            "source": "D",
            "target": "B",
            "label": "9",
            "size": 1,
            "color": "#ccc",
            "hover_color": "#000"
        },
        {
            "id": "BE",
            "source": "B",
            "target": "E",
            "label": "7",
            "size": 1,
            "color": "#ccc",
            "hover_color": "#000"
        },
        {
            "id": "CE",
            "source": "C",
            "target": "E",
            "label": "5",
            "size": 1,
            "color": "#ccc",
            "hover_color": "#000"
        },
        {
            "id": "DE",
            "source": "D",
            "target": "E",
            "label": "15",
            "size": 1,
            "color": "#ccc",
            "hover_color": "#000"
        },
        {
            "id": "DF",
            "source": "D",
            "target": "F",
            "label": "6",
            "size": 1,
            "color": "#ccc",
            "hover_color": "#000"
        },
        {
            "id": "EF",
            "source": "E",
            "target": "F",
            "label": "8",
            "size": 1,
            "color": "#ccc",
            "hover_color": "#000"
        },
        {
            "id": "FG",
            "source": "F",
            "target": "G",
            "label": "11",
            "size": 1,
            "color": "#ccc",
            "hover_color": "#000"
        },
        {
            "id": "EG",
            "source": "E",
            "target": "G",
            "label": "9",
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
        enableCamera: true,
        labelThreshold: 0
    }
});

// Изменяет масштаб графа
s.cameras[0].goTo({ x: 0, y: 0, angle: 0, ratio: 1.2 });

// Массив для ребер, выбранных пользователем
let chosenEdges = [];

// Массив с оставным деревом для проверки
let result = [
    {
        "id": "AD",
        "label": "5"
    },
    {
        "id": "CE",
        "label": "5"
    },
    {
        "id": "DF",
        "label": "6"
    },
    {
        "id": "AB",
        "label": "7"
    },
    {
        "id": "BE",
        "label": "7"
    },
    {
        "id": "EG",
        "label": "9"
    },
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

// Функция для подсвечивания ребёр
function highlightEdges() {
    chosenEdges.forEach((edge) => {
        edge.color = '#4db6acc2';
    })
}

// Сортировка
function sortArrayOfEdges(arr) {
    arr.sort(function (item1, item2) {
        return Number(item1.label) - Number(item2.label);
    });

    return arr;
}

// Функция для проверки ввода пользователя
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

checkButton.addEventListener('click', check);