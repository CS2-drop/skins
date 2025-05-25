const imageWidth = 250;
const cycleWidth = 5 * imageWidth;
const continuousSpinTime = 3000;
const decelerationDuration = 3000;
const extraCycles = 2;

const case1Skins = [
  { name: "Кейс 1 – Скін A", image: "https://via.placeholder.com/300x300.png?text=Кейс+1+A" },
  { name: "Кейс 1 – Скін B", image: "https://via.placeholder.com/300x300.png?text=Кейс+1+B" },
  { name: "Кейс 1 – Скін C", image: "https://via.placeholder.com/300x300.png?text=Кейс+1+C" },
  { name: "Кейс 1 – Скін D", image: "https://via.placeholder.com/300x300.png?text=Кейс+1+D" },
  { name: "Кейс 1 – Скін E", image: "https://via.placeholder.com/300x300.png?text=Кейс+1+E" }
];

let spinRAF;
let currentOffset = 0;
let isSpinning = false;

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

function startDeceleration(track, skins, selectedIndex) {
  cancelAnimationFrame(spinRAF);
  let targetOffset = -selectedIndex * imageWidth;
  let decelerationStart = performance.now();

  function decelerate() {
    let progress = (performance.now() - decelerationStart) / decelerationDuration;
    if (progress < 1) {
      currentOffset += speed * (1 - progress); // slower over time
      track.style.transform = `translateX(-${currentOffset}px)`;
      spinRAF = requestAnimationFrame(decelerate);
    } else {
      currentOffset = targetOffset;
      track.style.transform = `translateX(-${currentOffset}px)`;
      displayWinner(skins[selectedIndex].image);
    }
  }

  decelerate();
}

function displayWinner(imageSrc) {
  const winningImg = document.createElement("img");
  winningImg.src = imageSrc;
  winningImg.classList.add("winning-img");
  document.body.appendChild(winningImg);
}

document.getElementById("openCase1Btn").addEventListener("click", () => {
  startContinuousSpin(document.getElementById("rouletteTrack"), case1Skins);
});
