/** file name for [your language].Dictionary */
const FILE_NAME_DICTIONARY = 'ja.Dictionary';
/** file name for [your language].Guides */
const FILE_NAME_GUIDES = 'ja.Guides';

/** message strings for web screens */ 
const DisplayTexts = {
  TITLE: 'Pathos Translation Helper',
  download : {
    LOADING: 'loading...',
    COMPLETED: 'The download data is ready to download. You may close this tab/window.',
    FAILED: 'Download failed.',
  },
  check : {
    CHECKING: 'checking...',
    SUCCEEDED: 'Belows are duplicated.',
    NO_RESULT: 'Checked but no duplication was found. Perhaps check function does not work properly.',
    FAILED: 'Failed to load the file.',
    PROVISIONAL: '[provisional]',
  },
  import : {
    INITIAL_MESSAGE: 'Select Dictionary or Guides file and press the load button.',
    LABEL_GIT: 'Check the GitHub repo',
    BUTTON_GIT: 'check',
    BUTTON_LOAD: 'load',
    BUTTON_EXECUTE: 'EXECUTE',
    BUTTON_RETURN: 'return to file selection',
    ILLEGAL_FILE_NAME: 'Illegal file name. Please select *.Dictionary or *.Guides file.',
    FILE_SELECTED: 'Press the load button to import file and display the modifications.',
    FAILED_LOAD_FILE: 'Failed to load the file.',
    LOADING: 'loading...',
    ILLEGAL_FILE_FORMAT: 'Illegal file format. Please select another file.',
    NO_CHANGE: 'There is no modification for now.',
    CONFIRM_DIFFERENCES: 'There are modifications below. Are you sure to update the spread sheet?',
    UPDATING: 'updating...',
    UPDATED: 'Update completed',
    FAILED_UPDATE: 'Failed to apply to the spread sheet.',
    ADD: 'add',
    DEL: 'del',
    commentAddedDate: function(date) { return 'added on ' + date; },
  },
  /** strings for th elements */
  tableHeaders: {
    LINE_NUMBER: 'line',
    CONCEPT: 'concept',
    ORIGINAL: 'original',
    TRANSLATION: 'translation',
    MOD: 'mod'
  }
};

/** The position of columns in your sheet (starts with 0) */
const SheetColumnIndexes =  {
  dictionary: {
    LINE_NUMBER: 0,
    CONCEPT: 1,
    ORIGINAL: 2,
    PROVISIONAL: 3, // if no provisional column in your sheet, set the same number as TRANSLATION
    TRANSLATION: 4,
    MEMO: 10
  },
  guides: {
    ORIGINAL: 0,
    PROVISIONAL: 1, // if no provisional column in your sheet, set the same number as TRANSLATION
    TRANSLATION: 2,
    MEMO: 7
  },
};

/**
 * The position of columns in game files (starts with 0)
 * DO NOT EDIT if not necessary!
 */
const CsvColumnIndexes = {
  dictionary: {
    CONCEPT: 0,
    ORIGINAL: 1,
    TRANSLATION: 2
  },
  guides: {
    ORIGINAL: 0,
    TRANSLATION: 1
  }
}
