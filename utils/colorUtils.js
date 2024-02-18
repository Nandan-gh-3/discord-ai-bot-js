// utils/colorUtils.js

const reset = "\x1b[0m";

// Define ANSI color codes from 0 to 255
const colors = {};
for (let i = 0; i <= 255; i++) {
    colors[i] = `\x1b[38;5;${i}m`;
}

// Convert the keys into functions
const colorFunctions = {};
for (let key in colors) {
    colorFunctions[key] = function(text) {
        return `${colors[key]}${text}${reset}`;
    };
}

module.exports = { reset, ...colorFunctions };
