import Counter from "/counter.js"
import { View, MiniView } from "/views.js"
import { validateHourInput, validateMinuteInput, validateSecondInput, prependMissingZeros } from "/utils.js";

export default class Timer {
  #timerId;
  #partials;
  #partialsDetails;
  #status = "pending"; // pending | running | paused | ended | reset
  
  // static store of timers and last instantiated timer to the maximum view as currentTimer
  static timers = [];
  static currentTimer;
  static lastCurrentTimer;
  
  constructor(time = "05:00", title = "Timer", initAsCurrent = true) {
    
    if (initAsCurrent) {
      if (Timer.currentTimer) {
        Timer.lastCurrentTimer = Timer.currentTimer;
        Timer.currentTimer.changeView()
      }
      
      Timer.currentTimer = this;
    }
    Timer.timers.push(this);
    
    this.counter = new Counter(this.getTimeUnitFromTime(time, "partials"));
    
    
    this.hasStarted = false;
    this.hasTimeFinished = false;
    this.hasWarned = false;
    this.hasAdditionalTimeEnabled = false;
    this.titleLength = 25;
    this.criticalSecond = 15;
    this.beepDurationSecond = 10;
    this.hasPartialsEnabled = false;
    
    this.audioBeep = new Audio("/clock_sound_effect_beeping.mp3");
    
    if (initAsCurrent) {
      this.maximumView = new View();
      this.view = this.maximumView;
    } else {
      this.minimumView = new MiniView();
      this.view = this.minimumView;
    }
    
    this.changeTitle(title);
    this.displayTime();
    this.addListeners();
  }
  
  setStatus(status) {
    if (["pending", "running", "paused", 'stopped', "ended", "reset"].includes(status)) {
      this.#status = status;
    } else {
      throw new Error("UNKNOWN_STATUS_TYPE : " + status);
    }
  }
  
  getStatus() {
    return this.#status;
  }
  
  // Init timer 
  getPartialsDetails() {
    
    if (!this.partialsType) {
      this.partialsType = 'none'; // none | tenth | hundredth 
    }
    
    if (!this.#partialsDetails || this.settingModifying) {
      let maximumSecond = 359999;
      
      let value, maximum, minimum, zeros, partialsPerSecond, maximumCount;
      
      switch (this.partialsType) {
        case "none": {
          value = 1;
          maximum = 1;
          zeros = "";
          partialsPerSecond = 1;
          break;
        }
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
          
      }
      maximumCount = maximumSecond * partialsPerSecond;
      
      this.#partialsDetails = { value, type: this.partialsType, maximum, minimum: 1, zeros, partialsPerSecond, maximumCount };
    }
    return this.#partialsDetails;
  }
  
  setPartialsType(type) {
    let validTypes = ["none", "tenth", "hundredth"];
    if (validTypes.includes(type)) {
      
      this.clearTimer();
      
      let time = this.getTime(this.counter.getCount(), this.getPartialsDetails(), true).timeFormatted;
      
      this.partialsType = type;
      
      if (type == "none" && this.viewIsMaximum) this.view.hidePartialsDisplay();
      
      let newCount = this.getTimeUnitFromTime(time, "partials");
      
      this.counter.setCount(newCount);
      
      this.displayTime();
      this.reinit();
    }
  }
  
  
  setSetting({ hasAdditionalTimeEnabled, hasPartialsEnabled, partialsType, visualWarningStart, beepDuration }) {
    
    this.settingModifying = true;
    
    this.hasPartialsEnabled = hasPartialsEnabled.value;
    this.setPartialsType(partialsType.value);
    
    this.hasAdditionalTimeEnabled = hasAdditionalTimeEnabled.value;
    
    this.criticalSecond = parseInt(visualWarningStart.value);
    this.beepDurationSecond = parseInt(beepDuration.value);
    
    setTimeout(() => {
      this.settingModifying = false;
    }, 5000)
  }
  changeTitle(newTitle) {
    // if value entered is not empty
    if (newTitle?.length > 0) this.title = newTitle.slice(0, this.titleLength);
    
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
      if (this.getStatus() == "paused") {
        this.view.restoreStartPause();
        this.view.startPauseButtonNext("resume");
      }
      
      //the timer is running 
      else if (this.getStatus() == "running") {
        this.view.runningDisplay();
      }
      // the timer has not yet been started 
      else if (this.getStatus() == 'pending') {
        this.view.reinitDisplay();
      }
      // the time is over
      else if (this.getStatus() == "ended") {
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
    
    let partialsDetails = this.getPartialsDetails();
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
    this.reinit();
  }
  
  addListeners() {
    if (this.view.viewIsMaximum) {
      
      // Double tap the title to edit it when the timer's maximum
      this.view.titleContainerElement.addEventListener("click", (e) => {
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
      
      const saveInputTime = () => {
        
        let hours = this.view.inputHourElement.value;
        let minutes = this.view.inputMinuteElement.value;
        let seconds = this.view.inputSecondElement.value;
        
        //stop the timer
        this.clearTimer();
        this.setCountFromTime(hours, minutes, seconds);
        
        this.view.hideTimingControls();
      };
      
      // input focus event
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
              processedValue = validateHourInput(element.value);
              break;
              
            case 'minutes':
              processedValue = validateMinuteInput(element.value);
              break;
              
            case 'seconds':
              processedValue = validateSecondInput(element.value);
              break;
          }
          element.value = processedValue;
          
        });
        
        inputElement.addEventListener("blur", (e) => {
          let element = e.target;
          let requiredInputLength = Number(element.getAttribute("size"));
          
          // set the value to the exact length 
          element.value = prependMissingZeros(element.value, requiredInputLength);
          
          if (element.classList.contains("highlight")) {
            element.classList.remove("highlight")
          }
        });
      });
      
      // Save time input on Enter keypress in last input field
      this.view.inputSecondElement.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          saveInputTime();
        }
      });
      
      // Save count from time input
      this.view.setTimeButton.addEventListener("click", () => {
        saveInputTime()
      });
      
      this.view.cancelSetTimeButton.addEventListener("click", () => {
        this.view.hideTimingControls()
      });
      
      // Setting modal listeners 
      
      this.view.settingButton.addEventListener("click", () => {
        
        if (this.view.settingButton.getAttribute("next-action") == "open") {
          this.view.showSettingModal();
          
        } else {
          this.view.hideSettingModal();
        }
      });
      
      this.view.settingModal.addEventListener("click", (e) => {
        
        if (!e.target.closest(".setting-container")) {
          //this.view.settingForm.submit();
        }
      });
      
      // radio button click
      
      this.view.enablePartialsElement.addEventListener("click", () => {
        if (this.view.selectPartialsTypeElement.hasAttribute('disabled')) this.view.selectPartialsTypeElement.removeAttribute('disabled');
        this.view.selectPartialsTypeElement.focus();
        
        if (this.view.nonePartialsTypeOptionElement.hasAttribute('selected')) {
          // select tenth if "none" option is selected 
          /*  this.view.nonePartialsTypeOptionElement.removeAttribute('checked');
            this.view.tenthPartialsTypeOptionElement.setAttribute('checked', "");
            */
          console.log("None")
        }
        
        this.view.showPartialsDisplay();
      });
      
      this.view.disablePartialsElement.addEventListener("click", () => {
        
        // change select type to value none if click on disable partials
        if (this.view.selectPartialsTypeElement.value !== "none") this.view.selectPartialsTypeElement == "none";
        
        if (!this.view.selectPartialsTypeElement.hasAttribute('disabled')) this.view.selectPartialsTypeElement.setAttribute('disabled', "");
        
        this.view.hidePartialsDisplay();
      });
      
      this.view.selectPartialsTypeElement.addEventListener("blur", (e) => {
        if (e.target.value == "none") {
          // if "none" option is selected on blur, disable partials
          this.view.disablePartialsElement.click();
        }
      });
      
      this.view.settingForm.addEventListener("submit", (e) => {
        let form = e.target;
        
        e.preventDefault();
        
        this.setSetting(form.elements);
        
        console.log(this.hasAdditionalTimeEnabled)
        
        this.view.hideSettingModal();
      });
      
    } else {
      // listeners for mini view
      this.view.miniTimerElement.addEventListener("click", this.maximizeView);
    }
  }
  
  maximizeView = () => {
    // minimize the view of old timer
    Timer.currentTimer?.changeView();
    
    // Maximize the view of the clicked timer()
    this.changeView();
    Timer.currentTimer = this;
  }
  
  getTimeValue(timeUnit = "minutes", type = "string") {
    let timeValues = this.getTime(this.counter.getCount(), this.getPartialsDetails());
    
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
    let { partialsPerSecond } = this.getPartialsDetails();
    
    let hoursCount = Number(hours) * 3600 * partialsPerSecond;
    let minutesCount = Number(minutes) * 60 * partialsPerSecond;
    let secondsCount = Number(seconds) * partialsPerSecond;
    
    let newCount = hoursCount + minutesCount + secondsCount + Number(partials);
    
    this.counter.setCount(newCount);
    
    // Reinit state
    this.displayTime();
    this.reinit();
  }
  
  // display the time on the screen according to the current count
  displayTime() {
    
    let count = this.counter.getCount();
    let partialsDetails = this.getPartialsDetails();
    let timeInfos = this.getTime(count, partialsDetails);
    
    // boolean to show hours or not based on the view size
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
        break;
      case 'tenth':
        partialsString = hasTimeNotFinished ? `${partialsCount}` : partialsZeros;
        break;
      case 'hundredth':
        partialsString = !hasTimeNotFinished ? partialsZeros : partialsCount > 9 ? `${partialsCount}` : `0${partialsCount}`;
        break;
    }
    
    return partialsString;
  }
  
  getTimeUnitFromTime(time, targetTimeUnit = "seconds") {
    
    let timeRegExp = /^(?<hours>\d{1,2}):(?<minutes>\d{1,2}):(?<seconds>\d{1,2})$|^(?<minutes>\d{1,2}):(?<seconds>\d{1,2})$|^(?<seconds>\d{1,2})$/;
    
    const resultGroups = time.match(timeRegExp)?.groups;
    
    if (resultGroups) {
      let { hours, minutes, seconds } = resultGroups;
      
      let timerCountInSeconds = 0;
      
      if (hours) timerCountInSeconds += parseInt(hours) * 3600;
      if (minutes) timerCountInSeconds += parseInt(minutes) * 60;
      if (seconds) timerCountInSeconds += parseInt(seconds);
      
      let result;
      
      switch (targetTimeUnit) {
        case 'hours':
          result = timerCountInSeconds / 3600
          break;
        case 'minutes':
          result = timerCountInSeconds / 60
          break;
        case 'seconds':
          result = timerCountInSeconds;
          break;
        case 'partials':
          let { partialsPerSecond } = this.getPartialsDetails();
          result = timerCountInSeconds * partialsPerSecond;
          break;
      }
      //set #count in seconds
      return result;
      
    } else {
      if (/[-]\d{2}\w*/g.test(time)) {
        return 0;
      } else {
        throw new Error("Invalid time format !", time);
      }
    }
  }
  minutesFromTime(time) {
    return this.secondsFromTime(time) / 60;
  }
  
  getTimerId() {
    if (this.#timerId) return this.#timerId
    throw new Error("Can't Find Timer ID");
  }
  
  getCounterId() {
    return this.counter?.getId();
  }
  
  getDefaultTime() {
    let defaultCount = this.counter.getDefaultCount();
    let partialsDetails = this.getPartialsDetails();
    
    return this.getTime(defaultCount, partialsDetails, true);
  }
  
  //Format a time object from count
  getTime(count, partialsDetails, showHours = true) {
    let { value: valueInSecond, maximum: partialsMax, partialsPerSecond } = partialsDetails;
    
    let timeFormatted = "";
    let hours, hoursFormatted, minutes, minutesFormatted, seconds, secondsFormatted, isTimeout;
    let secondsPerHour = 3600;
    let secondsPerMinute = 60;
    
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
    let minuteFactor = secondsPerMinute * partialsPerSecond;
    
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
    
    remainingPartials = countProcessing;
    
    let partialsFormatted = this.getPartials(remainingPartials, partialsDetails, !isTimeout);
    
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
    // test if the audio is currently playing before trying to stop it
    if (!audio?.paused) {
      audio.pause();
      audio.currentTime = 0;
    }
  }
  
  // Visual warning the time is about to end
  #warn() {
    if (this.view.viewIsMaximum) {
      this.view.screenElement.classList.add("warning");
    } else {
      this.view.miniTimeElement.classList.add("warning");
    }
    this.hasWarned = true;
  }
  
  startPause() {
    //control the action of startpause button according to the state of the timer
    if (this.getStatus() == "pending" || this.getStatus() == "reset") {
      this.#start();
    }
    else if (this.getStatus() == "ended") {
      this.#stop();
    }
    else if (this.getStatus() == "paused") {
      if (this.view.viewIsMaximum) this.view.runningDisplay();
      this.#resume();
    }
    else if (this.getStatus() == "running") {
      this.#pause();
    }
    if (this.view.viewIsMaximum) {
      this.view.hideTimingControls();
    }
  }
  
  //run the timer whenever it is called 
  #runTimer() {
    let { value: partialsValue, maximum: partialsMax } = this.getPartialsDetails();
    
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
        this.#beep(this.audioBeep, this.beepDuration);
        if (this.view.viewIsMaximum) this.view.startPauseButtonNext("stop");
        
        if (this.getStatus() !== 'ended') {
          this.setStatus('ended');
        }
        
        if (!this.hasAdditionalTimeEnabled) this.#stop();
      }
    }, 1000 * partialsValue);
    
    if (this.getStatus() !== 'running') {
      this.setStatus('running');
    }
  }
  
  #start() {
    this.setStatus('running');
    this.counter.saveCount();
    this.#runTimer();
    
    if (this.view.viewIsMaximum) this.view.runningDisplay();
  }
  
  // pause the timer
  #pause() {
    if (this.getStatus() !== 'paused') {
      this.setStatus('paused');
    }
    if (this.view.viewIsMaximum) {
      if (!this.hasTimeFinished) this.view.startPauseButtonNext("resume");
    }
    //clear the timeout
    this.clearTimer();
  }
  
  #resume() {
    if (this.getStatus() == "paused") {
      this.#runTimer();
      
      if (this.view.viewIsMaximum) {
        this.view.startPauseButtonNext("pause");
      }
      this.setStatus("running");
    }
  }
  
  #stop() {
    if (this.getStatus() == 'ended') {
      this.clearTimer();
      this.#stopBeep(this.audioBeep);
      this.view.maximizeResetButton();
      if (this.getStatus() !== 'stopped') {
        this.setStatus('stopped');
      }
    }
  }
  
  // Clear the timer intervall
  clearTimer() {
    if (this.#timerId) {
      clearInterval(this.#timerId);
      this.#stopBeep(this.audioBeep);
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
    }
  }
  
  //Reinitialize the timer state (boolean value)
  reinit() {
    
    this.hasWarned = false;
    this.setStatus("reset");
    
    // reinitialize the display of the maximum view if active
    if (this.view.viewIsMaximum) this.view.reinitDisplay();
  }
  
  deleteTimer() {
    let counterId = this.getCounterId()
    
    // test if the timer is the current timer in maximum view
    if (this === Timer.currentTimer) {
      Timer.currentTimer = null
    }
    this.view.unmount();
    Counter.idArray = Counter.idArray.filter(id => id !== counterId);
    Timer.timers = Timer.timers?.filter(timer => timer.getCounterId() !== counterId);
  }
}