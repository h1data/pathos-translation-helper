/** file name for [your language].Dictionary */
const FILE_NAME_DICTIONARY = 'ja.Dictionary';
/** file name for [your language].Guides */
const FILE_NAME_GUIDES = 'ja.Guides';

/** message strings for web screens */ 
const DisplayTexts = {
  TITLE: 'Pathos 日本語 Translation Helper',
  download : {
    LOADING: 'データ作成中...',
    COMPLETED: 'データ作成が完了しました。このウィンドウは閉じても構いません。',
    FAILED: 'データのダウンロードに失敗しました',
  },
  check : {
    CHECKING: 'チェック中...',
    SUCCEEDED: '項目重複、ヨシ!!!!',
    NO_RESULT: 'チェックしましたが重複する項目はありませんでした。もしかするとチェック処理が正しく動作していないかも知れません。',
    FAILED: 'チェックに失敗しました。',
    PROVISIONAL: '【暫定版】',
  },
  import : {
    INITIAL_MESSAGE: 'ja.Dictionary または ja.Guides ファイルを選択し、読み込みボタンを押してください。',
    BUTTON_LOAD: '読み込み',
    BUTTON_EXECUTE: '実行!!',
    BUTTON_RETURN: 'ファイル選択に戻る',
    ILLEGAL_FILE_NAME: 'ファイル名が不正です。ja.Dictionary または ja.Guides ファイルを選択してください。',
    FILE_SELECTED: '読み込みボタンを押すと、ファイルを読み込んで変更箇所を表示します。',
    FAILED_LOAD_FILE: 'ファイルの読み込みに失敗しました。',
    LOADING: '読み込み中...',
    ILLEGAL_FILE_FORMAT: 'ファイル形式が不正です。他のファイルを選択してください。',
    NO_CHANGE: '変更点は今のところありません。',
    CONFIRM_DIFFERENCES: '下記の変更点があります。シートへ反映しますか？',
    UPDATING: 'シートへ反映中...',
    UPDATED: 'シートへの反映が完了しました。',
    FAILED_UPDATE: 'シートへの反映に失敗しました。',
    ADD: '追加',
    DEL: '削除',
    commentAddedDate: function(date) { return date + '追加'; },
  },
  /** strings for th elements */
  tableHeaders: {
    LINE_NUMBER: '行番号',
    CONCEPT: '項目',
    ORIGINAL: '原文',
    TRANSLATION: '訳',
    MOD: '変更'
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
