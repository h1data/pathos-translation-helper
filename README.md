# Pathos Translation Helper

Hail translators!
This helps Google Spreadsheet workflow for Pathos NetHack Codec translators.

## Features
- Generates Dictionary and Guides file and enables to download.
- Generated files are selectable between fully modified translation,<br>
  line number mode, or provisional mode.<br>
  In line number mode, append line number for each translated word.<br>
  In provisional mode, files are filled blank lines only, not modified existing lines.
- Checks duplicate translations within the same concepts.<br>
  AppearanceName and ItemName are judged as the same concepts.
- Semi-auto import function for Dictionary and Guides files.<br>
  Deleted lines are not removed from spreadsheet automatically for safety, only changed background color.

## How To Setup

### 1. Ready your spreadsheet
The spreadsheet must have sheets;
- which has the header line as line 1.
- which has the first 5 columns represents
  - Column A: row number (embedding function =row()-1 is useful)
  - Column B: concept (ex. AppearanceName)
  - Column C: original words
  - Column D: translated words (before modified)
  - Column E: translated words (after modified)

  The sheet can have columns for progress management or discussions right from column E.

### 2. Install clasp (requires Node.js and npm environment)
```
npm install -g @google/clasp
```

### 3. Clone this repository
```
git clone https://github.com/h1data/pathos-translation-helper
```

### 4. Install google script helper from npm
```
npm install
```

### 5. Create Google Apps Script project
Create as a Web App project.

### 6. Tune scripts
At least, you have to modify scripts/variables.js for your spreadsheet and translation filenames.
```JavaScript
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
```

### 7. Deploy scripts as Web Service
```
clasp push
clasp deploy -d [your deploy id]
```

### 8. Add embed links of the script to the spreadsheet
- File downloader (dictionary file)<br>
```https://script.google.com/macros/s/[your deployment id of web app]/exec?id=[your spreadsheet id]&type=0&mode=*```<br>
mode: 0=normal mode, 1=with line number mode, 2=provisional mode

- File downloader (guides file)<br>
```https://script.google.com/macros/s/[your deployment id of web app]/exec?id=[your spreadsheet id]&type=1&mode=*```<br>
mode: 0=normal mode, 1=with line number mode, 2=provisional mode

- Duplicate checker<br>
```https://script.google.com/macros/s/[your deployment id of web app]/exec?id=[your spreadsheet id]&type=2&mode=*```<br>
mode: 0=normal mode, 2=provisional mode

- File importer<br>
```https://script.google.com/macros/s/[your deployment id of web app]/exec?id=[your spreadsheet id]&type=3```

## Miscellaneous info
- [Pathos NetHack Codec](https://pathos.azurewebsites.net/)
- Portions of this page are reproduced from work created and
[shared by Google](https://developers.google.com/terms/site-policies)<br>
and used according to terms described in the [Creative Commons 4.0 Attribution License](https://creativecommons.org/licenses/by/4.0/). 
