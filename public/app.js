//  --- setup ---

let ctx;

let canvasWidth = 800, canvasHeight = 800;
let width = 20, height = 20;
let rectWidth = canvasWidth / width, rectHeight = canvasHeight / height;
let rect = [], startCoord, goalCoord;

let mouseDown;
let empty = 0, wall = 1, start = 2, goal = 3;
let draw = empty;
let drawColors = ['#bbb', '#555', '#0b0', '#b00'];

let initCanvas = () => {
    let canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext('2d');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    refreshCanvas();
};

let initRect = () => {
    _.times(width, () => {
        let column = [];
        rect.push(column);
        _.times(width, () => {
            column.push(randBoolean(.3) ? wall : empty);
        });
    });
};

let init = () => {
    initRect();
    window.onload = initCanvas;
};

// --- util ---

let randBoolean = (trueWeight) => {
    return Math.random() < trueWeight;
};

let randDouble = (min, max) => {
    return Math.random() * (max - min) + min;
};

let refreshCanvas = () => {
    drawCanvasClear();
    _.each(rect, (column, x) => {
        _.each(column, (cell, y) => {
            let rect = createRect(x, y);
            drawCanvasRect(rect, drawColors[cell], true);
        });
    });
};

let createRect = (x, y) => {
    return {
        x: x * rectWidth,
        y: y * rectHeight,
        width: rectWidth,
        height: rectHeight
    };
};

let getCoord = (x, y) => {
    return {
        x: parseInt(x / rectWidth),
        y: parseInt(y / rectHeight)
    };
};

let getRect = (coord) => {
    return rect[coord.x][coord.y];
}

let setRect = (coord, value) => {
    if (value === start) {
        if (startCoord)
            rect[startCoord.x][startCoord.y] = empty;
        startCoord = coord;
    }

    if (value === goal) {
        if (goalCoord)
            rect[goalCoord.x][goalCoord.y] = empty;
        goalCoord = coord;
    }

    rect[coord.x][coord.y] = value;
}

let setDraw = (value) => {
    draw = value;
}

// --- canvas drawing ---

let drawCanvasClear = () => {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
};

let drawCanvasRect = (rect, color, fill) => {
    if (fill) {
        ctx.fillStyle = color;
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    } else {
        ctx.strokeStyle = color;
        ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
    }
};

// --- input ---

let handleMouseDown = (x, y) => {
    mouseDown = true;
    if (draw === empty)
        draw = getRect(getCoord(x, y)) ? empty : wall;
    handleMouseMove(x, y);
};

let handleMouseUp  = () => {
    mouseDown = false;
    draw = empty;
};

let handleMouseMove = (x, y) => {
    if (mouseDown) {
        setRect(getCoord(x, y), draw);
        refreshCanvas();
    }
};


init();
