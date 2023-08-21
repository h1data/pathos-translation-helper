/**
 * generates download data
 * @param {number} fileType referred to FileType
 * @param {boolean} numbered 
 * @param {boolean} provisional 
 * @returns {string} contents for download data
 */ 
function createCsvData(fileType, numbered, provisional) {
  console.log('fileType', fileType);
  console.log('numbered', numbered);
  console.log('provisional', provisional);
  
  // choose function to generate data per line
  if (fileType == FileType.DICTIONARY) {
    if (provisional) {
      var buildFunction = buildDictionaryProvisional;
    } else {
      var buildFunction = buildDictionaryNormal;
    }
  } else if (fileType == FileType.GUIDES) {
    if (provisional) {
      var buildFunction = buildGuidesProvisional;
    } else {
      var buildFunction = buildGuidesNormal;
    }
  } else {
    throw 'invalid file type: ' + fileType;
  }

  let sheetName = (fileType == FileType.DICTIONARY) ? 'dictionarySheet' : 'guidesSheet';
  const inputArray = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('sheetID'))
                                   .getSheetByName(PropertiesService.getScriptProperties().getProperty(sheetName))
                                   .getDataRange()
                                   .getValues();
  const outputArray = [];
  // remove the header line
  inputArray.shift();
  inputArray.forEach((line) => { buildFunction(line, outputArray) });
  return outputArray.join('\r\n').concat('\r\n');

  function buildDictionaryNormal(inputArray, outputArray) {
    if (inputArray[4] == '') {
      outputArray.push(inputArray[1].concat(',', treatQuot(inputArray[2]), ',', treatQuot(inputArray[3].concat(numbered ? inputArray[0] : ''))));
    } else {
      outputArray.push(inputArray[1].concat(',', treatQuot(inputArray[2]), ',', treatQuot(inputArray[4].concat(numbered ? inputArray[0] : ''))));
    }
  }
  
  function buildDictionaryProvisional(inputArray, outputArray) {
    if (inputArray[3] == '') {
      outputArray.push(inputArray[1].concat(',', treatQuot(inputArray[2]), ',', treatQuot(inputArray[4].concat(numbered ? inputArray[0] : ''))));
    } else {
      outputArray.push(inputArray[1].concat(',', treatQuot(inputArray[2]), ',', treatQuot(inputArray[3].concat(numbered ? inputArray[0] : ''))));
    }
  }
  
  function buildGuidesNormal(inputArray, outputArray) {
    if (inputArray[0] == '' || inputArray[0] == '/'){
      outputArray.push(inputArray[0]);
    } else if (inputArray[2] == '') {
      outputArray.push(inputArray[0].concat('; ', inputArray[1]));
    } else {
      outputArray.push(inputArray[0].concat('; ', inputArray[2]));
    }
  }
            
  function buildGuidesProvisional(inputArray, outputArray) {
    if (inputArray[0] == '' || inputArray[0] == '/'){
      outputArray.push(inputArray[0]);
    } else if (inputArray[1] == '') {
      outputArray.push(inputArray[0].concat('; ', inputArray[2]));
    } else {
      outputArray.push(inputArray[0].concat('; ', inputArray[1]));
    }
  }
            
  /**
   * replace '"' into '""' and enclose str in '""' if it includes ',' or '"'.
   * @param {string} str input string
   * @return {string} treated string
   */
  function treatQuot(str) {
    str = str.replace(/"/g,'""');  // instead of str.replaceAll('"', '""');
    if (str.includes(',') || str.includes('"')) str = '"'.concat(str, '"');
    return str;
  }
  
}

/**
 * Get file name for download
 * @param {number} fileType referred to FileType map
 * @param {boolean} numbered 
 * @param {boolean} provisional 
 */
function createDownloadFileName(fileType, numbered, provisional) {
  if (fileType == FileType.DICTIONARY) {
    var fileName = FILE_NAME_DICTIONARY;
  } else if (fileType == FileType.GUIDES) {
    var fileName = FILE_NAME_GUIDES;
  } else {
    throw 'invalid file type: ' + fileType;
  }
  if (provisional) fileName += '_provisional';
  if (numbered) fileName += '_withnumber';
  return fileName;
}
