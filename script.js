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

            window.addEventListener("keypress", this.keyPress);
            window.addEventListener("keyup", this.keyRelease);
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
            '0': -100,
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
            'c2+': 385
        },

        generateLines: function () {
            let barsWindow = document.querySelector("#bars");
            let line = document.createElement("div");
            line.classList.add("line");

            barsWindow.appendChild(line);

            setTimeout(function () {
                barsWindow.removeChild(line);
            }, 13000);
        },

        generateBar: function (tone, noteType, wholeNoteDuration, autoPlay = false) {
            let barsWindow = document.querySelector("#bars");
            let bar = document.createElement("div");
            if (tone.indexOf('+') !== -1)
                bar.classList.add("black-bar");
            else
                bar.classList.add("white-bar");

            bar.style.left = this.coordinates[tone] + "px";
            let height = Math.floor(noteType * wholeNoteDuration / 10) - 2;
            bar.style.height = height + "px";

            setTimeout(function () {
                barsWindow.appendChild(bar);
            }, height * 10);

            setTimeout(function () {
                barsWindow.removeChild(bar);
            }, 13000);

            if(autoPlay === true) {
                let keyboard = global.keyboard;

                setTimeout(function () {
                    keyboard.play(tone);
                }, 8000);

                setTimeout(function () {
                    keyboard.stop(tone);
                }, 8000 + height * 10);
            }
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

        playSong: function (iterator, wnd, callback, autoPlay = false) {
            let that = this;
            let song = that.loadedSong;
            if (song.notes[iterator] === undefined) {
                callback.apply();
                return;
            }
            global.bars.generateBar(song.notes[iterator].note, song.notes[iterator].noteType, wnd, autoPlay);
            setTimeout(function () {
                that.playSong(++iterator, wnd, callback, autoPlay);
            }, wnd * song.notes[iterator].noteType);
        },

        play: function (elem, autoPlay = false) {
            let that = this;
            let metrum = that.loadedSong.measure.split('/')[0] / that.loadedSong.measure.split('/')[1];
            let delay = 60 / that.loadedSong.tempo * 1000;
            let buttons = document.querySelectorAll("#play-mode input[type='button'], #song-select input[type='button']");
            buttons.forEach(function (value) {
                value.disabled = true;
            });

            global.bars.generateLines();
            let generatingLines = setInterval(global.bars.generateLines, delay * metrum);
            that.playSong(0, delay, function () {
                clearInterval(generatingLines);
                setTimeout(function () {
                    elem.classList.remove("active");
                    buttons.forEach(function (value) {
                        value.disabled = false;
                    });
                }, 10000);
            }, autoPlay);
            that.countdown(5);
        },

        loadSong: function (name, elem) {
            let that = this;

            let xmlHttpRequest = new XMLHttpRequest();
            xmlHttpRequest.overrideMimeType("application/json");
            xmlHttpRequest.open('GET', 'songs/'+name+'.json', true);
            xmlHttpRequest.onreadystatechange = function () {
                if (xmlHttpRequest.readyState === 4 && xmlHttpRequest.status === 200) {
                    that.loadedSong = JSON.parse(xmlHttpRequest.responseText);
                    elem.classList.add('active');
                }
            };
            xmlHttpRequest.send(null);
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
        },

        countdown: function (time) {
            if (time <= 0) {
                let overlay = document.querySelector("#overlay");
                document.querySelector("body").removeChild(overlay);
                return;
            } else if (document.querySelector("#overlay span") === null) {
                let overlay = document.createElement("div");
                overlay.id = "overlay";
                let timer = document.createElement("span");
                timer.innerText = time;
                overlay.appendChild(timer);
                document.querySelector("body").appendChild(overlay);
            } else {
                document.querySelector("#overlay span").innerText = time;
            }
            setTimeout(function () {
                global.songs.countdown(time-1);
            }, 1000);
        }
    },

    buttons: {
        selectClick: function (elem, name) {
            let buttons = document.querySelectorAll("#song-select input[type='button']");
            buttons.forEach(function (value) {
                value.classList.remove('active');
            });
            global.songs.loadSong(name, elem);
        },

        play: function (elem, autoPlay = false) {
            if(global.songs.loadedSong.notes === undefined) {
                alert("Nie wybrano utworu");
            } else {
                let buttons = document.querySelectorAll("#play-mode input[type='button']");
                buttons.forEach(function (value) {
                    value.classList.remove('active');
                });
                elem.classList.add('active');
                global.songs.play(elem, autoPlay);
            }
        }
    },

    construct: function () {
        global.keyboard.construct();
    }
};

document.addEventListener('DOMContentLoaded', function () {
    global.construct();
}, false);