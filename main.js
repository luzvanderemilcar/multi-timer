class Counter {
  // store ids of the counters initialized
  static idArray = [];
  #id;
  #count;
  #defaultCount;
  #step;
  #partials;
  #partialsDetails;

  constructor(initialCount) {
    this.#id = generateUniqueId(Counter.idArray);

    this.#count = this.calculatePartialsCount(initialCount);
    this.#step = 1;
    this.saveCount();
  }

  //get the counter id
  getId() {
    return this.#id;
  }

  getPartialsDetails() {
    if (!this.partialsType) {
      this.partialsType = 'tenth'; // tenth | hundredth | thousandth
    }

    if (!this.#partialsDetails) {
      let maximumSecond = 359999;

      let value, maximum, minimum, zeros, partialsPerSecond, maximumCount;

      switch (this.partialsType) {
        case 'tenth':
          value = .1;
          maximum = 10;
          zeros = "0";
          partialsPerSecond = 10;
          break;
        case 'hundredth':
          value = .01;
          maximum = 100;
          zeros = "00";
          partialsPerSecond = 100;
          break;
        case 'thousands':
          value = .001;
          maximum = 1000;
          zeros = "000";
          partialsPerSecond = 1000;
          break;

      }
      maximumCount = maximumSecond * partialsPerSecond;

      this.#partialsDetails = { value, type: this.partialsType, maximum, minimum: 1, zeros, partialsPerSecond, maximumCount };
    }
    return this.#partialsDetails;
  }

  calculatePartialsCount(count) {
    let { partialsPerSecond } = this.getPartialsDetails();
    let secondsPerMinute = 60;
    let partialsCount = count * secondsPerMinute * partialsPerSecond;

    return partialsCount
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
    this.#count -= value;
  }

  setStep(newStep) {
    this.#step = newStep;
  }

  getStep() {
    return this.#step
  }
  
  saveCount() {
    this.#defaultCount = this.#count;
  }

  setCount(newCount) {
    this.#count = newCount;
    this.saveCount()
  }

  getCount() {
    return this.#count
  }


  // reset partials number to 0 if lowest, or greatest depending on the partials' type 

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

  updateAdditionalTime({ timeFormatted }) {
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
     </div>
     <input class="title-input hidden" type="text" name="title" maxlength=15 pattern=".{,15}" title="timer name should be at most 15 character long"/>
     <hr/>
      <div class="screen">
       <div class="time">
        <span class="hours time-unit" name="hours">00</span>:<span class="minutes time-unit" name="minutes">00</span>:<span class="seconds time-unit" name="seconds">50</span>.<span class="partials time-unit">87</span>
        </div>
        <hr/>
        <div class="additional-time warning invisible">
          <span class="info"></span>
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

    this.inputTitleElement = this.displayElement.querySelector("input.title-input");

    this.hourElement = this.screenElement.querySelector("span.hours");
    this.minuteElement = this.screenElement.querySelector("span.minutes");
    this.secondElement = this.screenElement.querySelector("span.seconds");
    this.partialElement = this.screenElement.querySelector("span.partials");
    this.timeElements = this.screenElement.querySelectorAll("span.time-unit");
this.additionalTimeContainerElement = this.screenElement.querySelector("div.additional-time");

    this.additionalTimeElement = this.additionalTimeContainerElement.querySelector("span.info");

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
  updateTime({ hoursFormatted, minutesFormatted, secondsFormatted, partialsFormatted }, affectPartials = true) {
    this.hourElement.innerHTML = hoursFormatted;
    this.minuteElement.innerHTML = minutesFormatted;
    this.secondElement.innerHTML = secondsFormatted;
    if (affectPartials) this.updatePartials(partialsFormatted);
  }

  updatePartials(partialsString) {
    this.partialElement.innerText = partialsString;
  }

  updateAdditionalTime({ timeFormatted }) {
    this.additionalTimeElement.textContent = timeFormatted;
  }
  // reinitialize the timer display to the start
  reinitDisplay() {
    this.screenElement.classList.remove("warning");
    this.maximizeStartPause();
   // this.updateAdditionalTime({ timeFormatted: "-00:00" });
  }

  // set the display to that of a running timer
  runningDisplay() {
    this.removeScreenHighLight();
    this.hideTimingControls();
    this.restoreStartPause();
    this.startPauseButtonNext("pause");
  }

  //remove the class highlight from the time-unit elements
  removeScreenHighLight() {
    this.timeElements.forEach(elem => {
      if (elem.classList.contains("highlight")) elem.classList.remove("highlight");
    });
  }
  
  // hide element while keeping its space on the documen
  makeInvisible(element) {
    if (!element.classList.contains("invisible")) element.classList.add("invisible")
  }
makeVisible(element) {
  if (element.classList.contains("invisible")) element.classList.remove("invisible")
}

// hide element and its space on the document
  hide(element) {
    if (!element.classList.contains("hidden")) element.classList.add("hidden")
  }
  show(element) {
    if (element.classList.contains("hidden")) element.classList.remove("hidden")
  }
  
  // hide and show additional time display
  
  hideAdditionalTime() {
    this.makeInvisible(this.additionalTimeContainerElement)
  }
  
showAdditionalTime() {
  this.makeVisible(this.additionalTimeContainerElement)
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
    
    this.hide(this.resetButton);
    
    if (!this.startPauseButton.classList.contains("max-button")) this.startPauseButton.classList.add("max-button");
  }

  // startpause in running display
  restoreStartPause() {
    if (this.startPauseButton.classList.contains("max-button")) this.startPauseButton.classList.remove("max-button");
    this.show(this.resetButton);
  }

  //customize the look of the startpause button according to the next action
  startPauseButtonNext(action) {
    if (["start", "resume", "pause", "stop"].includes(action)) {
      this.startPauseButton.setAttribute("next", action);
      this.startPauseButton.innerHTML = capitalCase(action);
      if (action === "start") this.maximizeStartPause();
      if (action === "pause" || action === "resume") this.restoreStartPause();
    }
  }

  maximizeResetButton() {
    this.hide(this.startPauseButton);
    if (!this.resetButton.classList.contains("max-button")) this.resetButton.classList.add("max-button");
  }

  restoreResetButton() {
    if (this.resetButton.classList.contains("max-button")) this.resetButton.classList.remove("max-button");
    this.show(this.startPauseButton);
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

  constructor(count = 5, title = "Timer") {
    Timer.timers.push(this);
    Timer.currentTimer = this;
    this.audioBeep = new Audio("/clock_sound_effect_beeping.mp3");

    this.counter = new Counter(count);

    this.hasStarted = false;
    this.hasTimeFinished = false;
    this.hasWarned = false;
    this.hasAdditionalTimeEnabled = true;
    this.criticalSecond = 15;

    this.maximumView = new View();
    this.view = this.maximumView;

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
        this.view.startPauseButtonNext("resume");
      }

      //the timer is running 
      else if (this.hasStarted & !this.hasTimeFinished) {
        this.view.runningDisplay();
      }
      // the timer has not yet been started 
      else if (!this.hasStarted) {
        this.view.reinitDisplay();
      }
      
      else if (this.hasTimeFinished) {
        this.view.startPauseButtonNext("stop");
      }
    }
    // the timer has passed the critical time to send visual warning 
    if (this.hasWarned) this.#warn();
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
    let count = this.counter.getCount();
    let partialsDetails = this.counter.getPartialsDetails();
    let { remainingPartials: partials } = this.getTime(count, partialsDetails);

    let { partialsPerSecond, maximumCount } = partialsDetails;

    let input = timeUnit === "hours" ? 3600 * partialsPerSecond : timeUnit === "seconds" ? 1 * partialsPerSecond : 60 * partialsPerSecond;

    let nextCount;

    if (sense === "increment") {
      nextCount = count + input - partials;
      // test the next probable value of coun is not greater than maximum seconds of the timer capability
      if (nextCount <= maximumCount) {
        this.counter.incrementBy(input - partials);
      } else {
        console.log("Can't set timer with greater time");
      }
    }
    
    if (sense === "decrement") {
      nextCount = count - input - partials;
      // test the sign of the next probable value of count
      if (nextCount >= 0) {
        this.counter.decrementBy(input + partials);
      } else {
        console.log("Can't set timer with negative time");
      }
    }
    this.displayTime();
    this.view.startPauseButtonNext("start");
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
      // add screen highlight for all time unit element out of partials
      this.view.timeElements.forEach(elem => {
        if (!elem.classList.contains("partials")) elem.addEventListener("dblclick", setScreenHighlight);
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
  
    let count = this.counter.getCount();
    let partialsDetails = this.counter.getPartialsDetails();
    let timeInfos = this.getTime(count, partialsDetails);
    
    // boolean to show hours or not based on the view sisze
    let showHours = this.view.viewIsMaximum ? false : true;

// the time has ended
    if (count >= 0) {
      this.view.updateTime(timeInfos);
      
      //boolean to control additionalTime display is clear
      let clearAdditionalTimeDisplay;
      
      if (!clearAdditionalTimeDisplay && !showHours)
      {
        this.view.updateAdditionalTime(this.getTime(0, partialsDetails, showHours));
        this.view.hideAdditionalTime();
        clearAdditionalTimeDisplay = true;
      }
    } else {
      let hasClearMainTimeDisplay;

      if (!hasClearMainTimeDisplay && !showHours) {
        // clear main time display on view change
        this.view.updateTime(this.getTime(0, partialsDetails));
        this.view.showAdditionalTime();
        
        hasClearMainTimeDisplay = true;
      }

      this.view.updateAdditionalTime(this.getTime(count, partialsDetails, showHours));
    }
  }

  getPartials(partialsCount, partialsDetails, hasTimeNotFinished) {
    let { maximum: partialsMax, type: partialsType, zeros: partialsZeros } = partialsDetails;
    let partialsString;

    switch (partialsType) {
      case 'tenth':
        partialsString = hasTimeNotFinished ? `${partialsCount}` : partialsZeros;
        break;
      case 'hundredth':
        partialsString = !hasTimeNotFinished ? partialsZeros : partialsCount > 9 ? `${partialsCount}` : `0${partialsCount}`;
        break;
      case 'thousands':
        partialsString = !hasTimeNotFinished ? partialsZeros : partialsCount > 99 ? `${partialsCount}` : partialsCount > 9 && partialsCount <= 99 ? `0${partialsCount}` : `00${partialsCount}`;
        break;
    }

    return partialsString;
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
  getTime(count, partialsDetails, showHours = true) {
    let { value: valueInSecond, maximum: partialsMax, partialsPerSecond } = partialsDetails;

    let timeFormatted = "";
    let hours, hoursFormatted, minutes, minutesFormatted, seconds, secondsFormatted, isTimeout;
    let secondsPerHour = 3600;
    let secondsPerMinutes = 60;

    let remainingPartials;

    // Set the sign for the time formatted string
    if (count < 0) {
      timeFormatted += "-";
      isTimeout = true;
    } else {
      isTimeout = false
    }

    //get current count
    let countProcessing = Math.abs(count);

    let hourFactor = secondsPerHour * partialsPerSecond;

    //  seconds greater or equal to one hour
    if (countProcessing / hourFactor >= 1) {
      hours = Math.floor(countProcessing / hourFactor);

      // prepend 0 if hour number lesser then 10
      hoursFormatted = `${hours<10 ? "0": ""}${hours}`;

      countProcessing -= hours * hourFactor;
    } else {
      hoursFormatted = "00"
    }
    // option boolean whether to show hours or not
    if (showHours) {
      timeFormatted += hoursFormatted + ":";
    }

    //remaining seconds greater or equal to one minute
    let minuteFactor = secondsPerMinutes * partialsPerSecond;

    if (countProcessing / minuteFactor >= 1) {
      minutes = Math.floor(countProcessing / minuteFactor);
      minutesFormatted = `${minutes<10 ? "0": ""}${minutes}`;
      countProcessing -= minutes * minuteFactor;
    } else {
      minutesFormatted = "00"
    }
    timeFormatted += minutesFormatted + ":";
    if (countProcessing / partialsPerSecond >= 1) {
      seconds = Math.floor(countProcessing / partialsPerSecond);

      secondsFormatted = `${seconds<10 ? "0": ""}${seconds}`;
      countProcessing -= seconds * partialsPerSecond;
    }
    else {
      secondsFormatted = "00";
    }
    timeFormatted += secondsFormatted;


    let partialsFormatted = this.getPartials(countProcessing, partialsDetails, !isTimeout);
    remainingPartials = countProcessing;

    return {
      timeFormatted,
      hoursFormatted,
      minutesFormatted,
      secondsFormatted,
      partialsFormatted,
      remainingPartials,
      isTimeout
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
      this.#start();
    }
    else if (this.hasStarted && this.hasTimeFinished) {
      this.#stop();
    }
    else if (this.hasStarted && this.hasPaused) {
      if (this.view.viewIsMaximum) this.view.runningDisplay();
      this.#resume();
    }
    else if (this.hasStarted) {
      this.#pause();
    }
    if (this.view.viewIsMaximum) {
      this.view.hideTimingControls();
    }
  }

  //run the timer whenever it is called 
  #runTimer() {
    let { value: partialsValue, maximum: partialsMax } = this.counter.getPartialsDetails();

    let criticalCount = this.criticalSecond * partialsMax;

    this.#timerId = setInterval(() => {
      this.counter.decrementBy(1);
      this.displayTime();

      // the count is lower than the critical count
      if (this.counter.getCount() <= criticalCount && !this.hasWarned) {
        this.#warn();
      }
      // the countet reach 0
      if (this.counter.getCount() === 0) {
        this.#beep(this.audioBeep, 10);
      if (this.view.viewIsMaximum)  this.view.startPauseButtonNext("stop");
      
        if (!this.hasTimeFinished) {
          this.hasTimeFinished = true;
          if (!this.hasAdditionalTimeEnabled) this.#stop();
        }
      }
    }, 1000 * partialsValue);

    // setValue once 
    if (this.hasPaused) this.hasPaused = false;
    if (!this.hasStarted) this.hasStarted = true;
  }
  
#start() {
  this.hasStarted = true;
  this.counter.saveCount();
  this.#runTimer();
  
  if (this.view.viewIsMaximum) this.view.runningDisplay();
}

  // pause the timer
  #pause() {
    this.hasPaused = true;

    if (this.view.viewIsMaximum) {
      if (!this.hasTimeFinished) this.view.startPauseButtonNext("resume");
    }
    //clear the timeout
    this.clearTimer();
  }

  #resume() {
    if (this.hasPaused) {
      this.#runTimer();

      if (this.view.viewIsMaximum) {
        this.view.startPauseButtonNext("pause");
      }
      this.hasPaused = false;
    }
  }

  #stop() {
    if (this.hasTimeFinished) {
      this.clearTimer();
      this.view.maximizeResetButton();
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
      this.view.restoreResetButton();
      this.view.startPauseButtonNext("start");
    }
  }

  //Reinitialize the timer state (boolean value)
  reinit() {
    this.hasStarted = false;
    this.hasPaused = false;
    this.hasWarned = false;
    this.hasTimeFinished = false;

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

let timer1 = new Timer(1, "etoile");

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