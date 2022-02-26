// message
const text = {
  title: 'Pathos Translation Helper',
  download : {
    loading: 'loading...',
    completed: 'The download data is ready to download. You may close this tab/window.',
    failed: 'Download failed.',
  },
  check : {
    checking: 'checking...',
    normal: 'Belows are duplicated.',
    noResult: 'Checked but no duplication was found. Perhaps check function does not work properly.',
    failed: 'Check failed.',
    provisional: '[provisional]',
    headers: ['line', 'concept', 'original', 'translation']
  },
  import : {
    initialMessage: 'Select Dictionary or Guides file and press the load button.',
    loadButton: 'load',
    executeButton: 'EXECUTE',
    returnButton: 'return to file selection',
    illegalFileName: 'Illegal file name. Please select *.Dictionary or *.Guides file.',
    fileSelected: 'Press the load button to import file and display the modifications.',
    fileLoadFailed: 'Failed to load the file.',
    loading: 'loading...',
    illegalFileFormat: 'Illegal file format. Please select another file.',
    noChange: 'There is no modification for now.',
    differenceConfirm: 'There are modifications below. Are you sure to execute applying to the spread sheet?',
    updating: 'applying to the spread sheet...',
    updated: 'Applying to the spread sheet has been completed.',
    updateFailed: 'Failed to apply to the spread sheet.',
    headers: ['mod', 'line', 'concept', 'original', 'translation'],
    add: 'add',
    del: 'del',
    addDateComment: function(date) { return 'added on ' + date; },
    memoColumn: [11, 8]
  }
};

// the input sheet names for each type (dictionary, guides)
const sheetNames = ['dictionary', 'guides'];

// for validation of if the spreadsheet is proper one
const spreadsheetName = 'Pathos translation';

// file names for each type and mode
const fileNames = [
  // type=0: Dictionary file
  ['ja.Dictionary', 'ja.Dictionary_withnumber', 'ja.Dictionary_provisional'],
  // type=1: Guides files
  ['ja.Guides', 'error', 'ja.Guides_provisional']
];
