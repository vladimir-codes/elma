var requestOptions = {
  method: 'GET',
  redirect: 'follow'
};


let BacklogTasks=[];
let ActiveTasks=[];
let Users=[];
let Board=[];
const Days = 31;

async function getTasks()
{
  let responceTasks = await fetch('https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/tasks', requestOptions)
  let responceUsers = await fetch('https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/users', requestOptions)
  let data = await responceTasks.json();
  let users = await responceUsers.json();  
  let TableBacklogTasks = document.querySelector('.TableBacklogTasks');
  let TableActiveTasks = document.querySelector('.TableActiveTasks');
 


  for (let key in data) {
    if(data[key].executor==null) BacklogTasks.push(data[key]);
    else ActiveTasks.push(data[key]);
  }

  for (const key in users) {
    Users.push(users[key]);
  }



let key=0;
  Board[Users.length] = [];
  for (key in Users) {
      Board[key] = [];
      for(let j=0;j<=Days;j++)
      { 
        Board[key][j]='';  
        if(j>0)
        {
          Board[key][j]=j+'.05.2022';
        }
        if(j==0)
        {
          Board[key][j]=Users[key].firstName+" "+Users[key].surname;
        }
        for (const tasks in ActiveTasks) {
            if(ActiveTasks[tasks].executor==Users[key].id && j>=new Date(ActiveTasks[tasks].planStartDate).getDate() && j<=new Date(ActiveTasks[tasks].planEndDate).getDate())
            {
              Board[key][j]=`<div class='Task' draggable="true">${ActiveTasks[tasks].subject}<div class="description">Исполнитель:${Users[key].firstName}<br>Описание: ${ActiveTasks[tasks].description?ActiveTasks[tasks].description:"Описание отсутвует"}<br>Дата начала: ${ActiveTasks[tasks].planStartDate}<br>Дата окончания: ${ActiveTasks[tasks].planEndDate}</div></div>`;
            }
        }
      }
  }



  for (let key in BacklogTasks) {
    TableBacklogTasks.innerHTML+=
    `<tr>` +
    ` <td>` +
    `<div class='Task' draggable="true">${BacklogTasks[key].subject}<div class="description">Описание: ${BacklogTasks[key].description?BacklogTasks[key].description:"Описание отсутвует"}<br>Дата начала: ${BacklogTasks[key].planStartDate}<br>Дата окончания: ${BacklogTasks[key].planEndDate}</div></div>`+
    ` </td>` +
    `</tr>`;
  }
   

  for(let i=0;i<Board.length-1;i++)
  {
    let tr = TableActiveTasks.appendChild(document.createElement('tr'))
    for(let j=0;j<=Days;j++)
    {
      tr.innerHTML+=`<td>${Board[i][j]}</td>`;
    }
  }

}


getTasks();



