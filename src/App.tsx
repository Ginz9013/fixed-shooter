import { useEffect, useRef, useState } from "react";
import { Application } from "@pixi/react";
import { Assets } from "pixi.js";
import Game from "./components/Game";


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
];


const App = () => {

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const divRef = useRef<HTMLDivElement>(null);

  // 讀取圖片資源
  useEffect(() => {
    Assets.load(assetList).then(() => setIsLoading(false));
  }, []);

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-black">

      {/* Pixi Container */}
      <div ref={divRef} className="border flex justify-center items-center w-[768px] h-full">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <Application resizeTo={divRef}>
            <Game />
          </Application> 
        )}
      </div>
    </div>
  )
}

export default App;
