/**
 * Output data duplicate lines in JSON
 * @param {boolean} provisional
 * @returns JSON string
 */
function checkDuplicates(provisional) {
  console.log('checkDuplicates');
  /** table to convert above multiple concepts */
  const keyMap =
  {
    "AppearanceName": "ItemName",
  };
  const sheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('sheetID'))
                              .getSheetByName(PropertiesService.getScriptProperties().getProperty('dictionarySheet'));
  const inputArray = sheet.getRange(2, 1, sheet.getLastRow()-1, 5).getValues();
  const midArray = [];
  const counts = {};
  const outputArray = [];
  for (line of inputArray) {
    let output;
    let key = keyMap[line[1]];
    if (keyMap[line[1]] === undefined) {
      key = line[1];
    }
    if (provisional) {  // provisional
      if (line[3] == '') {
        output = [line[0], line[1], line[2], line[4]];
        key += line[4];
      } else {
        output = [line[0], line[1], line[2], line[3]];
        key += line[3];
      }
    } else {  // normal
      if (line[4] == '') {
        output = [line[0], line[1], line[2], line[3]];
        key += line[3];
      } else {
        output = [line[0], line[1], line[2], line[4]];
        key += line[4];
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
      key = output[1];
    } else {
      key = keyMap[output[1]];
    }
    key += output[3];
    if (counts[key] >= 2) {
      outputArray.push(output);
    }
  }
  return outputArray;
}
