//  --- setup ---

let mmlSpan, imnSpan, ratioSpan, ctx;

let canvasWidth = 950, canvasHeight = 950;
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
    mmlSpan = document.getElementById('mmlSpan');
    imnSpan = document.getElementById('imnSpan');
    ratioSpan = document.getElementById('ratioSpan');
    let canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext('2d');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    update();
};

let initRectRand = (density) => {
    rect = [];
    _.times(width, () => {
        let column = [];
        rect.push(column);
        _.times(height, () => {
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

initRectHouse = () => {
    let hg = houseGenerator(width, height);
    hg.generate();

    let walls = hg.getWalls();
    rect = _.map(walls, (column) => {
        return _.map(column, (wall) => {
            return wall ? 1 : 0;
        });
    });

    startCoord = hg.getSpawn(0);
    goalCoord = hg.getSpawn(1);
    rect[startCoord.x][startCoord.y] = start;
    rect[goalCoord.x][goalCoord.y] = goal;
};

let init = () => {
    initRectHouse(0);
    window.onload = initCanvas;
};

let update = () => {
    if (startCoord && goalCoord) {
        let aStar = astarMain(rect, startCoord, goalCoord);
        path = aStar.path;
        graph = aStar.graph;
    }
    refreshText();
    refreshCanvas();
};

let refreshText = () => {
    let mapAreas = _.countBy(_.flatten(rect), (r) => {
        return r;
    });
    mmlSpan.innerText = mapAreas['0'];
    imnSpan.innerText = graph.length;
    ratioSpan.innerText = parseInt(graph.length / mapAreas['0'] * 1000) / 1000;
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
                drawCanvasLine(createLine(node.coord.x, node.coord.y, connected.neighbor.coord.x, connected.neighbor.coord.y), drawColors[graphColor], 1);
            });
        });
    }

    if (pathOverlay) {
        // draw path
        _.times(path.length - 1, (i) => {
            drawCanvasLine(createLine(path[i].x, path[i].y, path[i + 1].x, path[i + 1].y), drawColors[pathNode], 4);
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

init();
