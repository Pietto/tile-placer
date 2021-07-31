    var totalTiles = height*width;

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

var p = document.getElementsByClassName('tile');
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
        // dragEnd();
        this.append(dragItem);
        updateDataSet(this.id, this.firstChild.id);
    }else{
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
var tileData = [{top: 'green', right: 'white', bottom: 'red', left: 'green'},{top: 'green', right: 'white', bottom: 'red', left: 'white'},{top: 'green', right: 'white', bottom: 'white', left: 'red'},{top: 'green', right: 'white', bottom: 'red', left: 'red'},{top: 'white', right: 'red', bottom: 'red', left: 'red'},{top: 'white', right: 'green', bottom: 'green', left: 'red'}]

var tiles = {};
for(i=0; i<totalTiles; i++){
    Object.assign(tiles, {[i]:{tile: null, top: null, right: null, bottom: null, right: null}});
}


//giving middle position of grid an actual value (#1)
Object.assign(tiles, {[12]:{tile: 1, top: 'green', right: 'white', bottom: 'red', left: 'green'}}); //change 12 to middletilenumber later





function updateDataSet(location_id, tile_id){
    tile_id = tile_id.replace(/\D/g,'');
    Object.assign(tiles, {[location_id]:{tile: tile_id, top: tileData[tile_id].top, left: tileData[tile_id].left, bottom: tileData[tile_id].bottom, right: tileData[tile_id].right}});
}





//checks whether tile is allowed to be placed on the dropped location
function checkCompatibility(id, tile_id){
    var left_id = id-1,
        right_id = parseInt(id)+1,
        top_id = id-width,
        bottom_id = parseInt(id)+ parseInt(width),
        tile_id = tile_id.replace(/\D/g,'');
        adjacentTiles = false;
    //check left tile
    if(left_id < 0){
        console.log('left tile pos doesn\'t exist');
    }else if(tiles[left_id].right == null){
        console.log('left is empty');
    }else{
        adjacentTiles = true;
        if(tiles[left_id].right == tileData[tile_id].left){
            console.log('left compatible!');
        }else{
            console.log('left uncompatible!');
            abort = true;
        }
    }

    //check right tile
    if(right_id >= totalTiles){
        console.log('right tile pos doesn\'t exist');
    }else if(tiles[right_id].left == null){
        console.log('right is empty');
    }else{
        adjacentTiles = true;
        if(tiles[right_id].left == tileData[tile_id].right){
            console.log('right compatible!');
        }else{
            console.log('right uncompatible!');
            abort = true;
        }
    }

    //check top tile
    if(top_id < 0){
        console.log('top tile pos doesn\'t exist');
    }else if(tiles[top_id].bottom == null){
        console.log('top is empty');
    }else{
        adjacentTiles = true;
        if(tiles[top_id].bottom == tileData[tile_id].top){
            console.log('top compatible!');
        }else{
            console.log('top uncompatible!');
            abort = true;
        }
    }

    //check bottom tile
    if(bottom_id >= totalTiles){
        console.log('bottom tile pos doesn\'t exist');
    }else if(tiles[bottom_id].top == null){
        console.log('bottom is empty');
    }else{
        adjacentTiles = true;
        if(tiles[bottom_id].top == tileData[tile_id].bottom){
            console.log('bottom compatible!');
        }else{
            console.log('bottom uncompatible!');
            abort = true;
        }
    }
    if(adjacentTiles == false){
        abort = true;
    }
}