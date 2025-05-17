import { useEffect, useState } from 'react'
import { words } from './constants/words'
import { Line } from './components/Line'
import { keys } from './constants/keys'
import { Keys } from './components/Keys'
import { getLetterStatusMap } from './composable/getLetterStatusMap'

function App() {
  const [solution, setSolution] = useState(() => words[Math.floor(Math.random() * words.length)].toLowerCase())
  const [guesses, setGuesses] = useState(Array(6).fill(null))
  const [currentGuess, setCurrentGuess] = useState('')
  const [isGameOver, setIsGameOver] = useState(false)
  const letterStatusMap = getLetterStatusMap(guesses.filter(Boolean), solution)

  const reset = () => {
    setIsGameOver(false)
    setCurrentGuess('')
    setGuesses(Array(6).fill(null))
    setSolution(words[Math.floor(Math.random() * words.length)].toLowerCase())
  }

  const handleKeyPress = (key: string) => {
    if (isGameOver) {
      return
    }

    if (key === 'Enter') {
      if(currentGuess.length != 5) return

      const newGuesses = [...guesses]
      newGuesses[guesses.findIndex(val => val == null)] = currentGuess
      setGuesses(newGuesses)
      setCurrentGuess('')

      const isCorrect = solution === currentGuess
      if (isCorrect) {
        setIsGameOver(true)
      }
    } else if (key === 'Backspace') {
      setCurrentGuess(currentGuess.slice(0, -1))
      return
    }

    if(currentGuess.length >= 5) {
      return
    }


    const isLetter = key.match(/^[a-zA-Z]$/) != null
    if(isLetter) {
      setCurrentGuess(oldGuess => oldGuess + key.toLowerCase())
    }
  }

  useEffect(() => {
    const handleType = (event: KeyboardEvent) => {
      if (isGameOver) {
        return
      }

      if (event.key === 'Enter') {
        if(currentGuess.length != 5) return

        const newGuesses = [...guesses]
        newGuesses[guesses.findIndex(val => val == null)] = currentGuess
        setGuesses(newGuesses)
        setCurrentGuess('')

        const isCorrect = solution === currentGuess
        if (isCorrect) {
          setIsGameOver(true)
        }
      } else if (event.key === 'Backspace') {
        setCurrentGuess(currentGuess.slice(0, -1))
        return
      }

      if(currentGuess.length >= 5) {
        return
      }


      const isLetter = event.key.match(/^[a-zA-Z]$/) != null
      if(isLetter) {
        setCurrentGuess(oldGuess => oldGuess + event.key.toLowerCase())
      }
    }

    window.addEventListener('keydown', handleType)
    return () => window.removeEventListener('keydown', handleType)
  }, [currentGuess, isGameOver, solution, guesses])

  return (
    <>
      <main className='flex flex-col justify-between p-16 h-screen bg-linear-to-r from-blue-300 to-red-300'>
        <section className='flex flex-col gap-4 items-center scale-80 sm:scale-100'>
          <h1 className='font-bold text-3xl tracking-widest'>WORDLE</h1>
          <div className='flex flex-col gap-2'>
            {
              guesses.map((guess, i) => {
                const isCurrentGuess = i === guesses.findIndex(val => val== null)
                return (
                  <Line
                    key={i}
                    guess={isCurrentGuess ? currentGuess : guess ?? ''}
                    isFinal={!isCurrentGuess && guess != null}
                    solution={solution}
                  />
                )
              })
            }
          </div>
          {
            !guesses.includes(null) && solution.toLowerCase() !== guesses[5].toLowerCase() && 
            <div className='flex flex-col gap-4'>
              <p>
                <span className='font-semibold'>😔 Good try! </span> 
                The correct word was 
                <span className='font-semibold'> {solution.toUpperCase()}</span>. 
                Don't give up — try again and sharpen your word skills!
              </p>
              <button 
                className='bg-blue-200 rounded-sm hover:bg-blue-300 hover:cursor-pointer transition-colors py-2 px-4 w-fit self-center' 
                onClick={reset}
              >
                Play Again
              </button>
            </div>
            
          }
          {
            isGameOver && 
            <>
              <p>
                🎉 Congratulations! You guessed the word correctly — 
                <span className='font-semibold'>{solution.toUpperCase()}</span>! 🏆
              </p>
              <button 
                className='bg-blue-200 rounded-sm hover:bg-blue-300 hover:cursor-pointer transition-colors py-2 px-4' 
                onClick={reset}
              >
                Play Again
              </button>
            </>
          }
        </section>
        <section className='scale-65 sm:scale-100'>
          { <Keys keyGroup={keys} letterStatusMap={letterStatusMap} onKeyPress={handleKeyPress}/> }
        </section>
      </main>
    </>
  )
}

export default App
