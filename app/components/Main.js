import React from "react";
var canvasSide = 1000;
var gridSide = 10;
var boardSide = 100;
var minRoomSide = 12;
var maxRoomSide = 24;

var getRandom = (min, max) => {
    return min + Math.floor(Math.random() * (max - min + 1));
}

class Board extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            start: true,
            simSpeed: 250,
            generation: 0
        };
        this.grid;
        this.copyGrid;
        this.ctx;
        this.c;
        this.rooms = [];
        this.frame;
    }

    createArray(rows) {
        var arr = [];
        for (var i = 0; i < rows; i++) {
            arr[i] = [];
        }
        return arr;
    }

    componentDidMount() {
        this.c = document.getElementById('board');
        this.ctx = this.c.getContext('2d');
        this.grid = this.createArray(boardSide);
        this.ctx.clearRect(0, 0, canvasSide, canvasSide);
        this.ctx.fillStyle = "#FF0000";
        this.placeRoom();
        for (var j = 0; j < boardSide; j++) {
            var x = j * gridSide;
            for (var k = 0; k < boardSide; k++) {
                if (this.grid[j][k] === 1) {
                    var y = k * gridSide;
                    this.ctx.fillRect(x, y, gridSide, gridSide);
                }
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

    render() {
        var _this = this;
        return (
            <div id="content">
                <div id="canvas">
                    <canvas id="board" width="1000" height="1000"></canvas>
                </div>
            </div>
        )
    }

}

export default Board;
