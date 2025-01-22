// Select all the piano keys
const pianoKeys = document.querySelectorAll(".piano-keys .key");

// Select the circle
const circle = document.getElementById('circle');

// Define key-to-color mapping
const keyColors = {
    's': '#c42222', // red
    'd': '#fe6300', // orange
    'f': '#ffec00', // yellow
    'j': '#25fe00', // green
    'k': '#0080EA', // blue
    'l': '#983DE8'  // purple
};

// Key-to-shadow mapping (for shadow effect)
const keyMap = {
    's': 'red',
    'd': 'orange',
    'f': 'yellow',
    'j': 'green',
    'k': 'blue',
    'l': 'purple'
};

// Track pressed keys for color blending
let pressedKeys = [];

// Function to play the audio based on the key pressed
const playTune = (key) => {
    let audio; // Declare audio variable

    // Determine the audio file based on the key
    switch (key) {
        case 's':
            audio = new Audio('sounds/red.m4a');  // Replace with your sound file
            break;
        case 'd':
            audio = new Audio('sounds/orange.m4a');  // Replace with your sound file
            break;
        case 'f':
            audio = new Audio('sounds/yellow.m4a');  // Replace with your sound file
            break;
        case 'j':
            audio = new Audio('sounds/green.m4a');  // Replace with your sound file
            break;
        case 'k':
            audio = new Audio('sounds/blue.m4a');  // Replace with your sound file
            break;
        case 'l':
            audio = new Audio('sounds/purple.m4a');  // Replace with your sound file
            break;
        default:
            console.error('No sound file found for this key.');
    }

    if (audio) {
        audio.play(); // Play the sound if audio object is created

        const clickedKey = document.querySelector(`[data-key="${key}"]`);
        if (clickedKey) {
            clickedKey.classList.add("active"); // Add active class
            // Remove active class after a short delay
            setTimeout(() => {
                clickedKey.classList.remove("active");
            }, 200); // Adjust as needed
        }
    }
};

// Function to add the pressed shadow
function pressKey(key) {
    const pianoKey = document.querySelector(`.piano-keys .${key}`);
    if (pianoKey) {
        pianoKey.classList.add('pressed'); // Add the pressed shadow
    }
}

// Function to remove the pressed shadow
function releaseKey(key) {
    const pianoKey = document.querySelector(`.piano-keys .${key}`);
    if (pianoKey) {
        pianoKey.classList.remove('pressed'); // Remove the pressed shadow
    }
}

// Function to convert HEX to RGB
function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}

// Function to blend multiple colors
function blendColors(colors) {
    const totalColors = colors.length;

    const avgColor = colors.reduce((acc, color) => {
        acc.r += color.r;
        acc.g += color.g;
        acc.b += color.b;
        return acc;
    }, { r: 0, g: 0, b: 0 });

    return `rgb(${Math.floor(avgColor.r / totalColors)}, ${Math.floor(avgColor.g / totalColors)}, ${Math.floor(avgColor.b / totalColors)})`;
}

// Add event listener for keyboard presses
document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase(); // Get the pressed key
    const validKeys = ['s', 'd', 'f', 'j', 'k', 'l']; // Define valid keys

    if (validKeys.includes(key)) {
        playTune(key); // Play the tune
        pressKey(keyMap[key]); // Add shadow effect

        // Color-changing behavior
        if (keyColors[key] && !pressedKeys.includes(key)) {
            pressedKeys.push(key); // Track pressed keys

            // Collect RGB values of all pressed keys
            const rgbColors = pressedKeys.map(k => hexToRgb(keyColors[k]));
            // Blend the colors and update the circle's background color
            circle.style.backgroundColor = blendColors(rgbColors);
        }
    }
});

// Add event listener for keyboard releases
document.addEventListener("keyup", (event) => {
    const key = event.key.toLowerCase(); // Get the released key
    const validKeys = ['s', 'd', 'f', 'j', 'k', 'l']; // Define valid keys

    if (keyMap[key]) {
        releaseKey(keyMap[key]); // Remove shadow effect
    }

    // Color-changing behavior on key release
    if (keyColors[key]) {
        pressedKeys = pressedKeys.filter(k => k !== key); // Remove key from pressedKeys array
        if (pressedKeys.length > 0) {
            // If keys are still pressed, blend the remaining colors
            const rgbColors = pressedKeys.map(k => hexToRgb(keyColors[k]));
            circle.style.backgroundColor = blendColors(rgbColors);
        } else {
            // Reset circle color when no keys are pressed
            circle.style.backgroundColor = ''; // Or set a default color
        }
    }
});

// Add event listeners to each piano key for mouse clicks
pianoKeys.forEach(key => {
    key.addEventListener("click", () => {
        playTune(key.querySelector("span").textContent); // Use the text content of the span to identify the key
    });
});
