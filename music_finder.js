let songs;
let video;
let buttons = [];
let button_size;
let current_song_id = 1;
function preload(){
  songs = loadJSON("/data.json");
}
function setup() {
  createCanvas(windowWidth,windowHeight);
  button_size = width/9;
  for(let i = 0;i<9;i++){
    buttons[i] = createButton(i+1);
    buttons[i].position(i*button_size,height-button_size);
    buttons[i].size(button_size,button_size);
  }
  console.log(songs[current_song_id]["genres"]);
  let video_id = songs[current_song_id]["video_id"];
  video = createDiv('<iframe width="'+width+'" height="'+(height-button_size)+'" src="https://www.youtube.com/embed/'+video_id+'?autoplay=1" frameborder="0" allowfullscreen></iframe>')
  video.position(0,0);
  
}


function draw() {
}
