// truncate a string at a specific length from a specific border 
function truncateInput(input, options = { length: 0, border: "start" }) {
  let { length, border } = options;

  if (input) {
  let inputLength = input?.length;
  
  // If 
  if (length > 0) {
    if (length >= inputLength) return input;
    if (border == "end") return input.slice(inputLength - length, inputLength);
    if (border == "start") return input.slice(0, length);
  }
  return input
  }
}

function limitInputValue(input, options = { min: 0, max: 50 }) {

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
    return "00"
  }
}

function excludeCharacter(input, options = { characterToExcludeList: [".", ","] }) {
  let { characterToExcludeList } = options;

  let characterRegExp = new RegExp(`[${characterToExcludeList.join("")}]`, "g");
  return input.replace(characterRegExp, "");
}

function sanitizeHourInput(hours, options = { min: 0, max: 99, length: 2, border: "end", characterToExcludeList: [".", ","] }) {

  return truncateInput(limitInputValue(excludeCharacter(hours, options), options), options);
}

function sanitizeMinuteInput(minutes, options = { min: 0, max: 59, length: 2, border: "end", characterToExcludeList: [".", ","] }) {

  return truncateInput(limitInputValue(excludeCharacter(minutes, options), options), options);
}

function sanitizeSecondInput(seconds, options = { min: 0, max: 59, length: 2, border: "end", characterToExcludeList: [".", ","] }) {

  return truncateInput(limitInputValue(excludeCharacter(seconds, options), options), options);
}

export {sanitizeHourInput, sanitizeMinuteInput, sanitizeSecondInput};