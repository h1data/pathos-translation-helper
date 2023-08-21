// common constants
/** file type (dictionary or guides) */
const FileType = {
  DICTIONARY: 0,
  GUIDES: 1,
}

/**
 * return html page to client side
 * @param {Map} e Web app event parameters
 * @returns {HtmlOutput} the contents of HTML page
 */
function doGet(e){
  console.info(e);
  try {
    if (e.pathInfo.match(/download\/.+/)) {
      return createDownloadPage(e);
    } else if (e.pathInfo.match(/file.*/)) {
      // TODO
    } else if (e.pathInfo.match(/check.*/)) {
      return createCheckPage(e);
    } else if (e.pathInfo.match(/import.*/)) {
      return HtmlService.createTemplateFromFile('html/import.html').evaluate().setTitle(DisplayTexts.TITLE);;
    } else {
      return HtmlService.createTemplateFromFile('html/error.html').evaluate();
    }
  } catch (exception) {
    console.error(exception);
    return HtmlService.createTemplateFromFile('html/error.html').evaluate();
  }

  function createDownloadPage(e) {
    let htmlTemplate = HtmlService.createTemplateFromFile('html/download.html').setTitle(DisplayTexts.TITLE);;
    if (e.pathInfo.match(/download\/dictionary/)) {
      htmlTemplate.fileType = FileType.DICTIONARY;
    } else if (e.pathInfo.match(/download\/guides/)) {
      htmlTemplate.fileType = FileType.GUIDES;
    } else {
      console.error('illegal path', e.pathInfo);
    }
    if (e.parameter.numbered != undefined) {
      htmlTemplate.numbered = e.parameter.numbered.toLowerCase() === 'true';
    } else {
      htmlTemplate.numbered = false;
    }
    if (e.parameter.provisional != undefined) {
      htmlTemplate.provisional = e.parameter.provisional.toLowerCase() === 'true';
    } else {
      htmlTemplate.provisional = false;
    }
    return htmlTemplate.evaluate();
  }

  function createCheckPage(e) {
    try {
      let htmlTemplate = HtmlService.createTemplateFromFile('html/check.html').setTitle(DisplayTexts.TITLE);;
      if (e.parameter.provisional != undefined) {
        htmlTemplate.provisional = e.parameter.provisional.toLowerCase() === 'true';
      } else {
        htmlTemplate.provisional = false;
      }
      return htmlTemplate.evaluate();
    } catch (exception) {
      console.error(exception);
      return HtmlService.createTemplateFromFile('html/error.html').evaluate();
    }
  }
}
