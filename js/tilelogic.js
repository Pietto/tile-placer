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

for (var i of p) {
    i.addEventListener('dragstart', dragStart);
    i.addEventListener('dragend', dragEnd);
}

function dragStart() {
    dragItem = this;
    setTimeout(() => this.style.display = "none", 0);
}

function dragEnd() {
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
    this.append(dragItem);
    console.log();
    updateDataSet(this.id, this.firstChild.id);
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







// creating the dataset for all the tiles

var tileData = [{top: 'green', right: 'white', bottom: 'red', left: 'green'},{top: 'green', right: 'white', bottom: 'red', left: 'white'},{top: 'green', right: 'white', bottom: 'white', left: 'red'},{top: 'green', right: 'white', bottom: 'red', left: 'red'},{top: 'white', right: 'red', bottom: 'red', left: 'red'},{top: 'white', right: 'green', bottom: 'green', left: 'red'}]

var totalTiles = height*width;
var tiles = {};
for(i=0; i<totalTiles; i++){
    Object.assign(tiles, {[i]:{tile: 1, top: null, right: null, bottom: null, right: null}});
}

function updateDataSet(location_id, tile_id){
    Object.assign(tiles, {[location_id]:{tile: tile_id, top: tileData[tile_id].top, left: tileData[tile_id].left, bottom: tileData[tile_id].bottom, right: tileData[tile_id].right}});
    console.log(tiles);
}