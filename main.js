class Counter {
  // store ids of the counters initialized
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

  //get the counter id
  getId() {
    return this.#id;
  }


  // Counter manipulations
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
    this.#defaultCount = newCount;
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
  static miniTimerHTML = `
      <p class="title">timer</p>
      <p class="time"></p>
  `;
  constructor() {
    //view size boolean
    this.viewIsMaximum = false;
    this.initView();
  }

  initView() {

    // View from the timerlist
    this.miniTimerElement = document.createElement("div");
    this.miniTimerElement.innerHTML = MiniView.miniTimerHTML;
    this.miniTimerElement.classList.add("timer-preview", 'rounded-corner');

    this.titleElement = this.miniTimerElement.querySelector(".title");
    this.miniTimeElement = this.miniTimerElement.querySelector(".time");
    this.mount();
  }

  mount() {
    document.querySelector(".timer-list").append(this.miniTimerElement);
  }

  unmount() {
    document.querySelector(".timer-list").removeChild(this.miniTimerElement);
  }

  // implementation for updating time from a time string
  updateTime({ timeFormatted }) {
    this.miniTimeElement.innerHTML = timeFormatted;
  }

  // implementation to change the title of the timer
  changeTitle(newTitle) {
    this.titleElement.innerHTML = newTitle;
  }
}

class View {
  static timerHTML = `
    <div class="display rounded-corner">
     <div class="title-container">
     <p class="title" ></p>
     <hr/>
     </div>
     <input class="title hidden" type="text" name="title" maxlength=15 pattern=".{,15}" title="timer name should be at most 15 character long"/>
      <div class="screen">
       <div class="time">
        <span class="hours time-unit" name="hours">00</span>:<span class="minutes time-unit" name="minutes">00</span>:<span class="seconds time-unit" name="seconds">50</span>.<span class="hundredths time-unit">87</span>
        </div>
        <div class="additional-time warning">
          <hr/>
          <span>-</span><span>00:01</span>
        </div>
      </div>
      <div class="input-time hidden" >
        <input class="hours hidden" type="number" name="hours" />
        <input class="minutes hidden" type="number" name="minutes" />
        <input class="seconds hidden" type="number" name="seconds" />
      </div>
    </div>
    <div class="controls">
      <div class="timing hidden">
        <button class="decrement rounded-corner">Decrement</button>
        <button class="increment rounded-corner">Increment</button>
      </div>
      <div class="action">
        <button class="start-pause rounded-corner max-button" next="start">Start</button>
        <button class="reset hidden rounded-corner">Reset</button>
      </div>
    </div>
  `;

  constructor() {
    this.viewIsMaximum = true;
    this.initView();
  }


  initView() {
    this.timerElement = document.createElement("div");

    this.timerElement.innerHTML = View.timerHTML;

    this.timerElement.classList.add("timer");

    //Timer display elements 
    this.displayElement = this.timerElement.querySelector(".display");
    this.screenElement = this.displayElement.querySelector(".screen");
    this.titleContainerElement = this.displayElement.querySelector("div.title-container");
    this.titleElement = this.displayElement.querySelector("p.title");

    this.titleElement.innerHTML = `timer`;

    this.inputTitleElement = this.displayElement.querySelector("input.title");

    this.hourElement = this.screenElement.querySelector("span.hours");
    this.minuteElement = this.screenElement.querySelector("span.minutes");
    this.secondElement = this.screenElement.querySelector("span.seconds");
    this.timeElements = this.screenElement.querySelectorAll("span.time-unit");

    //Timer control elements
    this.controls = this.timerElement.querySelector(".controls");
    this.timingControls = this.controls.querySelector(".timing");

    this.startPauseButton = this.controls.querySelector("button.start-pause");
    this.resetButton = this.controls.querySelector("button.reset");

    this.incrementButton = this.controls.querySelector("button.increment");
    this.decrementButton = this.controls.querySelector("button.decrement");

    this.mount();

  }

  // Append

  mount() {
    // select the existing timer if any
    let activeTimerElement = document.querySelector(".timer");

    //remove the existing timer before adding the new one
    if (activeTimerElement) {
      document.body.removeChild(activeTimerElement);
    }
    document.body.appendChild(this.timerElement);
  }

  unmount() {
    document.body.removeChild(this.timerElement);
  }

  changeTitle(newTitle) {
    this.titleElement.innerHTML = newTitle;
  }

  // implementation to update the time according to properties
  updateTime({ hoursFormatted, minutesFormatted, secondsFormatted }) {
    this.hourElement.innerHTML = hoursFormatted;
    this.minuteElement.innerHTML = minutesFormatted;
    this.secondElement.innerHTML = secondsFormatted;
  }

  // reinitialize the timer display to the start
  reinitDisplay() {
    this.screenElement.classList.remove("warning");
    this.maximizeStartPause();
    this.hide(this.resetButton);
  }

  // set the display to that of a running timer
  runningDisplay() {
    this.removeScreenHighLight();
    this.show(this.resetButton);
    this.hideTimingControls();
    this.restoreStartPause();
  }

  //remove the class highlight from the time-unit elements
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

  // Hide and show increment and decrement buttons
  hideTimingControls() {
    this.hide(this.timingControls);
  }
  showTimingControls() {
    this.show(this.timingControls);
  }

  // maximize the startpause button as for the initial look
  maximizeStartPause() {
    if (!this.startPauseButton.classList.contains("max-button")) this.startPauseButton.classList.add("max-button")
  }

  // startpause in running display
  restoreStartPause() {
    if (this.startPauseButton.classList.contains("max-button")) this.startPauseButton.classList.remove("max-button")
  }

  //customize the look of the startpause button according to the next action
  startPauseNext(action) {
    if (["start", "resume", "pause"].includes(action)) {
      this.startPauseButton.setAttribute("next", action);
      this.startPauseButton.innerHTML = capitalCase(action);
    }

  }
}

// Capitalize the first letter of a word
function capitalCase(text) {
  return text.replace(/^(?<first>\w)/, (match, first, index, groups) => {
    return first.toUpperCase();
  })
}

class Timer {
  #timerId;

  // static store of timers and last instantiated timer as currentTimer
  static timers = [];
  static currentTimer;

  constructor(count = 300, title = "Timer") {
    Timer.timers.push(this);
    Timer.currentTimer = this;
    this.audioBeep = new Audio("/clock_sound_effect_beeping.mp3");
    this.maximumView = new View();
    this.view = this.maximumView;

    this.counter = new Counter(count);
    this.hasStarted = false;
    this.criticalCount = 15;

    this.changeTitle(title);
    this.displayTime();
    this.addListeners();
  }

  changeTitle(newTitle) {
    if (newTitle?.length > 0) this.title = newTitle;
    this.view.changeTitle(this.title);
  }
  changeView() {
    //Remove the old view from DOM
    this.view.unmount();

    // if the old view is maximum
    if (this.view.viewIsMaximum) {

      //check if the MiniView class has already been called (if there is an minimum view as property);
      if (this.minimumView) {
        this.view = this.minimumView;
        this.view.mount();
      } else {
        this.view = new MiniView();
        // add event listeners to the newly instantiated view
        this.addListeners();
      }
    } else {
      if (this.maximumView) {
        this.view = this.maximumView;
        this.view.mount();
      } else {
        this.view = new View();
        this.addListeners();
      }
    }

    // update the view to match the current state of the timer (via booleans properties)
    this.updateView();
  }

  updateView() {
    this.displayTime();
    this.changeTitle();

    // Update view according to Timer state

    //if the view is maximum
    if (this.view.viewIsMaximum) {

      //the timer has paused after being started 
      if (this.hasStarted && this.hasPaused) {
        this.view.restoreStartPause();
        this.view.startPauseNext("resume");

      }

      //the timer is running 
      else if (this.hasStarted & !this.hasFinished) {
        this.view.runningDisplay();
        this.view.startPauseNext("pause");
      }
      // the timer has not yet been started 
      else if (!this.hasStarted) {
        this.view.reinitDisplay();
        this.view.startPauseNext("start");
      }
    }

    // the timer has passed the critical time to send visual warning 
    if (this.hasWarned) {
      this.hasWarned = false;
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
    this.view.startPauseNext("start");
    this.reinit();
  }

  addListeners() {
    if (this.view.viewIsMaximum) {

      // Double tap the title to edit it when the timer's maximum
      this.view.titleContainerElement.addEventListener("dblclick", (e) => {
        this.view.titleContainerElement.classList.add("hidden");

        // catch the current value and assign if for modifying
        this.view.inputTitleElement.value = this.view.titleElement.innerText;
        this.view.inputTitleElement.classList.remove("hidden");
        this.view.inputTitleElement.focus();
      });

      //when finish up with title modifications (focus is remove from the input element)
      this.view.inputTitleElement.addEventListener("blur", (e) => {
        let inputElement = e.target;

        //remove blank spaces around input
        let value = inputElement.value.trim();
        if (value?.length > 0) {
          this.changeTitle(value);
        }

        inputElement.classList.add("hidden");
        this.view.titleContainerElement.classList.remove("hidden");
      });

      // Screen highlight to increment or decrement time unit
      const setScreenHighlight = (e) => {
        let element = e.target;
        let timeUnit = element.getAttribute("name");

        this.view.screenElement.setAttribute("highlight", timeUnit);
        // remove highlight from time unit if any
        this.view.removeScreenHighLight();
        element.classList.add("highlight");
        this.view.showTimingControls();
      }
      // add screen highlight for all time unit element out of hundredths
      this.view.timeElements.forEach(elem => {
        if (!elem.classList.contains("hundredths")) elem.addEventListener("dblclick", setScreenHighlight);
      });

      // controls 
      this.view.incrementButton.addEventListener("click", (e) => {
       //get te value of the highlighted time unit
        let timeUnit = this.view.screenElement.getAttribute("highlight");
        this.increment(timeUnit);
      });

      this.view.decrementButton.addEventListener("click", (e) => {
        let timeUnit = this.view.screenElement.getAttribute("highlight");
        this.decrement(timeUnit);
      });

      this.view.startPauseButton.addEventListener("click", () => {
        this.startPause();
      });
      
      this.view.resetButton.addEventListener("click", () => {
        this.reset();
      });
    } else {
  // listeners for mini view
      this.view.miniTimerElement.addEventListener("click", this.maximizeView);
    }
  }

  maximizeView = () => {
  // minimize the view of old timer
    Timer.currentTimer.changeView();
    
    // Maximize the view of the clicked timer()
    this.changeView();
    Timer.currentTimer = this;
  }

// display the time on the screen according to the current count
  displayTime() {
    this.view.updateTime(this.getTime())
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

//Format a time object from count
  getTime() {
    let timeFormatted = "";
    let hours, hoursFormatted, minutes, minutesFormatted, seconds, secondsFormatted;
    
    //get current count
    let countProcessing = this.counter.getCount();
//  seconds greater or equal to one hour
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

// Beep the end of the time
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

// stop the beep and reset his timing
  #stopBeep(audio) {
    audio.pause();
    audio.currentTime = 0;
  }

// Visual warning the time is about to end
  #warn() {
    if (this.view.viewIsMaximum) {
      this.view.screenElement.classList.add("warning");
    } else {
      this.view.miniTimerElement.classList.add("warning");
    }
    this.hasWarned = true;
  }

  startPause() {
//control the action of startpause button according to the state of the timer
    if (!this.hasStarted) {
      this.#runTimer();
    }
    else if (this.hasStarted && this.hasPaused) {
      this.#resume();
    }
    else if (this.hasStarted) {
      this.#pause();
    }
    if (this.view.viewIsMaximum) {
      this.view.hideTimingControls();
      this.view.runningDisplay();
    }
  }

//run the timer whenever it is called 
  #runTimer() {

    this.#timerId = setInterval(() => {
      this.counter.decrementBy(1);
      this.displayTime();
// the countet reach 0
      if (this.counter.getCount() === 0) {
        this.#beep(this.audioBeep, 10);
        this.clearTimer();
        this.hasFinished = true;
      }
// the count is lower than the critical count
      else if (this.counter.getCount() <= this.criticalCount && !this.hasWarned) {
        this.#warn();
      }
    }, 1000);

    if (this.hasPaused) this.hasPaused = false;
    if (!this.hasStarted) this.hasStarted = true;
    if (this.view.viewIsMaximum) this.view.startPauseNext("pause");
  }

// pause the timer
  #pause() {
    if (!this.hasFinished) {
      this.hasPaused = true;

      if (this.view.viewIsMaximum) this.view.startPauseNext("resume");
      
      //clear the timeout
      this.clearTimer();
    }
  }

  #resume() {
    if (this.hasPaused && !this.hasFinished) {
      this.#runTimer();
      if (this.view.viewIsMaximum) this.view.startPauseNext("pause");
    }
  }

  // Clear the timer intervall
  clearTimer() {
    if (this.#timerId) {
      clearInterval(this.#timerId);
      this.#timerId = null;
    }
  }

// reset the counter, the timer and its state 
  reset() {
    this.counter.reset();
    this.clearTimer();
    this.reinit();

    this.displayTime();
    if (this.view.viewIsMaximum) {
      this.view.removeScreenHighLight();
      this.view.startPauseNext("start");
    }
  }

  //Reinitialize the timer state (boolean value)
  reinit() {
    this.hasStarted = false;
    this.hasPaused = false;
    this.hasWarned = false;
    this.hasFinished = false;

// reinitialize the display of the maximum view if active
    if (this.view.viewIsMaximum) this.view.reinitDisplay();
  }
}

// initialize session from storage
function initializeStoredTimers(storedTiners) {
  storedTiners.forEach(timer => {
    timer.updateView();
  });
}

let timer1 = new Timer(600, "etoile");

const timerList = document.querySelector(".timer-list");
const addTimer = document.querySelector(".add-timer");

addTimer.addEventListener("click", setNewTimer);

function setNewTimer() {
  Timer.currentTimer.changeView();
  new Timer();
}

// generate a unique number between 0 and a given one based on an array of ids in use.
function generateUniqueId(idArray, maxId = 1000000) {
  let id;
  
  // loop until a unique number is found
  while (!id) {
    let candidateId = Math.floor(Math.random() * maxId) + 1;
    if (!idArray.includes(candidateId)) id = candidateId;
  }
  idArray.push(id);
  return id
}