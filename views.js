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
        <span class="hours time-unit" name="hours"></span>:<span class="minutes time-unit" name="minutes"></span>:<span class="seconds time-unit" name="seconds"></span>.<span class="partials time-unit"></span>
        </div>
        <hr/>
        <div class="additional-time warning invisible">
          <span class="info"></span>
        </div>
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
      <div class="input-time-modal hidden">
       <div class="input-time " >
        <input class="hours" type="number" placeholder="00" name="hours" size=2 min=0 max=99 />:
          <input class="minutes" placeholder="00" size=2 type="number" name="minutes" />:
          <input class="seconds" placeholder="00" size=2 type="number" name="seconds" />
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

    this.startPauseButton = this.controls.querySelector("button.start-pause");
    this.resetButton = this.controls.querySelector("button.reset");

    this.inputTimeModal = this.timerElement.querySelector(".input-time-modal");
    this.inputTimeInputContainer = this.inputTimeModal.querySelector(".input-time ");

    this.inputHourElement = this.inputTimeModal.querySelector(".hours");

    this.inputMinuteElement = this.inputTimeModal.querySelector(".minutes");

    this.inputSecondElement = this.inputTimeModal.querySelector(".seconds");
    this.inputTimeElements = this.inputTimeModal.querySelectorAll("input");
    
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
    if (affectPartials && partialsFormatted) this.updatePartials(partialsFormatted);
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
  }

  // set the display to that of a running timer
  runningDisplay() {
    this.restoreStartPause();
    this.startPauseButtonNext("pause");
  }

  //remove the class highlight from the time-unit elements

removeInputTimeHighLight() {
  this.inputTimeElements.forEach(elem => {
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
    this.hideInputTimeModal()
  }
  
  showTimingControls() {
   this.showInputTimeModal()
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
  
  // Input time
  hideInputTimeModal() {
    this.hide(this.inputTimeModal);
  }
  
  showInputTimeModal() {
    this.show(this.inputTimeModal);
  }
}

// Capitalize the first letter of a word
function capitalCase(text) {
  return text.replace(/^(?<first>\w)/, (match, first, index, groups) => {
    return first.toUpperCase();
  })
}

export { View, MiniView }