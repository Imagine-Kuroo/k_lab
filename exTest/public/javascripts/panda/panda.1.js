
const screenWidth = 1024;
const screenHeight = 768;
const bgRatio = 0.5;
const pandaRatio = 0.35;

var pandaPlayer, game;
var targetX = screenWidth / 2;

var levelNum = 1, levelIn; //1-幼年,2-中年,3-老年
var bgArr = [], bgNum = 0, bgIn; // 0-竹林，1-圣诞
var clothArr = ['1', '2'], clothIn; // 1-没衣服，2-圣诞
var clothClickFlagArr = [null, null]; // 与衣服一一对应，换一套新衣服时，重新绑定点击事件
var stateArr = ['hunger', 'walk', 'idle'], stateNum = 1, stateIn;  // 0-饥饿,1-饱腹,2-无聊


function preload() {
  game.add.plugin(PhaserSpine.SpinePlugin);
  game.load.spine('panda1', '/javascripts/panda/shengdanyouniance.json');
  game.load.spine('panda2', '/javascripts/panda/shengdanyouniance.json');
  game.load.spine('panda3', '/javascripts/panda/shengdanyouniance.json');

  game.load.image('bg1', '/javascripts/panda/image/bg1.png')
  game.load.image('bg0', '/javascripts/panda/image/bg0.png')

  var bar = game.add.graphics();
  game.load.onFileComplete.add(progress => {
    bar.beginFill(0xffffff, 1);
    bar.drawRect(0, screenHeight / 2 - 200, screenWidth * (progress / 100), 50);
    bar.clear();
  }, game);
}

function create() {
  var bg0 = game.add.sprite(0, 0, 'bg0');
  bg0.alpha = 0;
  bg0.scale.x = bgRatio;
  bg0.scale.y = bgRatio;
  bg0.num = 0;
  bg0.events.onInputDown.add(() => {
    defineBgSpriteClick()
  })
  var bg1 = game.add.sprite(0, 0, 'bg1');
  bg1.alpha = 0;
  bg1.scale.x = bgRatio;
  bg1.scale.y = bgRatio;
  bg1.num = 1;
  bg1.events.onInputDown.add(() => {
    defineBgSpriteClick()
  })
  bgArr.push(bg1)
  bgArr.push(bg0)
  if (bgNum != bgIn) {
    bgNum = bgIn;
  }
  changeBgArr()

  pandaPlayer = game.add.spine(targetX, screenHeight / 2 + 250, 'panda' + levelNum);
  pandaPlayer.scale.x = pandaRatio
  pandaPlayer.scale.y = pandaRatio

  pandaPlayer.setSkinByName(clothArr[clothIn]);
  pandaPlayer.setToSetupPose();
  bindPandaSkinClick();
  pandaPlayer.setAnimationByName(0, 'walk', true);
}

function update() {
  if (targetX > parseInt(pandaPlayer.x)) {
    pandaPlayer.x += 8 * bgRatio;
  }

  if (targetX < parseInt(pandaPlayer.x)) {
    pandaPlayer.x -= 8 * bgRatio;
  }

  if (bgNum != bgIn) {
    bgNum = bgIn;
    changeBgArr()
  }

  if (clothClickFlagArr[clothIn] == false) {
    bindPandaSkinClick();
  }
}

function defineBgSpriteClick() {
  console.log('bgNum->', bgNum)
  targetX = parseInt(game.input.activePointer.position.x);
  if (targetX > parseInt(pandaPlayer.x)) {
    pandaPlayer.scale.x = pandaRatio
  }
  if (targetX < parseInt(pandaPlayer.x)) {
    pandaPlayer.scale.x = -1 * pandaRatio
  }
  pandaPlayer.setToSetupPose();
}

function changeBgArr() {
  bgArr.map(itm => {
    if (itm.num == bgNum) {
      itm.alpha = 1;
      itm.inputEnabled = true;
    } else {
      itm.alpha = 0;
      itm.inputEnabled = false;
    }
  })
}

function bindPandaSkinClick() {
  clothClickFlagArr[clothIn] = true;
  for (var i in pandaPlayer.children) {
    var itm = pandaPlayer.children[i]
    console.log(i, '->', itm.children, clothClickFlagArr[clothIn])
    if (itm.children.length > 0) {
      itm.setAll('inputEnabled', true)
      itm.callAll('events.onInputDown.add', 'events.onInputDown', clickPanda)
    } else {
      clothClickFlagArr[clothIn] = false;
    }
  }
  console.log('clothClickFlagArr->', clothClickFlagArr)
}

function clickPanda() {
  console.log('clickPanda-click')
  return false;
}

function initPanda({ level = 1, state = 1, cloth = 1, bg = 1 }) {
  console.log('initPanda->', level, state, cloth, bg)

  levelIn = level
  stateIn = state
  clothIn = cloth
  bgIn = bg

  game = new Phaser.Game(screenWidth, screenHeight, Phaser.AUTO, 'phaserSet',
    {
      preload: preload,
      create: create,
      update: update
    }
  );
}

function changeCloth(num) {
  clothIn = clothArr.indexOf(num);
  pandaPlayer.setSkinByName(num);
  pandaPlayer.setToSetupPose();
  setTimeout(() => {
    bindPandaSkinClick();
  }, 300)

}

function changeBg(num) {
  bgIn = num;
}

export {
  initPanda,
  changeCloth,
  changeBg
}