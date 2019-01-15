let global = {
    keyboard: {
        notes: ['c', 'c+', 'd', 'd+', 'e', 'f', 'f+', 'g', 'g+', 'a', 'a+', 'h', 'c2', 'c2+'],
        keysOnKeyboard: {
            's': {},
            'e': {},
            'd': {},
            'r': {},
            'f': {},
            'g': {},
            'y': {},
            'h': {},
            'u': {},
            'j': {},
            'i': {},
            'k': {},
            'l': {},
            'p': {}
        },
        sounds: {},

        construct: function () {
            let that = this;
            this.notes.forEach(function (value) {
                let audio = new Audio("sounds/" + value + ".mp3");
                audio.loop = true;
                that.sounds[value] = audio;
            });

            let virtual_keys = document.querySelectorAll('#keyboard div');

            Object.keys(this.keysOnKeyboard).forEach(function (value, index) {
                if (that.keysOnKeyboard.hasOwnProperty(value)) {
                    that.keysOnKeyboard[value]["note"] = that.notes[index];
                    that.keysOnKeyboard[value]["key"] = virtual_keys[index];
                }
            });

            virtual_keys.forEach(function (value, key) {
                value.addEventListener("mousedown", function () {
                    that.play(that.notes[key]);
                });

                ['mouseup', 'mouseleave'].forEach(function (evt) {
                    value.addEventListener(evt, function () {
                        that.stop(that.notes[key]);
                    });
                });
            });

            document.addEventListener("keypress", this.keyPress);
            document.addEventListener("keyup", this.keyRelease);
        },

        play: function (note) {
            if (this.sounds[note] !== undefined)
                this.sounds[note].play();
        },

        stop: function (note) {
            if (this.sounds[note] !== undefined) {
                this.sounds[note].pause();
                this.sounds[note].currentTime = 0;
            }
        },

        keyPress: function (e) {
            if (global.keyboard.keysOnKeyboard.hasOwnProperty(e.key)) {
                global.keyboard.play(global.keyboard.keysOnKeyboard[e.key].note);
                global.keyboard.keysOnKeyboard[e.key].key.classList.add("active");
            }
        },

        keyRelease: function (e) {
            if (global.keyboard.keysOnKeyboard.hasOwnProperty(e.key)) {
                global.keyboard.stop(global.keyboard.keysOnKeyboard[e.key].note);
                global.keyboard.keysOnKeyboard[e.key].key.classList.remove("active");
            }
        }
    },

    bars: {
        coordinates: {
            'c': 0,
            'c+': 35,
            'd': 50,
            'd+': 85,
            'e': 100,
            'f': 150,
            'f+': 185,
            'g': 200,
            'g+': 235,
            'a': 250,
            'a+': 285,
            'h': 300,
            'c2': 350,
            'c2+': 400
        },

        generateLines: function (delay) {
            let that = this;
            let barsWindow = document.querySelector("#bars");
            let line = document.createElement("div");
            line.classList.add("line");

            barsWindow.appendChild(line);

            setTimeout(function () {
                barsWindow.removeChild(line);
            }, 8000);
        },

        generateBar: function (tone, noteType, wholeNoteDuration) {
            let barsWindow = document.querySelector("#bars");
            let bar = document.createElement("div");
            if (tone.indexOf('+') !== -1)
                bar.classList.add("black-bar");
            else
                bar.classList.add("white-bar");

            bar.style.left = this.coordinates[tone] + "px";
            let height = noteType * wholeNoteDuration / 10;
            bar.style.height = height + "px";

            setTimeout(function () {
                barsWindow.appendChild(bar);
            }, height * 10);

            setTimeout(function () {
                barsWindow.removeChild(bar);
            }, 8000);
        }
    },

    songs: {
        note: function (note, noteType) {
            this.note = note;
            this.noteType = noteType;
        },

        song: function (measure, tempo, notesArray) {
            this.measure = measure;
            this.tempo = tempo;
            this.notes = notesArray;
        },

        loadedSong: {},

        music: {"measure":"4/4","tempo":25,"notes":[{"note":"e","noteType":0.25},{"note":"e","noteType":0.25},{"note":"f","noteType":0.25},{"note":"g","noteType":0.25},{"note":"g","noteType":0.25},{"note":"f","noteType":0.25},{"note":"e","noteType":0.25},{"note":"d","noteType":0.25},{"note":"c","noteType":0.25},{"note":"c","noteType":0.25},{"note":"d","noteType":0.25},{"note":"e","noteType":0.25},{"note":"e","noteType":0.375},{"note":"d","noteType":0.125},{"note":"d","noteType":0.5},{"note":"e","noteType":0.25},{"note":"e","noteType":0.25},{"note":"f","noteType":0.25},{"note":"g","noteType":0.25},{"note":"g","noteType":0.25},{"note":"f","noteType":0.25},{"note":"e","noteType":0.25},{"note":"d","noteType":0.25},{"note":"c","noteType":0.25},{"note":"c","noteType":0.25},{"note":"d","noteType":0.25},{"note":"e","noteType":0.25},{"note":"d","noteType":0.375},{"note":"c","noteType":0.125},{"note":"c","noteType":0.5},{"note":"d","noteType":0.25},{"note":"d","noteType":0.25},{"note":"e","noteType":0.25},{"note":"c","noteType":0.25},{"note":"d","noteType":0.25},{"note":"e","noteType":0.125},{"note":"f","noteType":0.125},{"note":"e","noteType":0.25},{"note":"c","noteType":0.25},{"note":"d","noteType":0.25},{"note":"e","noteType":0.125},{"note":"f","noteType":0.125},{"note":"e","noteType":0.25},{"note":"d","noteType":0.25},{"note":"c","noteType":0.25},{"note":"d","noteType":0.25},{"note":"g","noteType":0.25},{"note":"e","noteType":0.25},{"note":"e","noteType":0.25},{"note":"e","noteType":0.25},{"note":"f","noteType":0.25},{"note":"g","noteType":0.25},{"note":"g","noteType":0.25},{"note":"f","noteType":0.25},{"note":"e","noteType":0.25},{"note":"d","noteType":0.25},{"note":"c","noteType":0.25},{"note":"c","noteType":0.25},{"note":"d","noteType":0.25},{"note":"e","noteType":0.25},{"note":"d","noteType":0.375},{"note":"c","noteType":0.125},{"note":"c","noteType":0.5}]},

        playSong: function (iterator, wnd, callback) {
            let that = this;
            let song = that.loadedSong;
            if (song.notes[iterator] === undefined) {
                callback.apply();
                return;
            }
            global.bars.generateBar(song.notes[iterator].note, song.notes[iterator].noteType, wnd);
            setTimeout(function () {
                that.playSong(++iterator, wnd, callback);
            }, wnd * song.notes[iterator].noteType);
        },

        play: function () {
            let that = this;
            let metrum = that.loadedSong.measure.split('/')[0] / that.loadedSong.measure.split('/')[1];
            let delay = 60 / that.loadedSong.tempo * metrum;
            global.bars.generateLines();
            let generatingLines = setInterval(global.bars.generateLines, delay * 1000);
            that.playSong(0, delay * 1000, function () {
                clearInterval(generatingLines);
                setTimeout(function () {
                    window.confirm("Koniec piosenki");
                }, 8500);
            });
        },

        loadSong: function (name) {
            let that = this;
            that.loadedSong = new that.song(that.music.measure, that.music.tempo, that.music.notes);
        },

        writeSong: function () {
            let that = this;
            let song = new that.song("4/4", 25, []);
            let note;
            do {
                let sound = window.prompt("nuta i rodzaj");
                let data = sound.split(' ');
                console.log(data);
                note = new that.note(data[0], eval(data[1]));
                console.log(note);
                song.notes.push(note);
            }while(note.noteType !== -1);

            console.log(JSON.stringify(song));
        }
    },

    construct: function () {
        global.keyboard.construct();
    }
};

document.addEventListener('DOMContentLoaded', function () {
    global.construct();
}, false);