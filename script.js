let global = {
    keyboard: {
        notes: ['c', 'c+', 'd', 'd+', 'e', 'f', 'f+', 'g', 'g+', 'a', 'a+', 'h'],
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
            'k': {}
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
            'h': 300
        },

        generateLines: function (duration) {
            let that = this;
            let barsWindow = document.querySelector("#bars");
            let line = document.createElement("div");
            line.classList.add("line");

            barsWindow.appendChild(line);

            setTimeout(function () {
                barsWindow.removeChild(line);
            }, 5000);

            setTimeout(function () {
                that.generateLines(duration);
            }, duration);
            //60000/tempo*4
        },

        generateBar: function (tone, noteType, duration, metrum) {
            let barsWindow = document.querySelector("#bars");
            let bar = document.createElement("div");
            if (tone.length > 1)
                bar.classList.add("black-bar");
            else
                bar.classList.add("white-list");

            bar.style.left = this.coordinates[tone] + "px";
            bar.style.height = (duration/500000)*metrum*noteType + "px";
            this.generateLines(duration);

            barsWindow.appendChild(bar);

            setTimeout(function () {
                barsWindow.removeChild(bar);
            }, 5000);
        }
    },

    construct: function () {
        global.keyboard.construct();
    }
};

document.addEventListener('DOMContentLoaded', function () {
    global.construct();
}, false);