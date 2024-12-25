import Timer from "/timer.js"

// initialize session from storage
function initializeSavedTimers(savedTimers) {
  savedTimers.forEach(timerDetails => {
    new Timer(timerDetails.time, timerDetails.title, timerDetails.initAsCurrent);
  });
}

function getTimersDetails() {
let timerDetails = Timer.timers?.map(timer => {
  return {
    title: timer.title,
    time: timer.getDefaultTime().timeFormatted, 
    initAsCurrent: timer.view.viewIsMaximum
  }
});
return timerDetails;
}


function saveTimersDetails() {
  // local storage for timer details
}

// initialize timers from storage
initializeSavedTimers([{title: "Reyinyon", time: "1:45:00", initAsCurrent: false}, {title: "Komantè", time: "00:00:30", initAsCurrent: true},{title: "Diskou", time: "10:00", initAsCurrent: false}, {title: "Diskou piblik", time: "30:00", initAsCurrent: false}, ]);
//Timer.currentTimer.deleteTimer();

console.log(getTimersDetails());

const timerList = document.querySelector(".timer-list");
const addTimer = document.querySelector(".add-timer");

addTimer.addEventListener("click", setNewTimer);

function setNewTimer() {
  new Timer();
}