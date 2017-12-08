let houseGenerator = (width, height) => {
    let MIN_ROOM_SIZE = 4, MAX_ROOM_SIZE = 8;
    let NUM_ROOMS = 250;
    let NUM_CONNECTIONS = 100, MAX_CONNECTION_LENGTH = 3;
    let rooms;
    let walls;
    let spawns;

    let generate = () => {
        initWalls();
        placeRooms();
        connectRooms();
        fillRoomWalls();
        findSpawns();
    };

    let initWalls = () => {
        walls = [];
        _.times(width, () => {
            let column = [];
            walls.push(column);
            _.times(height, () => {
                column.push(true);
            });
        });
    };

    let placeRooms = () => {
        rooms = [];
        _.times(NUM_ROOMS, () => {
            let w = randInt(MIN_ROOM_SIZE, MAX_ROOM_SIZE);
            let h = randInt(MIN_ROOM_SIZE, MAX_ROOM_SIZE);
            let left = randInt(0, width - w);
            let top = randInt(0, height - h);
            let room = {
                left: left,
                top: top,
                right: left + w,
                bottom: top + h,
                centerX: left + w / 2,
                centerY: top + h / 2,
                width: w,
                height: h
            };

            let intersects = _.any(rooms, (room2) => {
                return room.left <= room2.right && room.right >= room2.left && room.top <= room2.bottom && room.bottom >= room2.top;
            });

            if (!intersects)
                rooms.push(room);
        });
    };

    let connectRooms = () => {
        _.times(NUM_CONNECTIONS, () => {
            let roomNum1 = randInt(0, rooms.length - 1);
            let roomNum2 = randInt(0, rooms.length - 2);
            if (roomNum1 === roomNum2)
                roomNum2++;

            room1 = rooms[roomNum1];
            room2 = rooms[roomNum2];

            if (roomDistance(room1, room2) < MAX_CONNECTION_LENGTH) {
                room1.connected = room2.connected = true;

                let start = getRoomCoord(room1), end = getRoomCoord(room2);
                let startX = start.x;
                let startY = start.y;
                let endX = end.x;
                let endY = end.y;
                let deltaX = endX > startX ? 1 : -1;
                let deltaY = endY > startY ? 1 : -1;
                endX += deltaX;
                endY += deltaY;

                if (randBoolean(.5)) {
                    _.each(_.range(startX, endX, deltaX), (x) => {
                        walls[x][startY] = false;
                    });
                    endX -= deltaX;
                    _.each(_.range(startY, endY, deltaY), (y) => {
                        walls[endX][y] = false;
                    });
                } else {
                    _.each(_.range(startY, endY, deltaY), (y) => {
                        walls[startX][y] = false;
                    });
                    endY -= deltaY;
                    _.each(_.range(startX, endX, deltaX), (x) => {
                        walls[x][endY] = false;
                    });
                }
            }
        });

        rooms = _.filter(rooms, (room) => {
            return room.connected;
        });
    };

    //connectRooms = () => {_.each(rooms, (room) => {room.connected = true;});}

    let roomDistance = (room1, room2) => {
        let distX = Math.abs(room1.centerX - room2.centerX);
        let distY = Math.abs(room1.centerY - room2.centerY);
        distX -= room1.width + room2.width;
        distY -= room1.height + room2.height;
        distX = Math.max(distX, 0);
        distY = Math.max(distY, 0);
        return distX + distY;
    };

    let fillRoomWalls = () => {
        _.each(rooms, (room) => {
            _.each(_.range(room.left + 1, room.right), (x) => {
                _.each(_.range(room.top + 1, room.bottom), (y) => {
                    walls[x][y] = false;
                });
            });
        });
    };

    let findSpawns = () => {
        spawns = [];
        _.times(2, (i) => {
            spawns.push(getRoomCoord(rooms[i]));
        });
    };

    let getRoomCoord = (room) => {
        return {
            x: randInt(room.left + 1, room.right - 1),
            y: randInt(room.top + 1, room.bottom - 1)
        };
    };

    let getWalls = () => {
        return walls;
    };

    let getSpawn = (i) => {
        return spawns[i];
    };

    return {
        generate: generate,
        getWalls: getWalls,
        getSpawn: getSpawn
    };
};
