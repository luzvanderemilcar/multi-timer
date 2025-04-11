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
//initializeSavedTimers([{title: "All event", time: "3:30:00", initAsCurrent: false}, {title: "Introducing talk", time: "00:10:00", initAsCurrent: true},{title: "Second talk", time: "10:00", initAsCurrent: false}, {title: "Concluding talk", time: "30:00", initAsCurrent: false}, ]);

initializeSavedTimers([{title: "Trezò", time: "9:30", initAsCurrent: true}, {title: "Kòmantè", time: "0:30", initAsCurrent: false}]);

console.log(getTimersDetails());

const timerList = document.querySelector(".timer-list");
const addTimer = document.querySelector(".add-timer");

addTimer.addEventListener("click", setNewTimer);

function setNewTimer() {
  new Timer();
}