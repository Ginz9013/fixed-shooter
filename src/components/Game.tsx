
import { useEffect, useRef, useState } from "react";
import { extend, useApplication } from "@pixi/react";
import { Container, Ticker } from "pixi.js";
import Background from "../components/Background";
import Ghost from "../components/Ghost";
import Character from "./Character";


const ghostPositionList = [
  // 第一排
  { x: 0, y: 0},
  { x: 100, y: 0},
  { x: 200, y: 0},
  { x: 300, y: 0},
  { x: 400, y: 0},
  { x: 500, y: 0},
  // 第二排
  { x: 50, y: 60},
  { x: 150, y: 60},
  { x: 250, y: 60},
  { x: 350, y: 60},
  { x: 450, y: 60},
];

extend({
  Container
});


const Game = () => {

  const { app } = useApplication();

  const [groupY, setGroupY] = useState(100);
  const direction = useRef(1); // 用 ref 存動畫方向


  // 幽靈群的持續動畫特效
  useEffect(() => {
    const tick = (ticker: Ticker) => setGroupY(prevY => {
      let next = prevY + direction.current * ticker.deltaTime * 0.3; // delta 基本上約等於 1，但可自動適配 FPS
      if (next > 110) direction.current = -1;
      if (next < 100) direction.current = 1;

      return next;
    });

    app.ticker.add(tick);

    return () => {
      app.ticker.remove(tick)
    };
  }, []);

  return (
    <pixiContainer x={0} y={0}>
      {/* Ghost Group */}
      <pixiContainer x={(768 - 550) / 2} y={groupY}>
        {
          ghostPositionList.map((ghost, index) => (
            <Ghost key={index} x={ghost.x} y={ghost.y}/>
          ))
        }
      </pixiContainer>

      <Character />

      {/* Background */}
      <Background />
    </pixiContainer>
  );
};

export default Game;