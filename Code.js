// the normal response http file 
const responseHttp = 'download.html';

// the error response http file for illegal arguments
const errorHttp = 'error.html';

// the check result http file
const checkHttp = 'check.html';

// 0=dictionary, 1=guides, 2=duplicate check
var type__ = '9';

// 0=normal, 1=with line number, 2=provisional
var mode__ = '9';

// ID of spreadsheet
var id__ = '';

// functions to build CSV data
const buildFunctions =
    [
      [buildDictionaryNormal, buildDictionaryWithNumber, buildDictionaryProvisional],
      [buildGuidesNormal, null, buildGuidesProvisional]
    ];

// table to convert above multiple concepts
const keyMap =
  {
    "AppearanceName": "ItemName",
  };

// return html page to client side (browser)
function doGet(e){
  console.info(e.queryString);
  try {
    id__ = e.parameters.id.toString();
    type__ = e.parameters.type.toString();
    mode__ = e.parameters.mode.toString();
  } catch(exception) {
    console.error(exception);
    return HtmlService.createTemplateFromFile(errorHttp).evaluate();
  }
  if (checkParameters()) {
    if (type__ == '0' || type__ == '1') {
      return HtmlService.createTemplateFromFile(responseHttp).evaluate();
    } else if (type__ == '2') {
      return HtmlService.createTemplateFromFile(checkHttp).evaluate();
    }
  } else {
    return HtmlService.createTemplateFromFile(errorHttp).evaluate();
  }
}

// obtain file name
function getFileName() {
  if (checkParameters()) {
    return fileNames[type__][mode__];
  } else {
    return 'error';
  }
}
// check parameters from request URI
function checkParameters() {
  console.info('id\'s length: ' + id__.length);
  if (id__.length != 44) {
    return false;
  }
  if (type__ == '0' && mode__ >= '0' && mode__ <= '2') {
    return true;
  } else if (type__ == '1' && (mode__ == '0' || mode__ == '2') ) {
    return true;
  } else if (type__ == '2' && (mode__ == '0' || mode__ == '2') ) {
    return true;
  } else {
    console.error('illegal arguments');
    return false;
  }
}

// generates download data
function getCsvData() {
  // the input sheet name to be referenced
  let sheetName = sheetNames[type__];
  
  // define function to generate data per line
  let buildFunction = buildFunctions[type__][mode__];
  
  var inputArray = SpreadsheetApp.openById(id__).getSheetByName(sheetName).getDataRange().getValues();
  var outputArray = [];
  // line 1 is the header thus loop begins from line 2 (i=0)
  for (let i = 1; i < inputArray.length; i++) {
    buildFunction(inputArray[i], outputArray);
  }
  return outputArray.join('\r\n').concat('\r\n');
}

function buildDictionaryNormal(inputArray, outputArray) {
  if (inputArray[4] == '') {
    outputArray.push(inputArray[1].concat(',', treatQuot(inputArray[2]), ',', treatQuot(inputArray[3])));
  } else {
    outputArray.push(inputArray[1].concat(',', treatQuot(inputArray[2]), ',', treatQuot(inputArray[4])));
  }
}

function buildDictionaryWithNumber(inputArray, outputArray) {
  if (inputArray[4] == '') {
    outputArray.push(inputArray[1].concat(',', treatQuot(inputArray[2]), ',', treatQuot(inputArray[3].concat(inputArray[0]))));
  } else {
    outputArray.push(inputArray[1].concat(',', treatQuot(inputArray[2]), ',', treatQuot(inputArray[4].concat(inputArray[0]))));
  }
}

function buildDictionaryProvisional(inputArray, outputArray) {
  if (inputArray[3] == '') {
    // TODO 『』有りを提出したらreplaceメソッドを削る
    outputArray.push(inputArray[1].concat(',', treatQuot(inputArray[2]), ',', treatQuot(inputArray[4].replace(/[『,』]/g,''))));
  } else {
    outputArray.push(inputArray[1].concat(',', treatQuot(inputArray[2]), ',', treatQuot(inputArray[3])));
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
          
// replace '"' into '""' and enclose str in '""' if it includes ',' or '"'.
function treatQuot(str) {
  str = str.replace(/"/g,'""');  // instead of str.replaceAll('"', '""');
  if (str.includes(',') || str.includes('"')) str = '"'.concat(str, '"');
  return str;
}

// output data duplicate lines in JSON
function checkDuplicates() {
  console.log('checkDuplicates');
  let sheetName = sheetNames[0];  // fixed to dictionary
  let inputArray = SpreadsheetApp.openById(id__).getSheetByName(sheetName).getDataRange().getValues();
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
    if (mode__ == '0') {  // normal
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
  return JSON.stringify(outputArray);
}

// obtain output mode
function getMode() {
  return mode__;
}