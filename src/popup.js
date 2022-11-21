'use strict';

export default class PopUp { // 외부에서도 이 클래스를 만들고 볼수 있도록 보냄
  constructor() { // 멤버 변수 받아옴
    this.popUp = document.querySelector('.pop-up');
    this.popUpText = document.querySelector('.pop-up__message');
    this.popUpRefresh = document.querySelector('.pop-up__refresh');
    this.popUpRefresh.addEventListener('click', () => {
      this.onClick && this.onClick();
      this.hide();
    });
  }

  // 이 팝업 클래스 쓰는 사람이 클릭 리스너 등록 가능
  setClickListener(onClick) {
    this.onClick = onClick; // 멤버 변수 this.onClick 에 전달받은 함수를 할당
  }

  showWithText(text) {
    this.popUpText.innerText = text;
    this.popUp.classList.remove('pop-up-hide');
  }

  hide() {
    this.popUp.classList.add('pop-up-hide');
  }
}