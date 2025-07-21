import { motion } from "motion/react";
import { type CharacterSpec, CHARACTER_SPECS } from "../../config/characters";
import { useCallback, useEffect, useMemo, useState } from "react";

type SelectionProps = {
  setCharacter: (value: CharacterSpec) => void;
  setGameStart: (value: boolean) => void;
};

const Selection: React.FC<SelectionProps> = ({
  setCharacter,
  setGameStart,
}) => {
  const characters = useMemo(() => Object.values(CHARACTER_SPECS), []);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.key === "ArrowRight") {
        setSelectedIndex((prev) => (prev + 1) % characters.length);
      } else if (e.key === "ArrowLeft") {
        setSelectedIndex(
          (prev) => (prev - 1 + characters.length) % characters.length
        );
      } else if (e.key === "ArrowDown") {
        setSelectedIndex((prev) => (prev + 3) % characters.length);
      } else if (e.key === "ArrowUp") {
        setSelectedIndex(
          (prev) => (prev - 3 + characters.length) % characters.length
        );
      } else if (e.key === "Enter") {
        setCharacter(characters[selectedIndex]);
        setGameStart(true);
      }
    },
    [characters, selectedIndex, setCharacter, setGameStart]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-12">
      <div className="w-1/2 text-center">
        <h1 className="text-5xl font-bold text-white mb-2">CHOOSE YOUR CHARACTER</h1>
        <p className="text-xl text-gray-300">Use arrow keys to select and press Enter to start</p>
      </div>

      <div className="grid grid-cols-3 gap-10 w-1/2">
        {characters.map((char, index) => (
          <div
            key={char.id}
            className={`p-2 transition-transform duration-300 ease-in-out ${
              index === selectedIndex ? "relative scale-110" : "scale-100"
            }`}
          >
            <img src={`/assets/${char.name}.png`} alt={char.name} className="w-full" />

            {index === selectedIndex && (
              <motion.div
                className="absolute inset-0 flex justify-center items-center"
                animate={{ scale: [1.1, 1.3, 1.1] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  ease: "easeInOut",
                }}
              >
                <img src="/assets/select.png" alt="select" className="w-full h-full object-contain" />
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Selection;