type LetterStatus = 'correct' | 'present' | 'absent'
type LetterStatusMap = Record<string, LetterStatus>

export const getLetterStatusMap = (guesses: string[], solution: string): LetterStatusMap => {
  const statusMap: LetterStatusMap = {}

  guesses.forEach((guess) => {
    if (!guess) return;
    const used = Array(solution.length).fill(false);

    // Green background
    for (let i = 0; i < guess.length; i++) {
      const char = guess[i];
      if (char === solution[i]) {
        statusMap[char] = 'correct';
        used[i] = true;
      }
    }

    for (let i = 0; i < guess.length; i++) {
      const char = guess[i];

      if (statusMap[char] === 'correct') continue;

      let found = false;
      for (let j = 0; j < solution.length; j++) {
        if (!used[j] && solution[j] === char) {
          found = true;
          used[j] = true;
          break;
        }
      }

      // Yellow Background
      if (found) {
        if (statusMap[char] !== 'correct') {
          statusMap[char] = 'present';
        }
      } 
      // Red Background
      else {
        if (!statusMap[char]) {
          statusMap[char] = 'absent';
        }
      }
    }
  });

  return statusMap;
};
