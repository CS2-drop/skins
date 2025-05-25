/********************
 * Глобальні змінні *
 ********************/
let spinAnimationFrameId = null;
let spinOffset = 0;       // Абсолютний зсув (не обнуляємо через mod)
let spinStartTime = null;
const spinSpeed = 416.67; // px/с (приблизно)

/**********************
 * Налаштування та дані *
 **********************/
const imageWidth = 250;            // Ширина одного зображення
const cycleWidth = 5 * imageWidth;   // 1250 px – ширина одного набору скінів
const continuousSpinTime = 3000;     // Час безперервного обертання (мс)
const decelerationDuration = 3000;   // Тривалість сповільнення (мс)
const extraCycles = 2;             // Додатково циклів для ефекту сповільнення

// Масиви скінів
const case1Skins = [
  { name: "Кейс 1 – Скін A", image: "images/skins/Skin_A1.jpg" },
  { name: "Кейс 1 – Скін B", image: "images/skins/Skin_A2.jpg" },
  { name: "Кейс 1 – Скін C", image: "images/skins/Skin_A3.jpg" },
  { name: "Кейс 1 – Скін D", image: "images/skins/Skin_A4.jpg" },
  { name: "Кейс 1 – Скін E", image: "images/skins/Skin_A5.jpg" }
];

const case2Skins = [
  { name: "Кейс 2 – Скін A", image: "images/skins/Skin_B1.png" },
  { name: "Кейс 2 – Скін B", image: "images/skins/Skin_B2.png" },
  { name: "Кейс 2 – Скін C", image: "images/skins/Skin_B3.png" },
  { name: "Кейс 2 – Скін D", image: "images/skins/Skin_B4.png" },
  { name: "Кейс 2 – Скін E", image: "images/skins/Skin_B5.png" }
];

const case3Skins = [
  { name: "Кейс 3 – Скін A", image: "https://via.placeholder.com/300x300.png?text=Кейс+3+Скін+A" },
  { name: "Кейс 3 – Скін B", image: "https://via.placeholder.com/300x300.png?text=Кейс+3+Скін+B" },
  { name: "Кейс 3 – Скін C", image: "https://via.placeholder.com/300x300.png?text=Кейс+3+Скін+C" },
  { name: "Кейс 3 – Скін D", image: "https://via.placeholder.com/300x300.png?text=Кейс+3+Скін+D" },
  { name: "Кейс 3 – Скін E", image: "https://via.placeholder.com/300x300.png?text=Кейс+3+Скін+E" }
];

/****************************************************
 * Функція: Безперервне обертання рулетки (з використанням requestAnimationFrame)
 ****************************************************/
function startContinuousSpin(track, skins) {
  // Заповнюємо трек кількома копіями скінів (20 копій) для забезпечення «безперервності»
  const numCopies = 20;
  track.innerHTML = "";
  for (let i = 0; i < numCopies; i++) {
    skins.forEach(skin => {
      const img = document.createElement("img");
      img.src = skin.image;
      img.alt = skin.name;
      track.appendChild(img);
    });
  }
  
  // Скидаємо контрольні змінні (зберігаємо абсолютне значення)
  spinOffset = 0;
  spinStartTime = null;
  
  // Анімація за допомогою requestAnimationFrame – використовуючи абсолютний зсув, 
  // але відображаємо за модулем (для безперервного циклу)
  function animateSpin(timestamp) {
    if (!spinStartTime) {
      spinStartTime = timestamp;
    }
    let deltaTime = (timestamp - spinStartTime) / 1000; // у секундах
    spinStartTime = timestamp;
    spinOffset += spinSpeed * deltaTime;
    // Встановлюємо трансформацію за модулем
    track.style.transform = `translateX(-${spinOffset % (numCopies * cycleWidth)}px)`;
    spinAnimationFrameId = requestAnimationFrame(animateSpin);
  }
  spinAnimationFrameId = requestAnimationFrame(animateSpin);
}

/****************************************************
 * Функція: Зупинка рулетки із сповільненням та розрахунком остаточного положення
 ****************************************************/
function stopRoulette(track, skins, onStopCallback) {
  // Зупиняємо requestAnimationFrame (не робимо модульне скорочення spinOffset)
  cancelAnimationFrame(spinAnimationFrameId);
  
  const currentOffset = spinOffset; // Абсолютний зсув
  const finalIndex = Math.floor(Math.random() * skins.length);
  
  // Розрахунок бажаного положення:
  // Хочемо, щоб виграшний скін (номер finalIndex) мав лівий край на 250px (центр контейнера)
  let desiredModulo = finalIndex * imageWidth - 250;
  if (desiredModulo < 0) { 
    desiredModulo += cycleWidth;
  }
  
  const remainder = currentOffset % cycleWidth;
  let delta = desiredModulo - remainder;
  if (delta < 0) delta += cycleWidth;
  
  const extra = cycleWidth * extraCycles;
  const finalTotalOffset = currentOffset - remainder + delta + extra;
  
  // Застосовуємо перехід для плавного сповільнення
  track.style.transition = `transform ${decelerationDuration}ms ease-out`;
  // НЕ використовуйте модуль тут, щоб остаточне положення точно відповідало обчисленню
  track.style.transform = `translateX(-${finalTotalOffset}px)`;
  
  track.addEventListener("transitionend", function handler() {
    track.removeEventListener("transitionend", handler);
    onStopCallback(finalIndex);
  });
}

/****************************************************
 * Функція: Відкриття кейсу (ініціація анімації, зупинка і ефект "випадання")
 ****************************************************/
function openCaseModal(skins, mainImageId, resultId) {
  const modal = document.getElementById("rouletteModal");
  const track = document.getElementById("rouletteTrack");
  
  // Показуємо модальне вікно
  modal.style.display = "flex";
  
  // Запускаємо безперервне обертання рулетки
  startContinuousSpin(track, skins);
  
  // Через заданий час зупиняємо рулетку
  setTimeout(() => {
    stopRoulette(track, skins, function(finalIndex) {
      const selectedSkin = skins[finalIndex];
      
      // Створюємо ефект "випадання" – додаємо елемент у контейнер рулетки (в межах контейнера)
      const winningImg = document.createElement("img");
      winningImg.src = selectedSkin.image;
      winningImg.alt = selectedSkin.name;
      winningImg.classList.add("winning-img");
      document.getElementById("rouletteContainer").appendChild(winningImg);
      
      winningImg.addEventListener("animationend", function() {
        // Оновлюємо зображення кейсу та текст результату
        document.getElementById(mainImageId).src = selectedSkin.image;
        document.getElementById(resultId).textContent = "Ви отримали: " + selectedSkin.name;
        winningImg.remove();
        track.innerHTML = "";
        track.style.transition = "";
        setTimeout(() => {
          modal.style.display = "none";
        }, 1000);
      });
    });
  }, continuousSpinTime);
}

/*********************************************
 * Обробники кнопок відкриття кейсів
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
 * Обробник кнопки "Вихід" у модальному вікні
 *********************************************/
document.getElementById("exitModalBtn").addEventListener("click", function() {
  const modal = document.getElementById("rouletteModal");
  const track = document.getElementById("rouletteTrack");
  cancelAnimationFrame(spinAnimationFrameId);
  track.style.transition = "";
  track.style.transform = "";
  track.innerHTML = "";
  modal.style.display = "none";
});
