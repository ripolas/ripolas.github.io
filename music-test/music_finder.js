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
let slider = document.getElementById("slider");
let current_score = -1;
let lower_bound = 0;
let upper_bound = 0;
let songs_rated = 0;
let average = 0;
let average_counted = 0;
let test_finished = false;
let test_size = 10;
var tag = document.createElement('script');
let ready = false;
let paragraph;
let counter_element;
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;
let video_showed = false;
function preload() {
  songs = loadJSON("/new_data.json");
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  let stars = document.querySelectorAll('input[name="rating"]');
  for (let star of stars) {
    star.addEventListener('change', handleRating);
  }
  slider_size = width/9;
  current_song_id=0;
  if (localStorage.getItem('combinedData') !== null) {
    loadFromLocal();
  }
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: songs[current_song_id]["video_id"],
    playerVars: {
      'playsinline': 1
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
  paragraph = select('#textP');
  counter_element = select('#counter');
}
let progress_text ='';
function draw() {
  resizeCanvas(windowWidth, windowHeight); 
  setup_video();
  if(ready&&!video_showed){
    change_video();
  }
  background('#212121');
  if(average_counted<test_size){
    paragraph.html("Please rate the song. Progress: "+progress_text);
  }
  if(average_counted>=test_size){
    if(!test_finished){
      current_song_id=0;
      change_video();
      setup_video();
      test_finished=true;
      saveToLocal();
    }
    paragraph.html("You have completed the test!");
  }
  if(!test_finished){
    progress_text=(current_song_id+1)+'/'+test_size;
  }else{
    progress_text='';
  }
}
function findNextSong() {
  if(!test_finished){
    current_song_id++;
    current_score = isGood();
    average+=current_score;
    average_counted++;
  }else{
    do{
      current_song_id++;
      current_score = isGood();
      console.log(current_score);
    }while(current_score<(average/average_counted)*1.5);
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
  
}
let current_video;
let videoDiv;
function change_video(){
  let video_id = songs[current_song_id]["video_id"];
  video_showed=true;
  player.loadVideoById(video_id,0);
  player.playVideo();
}
function setup_video() {
  let w;
  let h;
  //let x = width-2*textWidth((current_song_id+1)+'/'+test_size);
  //let x = width - 2*100;
  let x = width;
  let y =height-150;
  if(x/16*9>=y){
    h = y;
    w = y/9*16;
  }else{
    h = x/16*9;
    w = x;
  }
  player.setSize(w,h);
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
  return (lower_bound+upper_bound)/2;
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
    average_counted: average_counted,
    test_finished:test_finished
  };
  localStorage.setItem('combinedData', JSON.stringify(combinedData));
}
function loadFromLocal() {
  try{
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
  test_finished = combinedData.test_finished;
  }catch(err){
    bpm_votes = {};
    bpm_total_votes = {};
    author_votes = {};
    author_total_votes = {};
    year_votes = {};
    year_total_votes = {};
    chord_votes = {};
    chord_total_votes = {};
    genre_votes = {};
    genre_total_votes = {};
    key_votes = {};
    key_total_votes = {};
    average=0;
    average_counted=0;
    current_song_id = 0;
    test_finished=false;
    current_score = 0;
  }
}
function windowResized() { 
  resizeCanvas(windowWidth, windowHeight); 
  setup_video();
} 
function onPlayerReady(event) {
  ready=true;
  event.target.playVideo();
}
function onPlayerStateChange(event) {
}
function handleRating(event) {
  let rating = event.target.value;
  displayRating(rating);
}

function displayRating(rating) {
  for (let i = 0; i<abs(rating-3); i++) {
    if (rating>3) {
      add_vote(1);
    } else {
      add_vote(-1);
    }
  }
  findNextSong();
  change_video();
  setup_video();
  saveToLocal();
  resetRating();
}
function resetRating() {
  let stars = document.querySelectorAll('input[name="rating"]');
  for (let star of stars) {
    star.checked = false;
  }
}