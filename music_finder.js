let songs;
var video;
var show_video = true;
function preload(){
  songs = loadJSON("/data.json");
}
function setup() {
  createCanvas(windowWidth,windowHeight);
  console.log(songs[0]["genres"]);
  let video_id = songs[0]["video_id"];
  video = createDiv('<iframe width="420" height="345" src="http://www.youtube.com/embed/'+video_id+'?autoplay=1" frameborder="0" allowfullscreen></iframe>')
  video.position(0,0);
}


function draw() {
}
