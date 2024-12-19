export default class Counter {
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
      this.partialsType = 'tenth'; // none | tenth | hundredth | thousandth
    }

    if (!this.#partialsDetails) {
      let maximumSecond = 359999;

      let value, maximum, minimum, zeros, partialsPerSecond, maximumCount;

      switch (this.partialsType) {
        case "none" :
          value = 1;
          maximum = 1;
          zeros = "";
          partialsPerSecond = 1;
          break;
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
        case 'thousandth':
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