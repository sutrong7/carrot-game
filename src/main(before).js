'use strict';

// 1. init 하여 당근과 벌레를 5개씩 만들어서 랜덤한 포지션으로 지정하여 게임 필드에 추가

const CARROT_SIZE = 80;
const CARROT_COUNT = 20;
const BUG_COUNT = 5;
const GAME_DURATION_SEC = 20;

const field = document.querySelector('.game__field');
const fieldRect = field.getBoundingClientRect(); // 필드의 전체적인 사이즈 정보 가져옴
const gameBtn = document.querySelector('.game__button');
const gameTimer = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');

const popUp = document.querySelector('.pop-up');
const popUpText = document.querySelector('.pop-up__message');
const popUpRefresh = document.querySelector('.pop-up__refresh');

const images = document.querySelector('img');
const carrotSound = new Audio('./sound/carrot_pull.mp3');
const alertSound = new Audio('./sound/alert.mp3');
const bgSound = new Audio('./sound/bg.mp3');
const bugSound = new Audio('./sound/bug_pull.mp3');
const winSound = new Audio('./sound/game_win.mp3');

let started = false;
let score = 0;
let timer = undefined;

// 게임 진행
field.addEventListener('click', onFieldClick);

// 게임 컨트롤러
gameBtn.addEventListener('click', ()=>{
  if(started){
    stopGame();
  }else{
    startGame();
  }
});

// 게임 재시작
popUpRefresh.addEventListener('click',()=>{
  startGame();
  hidePopUp();
});

function startGame(){
  started = true;
  initGame();
  showStopButton();
  showTimerAndScore();
  startGameTimer();
  playSound(bgSound);
}

function stopGame() {
  started = false;
  stopGameTimer();
  hideGameButton();
  showPopUpWithText('REPLAY❓');
  playSound(alertSound);
  stopSound(bgSound);
}

// 게임 종료
function finishGame(win){
  started = false;
  hideGameButton();
  if(win) {
    playSound(winSound);
  }else{
    playSound(bugSound);
  }
  stopGameTimer();
  stopSound(bgSound);
  showPopUpWithText(win?'YOU WON 🎉':'YOU LOST ☠');
  // popUp.classList.remove('pop-up-hide');
  // popUp.classList.add('pop-up-show');
}

function showStopButton() {
  const icon = gameBtn.querySelector('.fas');
  icon.classList.add('fa-stop');
  icon.classList.remove('fa-play');
  gameBtn.style.visibility= 'visible';
}

function hideGameButton(){
  gameBtn.style.visibility = 'hidden';
}

function showTimerAndScore() {
  gameTimer.style.visibility= 'visible';
  gameScore.style.visibility= 'visible';
}

function startGameTimer() {
  let remainingTimeSec = GAME_DURATION_SEC;
  updateTimerText(remainingTimeSec);

  timer = setInterval(()=> {
    if(remainingTimeSec <=0){
      clearInterval(timer);
      finishGame(CARROT_COUNT === score);
      return;
    }
    updateTimerText(--remainingTimeSec);
  },1000);
}

function stopGameTimer() {
    clearInterval(timer);
}

function showPopUpWithText(text){
  popUpText.innerText = text;
  popUp.classList.remove('pop-up-hide');
}

function hidePopUp() {
  popUp.classList.add('pop-up-hide');
}

function updateTimerText(time) {
  const minutes = Math.floor(time/60);
  const seconds = time % 60;
  gameTimer.innerText = `${minutes}:${seconds}`;
}

function updateScoreBoard(score){
  gameScore.innerText = CARROT_COUNT - score;
}

function initGame() {
  score = 0;
  // 벌레와 당근을 생성한 뒤 field 에 추가해줌
  field.innerHTML = '';
  gameScore.innerText = CARROT_COUNT;
  addItem('carrot', 20, 'img/carrot.png');
  addItem('bug', 20, 'img/bug.png');
}

function onFieldClick(event) {
  // 시작하지 않았다면 동작하지 않도록
  if(!started) {
    return;
  }

  const target = event.target;
  if(target.matches('.carrot')){
    // 당근 찾았다 !!
    target.remove();
    score++;
    playSound(carrotSound);
    updateScoreBoard(score);
    if(score === CARROT_COUNT) {
      finishGame(true); //불리언으로 전달하는 것은 의미 파악이 불가해 좋지 않음

    }
  } else if(target.matches('.bug')) {
    // 벌레다 !!
      finishGame(false);
  }
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}

function addItem(className, count, imgPath) {
  const x1 = 0;
  const y1 = 0;
  const x2 = fieldRect.width - CARROT_SIZE;
  const y2 = fieldRect.height - CARROT_SIZE;

  for (let i = 0;  i < count ; i++) {
    const item = document.createElement('img');
    item.setAttribute('class', className);
    item.setAttribute('src', imgPath);
    item.style.position = 'absolute';
    const x = randomNumber(x1, x2);
    const y = randomNumber(y1, y2);
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    field.appendChild(item);
  }
}

function randomNumber(min,max) {
  return Math.random() * (max - min) + min;
}
