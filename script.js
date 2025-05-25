/**********************
 * Налаштування та дані *
 **********************/
const imageWidth = 250;         // Ширина одного зображення в рулетці (px)
const cycleWidth = 5 * imageWidth; // Повна ширина одного набору скінів (5 * 250 = 1250px)
const continuousSpinTime = 3000;  // Час безперервного обертання перед сповільненням (мс)
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
 * Функція: Запуск анімації рулетки (безперервно) *
 ****************************************************/
function startContinuousSpin(track, skins) {
  // Для безперервності створюємо дві копії набору скінів
  const trackContent = skins.concat(skins);
  track.innerHTML = "";
  trackContent.forEach(skin => {
    const img = document.createElement("img");
    img.src = skin.image;
    img.alt = skin.name;
    track.appendChild(img);
  });
  // Додаємо клас, який запускає CSS-анімацію безперервного обертання
  track.classList.add("spinning");
}

/****************************************************
 * Функція: Зупинка обертання та розрахунок кінцевої позиції *
 ****************************************************/
function stopRoulette(track, skins, onStopCallback) {
  // Зупиняємо безперервну анімацію, видаляючи клас "spinning"
  track.classList.remove("spinning");

  // Отримуємо обчислене значення поточної трансформації (translateX)
  const computedStyle = window.getComputedStyle(track);
  const matrix = computedStyle.transform || computedStyle.webkitTransform;
  let currentOffset = 0;
  if (matrix && matrix !== "none") {
    const values = matrix.split('(')[1].split(')')[0].split(',');
    // Припускаємо, що матриця виглядає як "matrix(a, b, c, d, tx, ty)"
    currentOffset = Math.abs(parseFloat(values[4])); // tx – поточний зсув (px)
  }
  
  // Обираємо випадковий індекс кінцевого скіну
  const finalIndex = Math.floor(Math.random() * skins.length);
  // Обчислюємо бажане положення за циклом:
  // Щоб центральне зображення з'явилося по центру контейнера (зліва має бути 250px)
  let desiredModulo = finalIndex * imageWidth - 250;
  // Якщо desiredModulo від'ємне – додаємо повний цикл, щоб отримати додатнє значення
  if (desiredModulo < 0) {
    desiredModulo += cycleWidth;
  }
  // Поточний залишок від ділення на ширину циклу
  const remainder = currentOffset % cycleWidth;
  
  // Обчислюємо базу: вирівнюємо до початку циклу
  let baseOffset = currentOffset - remainder;
  // Розраховуємо необхідну додаткову відстань до бажаного положення
  let delta = desiredModulo - remainder;
  if (delta < 0) {
    delta += cycleWidth;
  }
  // Додаємо кілька повних циклів для ефекту сповільнення (наприклад, 2 цикли)
  const extra = cycleWidth * 2;
  
  const finalTotalOffset = baseOffset + delta + extra;
  
  // Застосовуємо перехід для плавного сповільнення
  track.style.transition = `transform ${decelerationDuration}ms ease-out`;
  track.style.transform = `translateX(-${finalTotalOffset}px)`;
  
  // Після завершення переходу запускаємо ефект "випадання"
  track.addEventListener("transitionend", function handleTransition() {
    track.removeEventListener("transitionend", handleTransition);
    // Викликаємо callback з інформацією про вибраний скін
    onStopCallback(finalIndex);
  });
}

/****************************************************
 * Функція: Відкриття кейсу (ініціація анімації) *
 ****************************************************/
function openCaseModal(skins, mainImageId, resultId) {
  const modal = document.getElementById("rouletteModal");
  const track = document.getElementById("rouletteTrack");

  // Показуємо модальне вікно
  modal.style.display = "flex";
  // Запускаємо безперервну анімацію (дві копії скінів для безперервності)
  startContinuousSpin(track, skins);

  // Через певний час (continuousSpinTime) зупиняємо анімацію та розраховуємо кінцеву позицію
  setTimeout(() => {
    stopRoulette(track, skins, function(finalIndex) {
      // Створюємо ефект "випадання" обраного скіну
      const selectedSkin = skins[finalIndex];
      const winningImg = document.createElement("img");
      winningImg.src = selectedSkin.image;
      winningImg.alt = selectedSkin.name;
      winningImg.classList.add("winning-img");
      // Додаємо елемент з ефектом випадання у центр модального вікна
      document.querySelector(".modal-content").appendChild(winningImg);

      winningImg.addEventListener("animationend", function() {
        // Оновлюємо зображення кейсу та текст результату на головній сторінці
        document.getElementById(mainImageId).src = selectedSkin.image;
        document.getElementById(resultId).textContent = "Ви отримали: " + selectedSkin.name;
        // Видаляємо ефект випадання
        winningImg.remove();
        // Очищуємо вміст треку
        track.innerHTML = "";
        // Закриваємо модальне вікно з невеликою затримкою
        setTimeout(() => {
          modal.style.display = "none";
          // Скидаємо перехід, щоб у наступних запусках все було чисто
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
  // Скидаємо анімацію та очищаємо вміст
  track.classList.remove("spinning");
  track.style.transition = "";
  track.style.transform = "";
  track.innerHTML = "";
  modal.style.display = "none";
});
