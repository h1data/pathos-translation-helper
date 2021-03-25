// 0=dictionary, 1=guides, 2=duplicate check
var type__ = '9';

// 0=normal, 1=with line number, 2=provisional
var mode__ = '9';

// ID of spreadsheet
var id__ = '';

// return html page to client side (browser)
function doGet(e){
  console.info(e.queryString);
  try {
    id__ = e.parameters.id.toString();
    type__ = e.parameters.type.toString();
    mode__ = e.parameters.mode.toString();
  } catch(exception) {
    console.error(exception);
    return HtmlService.createTemplateFromFile('html/error.html').evaluate();
  }
  if (checkParameters()) {
    if (type__ == '0' || type__ == '1') {
      return HtmlService.createTemplateFromFile('html/download.html').evaluate();
    } else if (type__ == '2') {
      return HtmlService.createTemplateFromFile('html/check.html').evaluate();
    }
  } else {
    return HtmlService.createTemplateFromFile('html/error.html').evaluate();
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

// obtain file name
function getFileName() {
  if (checkParameters()) {
    return fileNames[type__][mode__];
  } else {
    return 'error';
  }
}

// obtain output type
function getType() {
  return type__;
}

// obtain output mode
function getMode() {
  return mode__;
}

// obtain spreadsheet id
function getId() {
  return id__;
}