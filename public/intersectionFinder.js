let intersects = (map, start, end) => {
    let x = start.x + .5;
    let y = start.y + .5;

    let dirX = end.x - start.x;
    let dirY = end.y - start.y;

    let checkDx = dirX < 0 ? .5 : -.5;
    let checkDy = dirY < 0 ? .5 : -.5;

    let totalMoved = 0;
    let totalToMove = Math.sqrt(dirX * dirX + dirY * dirY);

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

        if (!isMoveable(map, parseInt(x), parseInt(y)) ||
            !isMoveable(map, parseInt(x + checkDx), parseInt(y)) ||
            !isMoveable(map, parseInt(x), parseInt(y + checkDy)))
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
    return x >= 0 && x < map.length && y >= 0 && y < map[0].length && map[x][y] !== 1;
};
