/*
https://seositecheckup.com/seo-audit/ripolas.duckdns.org
*/

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
let current_score = -1;
let lower_bound = 0;
let upper_bound = 0;
let songs_rated = 0;
let average = 0;
let average_counted = 0;
let picking_out = false;
function preload() {
  songs = loadJSON("/new_data.json");
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  slider = document.getElementById("slider");
  slider_size = width/9;
  if (localStorage.getItem('combinedData') !== null) {
    loadFromLocal();
  }
  change_video();
  setup_video();
}
function draw() {
  background(0);
  fill(255);
  textAlign(LEFT, CENTER);
  for (let i = 0; i < width; i++) {
    text(i+1, i*(width-25)/8+12, height-50-8-46);
  }
  textAlign(CENTER, CENTER);
  if(average_counted>0){
    text(map(current_score - average/average_counted,-3,3,0,100)+'%', width/2, height-75-46);
  }
}
function findNextSong() {
  current_song_id++;
  current_score = isGood();
  average+=current_score;
  average_counted++;
  while (current_score<0) {
    current_song_id++;
    current_score = isGood();
  }
  if(picking_out){
    while(map(current_score - average/average_counted,-3,3,0,100)<75){
      current_song_id++;
      current_score = isGood();
      average+=current_score;
      average_counted++;
      while (current_score<0) {
        current_song_id++;
        current_score = isGood();
      }
    }
  }
  console.log(current_score);
}
function keyPressed(){
  if(key==' '){
    picking_out=!picking_out;
  }
}
function add_vote(amount) {
  let cbpm, cauthor, cyear, ckey, cchords, cgenres;
  if ("bpm" in songs[current_song_id]) {
    cbpm = songs[current_song_id]["bpm"];
  }
  if ("author" in songs[current_song_id]) {
    cauthor = songs[current_song_id]["author"];
  }
  if ("year" in songs[current_song_id]) {
    cyear = songs[current_song_id]["year"];
  }
  if ("key" in songs[current_song_id]) {
    ckey = songs[current_song_id]["key"];
  }
  if ("chords" in songs[current_song_id]) {
    cchords = songs[current_song_id]["chords"];
  }
  if ("genres" in songs[current_song_id]) {
    cgenres = songs[current_song_id]["genres"];
  }
  if (cbpm!==undefined) {
    if (int(cbpm/10) in bpm_votes) {
      bpm_votes[int(cbpm/10)]+=amount;
      bpm_total_votes[int(cbpm/10)]++;
    } else {
      bpm_votes[int(cbpm/10)] = amount;
      bpm_total_votes[int(cbpm/10)] = 1;
    }
  }
  if (cauthor!==undefined) {
    if (cauthor in author_votes) {
      author_votes[cauthor]+=amount;
      author_total_votes[cauthor]++;
    } else {
      author_votes[cauthor] = amount;
      author_total_votes[cauthor] = 1;
    }
  }
  if (cyear!==undefined) {
    if (cyear in year_votes) {
      year_votes[cyear]+=amount;
      year_total_votes[cyear]++;
    } else {
      year_votes[cyear] = amount;
      year_total_votes[cyear] = 1;
    }
  }
  if (ckey!==undefined) {
    if (ckey in key_votes) {
      key_votes[ckey]+=amount;
      key_total_votes[ckey]++;
    } else {
      key_votes[ckey] = amount;
      key_total_votes[ckey]=1;
    }
  }
  if (cgenres!==undefined) {
    for (let genre in cgenres) {
      if (genre in genre_votes) {
        genre_votes[genre]+=amount;
        genre_total_votes[genre]++;
      } else {
        genre_votes[genre]=amount;
        genre_total_votes[genre] = 1;
      }
    }
  }
  if (cchords!==undefined) {
    for (let chord in cchords) {
      if (chord in chord_votes) {
        chord_votes[chord]+=amount;
        chord_total_votes[chord]++;
      } else {
        chord_votes[chord]=amount;
        chord_total_votes[chord] = 1;
      }
    }
  }
}
function next() {
  for (let i = 0; i<abs(slider.value-5); i++) {
    if (slider.value>5) {
      add_vote(1);
    } else {
      add_vote(-1);
    }
  }
  if (slider.value!=5) {
    songs_rated++;
  }
  findNextSong();
  slider.value = 5;
  change_video();
  setup_video();
  saveToLocal();
}
let current_video;
let videoDiv;
function change_video(){
  let video_id = songs[current_song_id]["video_id"];
  console.log(songs[current_song_id],video_id);
  let iframeSrc = 'https://www.youtube.com/embed/'+video_id+'?rel=0&showinfo=0&modestbranding=1&autoplay=1&controls=1';
  if (current_video) {
    current_video.remove();
  }
  if (((width)/16*9)<=height-150-46) {
    videoDiv = createDiv('<iframe id="iframe" width="'+(width)+'" height="'+(width)/16*9+'" src="' + iframeSrc + '" frameborder="0" allow=\'autoplay\'></iframe>');
  }else{
    videoDiv = createDiv('<iframe id="iframe" width="'+(height-150-46)/9*16+'" height="'+(height-150-46)+'" src="' + iframeSrc + '" frameborder="0" allow=\'autoplay\'></iframe>');
  }
}
function setup_video() {
  if (((width)/16*9)<=height-150-46) {
    window.parent.document.getElementById('iframe').width = width+'px';
    window.parent.document.getElementById('iframe').height = (width)/16*9+'px';
    videoDiv.position(0, 46);
  } else {
    window.parent.document.getElementById('iframe').width = (height-150-46)/9*16+'px';
    window.parent.document.getElementById('iframe').height = (height-150-46)+'px';
    videoDiv.position(((width)-(height-150-50)/9*16)/2, 46);
  }
  current_video = videoDiv.elt;
}
document.addEventListener("DOMContentLoaded", function() {
  const button = document.getElementById("next");
  button.addEventListener("click", next);
}
);
function nuke() {
  bpm_votes = {};
  bpm_total_votes = {};
  author_votes = {};
  author_total_votes = {};
  year_votes = {};
  year_total_votes = {};
  key_votes = {};
  key_total_votes = {};
  chord_votes = {};
  chord_total_votes = {};
  genre_votes = {};
  genre_total_votes = {};
  average = 0;
  average_counted = 0;
  current_song_id = -1;
  current_song_id = 0;
  change_video();
  setup_video();
  current_score = isGood();
  saveToLocal();
}
function isGood() {
  lower_bound = 0;
  upper_bound = 0;
  let cbpm, cauthor, cyear, ckey, cchords, cgenres;
  if ("bpm" in songs[current_song_id]) {
    cbpm = songs[current_song_id]["bpm"];
  }
  if ("author" in songs[current_song_id]) {
    cauthor = songs[current_song_id]["author"];
  }
  if ("year" in songs[current_song_id]) {
    cyear = songs[current_song_id]["year"];
  }
  if ("key" in songs[current_song_id]) {
    ckey = songs[current_song_id]["key"];
  }
  if ("chords" in songs[current_song_id]) {
    cchords = songs[current_song_id]["chords"];
  }
  if ("genres" in songs[current_song_id]) {
    cgenres = songs[current_song_id]["genres"];
  }
  let score = 0;
  console.log("BPM: "+bpm_votes[int(cbpm/10)]+" "+cbpm+" "+current_song_id);
  console.log(bpm_votes);
  if (cbpm!==undefined) {
    if ((int(cbpm/10)+'') in bpm_votes) {
      score += bpm_votes[int(cbpm/10)+'']/bpm_total_votes[int(cbpm/10)];
      upper_bound += bpm_votes[int(cbpm/10)+'']/bpm_total_votes[int(cbpm/10)];
      lower_bound += bpm_votes[int(cbpm/10)+'']/bpm_total_votes[int(cbpm/10)];
    } else {
      lower_bound -= 1;
      upper_bound += 1;
    }
  }
  if (cauthor!==undefined) {
    if (cauthor in author_votes) {
      score += author_votes[cauthor]/author_total_votes[cauthor];
      upper_bound += author_votes[cauthor]/author_total_votes[cauthor];
      lower_bound += author_votes[cauthor]/author_total_votes[cauthor];
    } else {
      lower_bound -= 1;
      upper_bound += 1;
    }
  }
  if (cyear!==undefined) {
    if (cyear in year_votes) {
      score += year_votes[cyear]/year_total_votes[cyear];
      upper_bound += year_votes[cyear]/year_total_votes[cyear];
      lower_bound += year_votes[cyear]/year_total_votes[cyear];
    } else {
      lower_bound -= 1;
      upper_bound += 1;
    }
  }
  if (ckey!==undefined) {
    if (ckey in key_votes) {
      score += key_votes[ckey]/key_total_votes[ckey];
      upper_bound += key_votes[ckey]/key_total_votes[ckey];
      lower_bound += key_votes[ckey]/key_total_votes[ckey];
    } else {
      lower_bound -= 1;
      upper_bound += 1;
    }
  }
  let genre_score = 0;
  let genre_amount = 0; //how many were sumed up
  let total_genres = songs[current_song_id]["genres"].length;
  if (cgenres!==undefined) {
    for (let i in cgenres) {
      if (i in genre_votes) {
        genre_score += genre_votes[i]/genre_total_votes[i];
        upper_bound += genre_votes[i]/genre_total_votes[i]/total_genres;
        lower_bound += genre_votes[i]/genre_total_votes[i]/total_genres;
        genre_amount++;
      } else {
        lower_bound -= 1/total_genres;
        upper_bound += 1/total_genres;
      }
    }
    if (genre_amount>0) {
      score += genre_score/genre_amount;
    }
  }
  let chord_score = 0;
  let chord_amount = 0; //how many were sumed up
  let total_chords = songs[current_song_id]["chords"].length;
  if (cchords!==undefined) {
    for (let i in cchords) {
      if (i in chord_votes) {
        chord_score += chord_votes[i]/chord_total_votes[i];
        upper_bound += chord_votes[i]/chord_total_votes[i]/total_chords;
        lower_bound += chord_votes[i]/chord_total_votes[i]/total_chords;
        chord_amount++;
      } else {
        lower_bound -= 1/total_chords;
        upper_bound += 1/total_chords;
      }
    }
    if (chord_amount>0) {
      score += chord_score/chord_amount;
    }
  }
  return score;
}
function saveToLocal() {
  let combinedData = {
    bpm_votes: bpm_votes,
    bpm_total_votes: bpm_total_votes,
    author_votes: author_votes,
    author_total_votes: author_total_votes,
    year_votes: year_votes,
    year_total_votes: year_total_votes,
    key_votes: key_votes,
    key_total_votes: key_total_votes,
    chord_votes: chord_votes,
    chord_total_votes: chord_total_votes,
    genre_votes: genre_votes,
    genre_total_votes: genre_total_votes,
    current_song_id: current_song_id,
    average: average,
    average_counted: average_counted
  };
  localStorage.setItem('combinedData', JSON.stringify(combinedData));
}
function loadFromLocal() {
  let combinedDataJsonString = localStorage.getItem('combinedData');
  let combinedData = JSON.parse(combinedDataJsonString);
  bpm_votes = combinedData.bpm_votes;
  bpm_total_votes = combinedData.bpm_total_votes;
  author_votes = combinedData.author_votes;
  author_total_votes = combinedData.author_total_votes;
  year_votes = combinedData.year_votes;
  year_total_votes = combinedData.year_total_votes;
  key_votes = combinedData.key_votes;
  key_total_votes = combinedData.key_total_votes;
  chord_votes = combinedData.chord_votes;
  chord_total_votes = combinedData.chord_total_votes;
  genre_votes = combinedData.genre_votes;
  genre_total_votes = combinedData.genre_total_votes;
  current_song_id = combinedData.current_song_id;
  average = combinedData.average;
  average_counted = combinedData.average_counted;
  current_score = isGood();
}
function windowResized() { 
  resizeCanvas(windowWidth, windowHeight); 
  setup_video();
} 
