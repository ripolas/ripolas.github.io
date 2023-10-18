let car;
let wpress = false;
let apress = false;
let spress = false;
let dpress = false;
let scalefact = 0.5;
let camcoords;
function setup() {
  createCanvas(windowWidth,windowHeight);
  camcoords = createVector(0,0);
  car=new Car(width/2,height/2,100/scalefact,30/scalefact,"roadster");
}
function draw() {
  background(0);
  car.update();
  car.show();
}
function keyPressed(){
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
  }
  update(){
    camcoords.x += ((-this.pos.x+width/2 ) - camcoords.x)/5;
    camcoords.y += ((-this.pos.y+height/2) - camcoords.y)/5;
    if(wpress){
       this.accelforce = this.accelfact;
     }else{
       this.accelforce = 0;
     }
     this.speed += this.accelforce;
     this.speed = min(this.speed,this.maxspeed);
     this.vel.add(createVector(cos(radians(this.direction))*this.speed,sin(radians(this.direction))*this.speed));
     this.vel.mult(0.95);
     this.speed*=0.95;
     this.turnfact = map(this.speed,0,this.maxspeed,0,this.maxturnfact);
     if(apress){
       this.direction-=this.turnfact;
     }
     if(dpress){
       this.direction+=this.turnfact;
     }
     if(spress){
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
