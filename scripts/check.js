/**
 * Output data duplicate lines in JSON
 * @param {boolean} provisional
 * @returns {string[][]} duplicates to display
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
  const midArray = [];
  const counts = {};
  for (const line of sheet.getRange(2, 1, sheet.getLastRow()-1, 5).getValues()) {
    let key = keyMap[line[SheetColumnIndexes.dictionary.CONCEPT]];
    if (keyMap[line[1]] === undefined) {
      key = line[1];
    }
    let outputLine = [];
    outputLine.push(line[SheetColumnIndexes.dictionary.LINE_NUMBER]);
    outputLine.push(line[SheetColumnIndexes.dictionary.CONCEPT]);
    outputLine.push(line[SheetColumnIndexes.dictionary.ORIGINAL]);
    if (provisional) {  // provisional
      if (line[SheetColumnIndexes.dictionary.PROVISIONAL] == '') {
        outputLine.push(line[SheetColumnIndexes.dictionary.TRANSLATION]);
        key += line[SheetColumnIndexes.dictionary.TRANSLATION];
      } else {
        outputLine.push(line[SheetColumnIndexes.dictionary.PROVISIONAL])
        key += line[SheetColumnIndexes.dictionary.PROVISIONAL];
      }
    } else {  // normal
      if (line[SheetColumnIndexes.dictionary.TRANSLATION] == '') {
        outputLine.push(line[SheetColumnIndexes.dictionary.PROVISIONAL])
        key += line[SheetColumnIndexes.dictionary.PROVISIONAL];
      } else {
        outputLine.push(line[SheetColumnIndexes.dictionary.TRANSLATION]);
        key += line[SheetColumnIndexes.dictionary.TRANSLATION];
      }
    }
    midArray.push(outputLine);
    if (counts[key]) {
      counts[key]++;
    } else {
      counts[key] = 1;
    }
  }
  const outputArray = [];
  for (const output of midArray) {
    let key = output[1] + output[3];  // concept + translation
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
