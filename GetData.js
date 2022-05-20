var requestOptions = {
  method: 'GET',
  redirect: 'follow'
};


let MainBoard = [];
let Tasks = [];
let BacklogBoard = [];
const Days = 31;

async function getTasks() {
  let responceTasks = await fetch('https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/tasks', requestOptions)
  let responceUsers = await fetch('https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/users', requestOptions)
  let data = await responceTasks.json();
  let Users = await responceUsers.json();
  let TableBacklogTasks = document.querySelector('.TableBacklogTasks');
  let TableActiveTasks = document.querySelector('.TableActiveTasks');

  for (let task in data) {
    Tasks.push(data[task]);
  }

  for (let key in Users) {
    MainBoard[key] = [];
    for (let j = 0; j <= Days; j++) {
      MainBoard[key][j] = '';
      if (j == 0) {
        MainBoard[key][j] += `<div class='Name'>${Users[key].firstName}<br>${Users[key].surname}`;
        continue;
      }
      //Заполнение массива MainBoard задачами, имеющих исполнителя
      let Executor = `${Users[key].firstName} ${Users[key].surname}`;
      let date = `${j}.05.2022`;
      MainBoard[key][j]+=`<div class='TaskHeader'><div class='TaskExecutor'>${Executor}</div><div class='TaskDate'>${date}</div></div>`;
      for (const task in Tasks) {
        if (Tasks[task].executor == Users[key].id && j >= new Date(Tasks[task].planStartDate).getDate() && j <= new Date(Tasks[task].planEndDate).getDate()) {
          MainBoard[key][j] += `<div class='Task tasks__item'>${Tasks[task].subject}<div class="description">` +
            `Описание: ${Tasks[task].description ? Tasks[task].description : "Описание отсутвует"}` +
            `<div class='StartDate'>Дата начала:${Tasks[task].planStartDate}</div>` +
            `<div class='EndDate'>Дата окончания: ${Tasks[task].planEndDate}</div></div></div>`;
        }
      }
    }
  }

//Заполнение массива BacklogBoard задачами, не имеющих исполнителя
  for (let task in Tasks) {
    if (!Tasks[task].executor) {
      BacklogBoard.push(
        `<div class='Task tasks__item'>${Tasks[task].subject}<div class="description">` +
        `Описание: ${Tasks[task].description ? Tasks[task].description : "Описание отсутвует"}<br>` +
        `Дата начала:<div class='StartDate'>${Tasks[task].planStartDate}</div>` +
        `Дата окончания:<div class='EndDate'>${Tasks[task].planEndDate}</div></div></div>`);
    }
  }

  //Вывод задач в основную таблицу
  for (let i = 0; i < MainBoard.length - 1; i++) {
    let tr = TableActiveTasks.appendChild(document.createElement('tr'))
    tr.innerHTML += `<td>${MainBoard[i][0]}</td>`;
    for (let j = 1; j <= Days; j++) {
      tr.innerHTML += `<td class='tasks__list'>${MainBoard[i][j]}</td>`;
    }
  } 

  //Вывод задач в таблицу беклога
  
  let tr = TableBacklogTasks.appendChild(document.createElement('tr')).appendChild(document.createElement('td'))
  tr.classList.add('tasks__list');
  for (let i = 0; i < BacklogBoard.length; i++) {
    tr.innerHTML +=BacklogBoard[i];
  }

  const tasksListElement = document.querySelectorAll(`.tasks__list`);
  for (const taskElement of tasksListElement) {
    const taskElements = taskElement.querySelectorAll(`.tasks__item`);
    for (const task of taskElements) {
      task.draggable = true;
    }
    taskElement.addEventListener(`dragstart`, (evt) => {
      evt.target.classList.add(`selected`);
    })
    
    taskElement.addEventListener(`dragend`, (evt) => {
      evt.target.classList.remove(`selected`);
    });
    taskElement.addEventListener(`dragover`, (evt) => {
      evt.preventDefault();
      const activeElement = document.querySelector(`.selected`);
      const currentElement = evt.target;

      const isMoveable = activeElement !== currentElement && (currentElement.classList.contains(`tasks__list`) || currentElement.classList.contains(`TaskHeader`));

      if (!isMoveable) {
        return;
      }
      let StartDate = activeElement.querySelector('.description').querySelector('.StartDate').textContent;
      let EndDate = activeElement.querySelector('.description').querySelector('.EndDate').textContent;
      currentElement.appendChild(activeElement);
    });
  }

}

getTasks();
