import { X } from "lucide-react";
import { sampleInstructions, sampleWords } from "../constants/words";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
}

const Modal = ({ isOpen, onClose }: ModalProps) => {
  if (!isOpen) return null;
  const tileColor = (wordNum: number, charNum: number): string | undefined => {
    const conditions = [
      { word: 0, char: 0, color: 'bg-green-300' },  // Correct letter and position
      { word: 1, char: 2, color: 'bg-yellow-300' }, // Correct letter, wrong position
      { word: 2, char: 4, color: 'bg-gray-300' }    // Letter not in the word
    ];

    const match = conditions.find(
      condition => condition.word === wordNum && condition.char === charNum
    );

    return match?.color;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-gray-100 rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6 relative animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
        >
          <X size={20} />
        </button>

        {/* Modal Title */}
        <h2 className="text-xl font-bold mb-4">How To Play</h2>

        {/* Modal Body */}
        <div className="flex flex-col gap-2">
          <span>Guess the Wordle in 6 tries.</span>
          <span>Enter a valid 5-letter word for each attempt.</span>
          <p>After you submit a guess, the tiles will shift colors to reveal how close you are to uncovering the hidden word.</p>
          <ul>
            {sampleInstructions.map((instruction, i) => {
              return (
                <div key={i} className="flex flex-col gap-2">
                  <p>{instruction}</p>
                  <div className="flex gap-1 py-2">
                    {
                      sampleWords[i].split('').map((char, j) => {
                        return (
                          <div
                            key={j}
                            className={
                            [ 'flex',
                              'justify-center', 
                              'items-center', 
                              'border', 
                              'border-black', 
                              'w-8', 
                              'aspect-square',
                              'font-bold',
                              'text-2xl',
                              'uppercase',
                              'transition-all',
                              'duration-300',
                              tileColor(i, j)
                            ].join(' ')
                          }>
                            {char}
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              )
            })}
          </ul>
          <p>Use the clues to crack the code—one word at a time.</p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
