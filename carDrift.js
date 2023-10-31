let car;
let wpress = false;
let apress = false;
let spress = false;
let dpress = false;
let scalefact = 1;
let camcoords;
let trackimg;
let p1;
let p2;
let globalmousecoords;
let p1set = false;
let checkpoints=[];
let stuff;
let tst;
let starttst;
let st1;
let st2;
let strtlinetst;
let checkpointspassed=0;
let title = true;
let countdown = false;
let racestarted = false;
let currentframe = 0;
let laps = 0;
let editor = false;
let carnames = ['roadster','skoda','ford'];
let trackselected = 0;
let carselected = 0;
let trackscaleup = 0.5;
let music;
let musicstarted = false;
let lights = [];
let titlescreenimg;
let playbtnimg;
function preload(){
  playbtnimg = loadImage("data/buttons/play.png");
  titlescreenimg = loadImage("data/titlescreen/titlescreen.png");
  tst = loadStrings("data/tracks/"+trackselected+"/checkpoints.txt");
  starttst=loadStrings("data/tracks/"+trackselected+"/start.txt");
  strtlinetst = loadStrings("data/tracks/"+trackselected+"/finishline.txt");
  trackimg = loadImage("data/tracks/"+trackselected+"/track.png");
  for(let i = 0;i<6;i++){
    lights[i] = loadImage("data/lights/tl"+i+".png");
  }
}
function setup() {
  music = createAudio("data/Elektrace.mp3");
  createCanvas(windowWidth,windowHeight);
  trackimg.resize(trackimg.width*trackscaleup,trackimg.height*trackscaleup);
  p1 = createVector(-1,-1);
  p2 = createVector(-1,-1);
  setuptitle();
}
function setuptitle(){
  checkpoints = [];
}
let aftermatchstartframe;
function setupaftermatch(){
  aftermatchstartframe = currentframe;
}
function startracesetup(){
  setuprace(trackselected, carselected);
}
function setuprace(trackid, carid){
  countdownstartframe = currentframe;
  title=false;
  countdown=true;
  if(!editor){
    stuff=tst;
  }else{
    stuff=[];
  }
  for(let i = 0;i<tst.length;i++){
    if(tst[i]!=undefined){
      let splitted = split(tst[i],'`');
      checkpoints.push(new Checkpoint(splitted[0],splitted[1],splitted[2],splitted[3],i));
    }
  }
  let tt =split(strtlinetst[0],'`');
  st1 = createVector(float(tt[0]),float(tt[1]));
  st2 = createVector(float(tt[2]),float(tt[3]));
  let carposx = float(starttst[0].split('`')[0]);
  let carposy = float(starttst[0].split('`')[1]);
  p1 = createVector(-1,-1);
  p2 = createVector(-1,-1);
  camcoords = createVector(0,0);
  car=new Car(carposx,carposy,150/scalefact,45/scalefact,carnames[carid]);
}
function draw() {
  currentframe++;
  if(title){
    titledraw();
  }else if(countdown){
    countdowndraw();
    if(!musicstarted){
      musicstarted=true;
      music.loop();
    }
  }else if(racestarted){
    racedraw();
  }else if(aftermatch){
    aftermatchdraw();
  }
}
let countdownstartframe;
let btnscale = 3;
function titledraw(){
  noSmooth();
  imageMode(CENTER);
  image(titlescreenimg,width/2,height/2,width,height);
  image(playbtnimg,width/2,height/2,playbtnimg.width*btnscale,playbtnimg.height*btnscale);
  let worked = false;
  if(mouseX>width/2-playbtnimg.width*btnscale/2&&mouseX<width/2+playbtnimg.width*btnscale/2){
    if(mouseY>height/2-playbtnimg.height*btnscale/2&&mouseY<height/2+playbtnimg.height*btnscale/2){
      worked = true;
      cursor(HAND);
      if(mouseIsPressed){
        cursor(ARROW);
        startracesetup();
      }
    }
  }
  if(!worked){
    cursor(ARROW);
  }
  imageMode(CORNER);
}
function aftermatchdraw(){
  background('#252323');
  fill('#fdfeff');
  textAlign(CENTER,CENTER);
  textSize(60);
  text("gg? this should dissapear after 5 seconds",width/2,height/2);
  if((3-int((currentframe-aftermatchstartframe)/60))<=0){
    aftermatch = false;
    title=true;
    setuptitle();
  }
}
function countdowndraw(){
  noSmooth();
  image(trackimg,camcoords.x,camcoords.y,trackimg.width,trackimg.height);
  car.show();
  fill('#fdfeff');
  textAlign(CENTER,CENTER);
  textSize(60);
  if((4-int((currentframe-countdownstartframe)/60)<0)){
    countdown=false;
    racestarted=true;
  }else{
    imageMode(CENTER);
    let mg = lights[int((currentframe-countdownstartframe)/60)];
    image(mg,width/2,height/6,mg.width/5,mg.height/5);
    imageMode(CORNER);
    //text(5-int((currentframe-countdownstartframe)/60),width/2,height/6);
  }
}
function racedraw(){
  noSmooth();
  image(trackimg,camcoords.x,camcoords.y,trackimg.width,trackimg.height);
  if(int((currentframe-countdownstartframe)/60)<=5){
    imageMode(CENTER);
    let mg = lights[int((currentframe-countdownstartframe)/60)];
    image(mg,width/2,height/6,mg.width/5,mg.height/5);
    imageMode(CORNER);
  }
  car.update();
  for(let i = 0;i<checkpoints.length;i++){
    checkpoints[i].update();
  }
  if(checkpointspassed==checkpoints.length){
    if(car.pos.x>min(st1.x,st2.x)&&car.pos.x<max(st1.x,st2.x)){
      if(car.pos.y>min(st1.y,st2.y)&&car.pos.y<max(st1.y,st2.y)){
        laps++;
        console.log(laps);
        if(laps==3){
          laps=0;
          setupaftermatch();
          racestarted=false;
          aftermatch=true;
        }
        checkpointspassed = 0;
        for(let i = 0;i<checkpoints.length;i++){
          checkpoints[i].reset();
        }
      }
    }
  }
  car.show();
  if(editor){
    globalmousecoords = createVector(mouseX-camcoords.x,mouseY-camcoords.y);
    rect(min(p1.x,p2.x)+camcoords.x, min(p1.y,p2.y)+camcoords.y, max(p1.x,p2.x)-min(p1.x,p2.x), max(p1.y,p2.y)-min(p1.y,p2.y));
  }
}
function mousePressed(){
  if(racestarted){
  globalmousecoords = createVector(mouseX-camcoords.x,mouseY-camcoords.y);
    if(editor){
      if(!p1set){
        p1 = globalmousecoords;
        p1set=true;
      }else{
        p2 = globalmousecoords;
      }
    }
  }
  wpress=true;
  if(mouseX<width/2){
    apress=true;
  }else{
    dpress=true;
  }
}
function mouseReleased(){
  wpress=false;
  apress=false;
  dpress=false;
}
function keyPressed(){
  if(key == 'c'){
    stuff.push(p1.x+"`"+p1.y+"`"+p2.x+"`"+p2.y);
    p1set=false;
  }
  if(key=='z'){
    let stuf =[];
    stuf.push(p1.x+"`"+p1.y);
    saveStrings(stuf,"start.txt");
  }
  if(key=='x'){
    let stuf =[];
    stuf.push(p1.x+"`"+p1.y+"`"+p2.x+"`"+p2.y);
    saveStrings(stuf,"finishline.txt");
  }
  if(key == 'p'){
    saveStrings(stuff,"checkpoints.txt");
  }
  if(key == 'w'){
    wpress=true;
  }
  if(key == 'a'){
    apress=true;
  }
  if(key == 's'){
    spress=true;
  }
  if(key == 'd'){
    dpress=true;
  }
}
function keyReleased(){
  if(key == 'w'){
    wpress=false;
  }
  if(key == 'a'){
    apress=false;
  }
  if(key == 's'){
    spress=false;
  }
  if(key == 'd'){
    dpress=false;
  }
}
class Car{
  constructor(x,y,w,h,name){
    this.pos = createVector(x,y);
    this.w=w;
    this.h=h;
    this.name=name;
    this.img=loadImage("data/cars/"+name+"/"+name+".png");
    this.accelfact = 1/scalefact;
    this.turnfact = 0;
    this.maxturnfact = 3.5;
    this.direction = 180;
    this.vel = createVector(0,0);
    this.accelforce = 0;
    this.maxspeed = 1/scalefact;
    this.speed = 0;
    this.friction = 0.95;
    this.turnaccel=0;
    camcoords.x += ((-this.pos.x+width/2 ) - camcoords.x);
    camcoords.y += ((-this.pos.y+height/2) - camcoords.y);
  }
  update(){
     camcoords.x += ((-this.pos.x+width/2 ) - camcoords.x)/5;
     camcoords.y += ((-this.pos.y+height/2) - camcoords.y)/5;
     if(!countdown){
       if(wpress){
         this.accelforce = this.accelfact;
         this.friction = 0.95;
       }else{
         this.accelforce = 0;
         this.friction = 0.98;
       }
       this.speed = 0;
       this.speed += this.accelforce;
       if(spress){
         this.speed-=this.accelfact/4;
       }
       if(this.speed>0){
         this.speed = min(this.speed,this.maxspeed);
       }else{
         this.speed = max(this.speed,-this.maxspeed/10);
       }
       console.log(trackimg.get(this.pos.x,this.pos.y)[0]);
       if(trackimg.get(this.pos.x,this.pos.y)[0]!=77&&trackimg.get(this.pos.x,this.pos.y)[0]==trackimg.get(this.pos.x,this.pos.y)[1]){
         this.vel.mult(0.9);
         this.speed*=0.5;
       }
       this.vel.add(createVector(cos(radians(this.direction))*this.speed,sin(radians(this.direction))*this.speed));
       this.vel.mult(this.friction);
       this.turnfact = map(abs(this.vel.x)+abs(this.vel.y),0,this.accelfact/(1-0.95),0,this.maxturnfact);
       if(apress){
         this.turnaccel-=(this.turnfact/0.9-this.turnfact);
       }
       if(dpress){
         this.turnaccel+=(this.turnfact/0.9-this.turnfact);
       }
       this.turnaccel*=0.9;
       this.direction += this.turnaccel;

  
       this.pos.add(this.vel);

     }
  }
  show(){
    push();
    translate(this.pos.x+camcoords.x,this.pos.y+camcoords.y);
    rotate(radians(this.direction));
    imageMode(CENTER);
    image(this.img,0,0,this.w,this.w);
    pop();
  }
}
class Checkpoint{
  constructor(v1x,v1y,v2x,v2y,id){
    this.id=id;
    this.v1=createVector(v1x,v1y);
    this.v2=createVector(v2x,v2y);
    this.passeed = false;
  }
  update(){
    if(!this.passed){
      if(car.pos.x>min(this.v1.x,this.v2.x)&&car.pos.x<max(this.v1.x,this.v2.x)){
        if(car.pos.y>min(this.v1.y,this.v2.y)&&car.pos.y<max(this.v1.y,this.v2.y)){
          this.passed=true;
          checkpointspassed++;
        }
      }
    }
  }
  reset(){
    this.passed=false;
  }
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
