const setBtn = document.getElementById('set-btn');
const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');
const meridiemInput = document.getElementById('meridiem');
const alarmLists = document.getElementById('alarams');
let alarms = [];

/* Retrieve alarms from localStorage on page load */
if (localStorage.getItem('alarms')) {
  alarms = JSON.parse(localStorage.getItem('alarms'));
  renderList();
}

/* Handled click event to add alarm */
setBtn.addEventListener('click', (event) => {
  event.preventDefault();
  if (
    hoursInput.value.length === 0 ||
    minutesInput.value.length === 0 ||
    secondsInput.value.length === 0
  ) {
    alert("Alarm can't be set with empty fields. Try again");
  } else {
    const setTime = `${hoursInput.value} : ${minutesInput.value} : ${secondsInput.value} ${meridiemInput.value}`;
    if (duplicateAlarm(setTime)) {
      alert('Duplicate alarm');
    } else {
      const alarm = {
        setTime,
        id: Date.now().toString(),
      };
      alarms.push(alarm);
      renderList();
      saveAlarmsToLocalStorage(); // Save alarms to localStorage
    }
  }
});

/*
Reusable code for deletion of alarm and saving 
the code alrams list to localStorage for later retieval 
*/
function handleDeleteEvent(event) {
  const target = event.target;
  if (target.className === 'delete') {
    deleteAlarm(target.dataset.id);
    renderList();
    saveAlarmsToLocalStorage(); // Save alarms to localStorage
  }
}

/*
 Creates node for the alarms in array along with the delete icon
  */
function addAlarmsToDOM(alarm) {
  const li = document.createElement('li');
  li.innerHTML = `
    <label for="${alarm.id}">${alarm.setTime}</label>
    <img src="https://cdn-icons-png.flaticon.com/128/6861/6861362.png" class="delete" data-id="${alarm.id}" style="height:20px"/>
  `;
  alarmLists.append(li);
}

/**
 * Reusable code for rendering the DOM for any change in alarm array
 */
function renderList() {
  alarmLists.innerHTML = '';
  for (let i = 0; i < alarms.length; i++) {
    addAlarmsToDOM(alarms[i]);
  }
}

/**
 * Validates input in input boxes and formats them
 * @param {*} input
 * @param {*} maxValue
 * @param {*} errorMessage
 */
function validateInput(input, maxValue, errorMessage) {
  if (input.value > maxValue && input.value.length > 2) {
    alert(errorMessage);
    input.value = '';
  } else if (input.value > 9 && input.value <= maxValue) {
    input.value = `${input.value[input.value.length - 2]}${
      input.value[input.value.length - 1]
    }`;
  } else if (input.value < 10 && input.value >= 0) {
    if (input.value.length <= 1) {
      input.value = `0${input.value}`;
    } else {
      input.value = `0${input.value[input.value.length - 1]}`;
    }
  }
}

/**
 * Handles the input events when providing the hours
 */
hoursInput.addEventListener('input', (event) => {
  event.preventDefault();
  validateInput(hoursInput, 12, 'Invalid hours within 0-12');
});

/**
 * Handles the input events when providing the minutes
 */
minutesInput.addEventListener('input', (event) => {
  event.preventDefault();
  validateInput(minutesInput, 59, 'Invalid minutes within 0-59');
});

/**
 * Handles the input events when providing the seconds
 */
secondsInput.addEventListener('input', (event) => {
  event.preventDefault();
  validateInput(secondsInput, 59, 'Invalid seconds within 0-59');
});

/**
 * Reuseable code for adding zero leading zero if input is less than 10
 */
function addZero(time) {
  return time < 10 ? `0${time}` : time;
}

/**
 * Functionality to display clock and converting 24 hours to meridian system
 * Also checks the alarm and render list
 */
function clock() {
  const date = new Date();
  const min = date.getMinutes();
  let hours = date.getHours();
  const sec = date.getSeconds();

  let meridian;
  if (hours < 12) {
    meridian = 'AM';
  } else {
    hours -= 12;
    meridian = 'PM';
  }
  const paddedHours = addZero(hours);
  const paddedMinutes = addZero(min);
  const paddedSeconds = addZero(sec);
  const time = `${paddedHours} : ${paddedMinutes} : ${paddedSeconds} ${meridian}`;
  document.getElementById('clock').innerText = time;
  alarmChecker(time);
  renderList();
}
setInterval(clock, 1000);

/**
 * Checks the duplication of an alarm
 */
function duplicateAlarm(time) {
  return alarms.some((element) => element.setTime === time);
}

/**
 * Checks the alarm if alarm and current time are equal alert is shown and alarm is deleted from the array and also the local storage is updated
 * @param {*} time
 */
function alarmChecker(time) {
  alarms.forEach((element) => {
    if (element.setTime === time) {
      alert('Alarm');
      deleteAlarm(element.id);
      saveAlarmsToLocalStorage(); // Save alarms to localStorage
    }
  });
}

/**
 * Deletes the alarm by element ID which was set when alarm was created
 * @param {*} elementId
 */
function deleteAlarm(elementId) {
  alarms = alarms.filter((alarm) => alarm.id !== elementId);
}

/**
 * Reusable function to save alarm to the local storage
 */
function saveAlarmsToLocalStorage() {
  localStorage.setItem('alarms', JSON.stringify(alarms));
}

clock();
/**
 * Handling click event on delete icon to delete the alarm manually
 */
document.addEventListener('click', handleDeleteEvent);
