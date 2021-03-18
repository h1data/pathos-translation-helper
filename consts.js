// the input sheet names for each type
const sheetNames = ['入力用', 'ガイド入力用'];

// the normal response http file 
const responseHttp = 'download.html';

// the error response http file for illegal arguments
const errorHttp = 'error.html';

// the check result http file
const checkHttp = 'check.html';

// file names for each type and mode
const fileNames = 
    [
      // type=0: Dictionary file
      ['ja.Dictionary', 'ja.Dictionary_withnumberr', 'ja.Dictionary_provisional'],
      // type=1: Guides files
      ['ja.Guides', 'error', 'ja.Guides_provisional']
    ];