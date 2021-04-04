// message
const text = {
  title: 'Pathos 日本語 Translation Helper',
  download : {
    loading: 'データ作成中...',
    message: 'データ作成が完了しました。このウィンドウは閉じても構いません。'
  },
  check : {
    checking: 'チェック中...',
    normal: '項目重複、ヨシ!!!!',
    noResult: 'チェックしましたが重複する項目はありませんでした。もしかするとチェック処理が正しく動作していないかも知れません。',
    provisional: '【暫定版】'
  },
  import : {
    initialMessage: 'ja.Dictionary または ja.Guides ファイルを選択し、読み込みボタンを押してください。',
    loadButton: '読み込み',
    executeButton: '実行!!',
    returnButton: 'ファイル選択に戻る',
    illegalFileName: 'ファイル名が不正です。ja.Dictionary または ja.Guides ファイルを選択してください。',
    fileSelected: '読み込みボタンを押すと、ファイルを読み込んで変更箇所を表示します。',
    fileLoadFailed: 'ファイルの読み込みに失敗しました。',
    loading: '読み込み中...',
    illegalFileFormat: 'ファイル形式が不正です。他のファイルを選択してください。',
    noChange: '変更点は今のところありません。',
    differenceConfirm: '下記の変更点があります。シートへ反映しますか？',
    updating: 'シートへ反映中...',
    updated: 'シートへの反映が完了しました。',
    updateFailed: 'シートへの反映に失敗しました。',
    header: '変更,行番号,項目,原文,訳',
    add: '追加',
    del: '削除',
    addDateComment: function(date) { return date + '追加'; },
    memoColumn: [11, 8]
  }
};

// the input sheet names for each type (dictionary, guides)
const sheetNames = ['入力用', 'ガイド入力用'];

// file names for each type and mode
const fileNames = [
  // type=0: Dictionary file
  ['ja.Dictionary', 'ja.Dictionary_withnumber', 'ja.Dictionary_provisional'],
  // type=1: Guides files
  ['ja.Guides', 'error', 'ja.Guides_provisional']
];
