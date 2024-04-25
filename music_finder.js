let songs;
let video;
let current_song_id = 0;
let slider_size;
let bpm_votes = {};
let bpm_total_votes = {};
let author_votes = {};
let author_total_votes = {};
let year_votes = {};
let year_total_votes = {};
let chord_votes = {};
let chord_total_votes = {};
let genre_votes = {};
let genre_total_votes = {};
let key_votes = {};
let key_total_votes = {};
let slider;
function preload(){
  songs = loadJSON("/data.json");
}
function setup() {
  createCanvas(windowWidth,windowHeight);
  slider = document.getElementById("slider");
  slider_size = width/9;
  console.log(songs[current_song_id]["genres"]);
  let video_id = songs[current_song_id]["video_id"];
  if((height-125)>=width*9/16){
    video = createDiv('<iframe width="'+width+'" height="'+(height-(25+25+25+25+25))+'" src="https://www.youtube.com/embed/'+video_id+'?autoplay=1" frameborder="0" allowfullscreen></iframe>')

  }else if(width>=(height-125)*9/16){
    video = createDiv('<iframe width="'+width+'" height="'+(height-(25+25+25+25+25))+'" src="https://www.youtube.com/embed/'+video_id+'?autoplay=1" frameborder="0" allowfullscreen></iframe>')
  }
  video.position(0,0);
  findNextSong();
}
function draw() {
  background(0);
  fill(255);
  for(let i = 0; i < width;i++){
    text(i+1,i*(width-25)/8+12,height-25-8);
  }
}
function findNextSong(){
  let cbpm = songs[current_song_id]["bpm"];
  let cauthor = songs[current_song_id]["author"];
  let cyear = songs[current_song_id]["year"];
  let ckey = songs[current_song_id]["key"];
  let cchords = songs[current_song_id]["chords"];
  let cgenres = songs[current_song_id]["genres"];
  let score = 0;
  let lower_bound = 0;
  let upper_bound = 0;
  if((int(cbpm/10)+'') in bpm_votes){
    score += bpm_votes[int(cbpm/10)+'']/bpm_total_votes[int(cbpm/10)];
    upper_bound += bpm_votes[int(cbpm/10)+'']/bpm_total_votes[int(cbpm/10)];
    lower_bound += bpm_votes[int(cbpm/10)+'']/bpm_total_votes[int(cbpm/10)];
  }else{
    lower_bound -= 1;
    upper_bound += 1;
  }
  if(cauthor in author_votes){
    score += author_votes[cauthor]/author_total_votes[author];
    upper_bound += author_votes[cauthor]/author_total_votes[author];
    lower_bound += author_votes[cauthor]/author_total_votes[author];
  }else{
    lower_bound -= 1;
    upper_bound += 1;
  }
  if(cyear in year_votes){
    score += year_votes[cyear]/year_total_votes[cyear];
    upper_bound += year_votes[cyear]/year_total_votes[cyear];
    lower_bound += year_votes[cyear]/year_total_votes[cyear];
  }else{
    lower_bound -= 1;
    upper_bound += 1;
  }
  if(ckey in key_votes){
    score += key_votes[ckey]/key_total_votes[ckey]; 
    upper_bound += key_votes[ckey]/key_total_votes[ckey]; 
    lower_bound += key_votes[ckey]/key_total_votes[ckey]; 
  }else{
    lower_bound -= 1;
    upper_bound += 1;
  }
  let genre_score = 0;
  let genre_amount = 0; //how many were sumed up
  let total_genres = songs[current_song_id]["genres"].length;
  for(let i in cgenres){
    if(i in genre_votes){
      genre_score += genre_votes[i]/genre_total_votes[i];
      upper_bound += genre_votes[i]/genre_total_votes[i]/total_genres;
      lower_bound += genre_votes[i]/genre_total_votes[i]/total_genres;
      genre_amount++;
    }else{
      lower_bound -= 1/total_genres;
      upper_bound += 1/total_genres;
    }
  }
  if(genre_amount>0){
    score += genre_score/genre_amount;
  }
  let chord_score = 0;
  let chord_amount = 0; //how many were sumed up
  let total_chords = songs[current_song_id]["chords"].length;
  for(let i in cchords){
    if(i in chord_votes){
      chord_score += chord_votes[i]/chord_total_votes[i];
      upper_bound += chord_votes[i]/chord_total_votes[i]/total_chords;
      lower_bound += chord_votes[i]/chord_total_votes[i]/total_chords;
      chord_amount++;
    }else{
      lower_bound -= 1/total_chords;
      upper_bound += 1/total_chords;
    }
  }
  if(chord_amount>0){
    score += chord_score/chord_amount;
  }
  console.log(score);
}
function next(){
  
}
function add_vote(let amount){
  let cbpm = songs[current_song_id]["bpm"];
  let cauthor = songs[current_song_id]["author"];
  let cyear = songs[current_song_id]["year"];
  let ckey = songs[current_song_id]["key"];
  let cchords = songs[current_song_id]["chords"];
  let cgenres = songs[current_song_id]["genres"];
  if(int(cbpm/10) in bpm_votes){
    bpm_votes[int(cbpm/10)]+=amount;
    bpm_total_votes[int(cbpm/10)]++;
  }else{
    bpm_votes[int(cbpm/10)] = amount; 
    bpm_total_votes[int(cbpm/10)] = 1;
  }
  if(cauthor in author_votes){
    author_votes[cauthor]+=amount;
    author_total_votes[cauthor]++;
  }else{
    author_votes[cauthor] = amount;
    author_total_votes[cauthor] = 1;
  }
  if(cyear in year_votes){
    year_votes[cyear]+=amount;
    year_total_votes[cyear]++;
  }else{
    year_votes[cyear] = amount;
    year_total_votes[cyear] = 1;
  }
  if(ckey in key_votes){
    key_votes[ckey]+=amount;
    key_total_votes[ckey]++;
  }else{
    key_votes[ckey] = amount;
    key_total_votes[ckey]++;
  }
  
}
document.addEventListener("DOMContentLoaded", function() {
  const button = document.getElementById("next");
  button.addEventListener("click", next);
});
