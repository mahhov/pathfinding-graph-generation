let intersects = (map, start, end) => {
    let totalMoved = 0;
    let totalToMove = Math.sqrt((end.x - start.x) * (end.x - start.x), (end.y - start.y) * (end.y - start.y));

    let x = start.x + .5;
    let y = start.y + .5;

    let dirX = end.x - start.x;
    let dirY = end.y - start.y;
    dirX /= totalToMove;
    dirY /= totalToMove;

    while (true) {
        let moveX = getMove(x, dirX);
        let moveY = getMove(y, dirY);

        let move = (moveX < moveY? moveX : moveY) + 0.0000001;
        totalMoved += move;

        if (totalMoved > totalToMove)
            return false;

        x += dirX * move;
        y += dirY * move;

        if (!isMoveable(map, parseInt(x), parseInt(y)))
            return true;
    }
};

let getMove = (pos, dir) => {
    if (dir > 0)
        return (parseInt(pos) + 1 - pos) / dir;
    else if (dir < 0)
        return (pos - parseInt(pos)) / -dir;
    else
        return 2;
};

let isMoveable = (map, x, y) => {
    return x >= 0 && x < map.length && y >= 0 && y < map[0].length && !map[x][y];
};
