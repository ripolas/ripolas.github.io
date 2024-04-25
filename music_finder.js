let songs;
let video;
let current_song_id = 1;
let slider_size;
function preload(){
  songs = loadJSON("/data.json");
}
function setup() {
  createCanvas(windowWidth,windowHeight);
  slider_size = width/9;
  console.log(songs[current_song_id]["genres"]);
  let video_id = songs[current_song_id]["video_id"];
  video = createDiv('<iframe width="'+width+'" height="'+(height-slider_size)+'" src="https://www.youtube.com/embed/'+video_id+'?autoplay=1" frameborder="0" allowfullscreen></iframe>')
  video.position(0,0);
  
}
function draw() {
  background(0);
  fill(255);
  for(let i = 0; i < width;i++){
    text(i+1,i*(width-25)/8+12,height-25-8);
  }
}
