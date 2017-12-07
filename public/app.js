//  --- setup ---

let ctx;

let canvasWidth = 800, canvasHeight = 800;
let width = 20, height = 20;
let rectWidth = canvasWidth / width, rectHeight = canvasHeight / height;
let rect, startCoord, goalCoord;

let mouseDown;
let empty = 0, wall = 1, start = 2, goal = 3;
let pathNode = 4, graphNode = 5, graphEdge = 6;
let draw = empty;
let drawColors = ['#bbb', '#555', '#0b0', '#b00', '#fff', '#00b', '#0dd'];

let path, graph;

let initCanvas = () => {
    let canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext('2d');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    update();
};

let initRect = (density) => {
    rect = [];
    _.times(width, () => {
        let column = [];
        rect.push(column);
        _.times(width, () => {
            column.push(randBoolean(density) ? wall : empty);
        });
    });

    startCoord = {
        x: randInt(0, width),
        y: randInt(0, height)
    };
    setRect(startCoord, start);

    goalCoord = {
        x: randInt(0, width),
        y: randInt(0, height)
    };
    setRect(goalCoord, goal);
};

let init = () => {
    initRect(.3);
    window.onload = initCanvas;
};

// --- util ---

let randBoolean = (trueWeight) => {
    return Math.random() < trueWeight;
};

let randDouble = (min, max) => {
    return Math.random() * (max - min) + min;
};

let randInt = (min, max) => {
    return parseInt(Math.random() * (max - min)) + min;
};

let update = () => {
    if (startCoord && goalCoord) {
        let aStar = astarMain(rect, startCoord, goalCoord);
        path = aStar.path;
        graph = aStar.graph;
    }
    refreshCanvas();
};

let refreshCanvas = () => {
    // draw map
    drawCanvasClear();
    _.each(rect, (column, x) => {
        _.each(column, (cell, y) => {
            drawCanvasRect(createRect(x, y), drawColors[cell], true);
        });
    });

    // draw graph nodes
    _.each(graph, (node) => {
        drawCanvasRect(createRectSmall(node.coord.x, node.coord.y), drawColors[graphNode], true)
    });

    // draw graph edges
    _.each(graph, (node) => {
        _.each(node.connected, (connected) => {
            drawLine(createLine(node.coord.x, node.coord.y, connected.neighbor.coord.x, connected.neighbor.coord.y), drawColors[graphEdge], 1);
        });
    });

    // draw path
    _.times(path.length - 1, (i) => {
        drawLine(createLine(path[i].x, path[i].y, path[i + 1].x, path[i + 1].y), drawColors[pathNode], 5);
    });
    _.each(path, (coord) => {
        drawCanvasRect(createRectSmall(coord.x, coord.y), drawColors[pathNode], true)
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

let createRectSmall = (x, y) => {
    return {
        x: (x + .25) * rectWidth,
        y: (y + .25) * rectHeight,
        width: rectWidth * .5,
        height: rectHeight * .5
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

let getRect = (coord) => {
    return rect[coord.x][coord.y];
}

let setRect = (coord, value) => {
    if (value === start) {
        if (startCoord)
            rect[startCoord.x][startCoord.y] = empty;
        startCoord = coord;
    } else if (value === goal) {
        if (goalCoord)
            rect[goalCoord.x][goalCoord.y] = empty;
        goalCoord = coord;
    } else if (coord === startCoord)
        startCoord = null;
    else if (coord === goalCoord)
        goalCoord = null;

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

let drawLine = (line, color, width) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(line.x1, line.y1);
    ctx.lineTo(line.x2, line.y2);
    ctx.stroke();
};

// --- input ---
let eraseRect = () => {
    initRect(0);
    _.times(width, (x) => {
        rect[x][0] = wall;
        rect[x][height - 1] = wall;
    });
    _.times(height, (y) => {
        rect[0][y] = wall;
        rect[width - 1][y] = wall;
    });
    update();
}

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
        update();
    }
};


init();
