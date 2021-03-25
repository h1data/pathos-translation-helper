// table to convert above multiple concepts
const keyMap =
  {
    "AppearanceName": "ItemName",
  };

// output data duplicate lines in JSON
function checkDuplicates(id, mode) {
  console.log('checkDuplicates');
  let sheetName = sheetNames[0];  // fixed to dictionary
  let inputArray = SpreadsheetApp.openById(id).getSheetByName(sheetName).getDataRange().getValues();
  let midArray = new Array();
  let counts = {};
  let outputArray = new Array();
  for (let i = 1; i < inputArray.length; i++) {
    let output;
    let key = keyMap[inputArray[i][1]];
    console.info('concept=' + inputArray[i][1] + ', key=' + key);
    if (keyMap[inputArray[i][1]] === undefined) {
      key = inputArray[i][1];
    }
    if (mode == '0') {  // normal
      if (inputArray[i][4] == '') {
        output = [inputArray[i][0], inputArray[i][1], inputArray[i][2], inputArray[i][3]];
        key += inputArray[i][3];
      } else {
        output = [inputArray[i][0], inputArray[i][1], inputArray[i][2], inputArray[i][4]];
        key += inputArray[i][4];
      }
    } else {  // provisional
      if (inputArray[i][3] == '') {
        output = [inputArray[i][0], inputArray[i][1], inputArray[i][2], inputArray[i][4]];
        key += inputArray[i][4];
      } else {
        output = [inputArray[i][0], inputArray[i][1], inputArray[i][2], inputArray[i][3]];
        key += inputArray[i][3];
      }
    }
    midArray.push(output);
    if (counts[key]) {
      counts[key]++;
    } else {
      counts[key] = 1;
    }
  }
  for (let output of midArray) {
    let key = output[1] + output[3];
    if (keyMap[output[1]] === undefined) {
      console.log('not in keyMap: ' + output[1]);
      key = output[1];
    } else {
      key = keyMap[output[1]];
      console.log('found in keyMap: ' + output[1] + ', ' + key);
    }
    key += output[3];
    if (counts[key] >= 2) {
      outputArray.push(output);
    }
  }
  return outputArray;
}
