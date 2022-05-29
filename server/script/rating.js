
const fs = require('fs');
const path = require("path");


;

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
 function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function loader() {
    
    let videos = await rf(path.join(__dirname, "..", "storage", "videos.json"));
    videos = JSON.parse(videos);
    for (let video of videos) {
        video.rating = getRandomArbitrary(2.5, 5)
        video.numberOfRatings = getRandomInt(7, 55)

    }
    await wf(path.join(__dirname, "..", "storage", "videos.json"), JSON.stringify(videos, null, 2))


}

loader()