import { useEffect, useRef, useState } from "react";
import { Application } from "@pixi/react";
import { Assets } from "pixi.js";
import Game from "./components/Game";
import Selection from "./components/Selection/Selection";
import { CHARACTER_SPECS, type CharacterSpec } from "./config/characters";


const assetList = [
  "/assets/background.png",
  "/assets/マエデーズ15.png",
  "/assets/レンジャー（レッド）.png",
  "/assets/レンジャー（イエロー）.png",
  "/assets/レンジャー（グリーン）.png",
  "/assets/レンジャー（ピンク）.png",
  "/assets/レンジャー（ブルー）.png",
  "/assets/河童（かっぱ）.png",
  "/assets/うんち.png",
  "/assets/赤色のハート.png",
  "/assets/黄色のハート.png",
  "/assets/びっくりマーク.png",
  "/assets/毒きのこ.png",
  "/assets/バナナの皮.png",
  "/assets/きゅうり.png",
];


const App = () => {

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const divRef = useRef<HTMLDivElement>(null);

  // 開始遊戲
  const [gameStart, setGameStart] = useState<boolean>(false);
  // 預設選擇一台戰機，未來可以讓玩家選擇
  const [character, setCharacter] = useState<CharacterSpec>(CHARACTER_SPECS.blue);

  // 讀取圖片資源
  useEffect(() => {
    Assets.load(assetList).then(() => setIsLoading(false));
  }, []);

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-black">

      {/* Pixi Container */}
      <div ref={divRef} className="border border-gray-500 flex justify-center items-center w-[768px] h-full">
        {isLoading
          ? <p>Loading...</p>
          : !gameStart
            ? <Selection
                setCharacter={setCharacter}
                setGameStart={setGameStart}  
              />
            : <Application resizeTo={divRef}>
                <Game character={character} />
              </Application> 
        }
      </div>
    </div>
  )
}

export default App;
