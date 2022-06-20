/**
 * load file contents and check differences to the spread sheet
 * @param {string} fileName 
 * @param {string} fileContents 
 * @returns {string} differential data
 */
function loadFile(fileName, fileContents) {
  let sheetName;
  let valueCsv;
  let valueSheet;
  // regexp to split csv lines
  const regDictionary = /"([^"]|(""))+"|[^,]+/g;
  const regGuides = /"([^"]|(""))+"|[^;]+/g;
  // escape pattern for ';;' in guides file
  const regSemiTarget = /;;/g;
  const regSemiEscape = /___SEMICOLON___/g;

  console.log(fileName);
  if (fileName === dictionaryFileName) {
    sheetName = PropertiesService.getScriptProperties().getProperty('dictionarySheet');
    valueCsv = valueCsvDictionary;
    valueSheet = valueSheetDictionary;
  } else if (fileName == guidesFileName) {
    sheetName = PropertiesService.getScriptProperties().getProperty('guidesSheet');
    valueCsv = valueCsvGuides;
    valueSheet = valueSheetGuides;
  } else {
    console.warn('illegal file name: ' + fileName);
    throw 'failed';
  }

  const lines = fileContents.split('\r\n');
  const sheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('sheetID')).getSheetByName(sheetName);
  const sheetData = sheet.getRange(2, 1, sheet.getLastRow()-1, 5).getValues();
  const isGuides = fileName === guidesFileName;
  let guideCsvSepCount = 0;
  let guideCsvTopic = '';
  let guideSheetSepCount = 0;
  let guideSheetTopic = '';
  let diffData = new Map();
  // parse every line in both csv and spread sheet
  for (let i=0, j=0; (i < lines.length) || (j < sheetData.length); i++, j++) {
    let keyCSV = false;
    let columns;
    // parse csv line into columns and determine the key
    if (isGuides && i < lines.length) {
      // guides csv
      if (lines[i] == '/') {
        columns = [lines[i], ''];
        keyCSV = lines[i] + guideCsvTopic + guideCsvSepCount++;
      } else if (lines[i] == '') {  // separate lines in Guides file (not final line)
        if (i != (lines.length - 1)) {
          columns = [lines[i], ''];
          keyCSV = lines[i] + guideCsvTopic;
        }
      } else {
        columns = lines[i].replace(regSemiTarget, regSemiEscape.source).match(regGuides);
        if (columns.length > 2) {
          console.warn('illegal format', lines[i], columns);
          throw 'failed';
        }
        if (columns[0].search(/#.+/g) == 0) {
          guideCsvTopic = columns[0].replace(regSemiEscape, regSemiTarget.source);
          guideCsvSepCount = 0;
        }
        keyCSV = columns[0].replace(regSemiEscape, regSemiTarget.source);
      }
    } else if (!isGuides && i < lines.length && lines[i] != '') {
      // dictionary csv
      // 'a,"b, c", d' -> {'a', 'b, c', 'd'}
      columns = lines[i].match(regDictionary);
      if (columns.length < 2 || columns.length > 3) {
        console.warn('illegal format', lines[i], columns);
        throw 'failed';
      }
      for (let j=1; j<columns.length; j++) {
        columns[j] = columns[j].replace(/^[\"]|[\"]$/g, '').replace(/""/g, '\"');
      }
      keyCSV = columns[0] + columns[1];
    }

    // determine the key for each line in spread sheet
    let keySheet = false;
    if (j < sheetData.length) {
      if (isGuides) {
        if (sheetData[j][0] == '/') {
          keySheet = sheetData[j][0] + guideSheetTopic + guideSheetSepCount++;
        } else if (sheetData[j][0] == '') {
          keySheet = sheetData[j][0] + guideSheetTopic;
        } else {
          if (sheetData[j][0].search(/#.+/g) == 0) {
            guideSheetTopic = sheetData[j][0];
            guideSheetSepCount = 0;
          }
          keySheet = sheetData[j][0];
        }
      } else {
        keySheet = sheetData[j][1] + sheetData[j][2];
      } 
    }

    // compare and create diffData table
    if (keySheet != keyCSV) {
      if (diffData.has(keySheet)) {
        diffData.delete(keySheet);
      } else if (keySheet){
        diffData.set(keySheet, valueSheet(sheetData[j], j + 1));
      }
      if (diffData.has(keyCSV)) {
        diffData.delete(keyCSV);
      } else if(keyCSV) {
        diffData.set(keyCSV, valueCsv(columns, i + 1));
      }
    }
  }
  return Array.from(diffData.values());

  // functions for inner use
  function valueSheetDictionary(sheetLine, row) {
    return ['del', row, '', sheetLine[1], sheetLine[2], sheetLine[4] == '' ? sheetLine[3] : sheetLine[4]];
  }

  function valueCsvDictionary(csvLine, row) {
    if (csvLine[2] == null) {
      return ['add', '', row, csvLine[0], csvLine[1], ''];
    } else {
      return ['add', '', row, csvLine[0], csvLine[1], csvLine[2]];
    }
  }

  function valueSheetGuides(sheetLine, row) {
    return ['del', row, '', sheetLine[0], sheetLine[2] == '' ? sheetLine[1] : sheetLine[2]];
  }

  function valueCsvGuides(csvLine, row) {
    return ['add', '',
            row, csvLine[0].replace(regSemiEscape, regSemiTarget.source).trimStart(),
            csvLine[1] == null ? '' : csvLine[1].replace(regSemiEscape, regSemiTarget.source).trimStart()];
  }

}

/**
 * apply differences to spread sheet
 * @param {number} fileType referred to FileType
 * @param {Array} diff differential data
 * @param {Date} epoch timpstamp of the file
 */
function applyData(fileType, diff, epoch) {
  if (fileType == FileType.dictionary) {
    var sheetName = PropertiesService.getScriptProperties().getProperty('dictionarySheet');
  } else if (fileType == FileType.guides) {
    var sheetName = PropertiesService.getScriptProperties().getProperty('guidesSheet');
  } else {
    console.error('invalid fileType', fileType)
    throw 'invalid fileType';
  }
  const sheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('sheetID'))
                              .getSheetByName(sheetName);
  let date = (new Date(epoch)).toLocaleDateString();
  date = text.import.addDateComment(date);
  let addOffset = 1;
  let delOffset = 1;
  const lastColumn = sheet.getLastColumn();
  for (const line of diff) {
    if (line[0] == 'add') {
      sheet.insertRowBefore(line[2] + addOffset);
      if (fileType == FileType.dictionary) {
        sheet.getRange(line[2] + addOffset, 1).setFormula('=row() -1');
        sheet.getRange(line[2] + addOffset, 2, 1, 3).setValues([[line[3], line[4], line[5]]]);
        sheet.getRange(line[2] + addOffset, text.import.memoColumn[0]).setValue(date);
      } else {
        sheet.getRange(line[2] + addOffset, 1, 1, 2).setValues([[line[3], line[4]]]);
        sheet.getRange(line[2] + addOffset, text.import.memoColumn[1]).setValue(date);
        if (line[3] == '/') {
          sheet.getRange(line[2] + addOffset, 1, 1, lastColumn).setBackground('#d9d9d9');
        } else if (line[3] == '') {
          sheet.getRange(line[2] + addOffset, 1, 1, lastColumn).setBackground('#b7b7b7');
        } else {
          sheet.getRange(line[2] + addOffset, 1, 1, lastColumn).setBackground(null);
        }
      }
      delOffset++;
    } else if (line[0] == 'del') {
      sheet.getRange(line[1] + delOffset, 1, 1, lastColumn).setBackground('#a4c2f4');
      addOffset++;
    }
  }
}