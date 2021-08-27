var totalTiles = height*width,
    currentRotation = 0;

// playfield zoom/move logic

var scale = 1,
    panning = false,
    pointX = 0,
    pointY = 0,
    start = { x: 0, y: 0 },
    zoom = document.getElementById("zoom");

function setTransform() {
    zoom.style.transform = "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";
}

zoom.onmousedown = function (e) {
    e.preventDefault();
    start = { x: e.clientX - pointX, y: e.clientY - pointY };
    panning = true;
}

zoom.onmouseup = function (e) {
    panning = false;
}

zoom.onmousemove = function (e) {
    e.preventDefault();
    if (!panning) {
        return;
    }
    pointX = (e.clientX - start.x);
    pointY = (e.clientY - start.y);
    setTransform();
}

zoom.onwheel = function (e) {
    e.preventDefault();
    var xs = (e.clientX - pointX) / scale,
        ys = (e.clientY - pointY) / scale,
        delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);
    (delta > 0) ? (scale *= 1.2) : (scale /= 1.2);
    pointX = e.clientX - xs * scale;
    pointY = e.clientY - ys * scale;

    setTransform();
}





// logic for dragging 'n dropping of the tiles

var p = document.getElementsByClassName('unplacedTile');
var choice = document.getElementsByClassName('choice');
var dragItem = null;
var dragItem_id;
var abort;

for (var i of p) {
    i.addEventListener('dragstart', dragStart);
    i.addEventListener('dragend', dragEnd);
}

function dragStart() {
    dragItem = this;
    setTimeout(() => this.style.display = "none", 0);
    dragItem_id = this.id;
}

function dragEnd() {
    abort = false;
    dragItem = null;
    setTimeout(() => this.style.display = "block", 0);
}

for (j of choice) {
    j.addEventListener('dragover', dragOver);
    j.addEventListener('dragenter', dragEnter);
    j.addEventListener('dragleave', dragLeave);
    j.addEventListener('drop', Drop);
}

function Drop() {
    checkCompatibility(this.id, dragItem_id);
    if(abort == true){
        dragEnd();
    }else{
        document.getElementsByClassName('unplacedTile')[0].className = "tile";
        this.append(dragItem);
        updateDataSet(this.id, this.firstChild.id);
    }
}

function dragOver(e) {
    e.preventDefault();
    // this.style.border = "2px dotted cyan";
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {
    // this.style.border = "none";
}




//filling middle position with defaut tile (visual)
//actual value will be given at #1
middleTileNumber = Math.floor(totalTiles/2);
var middleTile = document.getElementById(middleTileNumber);
var defaultTile = document.getElementById('tile_0');
middleTile.append(defaultTile);

//shorter documentation of 3 lines above
document.getElementById(Math.floor(totalTiles/2)).append(document.getElementById('tile_0'));




// creating the dataset for all the tiles
var tileData = [{top: 'grass', right: 'road', bottom: 'castle', left: 'grass'},{top: 'grass', right: 'road', bottom: 'castle', left: 'road'},{top: 'grass', right: 'road', bottom: 'road', left: 'castle'},{top: 'grass', right: 'road', bottom: 'castle', left: 'castle'},{top: 'road', right: 'castle', bottom: 'castle', left: 'castle'},{top: 'road', right: 'grass', bottom: 'grass', left: 'castle'}]

var tiles = {};
for(i=0; i<totalTiles; i++){
    Object.assign(tiles, {[i]:{tile: null, top: null, right: null, bottom: null, right: null, rotation: 0}});
}


//giving middle position of grid an actual value (#1)
Object.assign(tiles, {[middleTileNumber]:{tile: 1, top: 'grass', right: 'road', bottom: 'castle', left: 'grass'}}); //change 12 to middletilenumber later





function updateDataSet(location_id, tile_id){
    console.log(currentRotation);
    tile_id = tile_id.replace(/\D/g,'');

    var oldTop = tileData[tile_id].top,
        oldRight = tileData[tile_id].right,
        oldBottom = tileData[tile_id].bottom,
        oldLeft = tileData[tile_id].left;
    //changing values for rotated tiles
    if(currentRotation == 0 || currentRotation == 360){
        var newTop = oldTop,
            newRight = oldRight,
            newBottom = oldBottom,
            newLeft = oldLeft;
    }else if(currentRotation == 270){
        var newTop = oldRight,
            newRight = oldBottom,
            newBottom = oldLeft,
            newLeft = oldTop;
    }else if(currentRotation == 180){
        var newTop = oldBottom,
            newRight = oldLeft,
            newBottom = oldTop,
            newLeft = oldRight;
    }else if(currentRotation == 90){
        var newTop = oldLeft,
            newRight = oldTop,
            newBottom = oldRight,
            newLeft = oldBottom;
    }
    Object.assign(tiles, {[location_id]:{tile: tile_id, top: newTop, left: newLeft, bottom: newBottom, right: newRight}});
}





//checks whether tile is allowed to be placed on the dropped location
function checkCompatibility(id, tile_id){
    var left_id = id-1,
        right_id = parseInt(id)+1,
        top_id = id-width,
        bottom_id = parseInt(id)+ parseInt(width),
        tile_id = tile_id.replace(/\D/g,'');
        adjacentTiles = false;

    var dontCheckTop = false,
        dontCheckRight = false,
        dontCheckBottom = false,
        dontCheckLeft = false;
    if(id < width){
        dontCheckTop = true;
    }
    if(id % width === 0){
        dontCheckLeft = true;
    }
    if([+id + +1] % width === 0){
        dontCheckRight = true;
    }
    if(Number(id) > Number([totalTiles-width])){
        dontCheckBottom = true;
        console.log('dontcheckbottom == ' + dontCheckBottom);
        console.log('id'+ id);
        console.log('totalTiles'+ totalTiles);
        console.log('width'+ width)
        console.log('[totalTiles-width]'+ [totalTiles-width]);
        console.log('id > [totalTiles-width]'+ Number(id) > Number([totalTiles-width]));
    }
    
    //check left tile
    if(left_id < 0){
        console.log('left tile pos doesn\'t exist');
    }else if(tiles[left_id].right == null){
        console.log('left is empty');
    }else if(dontCheckLeft == false){
        adjacentTiles = true;
        if(currentRotation == 0 || currentRotation == 360){
            if(tiles[left_id].right == tileData[tile_id].left){
            }else{
                console.log('left uncompatible!');
                abort = true;
            }
        }else if(currentRotation == 90){
            if(tiles[left_id].right == tileData[tile_id].bottom){
            }else{
                console.log('left uncompatible!');
                abort = true;
            }
        }else if(currentRotation == 180){
            if(tiles[left_id].right == tileData[tile_id].right){
            }else{
                console.log('left uncompatible!');
                abort = true;
            }
        }else if(currentRotation == 270){
            if(tiles[left_id].right == tileData[tile_id].top){
            }else{
                console.log('left uncompatible!');
                abort = true;
            }
        }
    }else{
        console.log('dontCheckLeft == '+dontCheckLeft);
    }
        

    //check right tile
    if(right_id >= totalTiles){
        console.log('right tile pos doesn\'t exist');
    }else if(tiles[right_id].left == null){
        console.log('right is empty');
    }else if(dontCheckRight == false){
        adjacentTiles = true;
        if(currentRotation == 0 || currentRotation == 360){
            if(tiles[right_id].left == tileData[tile_id].right){
            }else{
                console.log('right uncompatible!');
                abort = true;
            }
        }else if(currentRotation == 90){
            if(tiles[right_id].left == tileData[tile_id].top){
            }else{
                console.log('right uncompatible!');
                abort = true;
            }
        }else if(currentRotation == 180){
            if(tiles[right_id].left == tileData[tile_id].left){
            }else{
                console.log('right uncompatible!');
                abort = true;
            }
        }else if(currentRotation == 270){
            if(tiles[right_id].left == tileData[tile_id].bottom){
            }else{
                console.log('right uncompatible!');
                abort = true;
            }
        }
    }else{
        console.log('dontCheckRight == '+dontCheckRight);
    }

    //check top tile
    if(top_id < 0){
        console.log('top tile pos doesn\'t exist');
    }else if(tiles[top_id].bottom == null){
        console.log('top is empty');
    }else if(dontCheckTop == false){
        adjacentTiles = true;
        if(currentRotation == 0 || currentRotation == 360){
            if(tiles[top_id].bottom == tileData[tile_id].top){
            }else{
                console.log('top uncompatible!');
                abort = true;
            }
        }else if(currentRotation == 90){
            if(tiles[top_id].bottom == tileData[tile_id].left){
            }else{
                console.log('top uncompatible!');
                abort = true;
            }
        }else if(currentRotation == 180){
            if(tiles[top_id].bottom == tileData[tile_id].bottom){
            }else{
                console.log('top uncompatible!');
                abort = true;
            }
        }else if(currentRotation == 270){
            if(tiles[top_id].bottom == tileData[tile_id].right){
            }else{
                console.log('top uncompatible!');
                abort = true;
            }
        }
    }else{
        console.log('dontCheckTop == '+dontCheckTop);
    }

    //check bottom tile
    if(bottom_id >= totalTiles){
        console.log('bottom tile pos doesn\'t exist');
    }else if(tiles[bottom_id].top == null){
        console.log('bottom is empty');
    }else if(dontCheckBottom == false){
        adjacentTiles = true;
        if(currentRotation == 360 || currentRotation == 0){
            if(tiles[bottom_id].top == tileData[tile_id].bottom){
            }else{
                console.log('bottom uncompatible!');
                abort = true;
            }
        }else if(currentRotation == 90){
            if(tiles[bottom_id].top == tileData[tile_id].right){
            }else{
                console.log('bottom uncompatible!');
                abort = true;
            }
        }else if(currentRotation == 180){
            if(tiles[bottom_id].top == tileData[tile_id].top){
            }else{
                console.log('bottom uncompatible!');
                abort = true;
            }
        }else if(currentRotation == 270){
            if(tiles[bottom_id].top == tileData[tile_id].left){
            }else{
                console.log('bottom uncompatible!');
                abort = true;
            }
        }
    }else{
        console.log('dontCheckBottom == '+dontCheckBottom);
        console.log(id);
    }

    if(adjacentTiles == false){
        abort = true;
    }
}


//logic for rotating a tile

window.onkeypress = function(event){
    console.log('key: '+event.keyCode);
    if(event.keyCode == 91){
        rotateTile('left');
    }else if(event.keyCode == 93){
        rotateTile('right');
    }
}

function rotateTile(rotation){
    var ele = document.getElementsByClassName('unplacedTile');
    if(rotation == 'right'){
        currentRotation = currentRotation+90;
    }else if(rotation == 'left'){
        currentRotation = currentRotation-90;
    }

    if(currentRotation > 360){
        currentRotation = 90;
    }else if(currentRotation < 0){
        currentRotation = 270;
    }
    //visually rotating unplaced tile(s)
    for (var i = 0; i < ele.length; i++ ) {
        ele[i].style.webkitTransform = "rotate("+ currentRotation+ "deg)";
    }
}