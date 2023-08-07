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
    } else if (e.pathInfo.match(/check.*/)) {
      return createCheckPage(e);
    } else if (e.pathInfo.match(/import.*/)) {
      return HtmlService.createTemplateFromFile('html/import.html').evaluate();
    } else {
      return HtmlService.createTemplateFromFile('html/error.html').evaluate();
    }
  } catch (exception) {
    console.error(exception);
    return HtmlService.createTemplateFromFile('html/error.html').evaluate();
  }

  /**
   * Create HtmlService for download
   * @param {Map} e Web app event parameters
   * @returns {HtmlService} HtmlService object
   */
  function createDownloadPage(e) {
    try {
      let htmlService = HtmlService.createTemplateFromFile('html/download.html');
      if (e.pathInfo.match(/download\/dictionary/)) {
        htmlService.fileType = FileType.DICTIONARY;
      } else if (e.pathInfo.match(/download\/guides/)) {
        htmlService.fileType = FileType.GUIDES;
      } else {
        console.error('illegal path', e.pathInfo);
      }
      if (e.parameter.numbered != undefined) {
        htmlService.numbered = e.parameter.numbered.toLowerCase() === 'true';
      } else {
        htmlService.numbered = false;
      }
      if (e.parameter.provisional != undefined) {
        htmlService.provisional = e.parameter.provisional.toLowerCase() === 'true';
      } else {
        htmlService.provisional = false;
      }
      return htmlService.evaluate();
    } catch (exception) {
      console.error(exception);
      return HtmlService.createTemplateFromFile('html/error.html').evaluate();
    }
  }

  /**
   * Create HtmlService for check function
   * @param {Map} e Web app event parameters
   * @returns {HtmlService} HtmlService object
   */
  function createCheckPage(e) {
    try {
      let htmlService = HtmlService.createTemplateFromFile('html/check.html');
      if (e.parameter.provisional != undefined) {
        htmlService.provisional = e.parameter.provisional.toLowerCase() === 'true';
      } else {
        htmlService.provisional = false;
      }
      return htmlService.evaluate();
    } catch (exception) {
      console.error(exception);
      return HtmlService.createTemplateFromFile('html/error.html').evaluate();
    }
  }
}
