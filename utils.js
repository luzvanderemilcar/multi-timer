// truncate a string at a specific length from a specific border 
function truncateInput(input, options = { length: 0, border: "start" }) {
  let { length, border } = options;

  if (input) {
    let inputLength = input?.length;

    // If 
    if (length > 0) {
      if (length >= inputLength) {
       return input;
      } else {
      if (border == "end") return input.slice(inputLength - length, inputLength);
      if (border == "start") return input.slice(0, length);
      }
    }
    return input
  }
}

// limit the value for the input field type="number"
function limitInputValue(input, options = { min: 0, max: 50}) {

  let { min, max } = options;

  let value = Number(input);
  let limitedValue;

  if (value) {
    if (value >= min) {
      if (value <= max) {
        limitedValue = value
      } else {
        limitedValue = max;
      }
    } else {
      limitedValue = min
    }
    return String(limitedValue);
  } else {
    return ""
  }
}

// excluding a list of caracter from being typed
function excludeCharacter(input, options = { excludedCharacterList: [".", ","]}) {
  let { excludedCharacterList } = options;

  let characterRegExp = new RegExp(`[${excludedCharacterList.join("")}]$`, "g");
  
  return input.replace(characterRegExp, "");
}

// validate hour input field 
function validateHourInput(hours, options = { min: 0, max: 99, length: 2, border: "end", excludedCharacterList: [".", ","] }) {

  return truncateInput(limitInputValue(excludeCharacter(hours, options), options), options);
}

// validate minute input field 
function validateMinuteInput(minutes, options = { min: 0, max: 59, length: 2, border: "end", excludedCharacterList: [".", ","]}) {

  return truncateInput(limitInputValue(excludeCharacter(minutes, options), options), options);
}

// validate second input field 
function validateSecondInput(seconds, options = { min: 0, max: 59, length: 2, border: "end", excludedCharacterList: [".", ","] }) {

  return truncateInput(limitInputValue(excludeCharacter(seconds, options), options), options);
}

// Prepend missing zero to acheive an expected length
function prependMissingZeros(input, requiredLength = 2) {
  
  let processedInput = "";
  let inputLength = String(input).length || 0;
  
  let margin = requiredLength - inputLength;
  
  if (margin > 0) {
    while (margin > 0) {
    processedInput += "0";
    margin--;
    }
    processedInput += input;
  } else {
    processedInput += input;
  }
  return processedInput;
}

class State {
  
  #value;
  constructor(initialValue) {
    this.#value = initialValue;
  }
  
  getValue() {
    return this.#value
  }
  
  setValue(value) {
    this.#value = value 
  }
}

function useState(initialValue) {
  let state = initialValue;
  
  function setState(value) {
    state = value;
  }
  
 function getState() {
   return state
 }
  
  return [function(){return getState()}, setState];
}

let a = new State("6");

let [sum, setSum] = useState(6);

setSum(7);

console.log(sum(), a)

export { validateHourInput, validateMinuteInput, validateSecondInput, prependMissingZeros };