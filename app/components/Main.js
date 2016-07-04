import React from "react";
var canvasSide = 1000;
var gridSide = 10;
var boardSide = 100;
var minRoomSide = 10;
var maxRoomSide = 16;
var player = 2;
var life = 3;
var enemy = 4;
var weapon = 5;
var gate = 6;
var boss = 7;
var weapons = ["Basic sword", "Blade", "Sabre", "Spear", "Whip", "Keris", "Balmung", "Trident", "Lava whip"];

var getRandom = (min, max) => {
    return min + Math.floor(Math.random() * (max - min + 1));
}

class Board extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            health: 100,
            attack: getRandom(5, 10),
            level: 1,
            weapon: weapons[0],
            XP: 0,
            dungeon: 1
        };
        this.playerPosition;
        this.initialState;
        this.grid;
        this.ctx;
        this.c;
        this.rooms = [];
        this.frame;
        this.bossPower = getRandom(200, 300);
    }

    createArray(rows) {
        var arr = [];
        for (var i = 0; i < rows; i++) {
            arr[i] = [];
        }
        return arr;
    }

    componentDidMount() {
        var _this = this;
        this.initialState = Object.assign({}, this.state);
        window.addEventListener('keydown', _this.navigate.bind(_this));
        this.c = document.getElementById('board');
        this.ctx = this.c.getContext('2d');
        this.grid = this.createArray(boardSide);
        this.ctx.clearRect(0, 0, canvasSide, canvasSide);
        this.ctx.fillStyle = "#fff";
        this.placeRoom();
        this.placeObject(player, 1);
        this.placeObject(enemy, getRandom(4, 8));
        this.placeObject(life, getRandom(2, 5));
        this.placeObject(weapon, 1);
        this.placeObject(gate, 1);
        this.drawSquares();
    }

    drawSquares() {
        for (var j = 0; j < boardSide; j++) {
            var x = j * gridSide;
            for (var k = 0; k < boardSide; k++) {
                var y = k * gridSide;
                if (this.grid[j][k] > 0) {
                    if (this.grid[j][k] === 2) {
                        this.ctx.fillStyle = "#00f";
                        this.playerPosition = { x: j, y: k };
                    } else if (this.grid[j][k] === 3) {
                        this.ctx.fillStyle = "#007f00";
                    } else if (this.grid[j][k] === 4 || this.grid[j][k] === 7) {
                        this.ctx.fillStyle = "#f00";
                    } else if (this.grid[j][k] === 5) {
                        this.ctx.fillStyle = "#b27300";
                    } else if (this.grid[j][k] === 6) {
                        this.ctx.fillStyle = "#8B008B";
                    }
                    this.ctx.fillRect(x, y, gridSide, gridSide);
                    this.ctx.fillStyle = "#fff";
                }
            }

        }
    }

    placeObject(objectValue, times) {
        var _this = this;
        for (var i = 0; i < times; i++) {
            var room = this.rooms[getRandom(0, _this.rooms.length - 1)];
            var x = getRandom(room.x1, room.x2);
            var y = getRandom(room.y1, room.y2);
            if (this.grid[x][y] !== 2) {
                this.grid[x][y] = objectValue;
            }
        }
    }

    placeRoom() {
        var rooms = this.rooms;
        for (var i = 0, j = 0; i < 300; i++) {
            var width = minRoomSide + Math.floor(Math.random() * (maxRoomSide - minRoomSide + 1));
            var height = minRoomSide + Math.floor(Math.random() * (maxRoomSide - minRoomSide + 1));
            var x1 = Math.floor(Math.random() * (boardSide - width - 1)) + 1;
            var y1 = Math.floor(Math.random() * (boardSide - height - 1)) + 1;
            var x2 = x1 + width;
            var y2 = y1 + height;
            var intersect = false;
            var newRoom = { x1: x1, x2: x2, y1: y1, y2: y2, centerX: Math.floor((x1 + x2) / 2), centerY: Math.floor((y1 + y2) / 2) };
            for (var otherRoom of rooms) {
                if (x1 <= otherRoom.x2 - 1 && x2 + 1 >= otherRoom.x1 && y1 <= otherRoom.y2 - 1 && otherRoom.y2 + 1 >= otherRoom.y1) {
                    intersect = true;
                    break;
                }
            }
            if (!intersect) {
                this.createRoom(x1, y1, x2, y2);
                if (j !== 0) {
                    if (Math.floor(Math.random() * 2) === 1) {
                        this.horizConnect(rooms[j - 1].centerX, newRoom.centerX, rooms[j - 1].centerY);
                        this.vertiConnect(rooms[j - 1].centerY, newRoom.centerY, newRoom.centerX);
                    } else {
                        this.vertiConnect(rooms[j - 1].centerY, newRoom.centerY, rooms[j - 1].centerX);
                        this.horizConnect(rooms[j - 1].centerX, newRoom.centerX, newRoom.centerY);
                    }
                }
                this.rooms[j] = newRoom;
                j++;
            }
        }

    }

    horizConnect(x1, x2, y) {
        var x = Math.min(x1, x2);
        var xM = Math.max(x1, x2);
        for (; x <= xM; x++) {
            this.grid[x][y] = 1;
        }
    }

    vertiConnect(y1, y2, x) {
        var y = Math.min(y1, y2);
        var yM = Math.max(y1, y2);
        for (; y <= yM; y++) {
            this.grid[x][y] = 1;
        }
    }

    createRoom(x1, y1, x2, y2) {
        for (var x = x1; x <= x2; x++) {
            for (var y = y1; y <= y2; y++) {
                this.grid[x][y] = 1;
            }
        }
    }

    move(dir) {
        var _this = this;
        var position = this.playerPosition;
        switch (dir) {
            case "up":
                _this.ctx.clearRect(position.x * gridSide, (position.y - 1) * gridSide, gridSide, 2 * gridSide);
                _this.grid[position.x][position.y] = 1;
                _this.grid[position.x][position.y - 1] = 2;
                _this.playerPosition = { x: position.x, y: position.y - 1 };
                _this.ctx.fillStyle = "#fff";
                _this.ctx.fillRect(position.x * gridSide, position.y * gridSide, gridSide, gridSide);
                _this.ctx.fillStyle = "#00f";
                _this.ctx.fillRect(position.x * gridSide, (position.y - 1) * gridSide, gridSide, gridSide);
                break;
            case "left":
                _this.ctx.clearRect((position.x - 1) * gridSide, position.y * gridSide, gridSide * 2, gridSide);
                _this.grid[position.x][position.y] = 1;
                _this.grid[position.x - 1][position.y] = 2;
                _this.playerPosition = { x: position.x - 1, y: position.y };
                _this.ctx.fillStyle = "#fff";
                _this.ctx.fillRect(position.x * gridSide, position.y * gridSide, gridSide, gridSide);
                _this.ctx.fillStyle = "#00f";
                _this.ctx.fillRect((position.x - 1) * gridSide, position.y * gridSide, gridSide, gridSide);
                break;
            case "down":
                _this.ctx.clearRect(position.x * gridSide, position.y * gridSide, gridSide, 2 * gridSide);
                _this.grid[position.x][position.y] = 1;
                _this.grid[position.x][position.y + 1] = 2;
                _this.playerPosition = { x: position.x, y: position.y + 1 };
                _this.ctx.fillStyle = "#fff";
                _this.ctx.fillRect(position.x * gridSide, position.y * gridSide, gridSide, gridSide);
                _this.ctx.fillStyle = "#00f";
                _this.ctx.fillRect(position.x * gridSide, (position.y + 1) * gridSide, gridSide, gridSide);
                break;
            case "right":
                _this.ctx.clearRect(position.x * gridSide, position.y * gridSide, gridSide * 2, gridSide);
                _this.grid[position.x][position.y] = 1;
                _this.grid[position.x + 1][position.y] = 2;
                _this.playerPosition = { x: position.x + 1, y: position.y };
                _this.ctx.fillStyle = "#fff";
                _this.ctx.fillRect(position.x * gridSide, position.y * gridSide, gridSide, gridSide);
                _this.ctx.fillStyle = "#00f";
                _this.ctx.fillRect((position.x + 1) * gridSide, position.y * gridSide, gridSide, gridSide);
                break;
        }
    }

    fightEnemy() {
        var _this = this;
        _this.setState({
            health: _this.state.health - getRandom(5, 10)
        }, _this.checkFinish.bind(_this));
        if (getRandom(0, 10) <= 6 + (_this.state.level - _this.state.attack / (10 * _this.state.dungeon))) {
            return true;
        }
        _this.setState({
            XP: _this.state.XP + getRandom(10, 15)
        }, function() {
            _this.setState({
                level: 1 + Math.floor(_this.state.XP / 50)
            });
        });
        return false;
    }

    increaseHealth() {
        var _this = this;
        _this.setState({
            health: _this.state.health + getRandom(10, 15) * _this.state.level
        });
    }

    getWeapon() {
        var _this = this;
        _this.setState({
            weapon: weapons[_this.state.level],
            attack: _this.state.attack + getRandom(10, 15)
        });
    }

    nextLevel() {
        var _this = this;
        this.rooms = [];
        this.grid = this.createArray(boardSide);
        this.ctx.clearRect(0, 0, canvasSide, canvasSide);
        this.ctx.fillStyle = "#fff";
        this.placeRoom();
        this.placeObject(player, 1);
        this.placeObject(enemy, getRandom(4, 8));
        this.placeObject(life, getRandom(2, 5));
        this.placeObject(weapon, 1);
        _this.setState({
            dungeon: _this.state.dungeon + 1
        }, _this.finalLevel.bind(_this));
        this.drawSquares();
    }

    placeBoss() {
        var _this = this;
        var room = this.rooms[getRandom(0, _this.rooms.length - 1)];
        var x = getRandom(room.x1, room.x2);
        var y = getRandom(room.y1, room.y2);
        while (this.grid[x][y] !== 1 || this.grid[x - 1][y] !== 1 || this.grid[x][y - 1] !== 1 || this.grid[x - 1][y - 1] !== 1) {
            room = this.rooms[getRandom(0, _this.rooms.length - 1)];
            x = getRandom(room.x1, room.x2);
            y = getRandom(room.y1, room.y2);
        }
        this.grid[x][y] = 7;
        this.grid[x - 1][y] = 7;
        this.grid[x - 1][y - 1] = 7;
        this.grid[x][y - 1] = 7;

    }

    checkFinish() {
        var _this = this;
        if (this.state.health <= 0 || this.bossPower <= 0) {
            this.setState(_this.initialState, function() {
                _this.rooms = [];
                _this.grid = this.createArray(boardSide);
                _this.ctx.clearRect(0, 0, canvasSide, canvasSide);
                _this.ctx.fillStyle = "#fff";
                _this.placeRoom();
                _this.placeObject(player, 1);
                _this.placeObject(enemy, getRandom(4, 8));
                _this.placeObject(life, getRandom(2, 5));
                _this.placeObject(weapon, 1);
                _this.placeObject(gate, 1);
                _this.drawSquares();
            });
        }
    }

    fightBoss() {
        var _this = this;
        _this.bossPower -= _this.state.attack;
        _this.setState({
            health: _this.state.health - getRandom(20, 40)
        }, _this.checkFinish.bind(_this));
    }

    finalLevel() {
        if (this.state.dungeon < 4) {
            this.placeObject(gate, 1);
        } else {
            this.placeBoss();
        }
    }

    handleMove(dir) {
        var _this = this;
        var position = this.playerPosition;
        switch (dir) {
            case "up":
                if (!(this.grid[position.x][position.y - 1] > 0)) {
                    break;
                }
                switch (this.grid[position.x][position.y - 1]) {
                    case 4:
                        if (_this.fightEnemy()) {
                            break;
                        }
                        _this.move("up");
                        break;
                    case 3:
                        _this.increaseHealth();
                        _this.move("up");
                        break;
                    case 1:
                        _this.move("up");
                        break;
                    case 5:
                        _this.getWeapon();
                        _this.move("up");
                        break;
                    case 6:
                        _this.nextLevel();
                        break;
                    case 7:
                        _this.fightBoss();
                        break;
                }
                break;
            case "left":
                if (position.x - 1 < 0 || !(this.grid[position.x - 1][position.y] > 0)) {
                    break;
                }
                switch (this.grid[position.x - 1][position.y]) {
                    case 4:
                        if (_this.fightEnemy()) {
                            break;
                        }
                        _this.move("left");
                        break;
                    case 3:
                        _this.increaseHealth();
                        _this.move("left");
                        break;
                    case 1:
                        _this.move("left");
                        break;
                    case 5:
                        _this.getWeapon();
                        _this.move("up");
                        break;
                    case 6:
                        _this.nextLevel();
                        break;
                    case 7:
                        _this.fightBoss();
                        break;
                }
                break;
            case "down":
                if (!(this.grid[position.x][position.y + 1] > 0)) {
                    break;
                }
                switch (this.grid[position.x][position.y + 1]) {
                    case 4:
                        if (_this.fightEnemy()) {
                            break;
                        }
                        _this.move("down");
                        break;
                    case 3:
                        _this.increaseHealth();
                        _this.move("down");
                        break;
                    case 1:
                        _this.move("down");
                        break;
                    case 5:
                        _this.getWeapon();
                        _this.move("up");
                        break;
                    case 6:
                        _this.nextLevel();
                        break;
                    case 7:
                        _this.fightBoss();
                        break;
                }
                break;
            case "right":
                if (position.x + 1 > boardSide - 1 || !(this.grid[position.x + 1][position.y] > 0)) {
                    break;
                }
                switch (this.grid[position.x + 1][position.y]) {
                    case 4:
                        if (_this.fightEnemy()) {
                            break;
                        }
                        _this.move("right");
                        break;
                    case 3:
                        _this.increaseHealth();
                        _this.move("right");
                        break;
                    case 1:
                        _this.move("right");
                        break;
                    case 5:
                        _this.getWeapon();
                        _this.move("up");
                        break;
                    case 6:
                        _this.nextLevel();
                        break;
                    case 7:
                        _this.fightBoss();
                        break;
                }
                break;
        }
    }

    navigate(e) {
        var _this = this;
        switch (e.keyCode) {
            case 38:
                _this.handleMove("up");
                break;
            case 37:
                _this.handleMove("left");
                break;
            case 40:
                _this.handleMove("down");
                break;
            case 39:
                _this.handleMove("right");
                break;
        }
    }

    render() {
        var _this = this;
        return (
            <div id="content">
                <div id="canvas">
                    <canvas id="board" width="1000" height="1000"></canvas>
                </div>
                <div id="stats">
                    <p>Health: {_this.state.health}</p>
                    <p>Attack: {_this.state.attack}</p>
                    <p>Weapon: {_this.state.weapon}</p>
                    <p>XP: {_this.state.XP}</p>
                    <p>Level: {_this.state.level}</p>
                    <p>Dungeon: {_this.state.dungeon}</p>
                </div>
            </div>
        )
    }

}

export default Board;
