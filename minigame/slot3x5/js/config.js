// js/config.js
export const gameConfig = {
    // Reel Data
    reelEmojis: ["💎", "🍀", "🎉", "🪙", "🎁", "🦄"],
    reelRows: 3,
    reelCols: 5,
    animationSymbolsCount: 10,

    // Win Conditions & Bonuses
    guaranteedWinSpins: [1, 2, 3],
    winningMatchCount: 10,
    bonusRewards: {
      1: { percentage: 100, text: "Bonus 100% deposit" },
      2: { percentage: 75, text: "Bonus 75% deposit" },
      3: { percentage: 50, text: "Bonus 50% deposit" },
      4: { percentage: 25, text: "Bonus 25% deposit" },
      5: { percentage: 10, text: "Bonus 10% deposit" }
    },
    defaultLossText: "Better luck next time!",

    // UI Texts & Messages
    buttonTexts: {
      spin: "🕹️ Mulai Spin",
      claim: "💰 Claim Reward"
    },
    resultMessages: {
      spinning: "Spinning...",
      win: (bonus, count, symbol) => `🎉 YOU WIN! Bonus ${bonus}%! (${count}x ${symbol})`,
      lose: "💨 So close! Try again!"
    },
    claimRewardURL: "https://www.google.com",

    // Sounds - Publicly hosted via cdnjs.com (from the howler.js library examples)
    sounds: {
      buttonClick: "https://cdnjs.cloudflare.com/ajax/libs/howler.js/2.2.3/examples/audio/click.mp3",
      spinStart: "https://cdnjs.cloudflare.com/ajax/libs/howler.js/2.2.3/examples/audio/spin.mp3",
      spinEndWin: "https://cdnjs.cloudflare.com/ajax/libs/howler.js/2.2.3/examples/audio/chime.mp3",
      spinEndLose: "https://cdnjs.cloudflare.com/ajax/libs/howler.js/2.2.3/examples/audio/ding.mp3"
    },

    // Images (Placeholders)
    images: {
      background: "slot_bg.jpg",
      logo: "slot_logo.png"
    }
};