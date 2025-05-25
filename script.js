const imageWidth = 250;
const cycleWidth = 5 * imageWidth;
const continuousSpinTime = 3000;
const decelerationDuration = 3000;
const extraCycles = 2;

const case1Skins = [...]; // як у тебе
const case2Skins = [...]; // як у тебе
const case3Skins = [...]; // як у тебе

let spinRAF;
let currentOffset = 0;
let isSpinning = false;

// 🚀 Запуск прокрутки через requestAnimationFrame
function startContinuousSpin(track, skins) {
  cancelAnimationFrame(spinRAF);
  track.replaceChildren();

  for (let i = 0; i < 3; i++) {
    skins.forEach(skin => {
      const img = document.createElement("img");
      img.src = skin.image;
      img.alt = skin.name;
      track.appendChild(img);
    });
  }

  currentOffset = 0;
  const speed = 3; // px per frame

  function animate() {
    currentOffset += speed;
    if (currentOffset >= cycleWidth) currentOffset -= cycleWidth;
    track.style.transform = `translateX(-${currentOffset}px)`;
    spinRAF = requestAnimationFrame(animate);
  }

  animate();
}

// 🛑 Зупинка прокрутки з плавним сповільненням
function stopRoulette(track, skins, onStopCallback) {
  cancelAnimationFrame(spinRAF);

  const finalIndex = Math.floor(Math.random() * skins.length);
  let desiredModulo = finalIndex * imageWidth - 250;
  if (desiredModulo < 0) desiredModulo += cycleWidth;

  const remainder = currentOffset % cycleWidth;
  let delta = desiredModulo - remainder;
  if (delta < 0) delta += cycleWidth;

  const extra = cycleWidth * extraCycles;
  const finalTotalOffset = currentOffset - remainder + delta + extra;

  track.style.transition = `transform ${decelerationDuration}ms ease-out`;
  track.style.transform = `translateX(-${finalTotalOffset}px)`;

  track.addEventListener("transitionend", () => {
    onStopCallback(finalIndex);
  }, { once: true });
}

// 🎁 Відкриття кейсу
function openCaseModal(skins, mainImageId, resultId) {
  if (isSpinning) return;
  isSpinning = true;

  const modal = document.getElementById("rouletteModal");
  const track = document.getElementById("rouletteTrack");
  const container = document.getElementById("rouletteContainer");

  modal.style.display = "flex";
  startContinuousSpin(track, skins);

  setTimeout(() => {
    stopRoulette(track, skins, function (finalIndex) {
      const selectedSkin = skins[finalIndex];
      const winningImg = document.createElement("img");
      winningImg.src = selectedSkin.image;
      winningImg.alt = selectedSkin.name;
      winningImg.classList.add("winning-img");
      container.appendChild(winningImg);

      winningImg.addEventListener("animationend", function () {
        document.getElementById(mainImageId).src = selectedSkin.image;
        document.getElementById(resultId).textContent = "Ви отримали: " + selectedSkin.name;
        winningImg.remove();
        track.innerHTML = "";
        track.style.transition = "";
        track.style.transform = "";
        setTimeout(() => {
          modal.style.display = "none";
          isSpinning = false;
        }, 1000);
      });
    });
  }, continuousSpinTime);
}

// 📦 Обробники кнопок
document.getElementById("openCase1Btn").addEventListener("click", function () {
  openCaseModal(case1Skins, "case1Image", "result1");
});
document.getElementById("openCase2Btn").addEventListener("click", function () {
  openCaseModal(case2Skins, "case2Image", "result2");
});
document.getElementById("openCase3Btn").addEventListener("click", function () {
  openCaseModal(case3Skins, "case3Image", "result3");
});

// ❌ Вихід
document.getElementById("exitModalBtn").addEventListener("click", function () {
  const modal = document.getElementById("rouletteModal");
  const track = document.getElementById("rouletteTrack");
  cancelAnimationFrame(spinRAF);
  isSpinning = false;
  track.style.transition = "";
  track.style.transform = "";
  track.innerHTML = "";
  modal.style.display = "none";
});
