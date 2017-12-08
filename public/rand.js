
let randBoolean = (trueWeight) => {
    return Math.random() < trueWeight;
};

let randDouble = (min, max) => {
    return Math.random() * (max - min) + min;
};

let randInt = (min, max) => {
    return parseInt(Math.random() * (max - min)) + min;
};
