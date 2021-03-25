// message
const text = {
  title: 'Pathos 日本語 Translation Helper',
  download : {
    loading: 'データ作成中...',
    message: 'データ作成が完了しました。このウィンドウは自動的に閉じます。'
  },
  check : {
    checking: 'チェック中...',
    normal: '項目重複、ヨシ!!!!',
    noResult: 'チェックしましたが重複する項目はありませんでした。もしかするとチェック処理が正しく動作していないかも知れません。',
    provisional: '【暫定版】'
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
