type LineProps = {
  guess: string
  isFinal: boolean
  solution: string
}

export const Line = ({ guess, isFinal, solution }: LineProps) => {
  const WORD_LENGTH = 5
  const tiles = []

  const color = (char: string, i: number) => {
    if(isFinal) {
      if(char === solution[i]) {
        return 'bg-green-300'
      } else if(solution.includes(char)) {
        return 'bg-yellow-300'
      } else {
        return 'bg-gray-300'
      }
    }
    return 'bg-white'
  } 

  for(let i = 0; i < WORD_LENGTH; i++) {
    const char = guess[i]

    tiles.push(
      <div 
        key={i} 
        className={
          ['flex', 
            'justify-center', 
            'items-center', 
            'border', 
            'border-black', 
            'min-h-12', 
            'aspect-square',
            'uppercase',
            'transition-all',
            'duration-300',
            color(char, i)
          ].join(' ')
        }
      >
        {char}
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      {tiles}
    </div>
  )
}
