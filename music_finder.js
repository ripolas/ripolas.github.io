let songs;
function preload(){
  songs = loadJSON("/data_final.json");
}
function setup() {
  createCanvas(windowWidth,windowHeight);
  console.log(songs[0]["genres"]);
}


function draw() {
}
