// functions to build CSV data
const buildFunctions =
  [
    [buildDictionaryNormal, buildDictionaryWithNumber, buildDictionaryProvisional],
    [buildGuidesNormal, null, buildGuidesProvisional]
  ];

// generates download data
function getCsvData(id, type, mode) {
  // the input sheet name to be referenced
  let sheetName = sheetNames[type];
  
  // define function to generate data per line
  let buildFunction = buildFunctions[type][mode];
  
  var inputArray = SpreadsheetApp.openById(id).getSheetByName(sheetName).getDataRange().getValues();
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
    outputArray.push(inputArray[1].concat(',', treatQuot(inputArray[2]), ',', treatQuot(inputArray[4])));
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
