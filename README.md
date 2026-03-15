# Syllable Pitch Master V2

A web-based tool for transcribing and editing syllable-based lyrics with pitch data (Akusento/Accent).

## Features

- **Lyrics Parsing**: Automatically detects types (Kana, Kanji, English) and prepares units for pitch entry.
- **Visual Pitch Chart**: Interactive Chart.js-based visualization of pitches.
- **Note Settings**:
    - **Accent (核)**: Mark the nucleus of the pitch accent.
    - **Shakuri (しゃくり)**: Visualize scoop curves between notes.
    - **Edge Voice**: Mark vocal fry or edge voice segments.
    - **Dynamics**: pp to ff markings.
- **Cloud Sync**: Google Drive API integration for backing up and restoring song data.
- **Local Persistence**: Saves progress automatically to `localStorage`.
- **Import/Export**: Load and save your data as JSON files.

## Project Structure

- `index.html`: The main application interface.
- `logic.js`: Shared business logic for parsing, pitch calculations, and migrations.
- `styles.css`: Modern, responsive CSS for the application.
- `tests/`: Automated tests for the core logic.
    - `tests.html`: Run this file in your browser to verify logic.
- `temp/`: Scratch files, research, and issue reproductions.

## Getting Started

1. Open `index.html` in any modern web browser.
2. Click **"+ 新しい曲"** to start a new project.
3. Enter your lyrics in the editor.
4. Use the pitch chart or the input fields to adjust the melody/accent.
5. Save your work locally or sync with Google Drive.

## Technical Details

- **Backend**: None (pure client-side).
- **Frontend**: Vanilla JS, HTML5, CSS3.
- **Libraries**:
    - [Chart.js](https://www.chartjs.org/)
    - [chartjs-plugin-dragdata](https://github.com/chrisjschroeder/chartjs-plugin-dragdata)
    - [Google Identity Services](https://developers.google.com/identity/gsi/web/guides/overview)
