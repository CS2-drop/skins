/**********************
 * Налаштування та дані *
 **********************/
const imageWidth = 250;          // Ширина одного зображення
const cycleWidth = 5 * imageWidth; // Ширина 5 скінів (1250px)
const continuousSpinTime = 3000; // Час безперервного обертання (мс)
const decelerationDuration = 3000; // Тривалість сповільнення (мс)
const extraCycles = 2;           // Додатково циклів для ефекту сповільнення

// Масиви скінів
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
  // Заповнюємо трек копіями скінів (6 копій для довжини)
  track.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    skins.forEach(skin => {
      const img = document.createElement("img");
      img.src = skin.image;
      img.alt = skin.name;
      track.appendChild(img);
    });
  }
  // Додаємо клас для CSS безперервного обертання
  track.classList.add("spinning");
}

/****************************************************
 * Функція: Зупинка рулетки та сповільнення            *
 ****************************************************/
function stopRoulette(track, skins, onStopCallback) {
  // Видаляємо клас безперервного обертання
  track.classList.remove("spinning");

  // Отримуємо поточний зсув з обчисленого стилю
  const computedStyle = window.getComputedStyle(track);
  const matrix = computedStyle.transform || computedStyle.webkitTransform;
  let currentOffset = 0;
  if (matrix && matrix !== "none") {
    const values = matrix.match(/matrix.*\((.+)\)/)[1].split(/,\s*/);
    currentOffset = Math.abs(parseFloat(values[4]));
  }

  // Обираємо випадковий індекс кінцевого скіну
  const finalIndex = Math.floor(Math.random() * skins.length);
  // Розраховуємо бажане положення так, щоб виграшний скін був по центру (зліва має бути 250px)
  let desiredModulo = finalIndex * imageWidth - 250;
  if (desiredModulo < 0) desiredModulo += cycleWidth;

  const remainder = currentOffset % cycleWidth;
  let delta = desiredModulo - remainder;
  if (delta < 0) delta += cycleWidth;

  // Додаємо додаткові цикли для ефекту сповільнення
  const extra = cycleWidth * extraCycles;
  const finalTotalOffset = currentOffset - remainder + delta + extra;
  
  // Застосовуємо перехід для плавного сповільнення
  track.style.transition = `transform ${decelerationDuration}ms ease-out`;
  track.style.transform = `translateX(-${finalTotalOffset}px)`;

  track.addEventListener("transitionend", function handler() {
    track.removeEventListener("transitionend", handler);
    onStopCallback(finalIndex);
  });
}

/****************************************************
 * Функція: Відкриття кейсу *
 ****************************************************/
function openCaseModal(skins, mainImageId, resultId) {
  const modal = document.getElementById("rouletteModal");
  const track = document.getElementById("rouletteTrack");

  // Показуємо модальне вікно та запускаємо безперервне обертання
  modal.style.display = "flex";
  startContinuousSpin(track, skins);

  // Через заданий час зупиняємо рулетку
  setTimeout(() => {
    stopRoulette(track, skins, function(finalIndex) {
      const selectedSkin = skins[finalIndex];
      // Створюємо ефект "випадання" виграшного скіну
      const winningImg = document.createElement("img");
      winningImg.src = selectedSkin.image;
      winningImg.alt = selectedSkin.name;
      winningImg.classList.add("winning-img");
      // Додаємо ефект безпосередньо у контейнер рулетки, щоб він був усередині вікна
      document.getElementById("rouletteContainer").appendChild(winningImg);

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
