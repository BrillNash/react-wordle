import { useCallback, useEffect, useState } from "react"
import type { KeysType } from "../types/types";

type KeysProps = {
  keyGroup: KeysType[]
  letterStatusMap: Record<string, 'correct' | 'present' | 'absent'>;
  onKeyPress: (key: string) => void
}

export const Keys = ({ keyGroup, letterStatusMap, onKeyPress }: KeysProps) => {
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [keyPreview, setKeyPreview] = useState<{ key: string, x: number, y: number, width: number } | null>(null);



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

  const handleKeyPress = useCallback((key: string, target?: HTMLDivElement | null) => {
    onKeyPress(key);
    setPressedKey(key);

    if (target) {
      const rect = target.getBoundingClientRect();
      setKeyPreview({
        key,
        x: rect.left + rect.width / 2,
        y: rect.top,
        width: rect.width,
      });

      setTimeout(() => {
        setKeyPreview(null);
      }, 150);
    }

    setTimeout(() => {
      setPressedKey(null);
    }, 100);
  }, [onKeyPress]);



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
    <div className="flex flex-col justify-center items-center gap-2 w-full ">
      {keyGroup.map((group, rowIndex) => (
        <div key={rowIndex} className={["flex self-stretch sm:self-auto justify-center gap-1 max-w-xl", rowIndex === 1 ? 'px-4' : 'px-0'].join(' ')}>
          {group.keys.map((key, keyIndex) => {
            const isPressed = key.toLowerCase() === pressedKey

            return <div
              key={`${rowIndex}-${keyIndex}`}
              onClick={(e) => handleKeyPress(key, e.currentTarget)}
              className={[
                'flex',
                'flex-1',
                'self-stretch',
                'justify-center',
                'items-center',
                'min-h-10 sm:min-h-13',
                'px-2.5 sm:px-4',
                'text-xs sm:text-lg',
                'uppercase',
                'rounded',
                'bg-gray-300',
                'text-black',
                'transition-all',
                'duration-300',
                'cursor-pointer',
                'hover:bg-blue-300',
                getColorClass(key.toLowerCase()),
                isPressed ? 'bg-blue-300 scale-80' : ''
              ].join(' ')}
            >
              {key}
            </div>
            })}
        </div>
      ))}
      {keyPreview && (
        <div
          className="fixed z-50 text-black pointer-events-none transform -translate-x-1/2 -translate-y-full bg-gray-300 border border-gray-300 rounded px-4 py-2 text-xl shadow-lg flex justify-center items-center"
          style={{
            left: `${keyPreview.x}px`,
            top: `${keyPreview.y}px`,
            width: `${keyPreview.width}px`
          }}
        >
          {keyPreview.key.toUpperCase()}
        </div>
      )}
    </div>
  )
}
