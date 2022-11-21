import { Field, ItemType } from './field.js';
import * as sound from './sound.js';

'use strict';

// 게임 시작/종료/재시작
// 게임 종료 결과 팝업 나타냄
// 팝업 내 재시작 버튼 누를 시 재시작
// 타이머?



// 자바스크립트 타입 보장
export const Reason = Object.freeze({
  win: 'win',
  lose: 'lose',
  cancel: 'cancel',
  clear: 'clear'
});

// Builder Pattern - 오브젝트 만들 때 빌더 패턴으로 오브젝트를 간단명료하게 가독성 좋게 만들기
export class GameBuilder {
  gameDuration(duration) {
    this.gameDuration = duration;
    return this;
  }

  carrotCount(num) {
    this.carrotCount = num;
    return this;
  }

  bugCount(num) {
    this.bugCount = num;
    return this;
  }

  chanceCount(num) {
    this.chanceCount = num;
    return this;
  }

  build() {
    return new Game(this.gameDuration, this.carrotCount, this.bugCount, this.chanceCount);
  }
}

class Game {
  constructor(gameDuration, carrotCount, bugCount, chanceCount ) {
    this.gameDuration = gameDuration;
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;
    this.chanceCount = chanceCount;

    this.gameBtn = document.querySelector('.game__button');
    this.gameTimer = document.querySelector('.game__timer');
    this.gameScore = document.querySelector('.game__score');
    this.gameLevel = document.querySelector('.game__level');
    this.gameLevelScore =document.querySelector('.game__level span');

    this.chanceCounter = document.querySelector('.game__chance');
    this.chanceArr = document.querySelectorAll('.game__chance i');

    this.gameBtn.addEventListener('click', () => {
      if (!this.started) {
        this.start();
      } else {
        this.stop(Reason.cancel);
        this.hideChanceCounter();
      }
    });

    this.started = false;
    this.score = 0;
    this.timer = undefined;
    this.chance = this.chanceCount;
    this.level = 1;

    this.gameField = new Field(
      this.carrotCount,
      this.bugCount,
      ()=> this.started,
      ()=> this.level
    );
    this.gameField.setStopListener(this.onItemClick);
  }

  setStopListener(onStop) {
    this.onStop = onStop;
  }

  onItemClick = (item) => {
    if (item === ItemType.carrot) {
      ++this.score;
      this.updateScore();
      if (this.carrotCount + this.level === this.score) {
        this.win();
      }
    } else if (item === ItemType.bug) {
      --this.chance;
      console.log(this.chance);
      if (this.chance <= 0) {
        this.lose();
        // this.updateChanceBoard();
        this.hideLevel();
        // return;
      }
      this.updateChanceBoard();
    }
  };

  win() {
    this.stop(Reason.win);
    this.level++;

    if(this.level > 20){
      this.stop(Reason.clear);
    }
  }

  lose() {
    this.stop(Reason.lose);
    this.level = 1;
  }

  start() {
    this.started = true;
    this.initGame();
    this.showChanceCounter();
    this.showStopButton();
    this.showTimerAndScore();
    this.startGameTimer();
    this.showLevel();
    sound.playBackground();
  }

  stop(reason) {
    this.gameField.moveStop();
    this.started = false;
    this.stopGameTimer();
    this.hideGameButton();
    sound.stopBackground();
    this.onStop && this.onStop(reason);
  }

  showStopButton() {
    const icon = this.gameBtn.querySelector('.fas');
    icon.classList.add('fa-stop');
    icon.classList.remove('fa-play');
    this.gameBtn.style.visibility = 'visible';
  }

  showChanceCounter() {
    this.chanceCounter.style.visibility = 'visible';
  }

  hideChanceCounter() {
    this.chanceCounter.style.visibility = 'hidden';
  }

  hideGameButton() {
    this.gameBtn.style.visibility = 'hidden';
  }

  showTimerAndScore() {
    this.gameTimer.style.visibility = 'visible';
    this.gameScore.style.visibility = 'visible';
  }

  showLevel(){
    this.gameLevel.style.visibility = 'visible';
  }

  hideLevel(){
    this.gameLevel.style.visibility = 'hidden';
  }

  startGameTimer() {
    let remainingTimeSec = this.gameDuration;
    this.updateTimerText(remainingTimeSec);

    this.timer = setInterval(() => {
      this.updateTimerText(--remainingTimeSec);
      if (remainingTimeSec <= 0) {
        this.stopGameTimer();
        (this.carrotCount + this.level) === this.score ? this.win() : this.lose();
      }
    }, 1000);
  }

  stopGameTimer() {
    clearInterval(this.timer);
  }

  updateTimerText(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    this.gameTimer.innerText = `${minutes}:${seconds}`;
  }

  initGame() {
    this.score = 0;
    this.updateLevel();
    this.gameScore.innerText = this.carrotCount + this.level;
    this.gameField.init();

    this.chance = this.chanceCount;
    this.chanceArr.forEach(item => {
      item.classList.remove('fa-heart-crack');
      item.classList.add('fa-heart');
    })
  }

  updateScore() {
    this.gameScore.innerText = this.carrotCount + this.level - this.score;
  }

  updateChanceBoard() {
    let remainingChance = document.querySelectorAll('.fa-heart');
    remainingChance[remainingChance.length - 1].classList.remove('fa-heart');
    remainingChance[remainingChance.length - 1].classList.add('fa-heart-crack');
  }

  updateLevel() {
    this.gameLevelScore.innerText= `${this.level}`;
  }
}

