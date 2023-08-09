let button = document.querySelector("button");

const imgURL = "assets/flappy-bird-set.png";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const img = new Image();
img.src = imgURL;

const tubeUp = new Image(); 
const tubeBottom = new Image(); 
const fg = new Image();

tubeUp.src = "assets/tubeUp.png"; 
tubeBottom.src = "assets/tubeBottom.png"; 
fg.src = "assets/flappy_bird_fg.png";

//Звук
const fly = new Audio();
const score_audio = new Audio();

fly.src = "audio/fly.mp3";
score_audio.src = "audio/score.mp3";

const SPEED = 3.1;

let index = 0;

// ширина и высота птицы
const sizeBird = [51, 36];
let xPosBird = 50;
let yPosBird = 350;

let grav = 2;


// ширина и высота трубы
const sizeTube = [78, 481];

//расстояние между трубами
let gap = 120;
let tube = [];

tube[0] = {
  x: canvas.width,
  y: 0
}

let bestScore = localStorage.getItem("bestScore") || 0;
let score = 0;


function render() {
  index += 0.3;
  
//_________________Background________________

  const backgroudX = -((index * SPEED) % canvas.width);

  const bgSource = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
  };

  const bgPartOneResult = {
    x: backgroudX + canvas.width,
    y: 0,
    width: canvas.width,
    height: canvas.height,
  };

  const bgPartTwoResult = {
    x: backgroudX,
    y: 0,
    width: canvas.width,
    height: canvas.height,
  };

  ctx.drawImage(
    img,

    bgSource.x,
    bgSource.y,
    bgSource.width,
    bgSource.height,

    bgPartOneResult.x,
    bgPartOneResult.y,
    bgPartOneResult.width,
    bgPartOneResult.height
  );
  
  ctx.drawImage(
    img,

    bgSource.x,
    bgSource.y,
    bgSource.width,
    bgSource.height,

    bgPartTwoResult.x,
    bgPartTwoResult.y,
    bgPartTwoResult.width,
    bgPartTwoResult.height
  );


  
//_________________Bird________________


  

  // изображение птицы, которое копируем
  // из изображения-источника
  const birdSource = {
    x: 432,
    y: Math.floor((index % 9) / 3) * sizeBird[1],
    width: sizeBird[0],
    height: sizeBird[1],
  };

  // координаты, по которым птица
  // будет расположена на Canvas
  const birdImg = {
    x: xPosBird,
    y: yPosBird,
    width: sizeBird[0],
    height: sizeBird[1],
  };

  ctx.drawImage(
    img,

    birdSource.x,
    birdSource.y,
    birdSource.width,
    birdSource.height,

    birdImg.x,
    birdImg.y,
    birdImg.width,
    birdImg.height
  );


//_________________Tube________________
  for (let i = 0; i < tube.length; i++) {
    ctx.drawImage(tubeUp, tube[i].x, tube[i].y);
    ctx.drawImage(tubeBottom, tube[i].x, tube[i].y + tubeUp.height + gap);
   

    tube[i].x--;

    if(tube[i].x == 100) {
      tube.push({
        x: canvas.width,
        y: Math.floor(Math.random() * tubeUp.height) - 
        tubeUp.height
      });
    }

    if(xPosBird + sizeBird[0] >= tube[i].x 
      && xPosBird <= tube[i].x + tubeUp.width
      && (yPosBird <= tube[i].y + tubeUp.height
      || yPosBird + sizeBird[1] >= tube[i].y + tubeUp.height +gap) 
      || yPosBird + sizeBird[1] >= canvas.height-fg.height + 20) {
      location.reload();
    }


    if( yPosBird + sizeBird[1] <= 0) {
      yPosBird = 10;
    }
    
    if(tube[i].x == 5) {
      score++;
      if (gap > 40) {
        gap = gap - 2;
      } else {
        gap = 40;
      }
      
      score_audio.play();
    }
  }

  ctx.drawImage( fg, 0, canvas.height-fg.height + 20, 431, 160);

  yPosBird += grav;

   // Сохранить обновленный лучший счет в localStorage
 if (score > bestScore) {
  bestScore = score;
  localStorage.setItem("bestScore", bestScore);
} 


  ctx.fillStyle = '#553847';
  ctx.font = '24px Verdana';
  ctx.fillText('Счёт: ' + score, 10, canvas.height - 30)
  ctx.fillText('Лучший результат: ' + bestScore, 10, canvas.height - 80)

  requestAnimationFrame(render);
};

//при нажатии на какую-либо кнопку птица взлетает
document.addEventListener("keydown", moveUp)

canvas.onclick = function() {
  moveUp();
}

function moveUp() {
  yPosBird -= 35;
  fly.currentTime = 0;
  fly.play();
}

//вызываем после загрузки изображения
img.onload = render;


// Обновление игры по кнопке
button.onclick = function() {
  location.reload();
}







