/**
 * load file contents and check differences to the spread sheet
 * @param {string} fileName 
 * @param {string} fileContents 
 * @returns {Array<Map<any>>} differential data
 */
function loadFile(fileName, fileContents) {
  let sheetName;
  let valueCsv;
  let valueSheet;
  // regexp to split csv lines
  const REG_DICTIONARY = /"([^"]|(""))+"|[^,]+/g;
  const REG_GUIDES = /"([^"]|(""))+"|[^;]+/g;
  // escape pattern for ';;' in guides file
  const REG_SEMICOLON = /;;/g;
  const REG_SEMICOLON_ESCAPE = /___SEMICOLON___/g;

  console.log(fileName);
  if (fileName === FILE_NAME_DICTIONARY) {
    sheetName = PropertiesService.getScriptProperties().getProperty('dictionarySheet');
    valueCsv = valueCsvDictionary;
    valueSheet = valueSheetDictionary;
  } else if (fileName == FILE_NAME_GUIDES) {
    sheetName = PropertiesService.getScriptProperties().getProperty('guidesSheet');
    valueCsv = valueCsvGuides;
    valueSheet = valueSheetGuides;
  } else {
    console.warn('illegal file name: ' + fileName);
    throw 'failed';
  }

  const csvData = fileContents.split('\r\n');
  const sheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('sheetID')).getSheetByName(sheetName);
  const sheetData = sheet.getRange(2, 1, sheet.getLastRow()-1, SheetColumnIndexes.dictionary.TRANSLATION + 1).getValues();
  const isGuides = fileName === FILE_NAME_GUIDES;
  let guideCsvSepCount = 0;
  let guideCsvTopic = '';
  let guideSheetSepCount = 0;
  let guideSheetTopic = '';
  let diffData = new Map();
  // parse every line in both csv and spread sheet
  for (let i=0, j=0; (i < csvData.length) || (j < sheetData.length); i++, j++) {
    let keyCSV = false;
    let columns;
    // parse csv line into columns and determine the key
    if (isGuides && i < csvData.length) {
      // guides csv
      if (csvData[i] == '/') {
        columns = [csvData[i], ''];
        keyCSV = csvData[i] + guideCsvTopic + guideCsvSepCount++;
      } else if (csvData[i] == '') {  // separate lines in Guides file (not final line)
        if (i != (csvData.length - 1)) {
          columns = [csvData[i], ''];
          keyCSV = csvData[i] + guideCsvTopic;
        }
      } else {
        // split csv line in guides file
        columns = csvData[i].replace(REG_SEMICOLON, REG_SEMICOLON_ESCAPE.source).match(REG_GUIDES);
        if (columns.length > CsvColumnIndexes.guides.size) {
          console.warn('illegal format', csvData[i], columns);
          throw 'failed';
        }
        if (columns[CsvColumnIndexes.guides.ORIGINAL].search(/#.+/g) == 0) {
          guideCsvTopic = columns[CsvColumnIndexes.guides.ORIGINAL].replace(REG_SEMICOLON_ESCAPE, REG_SEMICOLON.source);
          guideCsvSepCount = 0;
        }
        keyCSV = columns[0].replace(REG_SEMICOLON_ESCAPE, REG_SEMICOLON.source);
      }
    } else if (!isGuides && i < csvData.length && csvData[i] != '') {
      // split a line from dictionary csv like below
      // 'a,"b, c", d' -> {'a', 'b, c', 'd'}
      columns = csvData[i].match(REG_DICTIONARY);
      if (columns.length < 2 || columns.length > 3) {
        throw 'illegal format ' + JSON.stringify(columns);
      }
      for (let j=1; j<columns.length; j++) {
        // replace '""' to '""
        columns[j] = columns[j].replace(/^[\"]|[\"]$/g, '').replace(/""/g, '\"');
      }
      keyCSV = columns[CsvColumnIndexes.dictionary.CONCEPT] + columns[CsvColumnIndexes.dictionary.ORIGINAL];
    }

    // determine the key for each line in spread sheet
    let keySheet = false;
    if (j < sheetData.length) {
      if (isGuides) {
        if (sheetData[j][SheetColumnIndexes.guides.ORIGINAL] == '/') {
          keySheet = sheetData[j][SheetColumnIndexes.guides.ORIGINAL] + guideSheetTopic + guideSheetSepCount++;
        } else if (sheetData[j][SheetColumnIndexes.guides.ORIGINAL] == '') {
          keySheet = sheetData[j][SheetColumnIndexes.guides.ORIGINAL] + guideSheetTopic;
        } else {
          if (sheetData[j][SheetColumnIndexes.guides.ORIGINAL].search(/#.+/g) == 0) {
            guideSheetTopic = sheetData[j][SheetColumnIndexes.guides.ORIGINAL];
            guideSheetSepCount = 0;
          }
          keySheet = sheetData[j][SheetColumnIndexes.guides.ORIGINAL];
        }
      } else {
        keySheet = sheetData[j][SheetColumnIndexes.dictionary.CONCEPT] + sheetData[j][SheetColumnIndexes.dictionary.ORIGINAL];
      } 
    }

    // compare and create diffData maps
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

  function valueSheetDictionary(sheetLine, row) {
    return {
      mod: DisplayTexts.import.DEL,
      row: row,
      concept: sheetLine[SheetColumnIndexes.dictionary.CONCEPT],
      original: sheetLine[SheetColumnIndexes.dictionary.ORIGINAL],
      translation: (sheetLine[SheetColumnIndexes.dictionary.TRANSLATION] == '' ? 
        sheetLine[SheetColumnIndexes.dictionary.PROVISIONAL] : sheetLine[SheetColumnIndexes.dictionary.TRANSLATION])
    }
  }

  function valueCsvDictionary(csvLine, row) {
    return {
      mod: DisplayTexts.import.ADD,
      row: row,
      concept: csvLine[CsvColumnIndexes.dictionary.CONCEPT],
      original: csvLine[CsvColumnIndexes.dictionary.ORIGINAL],
      translation: (csvLine[CsvColumnIndexes.dictionary.TRANSLATION] == null) ? '' : csvLine[CsvColumnIndexes.dictionary.TRANSLATION]
    };
  }

  function valueSheetGuides(sheetLine, row) {
    return {
      mod: DisplayTexts.import.DEL,
      row: row,
      original: sheetLine[SheetColumnIndexes.guides.ORIGINAL],
      translation: (sheetLine[SheetColumnIndexes.guides.translation] == '' ?
        sheetLine[SheetColumnIndexes.guides.PROVISIONAL] : sheetLine[SheetColumnIndexes.guides.TRANSLATION])
    };
  }

  function valueCsvGuides(csvLine, row) {
    return {
      mod: DisplayTexts.import.ADD,
      row: row,
      original: csvLine[CsvColumnIndexes.guides.ORIGINAL].replace(REG_SEMICOLON_ESCAPE, REG_SEMICOLON.source).trimStart(),
      translation: (csvLine[CsvColumnIndexes.guides.TRANSLATION] == null ?
        '' : csvLine[CsvColumnIndexes.guides.TRANSLATION].replace(REG_SEMICOLON_ESCAPE, REG_SEMICOLON.source).trimStart())
    };
  }

}

/**
 * apply differences to spread sheet
 * @param {number} fileType referred to FileType
 * @param {Array} diffValues differential data
 * @param {number} epoch timestamp of the file
 */
function applyData(fileType, diffValues, epoch) {
  if (fileType == FileType.DICTIONARY) {
    var sheetName = PropertiesService.getScriptProperties().getProperty('dictionarySheet');
  } else if (fileType == FileType.GUIDES) {
    var sheetName = PropertiesService.getScriptProperties().getProperty('guidesSheet');
  } else {
    console.error('invalid fileType', fileType)
    throw 'invalid fileType';
  }
  const sheet = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('sheetID'))
                              .getSheetByName(sheetName);
  const date = DisplayTexts.import.commentAddedDate((new Date(epoch)).toLocaleDateString());
  let addOffset = 1;
  let delOffset = 1;
  const lastColumn = sheet.getLastColumn();
  for (const diff of diffValues) {
    if (diff.mod == DisplayTexts.import.ADD) {
      const range = sheet.getRange(diff.row + addOffset, 1, 1, lastColumn);
      sheet.insertRowBefore(diff.row + addOffset);
      let values = new Array(lastColumn);
      if (fileType == FileType.DICTIONARY) {
        values[SheetColumnIndexes.dictionary.CONCEPT] = diff.concept;
        values[SheetColumnIndexes.dictionary.ORIGINAL] = diff.original;
        values[SheetColumnIndexes.dictionary.PROVISIONAL] = diff.translation;
        values[SheetColumnIndexes.dictionary.MEMO] = date;
        range.setValues([values]);
        range.getCell(1, SheetColumnIndexes.dictionary.LINE_NUMBER + 1).setFormula('=row() - 1');
        range.setBackground(null);
      } else {
        values[SheetColumnIndexes.guides.ORIGINAL] = diff.original;
        values[SheetColumnIndexes.guides.PROVISIONAL] = diff.translation;
        values[SheetColumnIndexes.guides.MEMO] = date;
        range.setValues([values]);
        if (diff.original == '/') {
          range.setBackground('#d9d9d9');
        } else if (diff.original == '') {
          range.setBackground('#b7b7b7');
        } else {
          range.setBackground(null);
        }
      }
      delOffset++;
    } else if (diff.mod == DisplayTexts.import.DEL) {
      sheet.getRange(diff.row + delOffset, 1, 1, lastColumn).setBackground('#a4c2f4');
      addOffset++;
    }
  }
}

/**
 * 
 * @param {number} fileType FileType
 * @returns {Map<any>} updateDate, differential data
 */
function checkGit(fileType) {
  const fileName = (fileType == FileType.DICTIONARY ? FILE_NAME_DICTIONARY : FILE_NAME_GUIDES);
  const repoName = PropertiesService.getScriptProperties().getProperty('gitRepo');
  let fetchURL = `https://api.github.com/repos/${repoName}/commits?path=Assets/${fileName}&per_page=1`;
  const updateDate = JSON.parse(UrlFetchApp.fetch(fetchURL).getContentText())[0].commit.author.date;
  fetchURL = `https://raw.githubusercontent.com/${repoName}/main/Assets/${fileName}`;
  const response = UrlFetchApp.fetch(fetchURL).getContentText();
  return {updateDate: updateDate, diffContent: loadFile(fileName, response.replace(/\n/g, '\r\n'))};
}