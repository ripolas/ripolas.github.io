let car;
let wpress = false;
let apress = false;
let spress = false;
let dpress = false;
let scalefact = 1;
let camcoords;
let trackimg;
let editor = false;
let p1;
let p2;
let globalmousecoords;
let p1set = false;
let checkpoints=[];
let stuff;
let tst;
let starttst;
function preload(){
  tst = loadStrings("data/checkpoints.txt");
  starttst=loadStrings("data/start.txt");
  trackimg = loadImage("data/track.png");
}
function setup() {
  stuff=tst;
  for(let i = 0;i<tst.length;i++){
    if(tst[i]!=undefined){
      let splitted = split(tst[i],'`');
      checkpoints.push(new Checkpoint(splitted[0],splitted[1],splitted[2],splitted[3],i));
    }
  }
  let carposx = float(starttst[0].split('`')[0]);
  let carposy = float(starttst[0].split('`')[1]);
  p1 = createVector(-1,-1);
  createCanvas(windowWidth,windowHeight);
  p2 = createVector(-1,-1);
  camcoords = createVector(0,0);
  car=new Car(carposx,carposy,150/scalefact,45/scalefact,"roadster");
}
function draw() {
  image(trackimg,camcoords.x,camcoords.y,trackimg.width*3,trackimg.height*3);
  car.update();
  for(let i = 0;i<checkpoints.length;i++){
    checkpoints[i].update();
  }
  car.show();
  if(editor){
    globalmousecoords = createVector(mouseX-camcoords.x,mouseY-camcoords.y);
    rect(min(p1.x,p2.x)+camcoords.x, min(p1.y,p2.y)+camcoords.y, max(p1.x,p2.x)-min(p1.x,p2.x), max(p1.y,p2.y)-min(p1.y,p2.y));
  }
}
function mousePressed(){
  if(editor){
    if(!p1set){
      p1 = globalmousecoords;
      p1set=true;
    }else{
      p2 = globalmousecoords;
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
    this.img=loadImage("data/"+name+".png");
    this.accelfact = 1/scalefact;
    this.turnfact = 0;
    this.maxturnfact = 3.5;
    this.direction = 0;
    this.vel = createVector(0,0);
    this.accelforce = 0;
    this.maxspeed = 1/scalefact;
    this.speed = 0;
    this.friction = 0.95;
  }
  update(){
     camcoords.x += ((-this.pos.x+width/2 ) - camcoords.x)/5;
     camcoords.y += ((-this.pos.y+height/2) - camcoords.y)/5;
     
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
     this.vel.add(createVector(cos(radians(this.direction))*this.speed,sin(radians(this.direction))*this.speed));
     this.vel.mult(this.friction);
     this.turnfact = map(abs(this.vel.x)+abs(this.vel.y),0,this.accelfact/(1-0.95),0,this.maxturnfact);
     if(apress){
       this.direction-=this.turnfact;
     }
     if(dpress){
       this.direction+=this.turnfact;
     }
     this.pos.add(this.vel);
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
        }
      }
    }
  }
  reset(){
    this.passed=false;
  }
}
