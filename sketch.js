let starturl='https://78.56.245.255';
let username='';
let usernameInput;
let token = '';
let joined = false;
let started='false';
let question = '';
let timeleft = 0;
function setup(){
    createCanvas(windowWidth, windowHeight);
    fullscreen();
    usernameInput = createInput('');
    usernameInput.elt.addEventListener('keydown', function(event) {
        if (event.keyCode === 13) {
            setUsername();
        }
    });
    rescale();
}
function draw(){
    background('#2f4f4f');
    httpGet(starturl+'/started', function(result) {
        started = result;
    });
    if(started=='false'&&joined){
    }else if(started=='true'){ // started
        if(joined){
            httpGet(starturl+'/currentquestion', function(result) {
                question = result;
            });
            fill(255);
            textSize(40);
            textAlign(CENTER,CENTER);
            text(question, width/2,height/2-250);
        }else{
            fill(255);
            textSize(20);
            textAlign(CENTER,CENTER);
            text("Hurry up! The game has already started!", width/2,height/2-50);
        }
    }else if(started='false'&&!joined){
            fill(255);
            textSize(20);
            textAlign(CENTER,CENTER);
            text("Enter your username: ", width/2,height/2-50);
    }
    if(!joined){
        if(token!=''&&token!='USERNAME IN USE!'){
            usernameInput.remove();
            joined=true;
        }else if(token=='USERNAME IN USE!'){
            fill(255);
            textSize(20);
            textAlign(CENTER,CENTER);
            text("Username already in use!",width/2,height/2+50);
        }
    }else{
        if(started=='false'){
            fill(255);
            textSize(40);
            textAlign(CENTER,CENTER);
            text("You're in! Wait for the game to start!", width/2,height/2-250);
        }
    }
}
function setUsername(){
    username=usernameInput.value();
    httpGet(starturl+'/join/'+username, function(result) {
        token = result;
    });
}
function rescale(){
    usernameInput.size(height/8*4,height/8/10*4);
    usernameInput.style('position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);');
    usernameInput.position(width/2, height/2);
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  rescale();
}