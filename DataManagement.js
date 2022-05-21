var requestOptions = {
  method: 'GET',
  redirect: 'follow'
};


let MainBoard = [];     //Массив задач основной таблицы
let BacklogBoard = [];  //Массив задач беклога
const Days = 31;

async function getTasks() {
  let responceTasks = await fetch('https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/tasks', requestOptions)   //Парсинг списка задач
  let responceUsers = await fetch('https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/users', requestOptions)   //Парсинг списка пользователей
  let Tasks = await responceTasks.json();
  let Users = await responceUsers.json();
  let TableBacklogTasks = document.querySelector('.TableBacklogTasks');
  let TableActiveTasks = document.querySelector('.TableActiveTasks');

  for (let key in Users) {
    MainBoard[key] = [];
    for (let j = 0; j <= Days; j++) {
      MainBoard[key][j] = '';
      if (j == 0) {
        MainBoard[key][j] += `<div class='FirstColumn'>${Users[key].firstName}<br>${Users[key].surname}`;
        continue;
      }
      //Заполнение массива MainBoard задачами, имеющих исполнителя
      let Executor = `${Users[key].firstName} ${Users[key].surname}`;
      let date = `${j}.05.2022`;
      MainBoard[key][j] += `<div class='TaskHeader'><div class='TaskExecutor'>${Executor}</div><div class='TaskDate'>${date}</div></div>`;
      for (const task in Tasks) {
        if (Tasks[task].executor == Users[key].id && j >= new Date(Tasks[task].planStartDate).getDate() && j <= new Date(Tasks[task].planEndDate).getDate()) {
          MainBoard[key][j] += `<div class='Task'>${Tasks[task].subject}<div class="description">` +
            `Описание: ${Tasks[task].description ? Tasks[task].description : "Описание отсутвует"}<br>` +
            `Плановая дата начала: <div class='StartDate'>${Tasks[task].planStartDate}</div>` +
            `Плановая дата окончания: <div class='EndDate'>${Tasks[task].planEndDate}</div></div></div>`;
        }
      }
    }
  }

  //Заполнение массива BacklogBoard задачами, не имеющих исполнителя
  for (let task in Tasks) {
    if (!Tasks[task].executor) {
      BacklogBoard.push(
        `<div class='Task'>${Tasks[task].subject}<div class="description">` +
        `Описание: ${Tasks[task].description ? Tasks[task].description : "Описание отсутвует"}<br>` +
        `Плановая дата начала:<div class='StartDate'>${Tasks[task].planStartDate}</div>` +
        `Плановая дата окончания:<div class='EndDate'>${Tasks[task].planEndDate}</div></div></div>`);
    }
  }

  //Вывод задач в основную таблицу
  for (let i = 0; i < MainBoard.length - 1; i++) {
    let tr = TableActiveTasks.appendChild(document.createElement('tr'))
    for (let j = 0; j <= Days; j++) {
      let td = tr.appendChild(document.createElement('td'));
      td.classList.add('tasks__list');
      td.innerHTML += MainBoard[i][j];
    }
  }

  //Вывод задач в таблицу беклога

  let td = TableBacklogTasks.appendChild(document.createElement('tr')).appendChild(document.createElement('td'))
  td.classList.add('tasks__list');
  for (let i = 0; i < BacklogBoard.length; i++) {
    td.innerHTML += BacklogBoard[i];
  }


  //Drag&Drop
  const tasksListElement = document.querySelectorAll(`.tasks__list`); //Список всех td 
  for (const taskElement of tasksListElement) {
    const taskElements = taskElement.querySelectorAll(`.Task`);//Список всех задач
    for (const task of taskElements) {
      task.draggable = true;
    }


    //Добавить класс selected для выбранной задачи по нажатию
    taskElement.addEventListener(`dragstart`, (evt) => {
      if (evt.target.classList.contains('Task')){
        evt.target.classList.add(`selected`);
      }
    })



    //Удалить класс selected при отпускании кнопки и добавление задачи по наведению на пользователя(на даты, указанные в задаче)
    taskElement.addEventListener(`dragend`, (evt) => {

      evt.preventDefault();

      const currentElement = evt.target.parentNode;

      let activeElement = document.querySelector(`.selected`);    
      if (currentElement.classList.contains('TrashZone'))
      {
        activeElement.remove();
      }
      if (currentElement.querySelector('.FirstColumn')) {
        let StartDate = new Date(activeElement.querySelector('.description').querySelector('.StartDate').textContent).getDate();
        let EndDate = new Date(activeElement.querySelector('.description').querySelector('.EndDate').textContent).getDate();
        let CurrentRow = currentElement.parentNode.children;
        let i = 0;

        for (const key in CurrentRow) {
          if (i >= StartDate && i <= EndDate) {
            let CloneTask = activeElement.cloneNode(true);
            CurrentRow[key].appendChild(CloneTask);
            CloneTask.classList.remove(`selected`);
          }
          i++;
        }
        activeElement.remove();
      }

      evt.target.classList.remove(`selected`); //Удалить класс selected
    });

    //Добавление задачи, при наведении на ячейку таблицы
    taskElement.addEventListener(`dragover`, (evt) => {
      evt.preventDefault();
      const activeElement = document.querySelector(`.selected`);
      const currentElement = evt.target;

      if (!(isMoveable = activeElement !== currentElement && currentElement.classList.contains(`tasks__list`) && activeElement.classList.contains(`Task`))) {
        return;
      }
      currentElement.appendChild(activeElement);
    });
  }

}

getTasks();
