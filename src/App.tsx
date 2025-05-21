import { useEffect, useRef, useState } from 'react'
import { words } from './constants/words'
import { Line } from './components/Line'
import { keys } from './constants/keys'
import { Keys } from './components/Keys'
import { Confetti } from './components/Confetti'
import { getLetterStatusMap } from './composable/getLetterStatusMap'
import Modal from './components/Modal'

function App() {
  const [solution, setSolution] = useState(() => words[Math.floor(Math.random() * words.length)].toLowerCase())
  const [guesses, setGuesses] = useState(Array(6).fill(null))
  const [currentGuess, setCurrentGuess] = useState('')
  const [isGameOver, setIsGameOver] = useState(false)
  const letterStatusMap = getLetterStatusMap(guesses.filter(Boolean), solution)
  const [showConfetti, setShowConfetti] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const hasOpened = useRef(false)


  const reset = () => {
    setIsGameOver(false)
    setCurrentGuess('')
    setGuesses(Array(6).fill(null))
    setSolution(words[Math.floor(Math.random() * words.length)].toLowerCase())
  }

  const onCloseModal = () => {
    setIsModalOpen(false)
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
        setShowConfetti(true)

        setTimeout(() => {
          setShowConfetti(false);
        }, 5000);
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
    if (!hasOpened.current) {
      setIsModalOpen(true);
      hasOpened.current = true;
    }
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
      } else if (event.key === '⌫' || event.key === 'Backspace') {
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
      {isModalOpen && <Modal isOpen={isModalOpen} onClose={onCloseModal}/>}
      <main className='flex flex-col justify-between items-center gap-4 sm:gap-12 p-4 sm:p-16 min-h-screen bg-linear-to-r from-blue-300 to-red-300'>
        {showConfetti && <Confetti />}
        <section className='flex flex-col self-stretch gap-8 items-center'>
          <h1 className='font-bold text-3xl tracking-widest'>WORDLE</h1>
          <div className='w-full flex flex-col gap-2'>
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
            <div className='flex flex-col gap-4 max-w-xl'>
              <p className='text-center'>
                <span className='font-semibold'>😔 Good try! </span> 
                The correct word was 
                <span className='font-semibold'> {solution.toUpperCase()}</span>. 
                Don't give up — try again and sharpen your word skills!
              </p>
              <button 
                className='bg-blue-200 rounded-sm hover:bg-blue-300 hover:cursor-pointer transition-colors py-2 px-4 self-center' 
                onClick={reset}
              >
                Play Again
              </button>
            </div>
            
          }
          {
            isGameOver && 
            <div className='flex flex-col gap-4 max-w-xl'>
              <p className='text-center'>
                🎉 Congratulations! You guessed the word correctly — 
                <span className='font-semibold'>{solution.toUpperCase()}</span>! 🏆
              </p>
              <button 
                className='bg-blue-200 rounded-sm hover:bg-blue-300 hover:cursor-pointer transition-colors py-2 px-4 self-center' 
                onClick={reset}
              >
                Play Again
              </button>
            </div>
          }
        </section>
        <section className='self-stretch'>
          { <Keys keyGroup={keys} letterStatusMap={letterStatusMap} onKeyPress={handleKeyPress}/> }
        </section>
      </main>
    </>
  )
}

export default App
