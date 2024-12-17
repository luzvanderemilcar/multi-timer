import Counter from "/counter.js"
import { View, MiniView } from "/views.js"
import { sanitizeHourInput, sanitizeMinuteInput, sanitizeSecondInput } from "/utils.js";

export default class Timer {
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
      // the time is over
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
        this.view.inputTitleElement.select();
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
        this.view.showTimingControls();

        //set the current value of the inputs
        this.view.inputTimeElements.forEach(inputElement => {
          let inputTimeUnit = inputElement.getAttribute("name");
          let caughtValue = this.getTimeValue(inputTimeUnit);
          inputElement.value = caughtValue;

          if (timeUnit == inputTimeUnit) {
            inputElement.focus();
          }
     
        });
      }
      // add screen highlight for all time unit element out of partials
      this.view.timeElements.forEach(elem => {
        if (!elem.classList.contains("partials")) elem.addEventListener("click", setScreenHighlight);
      });

      // controls 

      this.view.startPauseButton.addEventListener("click", () => {
        this.startPause();
      });

      this.view.resetButton.addEventListener("click", () => {
        this.reset();
      });
      // save time input 
      this.view.inputTimeModal.addEventListener("click", (e) => {
        if (!e.target.closest("div.input-time")) {
       
          let hours = this.view.inputHourElement.value;
          let minutes = this.view.inputMinuteElement.value;
          let seconds = this.view.inputSecondElement.value;
          
          this.setCountFromTime(hours, minutes, seconds);
          
          this.view.hideInputTimeModal()
        }
      });

      // input hour
      this.view.inputTimeElements.forEach(inputElement => {
        inputElement.addEventListener("focus", (e) => {
          let element = e.target;

          if (!element.classList.contains("highlight")) {
            element.classList.add("highlight");
            element.select();
          }
        });

        inputElement.addEventListener("input", (e) => {
          let element = e.target;
          let timeUnit = element.getAttribute("name");
          let processedValue;

          switch (timeUnit) {
            case 'hours':
              processedValue = sanitizeHourInput(element.value);
              break;

            case 'minutes':
              processedValue = sanitizeMinuteInput(element.value);
              break;

            case 'seconds':
              processedValue = sanitizeSecondInput(element.value);
              break;
          }
          element.value = processedValue;

        });

        inputElement.addEventListener("blur", (e) => {
          let element = e.target;
          if (element.classList.contains("highlight")) {
            element.classList.remove("highlight")
          }
        });
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

  getTimeValue(timeUnit = "minutes", type = "string") {
    let timeValues = this.getTime(this.counter.getCount(), this.counter.getPartialsDetails());

    let value;

    switch (timeUnit) {
      case 'hours':
        value = timeValues.hoursFormatted;
        break;
      case 'minutes':
        value = timeValues.minutesFormatted;
        break;
      case 'seconds':
        value = timeValues.secondsFormatted;
        break;
      case 'partials':
        value = timeValues.partialsFormatted;
        break;

    }

    if (type === "number") value = parseInt(value);

    return value;
  }

  setCountFromTime(hours, minutes, seconds, partials = 0) {
    let { partialsPerSecond } = this.counter.getPartialsDetails();

    let hoursCount = Number(hours) * 3600 * partialsPerSecond;
    let minutesCount = Number(minutes) * 60 * partialsPerSecond;
    let secondsCount = Number(seconds) * partialsPerSecond;

    let newCount = hoursCount + minutesCount + secondsCount + Number(partials);

    this.counter.setCount(newCount);

    // Reinit state
    this.displayTime();
    this.view.startPauseButtonNext("start");
    this.reinit();
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
      case "none":
        partialsString = "";
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
        if (this.view.viewIsMaximum) this.view.startPauseButtonNext("stop");

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