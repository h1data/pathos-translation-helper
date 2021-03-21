// message
const text = {
  title: 'Pathos Translation Helper',
  download : {
    message: 'The file will be downloaded soon and this window will close automatically.'
  },
  check : {
    checking: 'checking...',
    normal: 'Belows are duplicated.',
    noResult: 'Checked but no duplication was found. Perhaps check function does not work properly.',
    provisional: '[provisional]'
  }
};

// the input sheet names for each type (dictionary, guides)
const sheetNames = ['dictionary', 'guides'];

// file names for each type and mode
const fileNames = [
  // type=0: Dictionary file
  ['ja.Dictionary', 'ja.Dictionary_withnumber', 'ja.Dictionary_provisional'],
  // type=1: Guides files
  ['ja.Guides', 'error', 'ja.Guides_provisional']
];
