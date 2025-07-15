import { useCallback } from "react";
import { useApplication } from "@pixi/react";


const Graphic = () => {

  const { app } = useApplication();
  console.log(app);

  const drawCallback = useCallback((graphics: any) => {
    graphics.clear()
    graphics.setFillStyle({ color: "red" })
    graphics.rect(0, 0, 100, 100)
    graphics.fill()
  }, []);

  return (
    <pixiGraphics
      // draw 的 callback 會在每次 tick 的時候重新執行進行繪製
      draw={drawCallback}
    />
  );
};

export default Graphic;