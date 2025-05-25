/**********************
 * Налаштування та дані *
 **********************/
const imageWidth = 250; // Ширина одного зображення в рулетці (в пікселях)
const loops = 5;        // Кількість повних циклів рулетки (без фінальної групи)

// Масиви скінів для кожного кейсу
const case1Skins = [
  { name: "Кейс 1 - Скін A", image: "images/skins/Skin_A1.jpg" },
  { name: "Кейс 1 - Скін B", image: "images/skins/Skin_A2.jpg" },
  { name: "Кейс 1 - Скін C", image: "images/skins/Skin_A3.jpg" },
  { name: "Кейс 1 - Скін D", image: "images/skins/Skin_A4.jpg" },
  { name: "Кейс 1 - Скін E", image: "images/skins/Skin_A5.jpg" }
];

const case2Skins = [
  { name: "Кейс 2 - Скін A", image: "https://via.placeholder.com/300x300.png?text=Кейс+2+Скін+A" },
  { name: "Кейс 2 - Скін B", image: "https://via.placeholder.com/300x300.png?text=Кейс+2+Скін+B" },
  { name: "Кейс 2 - Скін C", image: "https://via.placeholder.com/300x300.png?text=Кейс+2+Скін+C" },
  { name: "Кейс 2 - Скін D", image: "https://via.placeholder.com/300x300.png?text=Кейс+2+Скін+D" },
  { name: "Кейс 2 - Скін E", image: "https://via.placeholder.com/300x300.png?text=Кейс+2+Скін+E" }
];

const case3Skins = [
  { name: "Кейс 3 - Скін A", image: "https://via.placeholder.com/300x300.png?text=Кейс+3+Скін+A" },
  { name: "Кейс 3 - Скін B", image: "https://via.placeholder.com/300x300.png?text=Кейс+3+Скін+B" },
  { name: "Кейс 3 - Скін C", image: "https://via.placeholder.com/300x300.png?text=Кейс+3+Скін+C" },
  { name: "Кейс 3 - Скін D", image: "https://via.placeholder.com/300x300.png?text=Кейс+3+Скін+D" },
  { name: "Кейс 3 - Скін E", image: "https://via.placeholder.com/300x300.png?text=Кейс+3+Скін+E" }
];

/****************************************************
 * Функція: Ініціалізація анімації рулетки кейсу *
 ****************************************************/
function openCaseModal(skins, mainImageId, resultId) {
  const modal = document.getElementById("rouletteModal");
  const track = document.getElementById("rouletteTrack");

  // Показуємо модальне вікно та очищаємо трек
  modal.style.display = "flex";
  track.innerHTML = "";

  // Формуємо масив зображень для анімації рулетки:
  let totalSkins = [];
  for (let i = 0; i < loops; i++) {
    totalSkins = totalSkins.concat(skins);
  }
  // Додаємо фінальну групу для визначення результату
  totalSkins = totalSkins.concat(skins);

  // Заповнюємо трек зображеннями
  totalSkins.forEach(skin => {
    const img = document.createElement("img");
    img.src = skin.image;
    img.alt = skin.name;
    track.appendChild(img);
  });

  // Визначаємо фінальний індекс обраного скіна
  const finalIndex = Math.floor(Math.random() * skins.length);
  const totalImagesBefore = loops * skins.length + finalIndex;
  const targetOffset = totalImagesBefore * imageWidth;

  // З невеликою затримкою (щоб браузер точно відобразив всі елементи) запускаємо анімацію прокручування
  setTimeout(() => {
    track.style.transition = "transform 3s ease-out";
    track.style.transform = `translateX(-${targetOffset}px)`;
  }, 50);

  // Після завершення анімації прокручування
  track.addEventListener("transitionend", function handleTransition() {
    track.removeEventListener("transitionend", handleTransition);
    const selectedSkin = skins[finalIndex];

    // Створюємо елемент для ефекту "випадання" обраного скіна
    const winningImg = document.createElement("img");
    winningImg.src = selectedSkin.image;
    winningImg.alt = selectedSkin.name;
    winningImg.classList.add("winning-img");

    // Додаємо його всередину модального вікна (в .modal-content)
    document.querySelector(".modal-content").appendChild(winningImg);

    // Після завершення анімації "випадання" оновлюємо зображення кейсу та результат
    winningImg.addEventListener("animationend", function() {
      document.getElementById(mainImageId).src = selectedSkin.image;
      document.getElementById(resultId).textContent = "Ви отримали: " + selectedSkin.name;
      winningImg.remove();
      track.innerHTML = "";
      // Закриваємо модальне вікно з невеликою затримкою
      setTimeout(() => {
        modal.style.display = "none";
      }, 1000);
    });
  });
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
  track.style.transition = "";
  track.style.transform = "";
  track.innerHTML = "";
  modal.style.display = "none";
});

