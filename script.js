const clueHolTime = 1000;
const cluepauseTime = 333;
const nextCluewaitTime = 1000;

var pattern =  [2,2,4,3,2,1,2,4];
var progress = 0;
var gamePlaying = false;
var toneplaying = false;
var volume = 0.5;
var guess Counter = 0;




function startGame(){
  progress =0;
  gamePlaying = true;
  
  
   clueHoldTime = 1000; //how long to hold each clue's light/sound
  cluePauseTime = 333;

  // fill the played pattern with random numbers between 1 and # of buttons
  pattern[buttons] = [];
  for (let i = 0; i < arrayLength; i++) {
    pattern[buttons].push(Math.floor(Math.random() * buttons) + 1);
  }
  
  const clueHolTime = 1000;  
  const cluepauseTime = 333;
  
  document.getElementById("startBtn").classList.add("hidden");  
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}




function stopGame(){
  gamePlaying = false;
  document.getElementById("startBtn").classList.add("hidden");  
  document.getElementById("stopBtn").classList.remove("hidden");
  
  failures = 0;
  adjustTries();
}



function loseGame(){
  stopGame();
  alert("Game over. you lost.")
}

function winGame(){
  stopGame();
  alert('Game over. you won!')
}



function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}



function playClueSequence(){
  guessCounter = 0;
  
  context.resume()
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}


// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2
}

function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}

function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}

function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

function totalLoss(btn) {
  // combines all functions related to losing in one drive function
  
  // stop the Countdown
  clearInterval(intId);
  
  // Dark Souls image & sound
  lostSound();
  lostImage(btn);

  setTimeout(loseGame, 100);
  
  // set values to default
  failures = 0;
  adjustTries();

  progress = 0;
  updateCurrent();
}


function lostSound() {
  failureAudio.play();
}


function updateCurrent() {
  document.getElementById("currentScore").innerHTML = progress;
}



function lostImage(btn) {
  document.getElementById("button" + btn).style.backgroundImage =
    "url('https://user-images.githubusercontent.com/47567310/111846524-41923300-88c4-11eb-9f29-6fb31ef1169c.png')";
  setTimeout(restoreImage, 1000, btn);
}



function countDown() {
  // together with setInterval, counts down the time
  timeLeft -= 1;
  document.getElementById("count").innerHTML = timeLeft;
  
  // if no time left, lose()
  if (timeLeft == 0 || gamePlaying == false) {
    clearInterval(intId);
    totalLoss(1);
  }
}







// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)



function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}


function guess(btn){
   console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  }



var successAudio = new Audio(
  "https://cdn.glitch.com/6d1ee535-2e5a-4a4f-8872-d641ad4c3cd7%2Fsuccess.mp3?v=1616193126492"
);
var failureAudio = new Audio(
  "https://cdn.glitch.com/6d1ee535-2e5a-4a4f-8872-d641ad4c3cd7%2Ffailure.mp3?v=1616193470508"
);