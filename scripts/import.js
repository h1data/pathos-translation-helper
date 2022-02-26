function loadFile(id, fileName, data) {
  let sheetName;
  let valueCsv;
  let valueSheet;
  let mode;
  const _dictionary = 0;
  const _guides = 1;
  const regDictionary = /"([^"]|(""))+"|[^,]+/g;
  const regGuides = /"([^"]|(""))+"|[^;]+/g;
  // escape pattern for ';;' in guides file
  const semiEscape = {target: ';;', escape: '___SEMICOLON___'};
  const semiRegExp = new RegExp(semiEscape.target, 'g');

  console.log(fileName);
  if (fileName == fileNames[0][0]) {
    mode = _dictionary;
    sheetName = sheetNames[0];
    valueCsv = valueCsvDictionary;
    valueSheet = valueSheetDictionary;
  } else if (fileName == fileNames[1][0]) {
    mode = _guides;
    sheetName = sheetNames[1];
    valueCsv = valueCsvGuides;
    valueSheet = valueSheetGuides;
  } else {
    console.warn('illegal file name: ' + fileName);
    throw 'failed';
  }

  const lines = data.split('\r\n');
  const sheet = validateAndGetSpreadsheet(id).getSheetByName(sheetName);
  const sheetData = sheet.getRange(2, 1, sheet.getLastRow()-1, 5).getValues();
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
    if (mode == _guides && i < lines.length) {
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
        columns = lines[i].replace(semiRegExp, semiEscape.escape).match(regGuides);
        if (columns.length > 2) {
          console.warn('illegal format', lines[i], columns);
          throw 'failed';
        }
        if (columns[0].search(/#.+/g) == 0) {
          guideCsvTopic = columns[0].replace(semiEscape.escape, semiEscape.target);
          guideCsvSepCount = 0;
        }
        keyCSV = columns[0].replace(semiEscape.escape, semiEscape.target);
      }
    } else if (i < lines.length && lines[i] != '') {
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
      if (mode == _guides) {
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
            row, csvLine[0].replace(semiEscape.escape, semiEscape.target).trimStart(),
            csvLine[1] == null ? '' : csvLine[1].replace(semiEscape.escape, semiEscape.target).trimStart()];
  }

}

function applyData(mode, id, diff, epoch) {
  const sheet = validateAndGetSpreadsheet(id).getSheetByName(sheetNames[mode - 1]);
  let date = (new Date(epoch)).toLocaleDateString();
  date = text.import.addDateComment(date);
  let addOffset = 1;
  let delOffset = 1;
  const lastColumn = sheet.getLastColumn();
  for (const line of diff) {
    if (line[0] == 'add') {
      sheet.insertRowBefore(line[2] + addOffset);
      if (mode == 1) {
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