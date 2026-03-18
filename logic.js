const Logic = {
    // Parser Regex: Kanji | English (w/ hyphens/apostrophes) | Space | Other
    regex: /([\u4e00-\u9faf]+)|([A-Za-z0-9']+(?:-[A-Za-z0-9']+)*)|(\s)|([^\s])/g,

    /**
     * Parses a line of text into units (words/syllables)
     * Handles English "1 word = 1 note" rule and Word Indexing
     */
    parseLine: function (lineStr) {
        const units = [];
        let m;
        let wordCount = 0;

        // Reset lastIndex to ensure consistent behavior across calls
        this.regex.lastIndex = 0;

        while ((m = this.regex.exec(lineStr)) !== null) {
            let isSpace = !!m[3];
            let type = m[1] ? 'kanji' : (m[2] ? 'english' : (isSpace ? 'space' : 'kana'));

            // Default pitch empty (no pitch)
            const defaultPitch = "";

            // English defaults to 1 note
            const len = (type === 'english') ? 1 : m[0].length;

            units.push({
                text: m[0],
                type: type,
                reading: "",
                pitches: Array(len).fill(defaultPitch),
                accents: Array(len).fill(false),
                styles: Array(len).fill({}),
                wordIndex: isSpace ? wordCount : wordCount++
            });
        }
        return units;
    },

    /**
     * Calculates how many notes a unit should have based on its reading.
     * Rule: 1 char = 1 note. Empty reading = 1 note (default).
     */
    calculatePitchCount: function (unit, newReading) {
        if (!newReading) return 1;
        return newReading.length > 0 ? newReading.length : 1;
    },

    /**
     * Scans a list of units and fixes broken English words (legacy data).
     * Returns true if modifications were made.
     */
    migrateLineUnits: function (units) {
        let changed = false;
        units.forEach(u => {
            if (u.type === 'english' && u.pitches.length > 1) {
                const hasReading = u.reading && u.reading.length > 0;
                if (!hasReading) {
                    u.pitches = [u.pitches[0]];
                    // Safely collapse metadata arrays if they exist
                    if (u.accents && u.accents.length > 1) u.accents = [u.accents[0]];
                    if (u.styles && u.styles.length > 1) u.styles = [u.styles[0]];
                    changed = true;
                }
            }
        });
        return changed;
    },

    /**
     * Determines the visual radius of a point based on dynamics and styles.
     */
    /**
     * Determines the visual radius of a point based on dynamics and styles.
     */
    getPointRadius: function (style) {
        const radiusMap = { 'pp': 3, 'p': 4, 'mp': 5, 'n': 6, 'mf': 8, 'f': 10, 'ff': 12 };
        let radius = radiusMap[style.dynamic || 'n'] || 6;

        // Edge Voice visibility boost
        if (style.edge) {
            radius = Math.max(radius, 12);
        }
        return radius;
    },

    // --- Pitch Logic ---

    NOTE_NAMES: ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'],
    PITCH_MAP: {},
    REV_PITCH: {},

    _initialized: false,

    init: function () {
        if (this._initialized) return;
        // Pitch Range: C3 (48) to C6 (84)
        for (let i = 48; i <= 84; i++) {
            const octave = Math.floor(i / 12) - 1;
            const note = this.NOTE_NAMES[i % 12];
            const label = note + octave;
            this.PITCH_MAP[i] = label;
            this.REV_PITCH[label] = i;
        }
        this._initialized = true;
    },

    midiToFreq: function (midi) {
        return 440 * Math.pow(2, (midi - 69) / 12);
    },

    isValidPitch: function (noteName) {
        this.init();
        return this.REV_PITCH.hasOwnProperty(noteName.toLowerCase());
    },

    midiFromPitch: function (noteName) {
        this.init();
        return this.REV_PITCH[noteName.toLowerCase()] || null;
    },

    pitchFromMidi: function (midi) {
        this.init();
        return this.PITCH_MAP[midi] || null;
    },

    getNextPitch: function (currentPitch, direction) {
        this.init();
        const currentMidi = this.midiFromPitch(currentPitch);
        if (!currentMidi) return currentPitch; // Or default?

        const nextMidi = direction > 0 ? currentMidi + 1 : currentMidi - 1;
        return this.pitchFromMidi(nextMidi) || currentPitch; // Return original if out of bounds
    },

    transposeUnits: function (units, semitones) {
        this.init();
        let changed = false;
        // Deep copy not strictly needed if we just mutate, but let's mutate as requested by usage
        units.forEach(u => {
            u.pitches = u.pitches.map(p => {
                const m = this.midiFromPitch(p);
                if (m) {
                    const newM = m + semitones;
                    const newP = this.pitchFromMidi(newM);
                    if (newP) {
                        changed = true;
                        return newP;
                    }
                }
                return p;
            });
        });
        return changed;
    }
};

// Initialize immediately
Logic.init();