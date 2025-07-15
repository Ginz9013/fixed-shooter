import { useEffect, useRef, useState } from "react";
import { Application } from "@pixi/react";
import { Assets } from "pixi.js";
import Game from "./components/Game";


const assetList = [
  "/assets/background.png",
  "/assets/マエデーズ15.png",
  "/assets/レンジャー（レッド）.png",
  "/assets/うんち.png",
];


const App = () => {

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const divRef = useRef<HTMLDivElement>(null);

  // 讀取圖片資源
  useEffect(() => {
    Assets.load(assetList).then(() => setIsLoading(false));
  }, []);

  return (
    <div className="w-screen h-screen flex justify-center items-center">

      {/* Pixi Container */}
      <div ref={divRef} className="border flex justify-center items-center w-[768px] h-full">
        {
          isLoading ? (
            <p>Loading...</p>
          ) : (
            <Application resizeTo={divRef}>
              <Game />
            </Application> 
          )
        }
      </div>
    </div>
  )
}

export default App;
