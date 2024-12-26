export default class Counter {
  // store ids of the counters initialized
  static idArray = [];
  
  #id;
  #count;
  #defaultCount;
  #step;

  constructor(initialCount) {
    this.getId();
    this.#count = initialCount;
    this.#step = 1;
    this.saveCount();
  }

  //get the counter id
  getId() {
    if (!this.#id) this.#id = generateUniqueId(Counter.idArray);
    return this.#id;
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

  getDefaultCount() {
    return this.#defaultCount
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
    if (!idArray.includes(candidateId)) id =
       candidateId;
  }
  idArray.push(id);
  return id
}