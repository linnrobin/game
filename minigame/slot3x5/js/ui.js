// js/ui.js
import { gameConfig } from './config.js'; // Import gameConfig here

const elements = {
    actionButton: document.getElementById('actionButton'),
    claimRewardButton: document.getElementById('claimRewardButton'),
    resultDisplay: document.getElementById('result'),
    machine: document.getElementById('machine'),
    leaderboard: document.querySelector(".leaderboard"),
    bonusItems: null,
    audioPlayers: {} // Store Audio objects for sounds
};

function initializeAudio() {
    for (const key in gameConfig.sounds) { // Use gameConfig
        if (gameConfig.sounds.hasOwnProperty(key)) {
            elements.audioPlayers[key] = new Audio(gameConfig.sounds[key]);
            elements.audioPlayers[key].load();
        }
    }
}

function playSound(soundKey) {
    const audio = elements.audioPlayers[soundKey];
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.warn(`Audio playback failed for ${soundKey}:`, e));
    } else {
        console.warn(`Sound "${soundKey}" not found or initialized.`);
    }
}

function renderReelStructure() {
  elements.machine.innerHTML = '';
  for (let i = 0; i < gameConfig.reelCols; i++) { // Use gameConfig
    const container = document.createElement('div');
    container.className = 'reel-container';
    const reel = document.createElement('div');
    reel.className = 'reel';
    reel.id = `reel${i}`;
    container.appendChild(reel);
    elements.machine.appendChild(container);
  }
}

function renderReelSymbols(reelId, symbolsArray) {
  const reel = document.getElementById(reelId);
  reel.innerHTML = "";
  reel.style.transition = 'none';
  reel.style.transform = 'translateY(0)';
  symbolsArray.forEach(sym => {
    const div = document.createElement("div");
    div.className = "symbol";
    div.innerHTML = `<span class="emoji">${sym}</span>`;
    reel.appendChild(div);
  });
}

async function animateReels() {
  const firstSymbol = document.querySelector('.symbol');
  if (!firstSymbol) {
      console.error("No .symbol element found to calculate height for animation.");
      return Promise.resolve();
  }
  const symbolHeight = firstSymbol.offsetHeight;

  if (symbolHeight === 0) {
      console.warn("Symbol height is 0, animation will not occur. Check CSS or rendering.");
      return Promise.resolve();
  }

  const offset = symbolHeight * gameConfig.animationSymbolsCount; // Use gameConfig

  return new Promise(resolve => {
    let completedAnimations = 0;
    for (let i = 0; i < gameConfig.reelCols; i++) { // Use gameConfig
      const reel = document.getElementById(`reel${i}`);
      if (reel) {
        reel.style.transition = 'transform 2.5s cubic-bezier(0.22, 0.61, 0.36, 1)';
        reel.style.transform = `translateY(-${offset}px)`;

        setTimeout(() => {
          completedAnimations++;
          if (completedAnimations === gameConfig.reelCols) { // Use gameConfig
            resolve();
          }
        }, 2500);
      } else {
        console.warn(`Reel element with ID reel${i} not found.`);
        completedAnimations++;
        if (completedAnimations === gameConfig.reelCols) { // Use gameConfig
          resolve();
        }
      }
    }
  });
}

function updateResult(message, isWinning = false) {
  elements.resultDisplay.textContent = message;
  if (isWinning) {
    elements.resultDisplay.style.color = '#2ecc71';
    elements.resultDisplay.style.textShadow = '0 0 6px #2ecc71';
  } else {
    elements.resultDisplay.style.color = '#fff';
    elements.resultDisplay.style.textShadow = 'none';
  }
}

function showSpinButton() {
  elements.actionButton.style.display = 'block';
  elements.claimRewardButton.style.display = 'none';
  elements.actionButton.disabled = false;
  elements.actionButton.textContent = gameConfig.buttonTexts.spin; // Use gameConfig
  elements.claimRewardButton.classList.remove('neon-buzz');
}

function showClaimButton(addNeonEffect = false) {
  elements.actionButton.style.display = 'none';
  elements.claimRewardButton.style.display = 'block';
  elements.claimRewardButton.disabled = false;
  elements.claimRewardButton.textContent = gameConfig.buttonTexts.claim; // Use gameConfig
  if (addNeonEffect) {
    elements.claimRewardButton.classList.add('neon-buzz');
  } else {
    elements.claimRewardButton.classList.remove('neon-buzz');
  }
}

function disableSpinButton() {
    elements.actionButton.disabled = true;
}

function renderLeaderboard() {
    let leaderboardContent = `<h2>Bonus Leaderboard</h2>`;
    for (const spinNum in gameConfig.bonusRewards) { // Use gameConfig
        const reward = gameConfig.bonusRewards[spinNum]; // Use gameConfig
        leaderboardContent += `
            <div class="bonus-item" data-spin="${spinNum}">
                ${spinNum}th Spin: ≥ ${gameConfig.winningMatchCount} same emoji → ${reward.text}
            </div>
        `;
    }
    leaderboardContent += `
        <div class="bonus-item" data-spin="0">
            ${gameConfig.defaultLossText}
        </div>
    `;
    elements.leaderboard.innerHTML = leaderboardContent;
    elements.bonusItems = [...document.querySelectorAll(".bonus-item")];
}

function highlightBonus(currentSpin, isWinningSpin = false) {
  elements.bonusItems.forEach(item => {
    item.style.backgroundColor = '#333';
    item.style.color = '';
    item.classList.remove('neon-buzz');

    const dataSpin = parseInt(item.dataset.spin);
    if (currentSpin > 0 && dataSpin === currentSpin) {
      item.style.backgroundColor = '#f39c12';
      item.style.color = '#000';
      if (isWinningSpin) {
        item.classList.add('neon-buzz');
      }
    } else if (currentSpin === 0 && dataSpin === 0) {
      item.style.backgroundColor = '#f39c12';
      item.style.color = '#000';
    }
  });
}

function bindSpinButton(handler) {
  elements.actionButton.onclick = () => {
    playSound('buttonClick');
    handler();
  };
}

function bindClaimButton(handler) {
  elements.claimRewardButton.onclick = () => {
    playSound('buttonClick');
    handler();
  };
}

export const UI = { // Export the UI object
  elements,
  renderReelStructure,
  renderReelSymbols,
  animateReels,
  updateResult,
  showSpinButton,
  showClaimButton,
  disableSpinButton,
  renderLeaderboard,
  highlightBonus,
  bindSpinButton,
  bindClaimButton,
  playSound,
  initializeAudio
};