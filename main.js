class Counter {
  #count;
  #defaultCount;
  #step;

  constructor(initialCount = 300) {
    this.#defaultCount = initialCount;
    this.#count = initialCount;
    this.#step = 1;
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

class View {
  timerHTML = `
    <div class="display">
    <div>
    <p class="title"></p>
   <hr>
    </div>
      <div class="screen">
        <span class="minutes">00</span>:<span class="seconds">50</span>
      </div>
      <div class="input-time" hidden>
        <input class="minutes hidden" type="number" name="minutes" />
        <input class="seconds hidden" type="number" name="seconds" />
      </div>
    </div>
    <div class="controls">
      <div>
        <button class="increment">Increment</button>
        <button class="decrement">Decrement</button>
      </div>
      <div>
        <button class="start-pause">Start</button>
        <button class="reset">Reset</button>
      </div>
    </div>
  `;
  
  constructor(id) {
    this.timerDOM = document.createElement("div");
    
    this.timerDOM.innerHTML = this.timerHTML;
    this.timerDOM.setAttribute("id", id);
    this.timerDOM.classList.add("timer");
    this.title = this.timerDOM.querySelector(".title");
    this.title.innerHTML = id;
    
    //Timer display elements 
    this.display = this.timerDOM.querySelector(".display");
    
    //Timer control elements
    this.controls = this.timerDOM.querySelector(".controls");
    
  this.screen = this.display.querySelector(".screen");
 
  this.startPauseButton = this.controls.querySelector("button.start-pause");
  this.resetButton = this.controls.querySelector("button.reset");
  
  this.incrementButton = this.controls.querySelector("button.increment");
    this.decrementButton = this.controls.querySelector("button.decrement");
    
    // Append
    document.body.append(this.timerDOM);
  }

  updateTime(time) {
    this.screen.innerText = time;
  }
  
  reinitDisplay() {
    this.screen.classList.remove("warning");
  }

}

class Timer {
  #timerId;

  beepAudio = new Audio("");

  constructor(counter, view) {
    this.hasStarted = false;
    this.criticalCount = 15;
    this.counter = counter;
    this.view = view;
    this.displayTime();
  
   // this.increment = this.increment.bind(this);
    this.addListeners();
  }

  //Counter Decoration 
  increment(timeUnit = "minute") {
    this.changeBy(timeUnit);
  }

  decrement(timeUnit = "minute") {
    this.changeBy(timeUnit, "decrement");
  }

// timeUnit = hour | minute | second
// sense = increment | decrement 
  changeBy(timeUnit, sense = "increment") {
    this.clearTimer();
    let input = timeUnit == "hour" ? 3600 : timeUnit == "minute" ? 60 : 1;
    if (sense === "increment") this.counter.incrementBy(input);
    if (sense === "decrement") this.counter.decrementBy(input);
    this.displayTime();
    this.changeInnerHTML(this.view.startPauseButton, "Start");
    this.reinit();
  }
  
  addListeners() {
    this.view.incrementButton.addEventListener("click", (e) => {
  let button = e.target;
  let timeUnit = button?.getAttribute("unit") ?? "minute";
  this.increment(timeUnit);
});

this.view.decrementButton.addEventListener("click", (e) => {
  let button = e.target;
  let timeUnit = button?.getAttribute("unit") ?? "minute";
  this.decrement(timeUnit);
});

this.view.startPauseButton.addEventListener("click", ()=>{
  this.startPause();
});
this.view.resetButton.addEventListener("click", () => {
  this.reset();
});
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
    let countProcessing = this.counter.getCount();

    if (countProcessing / 3600 >= 1) {
      let hours = Math.floor(countProcessing / 3600);
      timeFormatted += `${hours<10 ? "0": ""}${hours}:`;
      countProcessing -= hours * 3600;
    }
    if (countProcessing / 60 >= 1) {
      let minutes = Math.floor(countProcessing / 60);
      timeFormatted += `${minutes<10 ? "0": ""}${minutes}:`;
      countProcessing -= minutes * 60;
    } else {
      timeFormatted += "00:"
    }
    timeFormatted += `${countProcessing<10 ? "0": ""}${countProcessing}`;
    return timeFormatted
  }

  #beep(audio, duration = 5) {
    try {
      audio.play()
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
    this.view.screen.classList.add("warning");
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
    
  }

  #runTimer() {
    if (this.hasPaused) {
      this.hasPaused = false;
    }
    if (!this.hasStarted) {
      this.hasStarted = true;
    }
    
this.changeInnerHTML(this.view.startPauseButton, "Pause");

    this.#timerId = setInterval(() => {
      this.counter.decrementBy(1);
      this.displayTime();

      if (this.counter.getCount() === 0) {
        console.log("Time over")
        this.#beep(this.beepAudio, 2);

        this.clearTimer();
        this.hasFinished = true;
      }

      else if (this.counter.getCount() <= this.criticalCount && !this.hasWarned) {
        this.#warn();
        this.hasWarned = true;
      }
    }, 1000);
  }


  #pause() {
    if (!this.hasFinished) {
      this.hasPaused = true;
      console.log("Timer paused");
      this.changeInnerHTML(this.view.startPauseButton, "Resume");
      this.clearTimer();
    }
  }

  #resume() {
    if (this.hasPaused && !this.hasFinished) {
      this.#runTimer();
      this.changeInnerHTML(this.view.startPauseButton, "Pause");
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
    this.displayTime();
    this.reinit();
    this.view.startPauseButton.innerText = "Start";
  }
  
  reinit() {
    this.hasStarted = false;
    this.hasPaused = false;
    this.hasWarned = false;
    this.hasFinished = true;
    this.view.reinitDisplay()
  }
}

let count1 = new Counter();

let view1 = new View("timer1");

let timer = new Timer(count1, view1);

const inputTimeField = document.querySelector(".input-time");

screen.addEventListener("dblclick", editTime)


//DOM
function editTime() {
  //inputTimeField.value = this.innerText;
  console.log(inputTimeField);

  this.classList.add("hidden");
  inputTimeField.classList.remove("hidden");
}