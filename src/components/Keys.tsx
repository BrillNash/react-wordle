import { useCallback, useEffect, useState } from "react"
import type { KeysType } from "../types/types";

type KeysProps = {
  keyGroup: KeysType[]
  letterStatusMap: Record<string, 'correct' | 'present' | 'absent'>;
  onKeyPress: (key: string) => void
}

export const Keys = ({ keyGroup, letterStatusMap, onKeyPress }: KeysProps) => {
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const getColorClass = (key: string) => {
    const status = letterStatusMap[key.toLowerCase()];
    switch (status) {
      case 'correct':
        return 'bg-green-400 text-white';
      case 'present':
        return 'bg-yellow-400 text-white';
      case 'absent':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-300 text-black';
    }
  };

  const handleKeyPress = useCallback((key: string) => {
    onKeyPress(key)
    setPressedKey(key)
    
    // Remove the pressed effect after a short delay
    setTimeout(() => {
      setPressedKey(null);
    }, 100) // Duration in ms
  }, [onKeyPress])

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      let key = e.key;

      if (key === 'Enter' || key === 'Backspace') {
        // Keep as is
      } else if (/^[a-zA-Z]$/.test(key)) {
        key = key.toLowerCase();
      } else {
        return; // Ignore other keys
      }

      handleKeyPress(key);
    };

    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [handleKeyPress]);

  return (
    <div className="flex flex-col justify-center items-center gap-2">
      {keyGroup.map((group, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1">
          {group.keys.map((key, keyIndex) => {
            const isPressed = key.toLowerCase() === pressedKey

            return <div
              key={`${rowIndex}-${keyIndex}`}
              onClick={() => handleKeyPress(key)}
              className={[
                'flex',
                'justify-center',
                'items-center',
                'min-h-10',
                'min-w-12',
                'px-4',
                'uppercase',
                'rounded',
                'bg-grey-100',
                'text-black',
                'transition-all',
                'duration-300',
                'cursor-pointer',
                'hover:bg-blue-300',
                isPressed ? 'bg-blue-300 scale-95' : '',
                getColorClass(key.toLowerCase())
              ].join(' ')}
            >
              {key}
            </div>
            })}
        </div>
      ))}
    </div>
  )
}
