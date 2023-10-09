let usernameInput;
let passwordInput;
let starturl='';
let signupBtn;
let signinBtn;
let confirmBtn;
let signup = false;
let btnsize = 30;
let username='';
let password='';
let inpwidth;
let inpheight;
function setup(){
    createCanvas(windowWidth,windowHeight);
    btnsize=height/30;
    usernameInput=createInput('');
    passwordInput=createInput('');
    signupBtn=createButton('Sign up');
    signinBtn=createButton('Sign in');
    confirmBtn=createButton('Sign in');
    placeinplace();
}
function draw(){
    background('#24302b');
    fill('#0c1913');
    rectMode(CENTER);
    stroke('#00a254');
    strokeWeight(1);
    rect(width/2,height/2,inpwidth*1.25,(inpheight)*3*2,10);
}
function setUsername(){
    username=usernameInput.value();
}
function setPassword(){
    password=passwordInput.value();
    confirm();
}
function confirm(){
    if(legal(username)&&legal(password)&&username!=''&&password!=''){
        if(signup){
             httpGet(starturl+'/signup/'+username, function(result) {
                token = result;
             });
        }
    }
}
function legal(str){
    let regex = /[\s\/]/;
    return regex.test(str);
}
function switchToSignin(){
    confirmBtn.elt.innerHTML = 'Sign in';
    signup=false;
}
function switchToSignup(){
    confirmBtn.elt.innerHTML = 'Sign up';
    signup=true;
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    placeinplace();
}
function placeinplace(){
    btnsize=height/30*4;
    if(width>height){
        inpwidth = height/8*4;
    }else{
        inpwidth = width/3*2;
    }
    inpheight = height/8/10*4;
    usernameInput.size(inpwidth,inpheight);
    usernameInput.style('position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);');
    usernameInput.position(width/2, height/2-usernameInput.height*1.5);
    usernameInput.changed(setUsername);
    passwordInput.attribute('type', 'password');
    passwordInput.size(inpwidth,inpheight);
    passwordInput.style('position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);');
    passwordInput.position(width/2, height/2);
    passwordInput.changed(setPassword);
    // signupBtn=createButton('Sign up');
    signupBtn.size(btnsize,btnsize/4);
    signupBtn.position(width-btnsize*2.1+btnsize/2,btnsize/8);
    signupBtn.mousePressed(switchToSignup);
    // signinBtn=createButton('Sign in')
    signinBtn.size(btnsize,btnsize/4);
    signinBtn.position(width-btnsize+btnsize/2,btnsize/8);
    signinBtn.mousePressed(switchToSignin);
    // confirmBtn=createButton('Sign in');
    confirmBtn.size(inpwidth,inpheight);
    confirmBtn.position(width/2,height/2+usernameInput.height*1.5);
    //confirmBtn.position(width/2-passwordInput.width/2, height/2-passwordInput.height/2+passwordInput.height*2);
    confirmBtn.mousePressed(confirm);
}