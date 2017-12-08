let emptyMap = () => {
    initRectRand(0);
    update();
};

let randomMap = () => {
    initRectRand(.3);
    update();
}

let houseMap = () => {
    initRectHouse();
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
