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
    
    // media query for extended screen sizes
    let extendedScreenMedia = window.matchMedia('min-width:768px');
    
    console.log(extendedScreenMedia);
    
    if (!extendedScreenMedia.matches) {
    this.miniTimerElement.scrollIntoView()
    }
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
        
        <div class="display-item partials-display hidden" >
       <span class="separator partials-separator">.</span>
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
    <button class="open-close-setting" next-action="open">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" ><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/></svg>
      </button>
    <div class="setting-modal hidden">
      <div class="setting-container">
       <form class="setting-form">
        <fieldset>
          <legend>Display additional time</legend>
        <div class="setting-item">
          <input id="disable-additional-time" type="radio" name="hasAdditionalTimeEnabled" value="false">
          <label for="disable-additional-time" >Hide</label>
           <input id="enable-additional-time" type="radio" name="hasAdditionalTimeEnabled" value="true" checked>
          <label for="enable-additional-time" >Show</label>
        </div>
        </fieldset> 
        <hr/>
        <fieldset>
          <legend>Display partials</legend>
        <div class="setting-item">
          <input id="disable-partials" type="radio" name="hasPartialsEnabled" value="false" checked>
          <label for="disable-partials">Hide</label>
           <input id="enable-partials" type="radio" name="hasPartialsEnabled" value="true">
          <label for="enable-partials">Show</label>
        </div>
        <div class="setting-item">
          <select class="partials-type" name="partialsType" disabled >
            <option value="none" selected >None</option>
            <option value="tenth">Tenth (0)</option>
            <option value="hundredth">Hundredth (00)</option>
          </select>
        </div>
        </fieldset>
        <hr/>
        <fieldset>
          <legend>Warning</legend>
          <div class="setting-item">
            <label for="warning-start-input">Visual warning (at seconds)</label>
            <input id="warning-start-input" name="visualWarningStart" type="number" value="15" />
          </div>
          <div class="setting-item">
            <label for="beep-duration-input">Beep duration (in seconds)</label>
            <input id="beep-duration-input" name="beepDuration" type="number" value="10" />
          </div>
        </fieldset>
       <div class="controls">
        <button type="submit">Save</button>
        </div>
       </form>
      </div>
    </div>
  `;
  //21/10/96

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
    this.partialsContainerElement = this.screenElement.querySelector(".partials-display");

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

    // Setting modal
    this.settingButton = this.timerElement.querySelector(".open-close-setting");

    this.settingModal = this.timerElement.querySelector(".setting-modal");
    this.settingForm = this.settingModal.querySelector(".setting-form");

    this.additionalTimeSwichElement = this.settingForm.querySelector('[name="hasAdditionalTimeEnabled"]:checked');
    
    // additional time
    this.enableAdditonalTimeElement = this.settingForm.querySelector('input#enable-additional-time');
    this.disableAdditonalTimeElement = this.settingForm.querySelector('input#disable-additional-time');

    // Partials 
    this.enablePartialsElement = this.settingForm.querySelector('input#enable-partials');
    this.disablePartialsElement = this.settingForm.querySelector('input#disable-partials');
    this.selectPartialsTypeElement = this.settingForm.querySelector('select.partials-type');
    
    // Options
    this.nonePartialsTypeOptionElement = this.settingForm.querySelector('option[value="none"]');
    
    this.tenthPartialsTypeOptionElement = this.settingForm.querySelector('option[value="tenth"]');
    
    // Warning sections


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

  // Setting modal
  showSettingModal() {
    this.show(this.settingModal);
    this.settingButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" ><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>';
    this.settingButton.setAttribute("next-action", "close");
  }

  hideSettingModal() {
    this.hide(this.settingModal);
    this.settingButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/></svg>';
    this.settingButton.setAttribute("next-action", "open");
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
  
  hidePartialsDisplay() {
    this.hide(this.partialsContainerElement);
  }
  
  showPartialsDisplay() {
  this.show(this.partialsContainerElement);
}
}

// Capitalize the first letter of a word
function capitalCase(text) {
  return text.replace(/^(?<first>\w)/, (match, first, index, groups) => {
    return first.toUpperCase();
  })
}

export { View, MiniView }