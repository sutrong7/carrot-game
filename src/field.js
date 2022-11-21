import * as sound from './sound.js';

'use strict';

const CARROT_SIZE = 80;
const MOVE_SPEED = 500;

export const ItemType = Object.freeze({
  carrot: 'carrot',
  bug: 'bug',
});

export class Field {
  constructor(carrotCount, bugCount, gameStatus , level) {
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;
    this.gameStatus = gameStatus;
    this.level = level;

    this.field = document.querySelector('.game__field');
    this.fieldRect = this.field.getBoundingClientRect(); // 필드의 전체적인 사이즈 정보 가져옴

    this.x2 = this.fieldRect.width - CARROT_SIZE;
    this.y2 = this.fieldRect.height - CARROT_SIZE;

    this.x = 0;
    this.y = 0;

    // this.onClick= this.onClick.bind(this); // 방법 1
    // this.field.addEventListener('click', this.onClick); // 함수를 어딘가에 인자로 전해줄 때 클래스 정보가 무시되기 때문에 함수를 클래스와 바인딩 해줘야함
    // this.field.addEventListener('click', (event) => this.onClick(event)); // 방법 2 화살표 함수는 this 가 유지됨
    this.field.addEventListener('click', this.onClick);
    this.timer = undefined;
  }

  // 클래스 안에 있는 함수를 다른 콜백으로 전달할 때는 그 함수가 포함하고 있는 class의 정보가 사라짐 , 그래서 클래스(this) 와 함수를 묶을수 있는 바인딩이라는 것이 있음
  // 방법 1~3 있음

  setStopListener(onStop) {
    this.onStop = onStop;
  }

  //onClick(event) { // 방법 1,2
  onClick = event => { // 방법 3 온클릭이라는 멤버 변수로 만들고 화살표 함수를 가르키게 하면 됨
    if (!this.gameStatus()) return;
    const target = event.target;
    if (target.matches('.carrot')) {
      target.remove();
      sound.playCarrot();
      this.onStop && this.onStop(ItemType.carrot);
    } else if (target.matches('.bug')) {
      sound.playBug();
      this.onStop && this.onStop(ItemType.bug);
    }
  };

  init() {
    this.field.innerHTML = '';
    this.addItem('carrot', this.carrotCount + this.level(), 'img/carrot.png');
    this.addItem('bug', this.bugCount + this.level(), 'img/bug.png');
    this.move();
  }

  addItem(className, count, imgPath) { // _addItem => private 한 함수 임을 표기.. 근데 안좋은 표기 방식 ㅠ-ㅠ
    const x1 = 0;
    const y1 = 0;

    for (let i = 0; i < count; i++) {
      const item = document.createElement('img');
      item.setAttribute('class', className);
      item.setAttribute('src', imgPath);
      item.style.position = 'absolute';
      this.x = randomNumber(x1, this.x2);
      this.y = randomNumber(y1, this.y2);
      item.style.left = `${this.x}px`;
      item.style.top = `${this.y}px`;
      this.field.appendChild(item);
    }
  }

  move() {
    const bugs = document.querySelectorAll('.bug');
    this.timer = setInterval(() => {
      bugs.forEach((bug) => {
        const x = randomNumber(-50, 50);
        const y = randomNumber(-50, 50);

        bug.style.transition = 'all 2000ms ease';

        let newX = parseFloat(bug.style.left);
        newX += x;

        if (newX > 0 && newX < this.x2) {
          bug.style.left = `${newX}px`;
        }

        let newY = parseFloat(bug.style.top);
        newY += y;

        if (newY > 0 && newY < this.y2) {
          bug.style.top = `${newY}px`;
        }
      });
    }, MOVE_SPEED);
  }

  moveStop() {
    clearInterval(this.timer);
  }
}

function randomNumber(min, max) { // static 함수,  오브젝트 마다 생성되지 않음
  return Math.random() * (max - min) + min;
}

