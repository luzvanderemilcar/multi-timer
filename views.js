class MiniView {
  static miniTimerHTML = `
      <div class="title-container">
      <p class="title"></p>
      </div>
      <div class="display-time">
      <p class="time"></p>
      </div>
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
    this.miniTimerElement.scrollIntoView(true)
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
    <div class="display">
     <div class="title-container">
     <p class="title" ></p>
     </div>
     
     <!-- Input field to handle the title of the timer -->
     <input class="title-input hidden" type="text" name="title" />
     <hr/>
      <div class="screen">
       <div class="display-time">
       <div class="display-item">
       <label for="hour-display">HH</label>
        <span id="hour-display" class="hours time-unit" name="hours"></span>
        </div>
        <span class="separator">:</span>
        <div class="display-item">
        <label for="minute-display">MM</label>
        <span id="minute-display" class="minutes time-unit" name="minutes"></span>
        </div>
        <span class="separator">:</span>
        <div class="display-item">
        <label for="second-display">SS</label>
        <span id="second-display" class="seconds time-unit" name="seconds"></span>
        </div>
        <span class="separator">.</span>
        <div class="display-item">
        <span class="partials time-unit"></span>
        </div>
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
      <div class="input-time ">
        <div class="input-item">
          <label for="hour-input">HH</label>
          <input id="hour-input" class="hours" type="number" placeholder="00" name="hours" size=2 min=0 max=99 />
        </div>
       <span class="separator">:</span>
        <div class="input-item">
          <label for="minute-input">MM</label>
          <input id="minute-input" class="minutes" placeholder="00" size=2 type="number" name="minutes" />
        </div>
        <span class="separator">:</span>
        <div class="input-item">
          <label for="second-input">SS</label>
          <input id="second-input" class="seconds" placeholder="00" size=2 type="number" name="seconds" />
        </div>
      </div>
      <div class="input-time-controls">
      <button class="set-time max-button rounded-corner">Set</button>
      <button class="cancel-set-time max-button rounded-corner">Cancel</button>
      </div>
    </div>
    <button class="more-setting">:</button>
    <div class="setting-modal hidden">
      <div class="setting-container">
       <form class="setting">
        <fieldset>
          <legend>Display partials</legend>
        <div class="setting-item">
          <input id="show-partials" type="radio" name="partialsSwitch" value="true" checked>
          <label for="show-partials">Show</label>
          <input id="hide-partials" type="radio" name="partialsSwitch" value="false">
          <label for="hide-partials">Hide</label>
        </div>
        <div class="setting-item">
          <select name="partialsType">
            <option value="tenth" checked>Tenth (0)</option>
            <option value="hundredth">Hundredth (00)</option>
            <option value="thousandth">Thousandth (000)</option>
          </select>
        </div>
        </fieldset>
        <hr/>
        <fieldset>
          <legend>Warning</legend>
          <div class="setting-item">
            <label for="warning-start-input">Visual warning (at seconds)</label>
            <input id="warning-start-input" name="visualWarningDuration" type="number" value="15" />
          </div>
          <div class="setting-item">
            <label for="beep-duration-input">Beep duration (in seconds)</label>
            <input id="beep-duration-input" name="beepDuration" type="number" value="10" />
          </div>
        </fieldset>
       </form>
      </div>
    </div>
  `;//21/10/96

  constructor() {
    this.viewIsMaximum = true;
    this.initView();
  }


  initView() {
    this.timerContainer = document.querySelector("main");
    
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
    
    this.setTimeButton = this.inputTimeModal.querySelector(".set-time");
    this.cancelSetTimeButton = this.inputTimeModal.querySelector(".cancel-set-time");
    
    this.mount();

  }

  // Append

  mount() {
    // select the existing timer if any
    let activeTimerElement = this.timerContainer.querySelector(".timer");

    //remove the existing timer before adding the new one
    if (activeTimerElement) {
      this.timerContainer.removeChild(activeTimerElement);
    }
    this.timerContainer.appendChild(this.timerElement);
  }

  unmount() {
    this.timerContainer.removeChild(this.timerElement);
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
    this.startPauseButtonNext("start");
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