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
      if (j > 0) {
        //Заполнение массива MainBoard датой, ФИ исполнителя
        MainBoard[key][j] = `<div class="TaskHeader">${j}.05.2022 <br>${Users[key].firstName} ${Users[key].surname}</div>`;
      }
      if (j == 0) {
        MainBoard[key][j] += Users[key].firstName + " " + Users[key].surname;
      }
      //Заполнение массива MainBoard задачами, имеющих исполнителя
      for (const task in Tasks) {
        if (Tasks[task].executor == Users[key].id && j >= new Date(Tasks[task].planStartDate).getDate() && j <= new Date(Tasks[task].planEndDate).getDate()) {
          MainBoard[key][j] += `<div class='Task'>${Tasks[task].subject}<div class="description">` +
            `Исполнитель: ${Users[key].firstName} ${Users[key].surname}<br>` +
            `Описание: ${Tasks[task].description ? Tasks[task].description : "Описание отсутвует"}<br>` +
            `Дата начала: ${Tasks[task].planStartDate}<br>` +
            `Дата окончания: ${Tasks[task].planEndDate}</div></div>`;
        }
      }
    }
  }

//Заполнение массива BacklogBoard задачами, не имеющих исполнителя
  for (let task in Tasks) {
    if (!Tasks[task].executor) {
      BacklogBoard.push(
        `<div class='Task'">${Tasks[task].subject}<div class="description">` +
        `Исполнитель: Не назначен<br>` +
        `Описание: ${Tasks[task].description ? Tasks[task].description : "Описание отсутвует"}<br>` +
        `Дата начала:${Tasks[task].planStartDate}<br>` +
        `Дата окончания: ${Tasks[task].planEndDate}</div></div>`);
    }
  }

  //Вывод задач в основную таблицу
  for (let i = 0; i < MainBoard.length - 1; i++) {
    let tr = TableActiveTasks.appendChild(document.createElement('tr'))
    for (let j = 0; j <= Days; j++) {
      tr.innerHTML += `<td draggable="true">${MainBoard[i][j]}</td>`;
    }
  } 

  //Вывод задач в таблицу беклога
  for (let i = 0; i < BacklogBoard.length; i++) {
    let tr = TableBacklogTasks.appendChild(document.createElement('tr'))
    tr.innerHTML += `<td draggable="true">${BacklogBoard[i]}</td>`
  }

}



getTasks();



