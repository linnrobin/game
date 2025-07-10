// js/slotMachine.js
import { UI } from './ui.js';       // Import UI module
import { gameConfig } from './config.js'; // Import gameConfig

let spinCount = 0;
let guaranteedWinSpin = 0;
let selectedWinningSymbol = null;

function getRandomSymbol() {
  return gameConfig.reelEmojis[Math.floor(Math.random() * gameConfig.reelEmojis.length)]; // Use gameConfig
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function countMatchingSymbols() {
  const allSymbols = [];
  for (let i = 0; i < gameConfig.reelCols; i++) { // Use gameConfig
    const reel = document.getElementById(`reel${i}`);
    if (!reel) {
        console.warn(`Reel with ID reel${i} not found when counting symbols.`);
        continue;
    }
    const symbolsInReel = Array.from(reel.querySelectorAll('.symbol')).map(s => s.textContent);
    const visibleSymbols = symbolsInReel.slice(-gameConfig.reelRows); // Use gameConfig
    allSymbols.push(...visibleSymbols);
  }
  const counts = {};
  allSymbols.forEach(s => counts[s] = (counts[s] || 0) + 1);
  return counts;
}

function generateReelSymbols(isWinningSpin, reelIndex) {
  const reelSymbols = [];
  for (let i = 0; i < gameConfig.animationSymbolsCount; i++) { // Use gameConfig
    reelSymbols.push(getRandomSymbol());
  }

  if (isWinningSpin) {
    if (!selectedWinningSymbol) {
         selectedWinningSymbol = getRandomSymbol();
    }

    const visibleSymbolsForThisReel = [];
    let winningSymbolsPlacedOnReel = 0;

    let targetWinningSymbolsForReel = 0;
    if (reelIndex === 0 || reelIndex === 1) {
        targetWinningSymbolsForReel = 3;
    } else if (reelIndex === 2 || reelIndex === 3) {
        targetWinningSymbolsForReel = 2;
    } else {
        targetWinningSymbolsForReel = getRandomInt(1, 3);
    }

    for (let i = 0; i < gameConfig.reelRows; i++) { // Use gameConfig
        if (winningSymbolsPlacedOnReel < targetWinningSymbolsForReel) {
            visibleSymbolsForThisReel.push(selectedWinningSymbol);
            winningSymbolsPlacedOnReel++;
        } else {
            visibleSymbolsForThisReel.push(getRandomSymbol());
        }
    }

    for (let i = visibleSymbolsForThisReel.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [visibleSymbolsForThisReel[i], visibleSymbolsForThisReel[j]] = [visibleSymbolsForThisReel[j], visibleSymbolsForThisReel[i]];
    }

    reelSymbols.push(...visibleSymbolsForThisReel);

  } else {
    selectedWinningSymbol = null;
    for (let i = 0; i < gameConfig.reelRows; i++) { // Use gameConfig
      reelSymbols.push(getRandomSymbol());
    }
  }
  return reelSymbols;
}

async function startSpin() {
  UI.playSound('spinStart'); // Use UI module
  UI.disableSpinButton();     // Use UI module
  UI.updateResult(gameConfig.resultMessages.spinning); // Use UI module and gameConfig
  spinCount++;
  UI.highlightBonus(spinCount, false); // Use UI module

  if (!gameConfig.bonusRewards[spinCount]) { // Use gameConfig
    UI.highlightBonus(0, false); // Use UI module
  }

  if (UI.elements.machine.innerHTML === '') { // Use UI module
    UI.renderReelStructure(); // Use UI module
    for (let i = 0; i < gameConfig.reelCols; i++) { // Use gameConfig
        const initialSymbols = [];
        for (let j = 0; j < gameConfig.reelRows; j++) { // Use gameConfig
            initialSymbols.push(getRandomSymbol());
        }
        UI.renderReelSymbols(`reel${i}`, initialSymbols); // Use UI module
    }
  }

  const isCurrentSpinGuaranteedWin = (spinCount === guaranteedWinSpin);

  for (let i = 0; i < gameConfig.reelCols; i++) { // Use gameConfig
    const reelSymbols = generateReelSymbols(isCurrentSpinGuaranteedWin, i);
    UI.renderReelSymbols(`reel${i}`, reelSymbols); // Use UI module
  }

  await UI.animateReels(); // Use UI module

  const counts = countMatchingSymbols();
  const mostFrequentSymbol = Object.keys(counts).length > 0 ? Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b)) : null;
  const maxMatch = mostFrequentSymbol ? counts[mostFrequentSymbol] : 0;

  let won = false;

  if (maxMatch >= gameConfig.winningMatchCount && gameConfig.bonusRewards[spinCount]) { // Use gameConfig
    won = true;
    const bonus = gameConfig.bonusRewards[spinCount].percentage; // Use gameConfig
    UI.updateResult(gameConfig.resultMessages.win(bonus, maxMatch, mostFrequentSymbol), true); // Use UI module and gameConfig
    UI.showClaimButton(true); // Use UI module
    UI.highlightBonus(spinCount, true); // Use UI module
    UI.bindClaimButton(() => window.location.href = gameConfig.claimRewardURL); // Use UI module and gameConfig
    UI.playSound('spinEndWin'); // Use UI module
    selectedWinningSymbol = null;
  } else {
    UI.updateResult(gameConfig.resultMessages.lose); // Use UI module and gameConfig
    UI.highlightBonus(0, false); // Use UI module
    UI.showSpinButton(); // Use UI module
    UI.playSound('spinEndLose'); // Use UI module
    selectedWinningSymbol = null;
  }
}

function init() {
  spinCount = 0;
  guaranteedWinSpin = gameConfig.guaranteedWinSpins[Math.floor(Math.random() * gameConfig.guaranteedWinSpins.length)]; // Use gameConfig
  selectedWinningSymbol = null;

  UI.initializeAudio(); // Use UI module
  UI.renderLeaderboard(); // Use UI module
  UI.renderReelStructure(); // Use UI module
  for (let i = 0; i < gameConfig.reelCols; i++) { // Use gameConfig
    const initialSymbols = [];
    for (let j = 0; j < gameConfig.reelRows; j++) { // Use gameConfig
        initialSymbols.push(getRandomSymbol());
    }
    UI.renderReelSymbols(`reel${i}`, initialSymbols); // Use UI module
  }
  UI.highlightBonus(0, false); // Use UI module
  UI.showSpinButton(); // Use UI module
  UI.bindSpinButton(startSpin); // Use UI module
}

export const SlotMachine = { // Export the SlotMachine object
  init
};