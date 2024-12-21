import Timer from "/timer.js"

// initialize session from storage
function initializeStoredTimers(storedTiners) {
  storedTiners.forEach(timer => {
    timer.updateView();
  });
}

// set first timer
(()=>{
  new Timer(105, "Reyinyon");
  new Timer(.5, "Komantè");
  new Timer(4, "Lekti an piblik");
  new Timer(10, "Diskou");
})();

const timerList = document.querySelector(".timer-list");
const addTimer = document.querySelector(".add-timer");

addTimer.addEventListener("click", setNewTimer);

function setNewTimer() {
  Timer.currentTimer?.changeView();
  new Timer();
}