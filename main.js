import Timer from "/timer.js"

// initialize session from storage
function initializeStoredTimers(storedTiners) {
  storedTiners.forEach(timer => {
    timer.updateView();
  });
}

// set first timer
(()=>{
  new Timer("1:45", "Reyinyon");
  new Timer("0:30", "Komantè");
  new Timer("4:00", "Lekti piblik");
  new Timer("10:00", "Diskou");
})();

const timerList = document.querySelector(".timer-list");
const addTimer = document.querySelector(".add-timer");

addTimer.addEventListener("click", setNewTimer);

function setNewTimer() {
  new Timer();
}