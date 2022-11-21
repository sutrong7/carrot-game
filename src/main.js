import PopUp from './popup.js';
import {GameBuilder , Reason} from './game.js';
import * as sound from './sound.js';

'use strict';

// 1. init 하여 당근과 벌레를 5개씩 만들어서 랜덤한 포지션으로 지정하여 게임 필드에 추가

const gameFinishBanner = new PopUp(); // 적절한 변수명 지정 중요

const game = new GameBuilder()
  .gameDuration(10)
  .carrotCount(3)
  .bugCount(2)
  .chanceCount(5)
  .build();

game.setStopListener(reason => {
  let message;
  switch(reason) {
    case Reason.win :
      message = 'YOU WON 🎉';
      sound.playWin();
      break;
    case Reason.lose :
      message = 'YOU LOST ☠';
      sound.playBug();
      break;
    case Reason.cancel :
      message = 'REPLAY❓';
      sound.playAlert();
      break;
    case Reason.clear :
      message = '축하드립니다 🎉🎉🎉🎉';
      sound.playWin();
      break;
    default :
      throw new Error('not valid reason');
  }

  gameFinishBanner.showWithText(message);

  console.log(reason);
});

gameFinishBanner.setClickListener(() => {
  game.start();
});

