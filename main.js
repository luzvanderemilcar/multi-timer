class Counter {
  #count;
  #step;
  #timerId;

  beepAudio = new Audio("");

  constructor(initialCount = 600) {
    this.criticalCount = 5;
    this.#step = 1;
    this.hasStarted = false;
    this.observers = [];

    this.#count = initialCount;
    this.remainingCount = initialCount;
  }

  increment() {
    this.reset();
    this.#count += this.#step;
  }

  decrement() {
    this.reset();
    this.#count -= this.#step;
  }

  setStep(newStep) {
    this.#step = newStep;
  }
  getStep() {
    return this.#step
  }

  setCount(newCount) {
    this.#count = newCount;
    this.reset();
  }

  getCount() {
    return this.#count
  }

  
  setCountFromTime(time) {
    this.reset();

    let timeRegExp = /^(?<hours>\d{1,2}):(?<minutes>\d{1,2}):(?<seconds>\d{1,2})$|^(?<minutes>\d{1,2}):(?<seconds>\d{1,2})$|^(?<seconds>\d{1,2})$/;

    const resultGroups = time.match(timeRegExp)?.groups;

    if (resultGroups) {
      let { hours, minutes, seconds } = resultGroups;

      let timerCountInSeconds = 0;

      if (hours) timerCountInSeconds += parseInt(hours) * 3600;
      if (minutes) timerCountInSeconds += parseInt(minutes) * 60;
      if (seconds) timerCountInSeconds += parseInt(seconds);
      //set #count in seconds
      this.#count = timerCountInSeconds;

    } else {
      throw new Error("time format invalid !");
    }
  }

  getTimerId() {
    return this.#timerId
  }
  
// observers 
suscribe(observer) {
  this.observers.push(observer)
}

unsuscribe(observer) {
  this.observers = this.observers.filter(obs => obs != observer) 
}
  notifyCount() {
  this.observers.forEach(obs => {obs.updateCount(this.getCount())
  });
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
    this.remainingCount = this.#count;

    this.#runTimer();
  }

  #runTimer() {
    if (this.hasPaused) {
      this.hasPaused = false;
    }

    this.#timerId = setInterval(() => {
      this.remainingCount--;
      this.notifyCount();
      console.log(this.remainingCount)
      if (this.remainingCount === 0) {
        console.log("Time over")
        this.#beep(this.beepAudio, 2);

        clearInterval(this.#timerId);
        this.#timerId = null;
        this.hasFinished = true;
      }
      else if (this.remainingCount <= this.criticalCount && !this.hasWarned) {
        this.#warn();
        this.hasWarned = true;
      }
    }, 1000);
    this.hasStarted = true;
  }

  pause() {
    if (this.#timerId && !this.hasFinished) {
      this.hasPaused = true;
      console.log("Timer paused");
      clearInterval(this.#timerId);
      this.#timerId = null;
    }
  }

  resume() {
    if (this.hasPaused && !this.hasFinished) this.#runTimer()
  }

  reset() {
    this.remainingCount = this.#count;
    clearInterval(this.#timerId);
    this.#timerId = null;
    this.hasFinished = false;
    this.hasStarted = false;
    this.hasWarned = false;
    this.hasPaused = false;

    console.log("Timer cleared")
  }
}

class View {
  constructor(id) {
    this.display = document.getElementById(id);
    this.screen = this.display.querySelector(".screen");
  }

  updateCount(count) {
    this.screen.innerText = this.getTime(count);
  }
  
  getTime(count) {
    let timeFormatted = "";
    let countProcessing = count;

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

}

class Timer {
  constructor(counter, view) {
    this.counter = counter;
    this.view = view;
    this.initialize();
  }

initialize() {
  this.counter.suscribe(this.view);
  this.counter.notifyCount();
  console.log(this.view.screen,
  this.counter.observers)
}

  start() {
    this.counter.start() //102196
  }
}

let count1 = new Counter(56000);

let view1 = new View("timer");

let timer1 = new Timer(count1, view1);

const inputTimeField = document.querySelector(".input-time");

screen.addEventListener("dblclick", editTime)

console.log(count1.getCount());

//count1.start();
//setTimeout(() => { count1.pause() }, 2000)
//setTimeout(() => { count1.resume() }, 4000);

//DOM
function editTime() {
  //inputTimeField.value = this.innerText;
console.log(inputTimeField);

  this.classList.add("hidden");
  inputTimeField.classList.remove("hidden");
}

//Controls 
const startButton = 0;

function putValueOnScreen(value) {
  screen.innerText = value;
}

//putValueOnScreen("9:50");