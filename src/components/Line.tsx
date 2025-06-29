type LineProps = {
  guess: string
  isFinal: boolean
  solution: string
}

const computeTileColors = (guess: string, solution: string): string[] => {
  const solutionCounts = [...solution].reduce<Record<string, number>>((acc, char) => {
    acc[char] = (acc[char] || 0) + 1;
    return acc;
  }, {});

  const colors = Array(guess.length).fill('bg-white');

  // First pass: mark greens and decrement count
  [...guess].forEach((char: string, i: number) => {
    if (char === solution[i]) {
      colors[i] = 'bg-green-300';
      solutionCounts[char]--;
    }
  });

  // Second pass: mark yellows and grays
  [...guess].forEach((char: string, i: number) => {
    if (colors[i] !== 'bg-white') return;

    if (solutionCounts[char]) {
      colors[i] = 'bg-yellow-300';
      solutionCounts[char]--;
    } else {
      colors[i] = 'bg-gray-300';
    }
  });

  return colors;
};


export const Line = ({ guess, isFinal, solution }: LineProps) => {
  const WORD_LENGTH = 5;
  const tiles = [];

  const tileColors = isFinal ? computeTileColors(guess, solution) : Array(WORD_LENGTH).fill('bg-white')

  // Render tiles with computed colors
  for (let i = 0; i < WORD_LENGTH; i++) {
    const char = guess[i] || ''
    const tileColor = tileColors[i]

    tiles.push(
      <div
        key={i}
        className={[
          'flex',
          'justify-center',
          'items-center',
          'border',
          'border-black',
          'w-full',
          'min-w-14',
          'aspect-square',
          'font-bold',
          'text-2xl',
          'uppercase',
          'transition-all',
          'duration-500',
          'transform',
          isFinal ? tileColor : 'bg-white'
        ].join(' ')}
      >
        {char}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-5 gap-2 w-full max-w-[320px] mx-auto">
      {tiles}
    </div>
  )
}
