class Counter {
  #count;
  #defaultCount;
  #step;

  constructor(initialCount = 600) {
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
    console.log("Timer reset")
  }
}

class View {
  constructor(id) {
    this.display = document.getElementById(id);
    this.screen = this.display.querySelector(".screen");
  }

  updateTime(time) {
    this.screen.innerText = time;
  }

}

class Timer {
  #timerId;

  beepAudio = new Audio("");

  constructor(counter, view) {
    this.hasStarted = false;
    this.counter = counter;
    this.view = view;
    this.displayTime();
  }

  //Counter Decoration 
  increment(timeUnit = "minute") {
    this.changeBy(timeUnit);
  }

  decrement(timeUnit = "minute") {
    this.changeBy(timeUnit, "decrement");
  }

  changeBy(timeUnit, sense = "increment") {
    this.clearTimer();
    let input = timeUnit == "hour" ? 3600 : timeUnit == "minute" ? 60 : 1;
    if (sense === "increment") this.counter.incrementBy(input);
    if (sense === "decrement") this.counter.decrementBy(input);
    this.displayTime();

  }

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
    console.log("Warning !!!")
  }

  start() {
    if (!this.hasStarted) {
      this.#runTimer()
    } else {
      console.log("Timer already started");
    }
  }

  #runTimer() {
    if (this.hasPaused) {
      this.hasPaused = false;
    }
    if (!this.hasStarted) {
      this.hasStarted = true;
    }

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


  pause() {
    if (!this.hasFinished) {
      this.hasPaused = true;
      console.log("Timer paused");
      this.clearTimer();
    }
  }

  resume() {
    if (this.hasPaused && !this.hasFinished) this.#runTimer()
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
    this.hasStarted = false;
    this.hasPaused = false;
    this.hasWarned = false;
    this.hasFinished = true;
  }
}

let count1 = new Counter(0);

let view1 = new View("timer");

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