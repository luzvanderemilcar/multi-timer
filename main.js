class Counter {
  static idArray = [];
  #id;
  #count;
  #defaultCount;
  #step;

  constructor(initialCount = 300) {
    this.#defaultCount = initialCount;
    this.#count = initialCount;
    this.#step = 1;
    this.#id = generateUniqueId(Counter.idArray);
  }

  getCounterId() {
    return this.#id;
  }

  increment() {
    this.#count += this.#step;
  }

  incrementBy(value) {
    this.#count += value;
  }

  decrement() {
    this.#count -= this.#step;
  }

  decrementBy(value) {
    this.#count -= value
  }

  setStep(newStep) {
    this.#step = newStep;
  }

  getStep() {
    return this.#step
  }

  setCount(newCount) {
    this.#count = newCount;
  }

  getCount() {
    return this.#count
  }

  reset() {
    this.#count = this.#defaultCount;
    this.#step = 1;
  }
}

class MiniView {
  miniTimerHTML = `
      <p class="title">timer</p>
      <p class="time"></p>
  `;
  constructor() {
    this.viewIsNormal = false;
  }

  initView() {
    this.miniTimerElement = document.createElement("div");

    this.miniTimerElement.innerHTML = this.miniTimerHTML;
    this.miniTimerElement.setAttribute("id", this.id);
    this.miniTimerElement.classList.add("timer-preview");
    this.titleElement = this.miniTimerElement.querySelector(".title");
    this.miniTimeElement = this.miniTimerElement.querySelector(".time");
    document.querySelector(".timer-list").append(this.miniTimerElement);
  }

  updateTime({ timeFormatted }) {
    this.miniTimeElement.innerHTML = timeFormatted;
  }
  changeTitle(newTitle) {
    this.titleElement.innerHTML = newTitle;
  }
}

class View {
  static timerHTML = `
    <div class="display">
     <div class="title"></div>
     <input class="title hidden" type="text" name="title" maxlength=15 pattern=".{,15}" title="timer name should be at most 15 character long"/>
      <div class="screen">
        <span class="hours time-unit" name="hours">00</span>:<span class="minutes time-unit" name="minutes">00</span>:<span class="seconds time-unit" name="seconds">50</span>
      </div>
      <div class="input-time hidden" >
        <input class="hours hidden" type="number" name="hours" />
        <input class="minutes hidden" type="number" name="minutes" />
        <input class="seconds hidden" type="number" name="seconds" />
      </div>
    </div>
    <div class="controls">
      <div class="timing hidden">
        <button class="decrement">Decrement</button>
        <button class="increment">Increment</button>
      </div>
      <div class="action">
        <button class="start-pause max-button" next="start">Start</button>
        <button class="reset hidden">Reset</button>
      </div>
    </div>
  `;
  
  //implement singleton for view
static #mainView;
static getView() {
  if (!View.#mainView) View.#mainView = new View();
  return View.#mainView;
}

  constructor() {
    this.viewIsNormal = true;
  }


  initView() {
    this.timerElement = document.createElement("div");

    this.timerElement.innerHTML = View.timerHTML;

    this.timerElement.classList.add("timer");

    //Timer display elements 
    this.displayElement = this.timerElement.querySelector(".display");
    this.screen = this.displayElement.querySelector(".screen");
    
    this.titleElement = this.displayElement.querySelector("div.title");
    
    this.titleElement.innerHTML = `<p>timer</p><hr/>`;
    
    this.inputTitleElement = this.displayElement.querySelector("input.title");

    this.hourElement = this.screen.querySelector("span.hours");
    this.minuteElement = this.screen.querySelector("span.minutes");
    this.secondElement = this.screen.querySelector("span.seconds");
    this.timeElements = this.screen.querySelectorAll("span.time-unit");

    //Timer control elements
    this.controls = this.timerElement.querySelector(".controls");
    this.timingControls = this.controls.querySelector(".timing");

    this.startPauseButton = this.controls.querySelector("button.start-pause");
    this.resetButton = this.controls.querySelector("button.reset");

    this.incrementButton = this.controls.querySelector("button.increment");
    this.decrementButton = this.controls.querySelector("button.decrement");
    
// Append
document.body.appendChild(this.timerElement);
  }

  changeTitle(newTitle) {
    this.titleElement.innerHTML = `<p>${newTitle}</p><hr/>`;
  }

  updateTime({ hoursFormatted, minutesFormatted, secondsFormatted }) {
    this.hourElement.innerHTML = hoursFormatted;
    this.minuteElement.innerHTML = minutesFormatted;
    this.secondElement.innerHTML = secondsFormatted;
  }

  reinitDisplay() {
    this.screen.classList.remove("warning");
    this.maximizeStartPause();
    this.hide(this.resetButton);
  }

  runningDisplay() {
    this.removeScreenHighLight();
    this.show(this.resetButton);
    this.hideTimingControls();
    this.restoreStartPause();
  }

  removeScreenHighLight() {
    this.timeElements.forEach(elem => {
      if (elem.classList.contains("highlight")) elem.classList.remove("highlight");
    });
  }
  hide(element) {
    if (!element.classList.contains("hidden")) element.classList.add("hidden")
  }
  show(element) {
    if (element.classList.contains("hidden")) element.classList.remove("hidden")
  }

  hideTimingControls() {
    this.hide(this.timingControls);
  }
  showTimingControls() {
    this.show(this.timingControls);
  }

  maximizeStartPause() {
    if (!this.startPauseButton.classList.contains("max-button")) this.startPauseButton.classList.add("max-button")
  }
  restoreStartPause() {
    if (this.startPauseButton.classList.contains("max-button")) this.startPauseButton.classList.remove("max-button")
  }

  startPauseNext(action) {
    if (["start", "resume", "pause"].includes(action))
      this.startPauseButton.setAttribute("next", action);

    this.startPauseButton.innerHTML = capitalCase(action);

  }
}

function capitalCase(text) {
  return text.replace(/^(?<first>\w)/, (match, first, index, groups) => {
    return first.toUpperCase();
  })
}

class Timer {
  #timerId;
  
  beepAudio = new Audio("/clock_sound_effect_beeping.mp3");

  constructor(counter, view, title="timer") {
    this.hasStarted = false;
    this.criticalCount = 15;
    this.counter = counter;
    currentCounter = counter;

    this.view = view;
    this.view.initView();
    this.changeTitle(title);
    this.displayTime();
    this.addListeners();
  }
  
changeTitle(newTitle) {
if (newTitle?.length > 0) this.title = newTitle;
  this.view.changeTitle(this.title);
}
  changeView(newView) {
    //Remove listendr from old view
    //this.removeListeners();
    
    if (this.view.viewIsNormal) {
   document.body.removeChild(this.view.timerElement);
    } else {
      document.querySelector(".timer-list").removeChild(this.view.miniTimerElement);
    }
    
    this.view = newView;
    this.view.initView();
    this.updateView();
  }

  updateView() {
    this.displayTime();
    this.changeTitle();
    this.addListeners();
    
    // Update view according to Timer state
    if (this.view.viewIsNormal) {
      if (this.hasStarted && this.hasPaused) {
        this.view.restoreStartPause();
        this.view.startPauseNext("resume");

      }
      else if (this.hasStarted & !this.hasFinished) {
        this.view.runningDisplay();
        this.view.startPauseNext("pause");
      }

      else if (!this.hasStarted) {
        this.view.reinitDisplay();
        this.view.startPauseNext("start");
      }
    }
    if (this.hasWarned) {
      this.#warn;
    }
  }

  //Counter Decoration 
  increment(timeUnit = "minutes") {
    this.changeBy(timeUnit);
  }

  decrement(timeUnit = "minutes") {
    this.changeBy(timeUnit, "decrement");
  }

  // timeUnit = hours | minutes | seconds
  // sense = increment | decrement 
  changeBy(timeUnit = "minutes", sense = "increment") {
    this.clearTimer();
    let input = timeUnit === "hours" ? 3600 : timeUnit === "seconds" ? 1 : 60;
    if (sense === "increment") this.counter.incrementBy(input);
    if (sense === "decrement") this.counter.decrementBy(input);
    this.displayTime();
    this.view.startPauseButton.setAttribute("next", "start");
    this.reinit();
  }

  addListeners() {
    if (this.view.viewIsNormal) {
    
    
   this.view.titleElement.addEventListener("dblclick", (e) => {
      let titleElement = e.target;
      
      titleElement.classList.add("hidden");
      
      this.view.inputTitleElement.value = titleElement.innerText;
      this.view.inputTitleElement.classList.remove("hidden");
      this.view.inputTitleElement.focus();
    });
    
    
    this.view.inputTitleElement.addEventListener("blur", (e) =>{
    let value = e.target.value.trim();
      if (value?.length>0 ) {
      this.changeTitle(value);
      }
      
      e.target.classList.add("hidden");
      this.view.titleElement.classList.remove("hidden");
      this.view.titleElement.querySelector("p").classList.remove("hidden");
    });
    
      // Screen
      const setScreenHighlight = (e) => {
        let element = e.target;
        let timeUnit = element.getAttribute("name");

        this.view.screen.setAttribute("highlight", timeUnit);

        this.view.removeScreenHighLight();
        element.classList.add("highlight");
        this.view.showTimingControls();
      }
      this.view.timeElements.forEach(elem => {
        elem.addEventListener("dblclick", setScreenHighlight);
      });

      // controls 
      this.view.incrementButton.addEventListener("click", (e) => {
        let timeUnit = this.view.screen.getAttribute("highlight");
        this.increment(timeUnit);
      });

      this.view.decrementButton.addEventListener("click", (e) => {
        let timeUnit = this.view.screen.getAttribute("highlight");
        this.decrement(timeUnit);
      });

      this.view.startPauseButton.addEventListener("click", () => {
        this.startPause();
      });
      this.view.resetButton.addEventListener("click", () => {
        this.reset();
      });
    } else {
      this.view.miniTimerElement.addEventListener("click", this.maximizeView);
    }
  }
  
maximizeView = () => {
    this.changeView(View.getView());
}

restoreView = () => {
  this.changeView(new miniView());
}


  displayTime() {
    this.view.updateTime(this.getTime())
  }

  changeInnerHTML(element, htmlValue) {
    element.innerHTML = htmlValue
  }

  secondsFromTime(time) {

    let timeRegExp = /^(?<hours>\d{1,2}):(?<minutes>\d{1,2}):(?<seconds>\d{1,2})$|^(?<minutes>\d{1,2}):(?<seconds>\d{1,2})$|^(?<seconds>\d{1,2})$/;

    const resultGroups = time.match(timeRegExp)?.groups;

    if (resultGroups) {
      let { hours, minutes, seconds } = resultGroups;

      let timerCountInSeconds = 0;

      if (hours) timerCountInSeconds += parseInt(hours) * 3600;
      if (minutes) timerCountInSeconds += parseInt(minutes) * 60;
      if (seconds) timerCountInSeconds += parseInt(seconds);

      //set #count in seconds
      return timerCountInSeconds;

    } else {
      throw new Error("time format invalid !");
    }
  }

  getTimerId() {
    if (this.#timerId) return this.#timerId
    throw new Error("Can't Find Timer ID");
  }

  getTime() {
    let timeFormatted = "";
    let hours, hoursFormatted, minutes, minutesFormatted, seconds, secondsFormatted;

    let countProcessing = this.counter.getCount();

    if (countProcessing / 3600 >= 1) {
      hours = Math.floor(countProcessing / 3600);
      hoursFormatted = `${hours<10 ? "0": ""}${hours}`;
      countProcessing -= hours * 3600;
    } else {
      hoursFormatted = "00"
    }
    timeFormatted += hoursFormatted + ":";

    if (countProcessing / 60 >= 1) {
      minutes = Math.floor(countProcessing / 60);
      minutesFormatted = `${minutes<10 ? "0": ""}${minutes}`;
      countProcessing -= minutes * 60;
    } else {
      minutesFormatted = "00"
    }
    timeFormatted += minutesFormatted + ":";

    secondsFormatted = `${countProcessing<10 ? "0": ""}${countProcessing}`;

    timeFormatted += secondsFormatted;
    return {
      timeFormatted,
      hoursFormatted,
      minutesFormatted,
      secondsFormatted
    }
  }

  #beep(audio, duration = 5) {
    try {
      audio.play();
      audio.loop = true;

      setTimeout(() => {
        this.#stopBeep(audio);
      }, duration * 1000);
    } catch (e) {
      console.error(e)
    }
  }

  #stopBeep(audio) {
    audio.pause();
    audio.currentTime = 0;
  }

  #warn() {
    console.log("Warning !!!");
    if (this.view.viewIsNormal) {
      this.view.screen.classList.add("warning");
    } else {
      this.view.miniScreen.classList.add("warning");
    }
  }

  startPause() {

    if (!this.hasStarted) {
      this.#runTimer();
    }
    else if (this.hasStarted && this.hasPaused) {
      this.#resume();
      console.log("Timer already started");
    }
    else if (this.hasStarted) {
      this.#pause();
    }
    if (this.view.viewIsNormal) {
      this.view.hideTimingControls();
      this.view.runningDisplay();
    }
  }

  #runTimer() {

    this.#timerId = setInterval(() => {
      this.counter.decrementBy(1);
      this.displayTime();

      if (this.counter.getCount() === 0) {
        console.log("Time over")
        this.#beep(this.beepAudio, 10);

        this.clearTimer();
        this.hasFinished = true;
      }

      else if (this.counter.getCount() <= this.criticalCount && !this.hasWarned) {
        this.#warn();
        this.hasWarned = true;
      }
    }, 1000);

    if (this.hasPaused) this.hasPaused = false;
    if (!this.hasStarted) this.hasStarted = true;
    if (this.view.viewIsNormal) this.view.startPauseNext("pause");
  }

  #pause() {
    if (!this.hasFinished) {
      this.hasPaused = true;
      console.log("Timer paused");
      if (this.view.viewIsNormal) this.view.startPauseNext("resume");
      this.clearTimer();
    }
  }

  #resume() {
    if (this.hasPaused && !this.hasFinished) {
      this.#runTimer();
      if (this.view.viewIsNormal) this.view.startPauseNext("pause");
      console.log("Timer resumed")
    }
  }

  clearTimer() {
    if (this.#timerId) {
      clearInterval(this.#timerId);
      this.#timerId = null;
    }
  }

  reset() {
    this.counter.reset();
    this.clearTimer();
    this.reinit();

    this.displayTime();
    if (this.view.viewIsNormal) {
      this.view.removeScreenHighLight();
      this.view.startPauseNext("start");
    }
  }

  reinit() {
    this.hasStarted = false;
    this.hasPaused = false;
    this.hasWarned = false;
    this.hasFinished = false;
    
    if (this.view.viewIsNormal) this.view.reinitDisplay();
  }
}

function hide(element) {
  if (!element.classList.contains("hidden")) element.classList.add("hidden")
}


const inputTimeField = document.querySelector(".input-time");

screen.addEventListener("dblclick", editTime)


//DOM
function editTime() {
  //inputTimeField.value = this.innerText;
  console.log(inputTimeField);

  this.classList.add("hidden");
  inputTimeField.classList.remove("hidden");
}

const counters = [];
let currentCounter;

let count1 = new Counter(30);

let view1 = new View();
let minView1 = new MiniView()

const timer = new Timer(count1, View.getView());

setTimeout(() => { timer.changeView(minView1) }, 7000)
//setTimeout(() => { timer.changeView(new MiniView()) }, 5000)

// Dom elements
const timerList = document.querySelector(".timer-list");
const addTimer = document.querySelector(".add-timer");

addTimer.addEventListener("click", setNewCounter);

function saveCurrentCounter() {
  counters.push(currentCounter);
}

function setNewCounter() {
  if (askToSaveCounter()) saveCurrentCounter();
  timer.setCounter();
}

function askToSaveCounter() {
  let answer = prompt(`Save the timer ?
  Type y for yes and n for no`);

  return answer.trim().toLowerCase() === "y" ? true : false
}

function generateUniqueId(idArray, maxId = 1000000) {
  let id;
  while (!id) {
    let candidateId = Math.floor(Math.random() * maxId) + 1;
    if (!idArray.includes(candidateId)) id = candidateId;
  }
  idArray.push(id);
  return id
}