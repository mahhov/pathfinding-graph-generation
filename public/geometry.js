let makeCoordinate = (x, y) => {
    return {
        x: x,
        y: y
    };
};

let modifyCoordinate = (coord, dx, dy) => {
    return {
        x: coord.x + dx,
        y: coord.y + dy
    };
};

let createRect = (x, y) => {
    return {
        x: x * rectWidth,
        y: y * rectHeight,
        width: rectWidth,
        height: rectHeight
    };
};

let createRectSmall = (x, y, size) => {
    let shift = (1 - size) / 2;
    return {
        x: (x + shift) * rectWidth,
        y: (y + shift) * rectHeight,
        width: rectWidth * size,
        height: rectHeight * size
    };
};

let createLine = (x1, y1, x2, y2) => {
    return {
        x1: (x1 + .5) * rectWidth,
        y1: (y1 + .5) * rectHeight,
        x2: (x2 + .5) * rectWidth,
        y2: (y2 + .5) * rectHeight
    };
};

let getCoord = (x, y) => {
    return {
        x: parseInt(x / rectWidth),
        y: parseInt(y / rectHeight)
    };
};
