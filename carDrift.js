let car;
let wpress = false;
let apress = false;
let spress = false;
let dpress = false;
function setup() {
  createCanvas(windowWidth,windowHeight);
  car=new Car(width/2,height/2,100,30);
}
function draw() {
  background(0);
  car.update();
  console.log(wpress);
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
  constructor(x,y,w,h){
    this.pos = createVector(x,y);
    this.w=w;
    this.h=h;
    this.accelfact = 1;
    this.turnfact = 0;
    this.maxturnfact = 3.5;
    this.direction = 0;
    this.vel = createVector(0,0);
    this.accelforce = 0;
    this.maxspeed = 1;
    this.speed = 0;
  }
  update(){
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
     this.turnfact = map(this.speed,0,this.maxspeed,0,3.5);
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
    translate(this.pos.x,this.pos.y);
    rotate(radians(this.direction));
    rectMode(CENTER);
    fill(255,0,0);
    rect(0,0,this.w,this.h);
    pop();
  }
}
