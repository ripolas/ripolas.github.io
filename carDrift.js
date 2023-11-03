let car;
let wpress = false;
let apress = false;
let spress = false;
let dpress = false;
let pwpress = false;
let papress = false;
let pspress = false;
let pdpress = false;
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
let arrowr;
let arrowl;
let editor = false;
let carnames = ['honda','skoda','roadster'];
let trackselected = 0;
let carselected = 0;
let trackscaleup = 0.5;
let menu = false;
let music;
let musicstarted = false;
let lights = [];
let lapdisplayimgs = [];
let titlescreenimg;
let playbtnimg;
let carimgsside = [];
let click = false;
let trackisplaying = false;
let fullnames = [];
let infoimg;
let infos =[];
let inputs = [];
let recording = true;
let carbots = [];
let botcount = 5;
let recordedbotcount = 5;
function preload(){
  infoimg = loadImage("data/buttons/info.png");
  arrowr = loadImage("data/buttons/arrowr.png");
  arrowl = loadImage("data/buttons/arrowl.png");
  playbtnimg = loadImage("data/buttons/play.png");
  titlescreenimg = loadImage("data/titlescreen/titlescreen.png");
  tst = loadStrings("data/tracks/"+trackselected+"/checkpoints.txt");
  starttst=loadStrings("data/tracks/"+trackselected+"/start.txt");
  strtlinetst = loadStrings("data/tracks/"+trackselected+"/finishline.txt");
  trackimg = loadImage("data/tracks/"+trackselected+"/track.png");
  for(let i = 0;i<6;i++){
    lights[i] = loadImage("data/lights/tl"+i+".png");
  }
  for(let i = 1;i<=3;i++){
    lapdisplayimgs[i-1] = loadImage("data/imgs/display"+i+".png");
  }
  for(let i = 0;i<3;i++){
    carimgsside[i] = loadImage("data/cars/"+carnames[i]+"/"+carnames[i]+".png");/////////////////side
  }
  for(let i = 0;i<3;i++){
    fullnames[i] = loadStrings("data/cars/"+carnames[i]+"/fullname.txt");
    infos[i] = loadStrings("data/cars/"+carnames[i]+"/info.txt");
  }
}
function setup() {
  frameRate(60);
  console.log(fullnames);
  music = createAudio("data/Elektrace.mp3");
  createCanvas(windowWidth,windowHeight);
  trackimg.resize(trackimg.width*trackscaleup,trackimg.height*trackscaleup);
  p1 = createVector(-1,-1);
  p2 = createVector(-1,-1);
  setuptitle();
}
function setupmenu(){
  if(musicstarted){
    musicstarted=false;
    music.stop();
  }
  checkpoints = [];
}
function setuptitle(){
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
  for(let i = 0;i<botcount;i++){
    carbots.push(new CarBot(carposx,carposy,150/scalefact,45/scalefact,carnames[int(random(0,carnames.length))],i));
  }
}
function draw() {
  currentframe++;
  if(title){
    titledraw();
  }else if(menu){
    menudraw();
  }else if(countdown){
    countdowndraw();
  }else if(racestarted){
    racedraw();
  }else if(aftermatch){
    aftermatchdraw();
  }
  click=false;
}
let countdownstartframe;
let btnscale = 3;
let menuoffsetx = 0;
let infoshowing = false;
function menudraw(){
  noSmooth();
  imageMode(CENTER);
  background('#252323');
  let arrowscale = 4;
  image(arrowl,arrowl.width*arrowscale/2,height/2,arrowl.width*arrowscale,arrowl.height*arrowscale);
  if(click){
    if(mouseX>0&&mouseX<arrowl.width*arrowscale){
      if(mouseY>height/2-arrowl.height*arrowscale/2&&mouseY<height/2+arrowl.height*arrowscale/2){
        if(menuoffsetx<0){
          carselected--;
          menuoffsetx += width;
        }
      }
    }
  }
  image(arrowr,width-arrowr.width *arrowscale/2,height/2,arrowr.width*arrowscale,arrowr.height*arrowscale);
  if(click){ 
    if(mouseX>width-arrowr.width *arrowscale&&mouseX<width){
      if(mouseY>height/2-arrowl.height*arrowscale/2&&mouseY<height/2+arrowl.height*arrowscale/2){
        if(menuoffsetx>-width*(carnames.length-1)){
          menuoffsetx -= width;
          carselected++;
        }
      }
    }
  }
  
  //image(titlescreenimg,width/2,height/2,width,height);
  let carfact = 0.8;
  let worked = false;
  let infobtnsize = 60;
  for(let i = 0;i<carimgsside.length;i++){
    textAlign(CENTER,CENTER);
    textSize(60);
    fill(255);
    text(fullnames[i],i*width+width/2+menuoffsetx,60);
    image(carimgsside[i],i*width+width/2+menuoffsetx,height/2,carimgsside[i].width*carfact,carimgsside[i].height*carfact);
    /*
    imageMode(CORNER);
    image(infoimg,i*width,0,infobtnsize,infobtnsize);
    imageMode(CENTER);
    if(mouseX>i*width+menuoffsetx&&mouseX<i*width+infobtnsize){
      if(mouseY>0&&mouseY<infobtnsize){
        if(click){
          infoshowing = !infoshowing;
        }
      }
    }
    */
    textAlign(LEFT,BOTTOM);
    fill(255);
    textSize(20);
    //console.log(infos[carselected],0,height/4*3,width,height/4);
    text(infos[carselected],0,height/4*3,width,height/4);
    if(mouseX>i*width+width/2+menuoffsetx-carimgsside[i].width*carfact/2 && mouseX<i*width+width/2+menuoffsetx+carimgsside[i].width*carfact/2){
      if(mouseY>height/2-carimgsside[i].height*carfact/2&&mouseY<height/2+carimgsside[i].height*carfact/2){
        worked = true;
        cursor(HAND);
        carselected = i;
        if(click){
          cursor(ARROW);
          menu=false;
          countdown = true;
          startracesetup();
          //startracesetup();
        }
      }
    }
  }
  
  
  if(!worked){
    cursor(ARROW);
  }
  imageMode(CORNER);
}
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
      if(click){
        cursor(ARROW);
        title=false;
        menu=true;
        setupmenu();
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
    menu=true;
    setupmenu();
  }
}
let racestartframe;
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
    racestartframe = currentframe;
  }else{
    imageMode(CENTER);
    let mg = lights[int((currentframe-countdownstartframe)/60)];
    image(mg,width/2,height/6,mg.width/5,mg.height/5);
    imageMode(CORNER);
    //text(5-int((currentframe-countdownstartframe)/60),width/2,height/6);
  }
}
let lapdisplayscale = 10;
let raceframes = 0;
function racedraw(){
  raceframes++;
  if(!musicstarted){// first frame of race
    raceframes = 1;
    if(wpress){
      inputs.push('p`'+'w'+"`"+int(raceframes));
    }
    if(apress){
      inputs.push('p`'+'a'+"`"+int(raceframes));
    }
    if(dpress){
      inputs.push('p`'+'d'+"`"+int(raceframes));
    }
    musicstarted=true;
    music.loop();
  }
  if(wpress!=pwpress){
    if(wpress){
      inputs.push('p`'+'w'+"`"+int(raceframes));
    }else{
      inputs.push('r`'+'w'+"`"+int(raceframes));
    }
  }
  if(apress!=papress){
    if(apress){
      inputs.push('p`'+'a'+"`"+int(raceframes));
    }else{
      inputs.push('r`'+'a'+"`"+int(raceframes));
    }
  }
  if(spress!=pspress){
    if(spress){
      inputs.push('p`'+'s'+"`"+int(raceframes));
    }else{
      inputs.push('r`'+'s'+"`"+int(raceframes));
    }
  }
  if(dpress!=pdpress){
    if(dpress){
      inputs.push('p`'+'d'+"`"+int(raceframes));
    }else{
      inputs.push('r`'+'d'+"`"+int(raceframes));
    }
  }
  noSmooth();
  image(trackimg,camcoords.x,camcoords.y,trackimg.width,trackimg.height);
  image(lapdisplayimgs[laps],width-lapdisplayimgs[laps].width*lapdisplayscale,height-lapdisplayimgs[laps].height*lapdisplayscale,lapdisplayimgs[laps].width*lapdisplayscale,lapdisplayimgs[laps].height*lapdisplayscale);
  if(int((currentframe-countdownstartframe)/60)<=5){
    imageMode(CENTER);
    let mg = lights[int((currentframe-countdownstartframe)/60)];
    image(mg,width/2,height/6,mg.width/5,mg.height/5);
    imageMode(CORNER);
  }
  for(let i = 0;i<carbots.length;i++){
    carbots[i].update();
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
          inputs.push('r`'+'w'+"`"+int(raceframes));
          inputs.push('r`'+'s'+"`"+int(raceframes));
          inputs.push('r`'+'a'+"`"+int(raceframes));
          inputs.push('r`'+'d'+"`"+int(raceframes));
          saveStrings(inputs,"bot0.txt");
          aftermatch=true;
        }
        checkpointspassed = 0;
        for(let i = 0;i<checkpoints.length;i++){
          checkpoints[i].reset();
        }
      }
    }
  }
  for(let i = 0;i<carbots.length;i++){
    carbots[i].show();
  }
  car.show();
  
  if(editor){
    globalmousecoords = createVector(mouseX-camcoords.x,mouseY-camcoords.y);
    rect(min(p1.x,p2.x)+camcoords.x, min(p1.y,p2.y)+camcoords.y, max(p1.x,p2.x)-min(p1.x,p2.x), max(p1.y,p2.y)-min(p1.y,p2.y));
  }
  papress = apress;
  pspress = spress;
  pdpress = dpress;
  pwpress = wpress;
  image(trackimg,0,0,width/8,width/8);
  fill(255,0,0);
  stroke(255,0,0);
  strokeWeight(width/8/20);
  point(map(car.pos.x,0,trackimg.width,0,width/8),map(car.pos.y,0,trackimg.height,0,width/8));
  strokeWeight(1);
}
function mousePressed(){
  click=true;
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
  /*
  wpress=true;
  if(mouseX<width/2){
    apress=true;
  }else{
    dpress=true;
  }
  */
}
function mouseReleased(){
  /*
  wpress=false;
  apress=false;
  dpress=false;
  */
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
  if(keyCode == UP_ARROW){
    wpress=true;
  }
  if(keyCode == DOWN_ARROW){
    spress=true;
  }
  if(keyCode == LEFT_ARROW){
    apress=true;
  }
  if(keyCode == RIGHT_ARROW){
    dpress=true;
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
  if(keyCode == UP_ARROW){
    wpress=false;
  }
  if(keyCode == DOWN_ARROW){
    spress=false;
  }
  if(keyCode == LEFT_ARROW){
    apress=false;
  }
  if(keyCode == RIGHT_ARROW){
    dpress=false;
  }
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
class CarBot{
  constructor(x,y,w,h,name,id){
    this.id=id;
    this.inps = loadStrings("data/tracks/"+trackselected+"/bots/bot"+this.id+".txt");
    this.pos = createVector(x,y);
    this.wid=w;
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
    this.w = false;
    this.a = false;
    this.s = false;
    this.d = false;
  }
  update(){
     console.log(raceframes);
     for(let i = 0;i<this.inps.length;i++){
       if(split(this.inps[i],'`')[2]==raceframes){
         if(split(this.inps[i],'`')[0]=='p'){
           if(split(this.inps[i],'`')[1]=='w'){
             this.w = true;
           }
           if(split(this.inps[i],'`')[1]=='s'){
             this.s = true;
           }
           if(split(this.inps[i],'`')[1]=='a'){
             this.a = true;
           }
           if(split(this.inps[i],'`')[1]=='d'){
             this.d = true;
           }
         }else{
           if(split(this.inps[i],'`')[1]=='w'){
             this.w = false;
           }
           if(split(this.inps[i],'`')[1]=='s'){
             this.s = false;
           }
           if(split(this.inps[i],'`')[1]=='a'){
             this.a = false;
           }
           if(split(this.inps[i],'`')[1]=='d'){
             this.d = false;
           }
         }
       }
     }
     if(this.w){
       this.accelforce = this.accelfact;
       this.friction = 0.95;
     }else{
       this.accelforce = 0;
       this.friction = 0.98;
     }
     this.speed = 0;
     this.speed += this.accelforce;
     if(this.s){
       this.speed-=this.accelfact/4;
     }
     if(this.speed>0){
       this.speed = min(this.speed,this.maxspeed);
     }else{
       this.speed = max(this.speed,-this.maxspeed/10);
     }
     if(trackimg.get(this.pos.x,this.pos.y)[0]!=77&&trackimg.get(this.pos.x,this.pos.y)[0]==trackimg.get(this.pos.x,this.pos.y)[1]){
       this.vel.mult(0.9);
       this.speed*=0.5;
     }
     this.vel.add(createVector(cos(radians(this.direction))*this.speed,sin(radians(this.direction))*this.speed));
     this.vel.mult(this.friction);
     this.turnfact = map(abs(this.vel.x)+abs(this.vel.y),0,this.accelfact/(1-0.95),0,this.maxturnfact);
     if(this.a){
       this.turnaccel-=(this.turnfact/0.9-this.turnfact);
     }
     if(this.d){
       this.turnaccel+=(this.turnfact/0.9-this.turnfact);
     }
     this.turnaccel*=0.9;
     this.direction += this.turnaccel;
     this.pos.add(this.vel);
  }
  show(){
    
    push();
    translate(this.pos.x+camcoords.x,this.pos.y+camcoords.y);
    rotate(radians(this.direction));
    imageMode(CENTER);
    tint(80);
    image(this.img,0,0,this.wid,this.wid);
    noTint();
    pop();
    
    //rect(this.pos.x+camcoords.x,this.pos.y+camcoords.y,this.w,this.h);
  }
}
