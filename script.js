/**********************
 * Налаштування та дані *
 **********************/
const imageWidth = 250;          // Ширина одного зображення (px)
const cycleWidth = 5 * imageWidth; // Ширина одного набору скінів: 5 * 250 = 1250px
const continuousSpinTime = 3000; // Час безперервного обертання (мс)
const decelerationDuration = 3000; // Тривалість сповільнення (мс)

// Масиви скінів для кожного кейсу
const case1Skins = [
  { name: "Кейс 1 – Скін A", image: "images/skins/SkinA1.jpg" },
  { name: "Кейс 1 – Скін B", image: "images/skins/SkinA2.jpg" },
  { name: "Кейс 1 – Скін C", image: "images/skins/SkinA3.jpg" },
  { name: "Кейс 1 – Скін D", image: "images/skins/SkinA4.jpg" },
  { name: "Кейс 1 – Скін E", image: "images/skins/SkinA5.jpg" }
];

const case2Skins = [
  { name: "Кейс 2 – Скін A", image: "https://via.placeholder.com/300x300.png?text=Кейс+2+Скін+A" },
  { name: "Кейс 2 – Скін B", image: "https://via.placeholder.com/300x300.png?text=Кейс+2+Скін+B" },
  { name: "Кейс 2 – Скін C", image: "https://via.placeholder.com/300x300.png?text=Кейс+2+Скін+C" },
  { name: "Кейс 2 – Скін D", image: "https://via.placeholder.com/300x300.png?text=Кейс+2+Скін+D" },
  { name: "Кейс 2 – Скін E", image: "https://via.placeholder.com/300x300.png?text=Кейс+2+Скін+E" }
];

const case3Skins = [
  { name: "Кейс 3 – Скін A", image: "https://via.placeholder.com/300x300.png?text=Кейс+3+Скін+A" },
  { name: "Кейс 3 – Скін B", image: "https://via.placeholder.com/300x300.png?text=Кейс+3+Скін+B" },
  { name: "Кейс 3 – Скін C", image: "https://via.placeholder.com/300x300.png?text=Кейс+3+Скін+C" },
  { name: "Кейс 3 – Скін D", image: "https://via.placeholder.com/300x300.png?text=Кейс+3+Скін+D" },
  { name: "Кейс 3 – Скін E", image: "https://via.placeholder.com/300x300.png?text=Кейс+3+Скін+E" }
];

/****************************************************
 * Функція: Запуск безперервного обертання рулетки *
 ****************************************************/
function startContinuousSpin(track, skins) {
  // Для безперервності створюємо одну копію набору скінів
  const trackContent = skins.concat(skins);
  track.innerHTML = "";
  trackContent.forEach(skin => {
    const img = document.createElement("img");
    img.src = skin.image;
    img.alt = skin.name;
    track.appendChild(img);
  });

  // Початкове положення – 0
  track.style.transform = "translateX(0px)";
}

/****************************************************
 * Функція: Зупинка рулетки та розрахунок кінцевої позиції *
 ****************************************************/
function stopRoulette(track, skins, onStopCallback) {
  // Отримуємо поточний зсув (translateX) з computedStyle
  const computedStyle = window.getComputedStyle(track);
  const matrix = computedStyle.transform || computedStyle.webkitTransform;
  let currentOffset = 0;
  if (matrix && matrix !== "none") {
    const values = matrix.split('(')[1].split(')')[0].split(',');
    currentOffset = Math.abs(parseFloat(values[4]));
  }
  
  // Обираємо випадковий індекс кінцевого скіну
  const finalIndex = Math.floor(Math.random() * skins.length);
  // Для того, щоб центральне зображення опинилося по центру контейнера (зліва має бути 250px),
  // бажаний зсув в межах одного циклу:
  let desiredModulo = finalIndex * imageWidth - 250;
  if (desiredModulo < 0) desiredModulo += cycleWidth;
  
  // Поточний залишок від ділення
  const remainder = currentOffset % cycleWidth;
  
  // Розраховуємо коригування:
  let delta = desiredModulo - remainder;
  if (delta < 0) delta += cycleWidth;
  
  // Додаємо повних циклів для ефекту сповільнення (наприклад, 2 цикли)
  const extra = cycleWidth * 2;
  const finalTotalOffset = currentOffset - remainder + delta + extra;
  
  // Застосовуємо перехід для плавного сповільнення
  track.style.transition = `transform ${decelerationDuration}ms ease-out`;
  track.style.transform = `translateX(-${finalTotalOffset}px)`;
  
  // Після завершення переходу викликаємо callback з кінцевим індексом
  track.addEventListener("transitionend", function handleTransition() {
    track.removeEventListener("transitionend", handleTransition);
    onStopCallback(finalIndex);
  });
}

/****************************************************
 * Функція: Відкриття кейсу *
 ****************************************************/
function openCaseModal(skins, mainImageId, resultId) {
  const modal = document.getElementById("rouletteModal");
  const track = document.getElementById("rouletteTrack");

  // Показуємо модальне вікно та запускаємо безперервну анімацію
  modal.style.display = "flex";
  startContinuousSpin(track, skins);

  // Після заданого часу зупиняємо рулетку
  setTimeout(() => {
    stopRoulette(track, skins, function(finalIndex) {
      // Отримуємо обраний скін
      const selectedSkin = skins[finalIndex];
      // Створюємо ефект "випадання" – додаємо елемент у контейнер рулетки (це гарантує, що він залишається всередині)
      const winningImg = document.createElement("img");
      winningImg.src = selectedSkin.image;
      winningImg.alt = selectedSkin.name;
      winningImg.classList.add("winning-img");
      document.getElementById("rouletteContainer").appendChild(winningImg);

      // Після завершення анімації "випадання" оновлюємо кейс та результат
      winningImg.addEventListener("animationend", function() {
        document.getElementById(mainImageId).src = selectedSkin.image;
        document.getElementById(resultId).textContent = "Ви отримали: " + selectedSkin.name;
        winningImg.remove();
        track.innerHTML = "";
        setTimeout(() => {
          modal.style.display = "none";
          track.style.transition = "";
        }, 1000);
      });
    });
  }, continuousSpinTime);
}

/*********************************************
 * Обробники кнопок відкриття кейсів *
 *********************************************/
document.getElementById("openCase1Btn").addEventListener("click", function() {
  openCaseModal(case1Skins, "case1Image", "result1");
});
document.getElementById("openCase2Btn").addEventListener("click", function() {
  openCaseModal(case2Skins, "case2Image", "result2");
});
document.getElementById("openCase3Btn").addEventListener("click", function() {
  openCaseModal(case3Skins, "case3Image", "result3");
});

/*********************************************
 * Обробник кнопки "Вихід" у модальному вікні *
 *********************************************/
document.getElementById("exitModalBtn").addEventListener("click", function() {
  const modal = document.getElementById("rouletteModal");
  const track = document.getElementById("rouletteTrack");
  track.classList.remove("spinning");
  track.style.transition = "";
  track.style.transform = "";
  track.innerHTML = "";
  modal.style.display = "none";
});
