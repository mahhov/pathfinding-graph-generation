//  --- setup ---

let ctx;

let canvasWidth = 1000, canvasHeight = 1000;
let width = 50, height = 50;
let rectWidth = canvasWidth / width, rectHeight = canvasHeight / height;

let rect, startCoord, goalCoord;
let path, graph;

let mouseDown;
let empty = 0, wall = 1, start = 2, goal = 3;
let pathNode = 4, graphColor = 5;
let draw = empty;
                // emtpy   wall    start   goal    path    graph
let drawColors = ['#eee', '#888', '#33d', '#d33', '#050', '#099'];
let endpointOverlay = true, graphOverlay = true, pathOverlay = true;

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
    initRect(0);
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
            let color = ((cell === start || cell === goal)) ? empty : cell;
            drawCanvasRect(createRect(x, y), drawColors[color], true);
        });
    });

    if (graphOverlay) {
        // draw graph nodes
        _.each(graph, (node) => {
            drawCanvasRect(createRectSmall(node.coord.x, node.coord.y, .3   ), drawColors[graphColor], true)
        });

        // draw graph edges
        _.each(graph, (node) => {
            _.each(node.connected, (connected) => {
                drawLine(createLine(node.coord.x, node.coord.y, connected.neighbor.coord.x, connected.neighbor.coord.y), drawColors[graphColor], 1);
            });
        });
    }

    if (pathOverlay) {
        // draw path
        _.times(path.length - 1, (i) => {
            drawLine(createLine(path[i].x, path[i].y, path[i + 1].x, path[i + 1].y), drawColors[pathNode], 4);
        });
        _.each(path, (coord) => {
            drawCanvasRect(createRectSmall(coord.x, coord.y, .3), drawColors[pathNode], true)
        });
    }

    if (endpointOverlay) {
        drawCanvasRect(createRect(goalCoord.x, goalCoord.y), drawColors[goal], true);
        drawCanvasRect(createRect(startCoord.x, startCoord.y), drawColors[start], true);
    }
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
let emptyMap = () => {
    initRect(0);
    update();
};

let randomMap = () => {
    initRect(.3);
    update();
}

let toggleEndpointOverlay = () => {
    endpointOverlay = !endpointOverlay;
    refreshCanvas();
}

let toggleGraphOverlay = () => {
    graphOverlay = !graphOverlay;
    refreshCanvas();
}

let togglePathOverlay = () => {
    pathOverlay = !pathOverlay;
    refreshCanvas();
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
