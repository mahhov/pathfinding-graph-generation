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
