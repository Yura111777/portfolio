import { useRef, useState, useEffect } from "react";

const Canvas = () => {
  const canvas = useRef();
  const [c, setFolderCanvas] = useState(false);
  useEffect(() => {
    setFolderCanvas(canvas.current);
    return () => {
      setFolderCanvas(false);
    };
  }, []);

  let ctx;
  if (c) {
    ctx = c.getContext("2d");
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    let gradient = ctx.createLinearGradient(0, 0, c.width, c.height);
    gradient.addColorStop(0, "red");
    gradient.addColorStop(0.2, "yellow");
    gradient.addColorStop(0.4, "green");
    gradient.addColorStop(0.6, "cyan");
    gradient.addColorStop(0.8, "blue");
    gradient.addColorStop(1, "magenta");

    class Symbol {
      constructor(x, y, fontSize, canvasHeight) {
        this.characters =
          "ぁあぃいぅうぇえぉおかがきぎくぐけげこごさざしじすずせぜそぞただちぢっつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもゃやゅゆょよらりるれろゎわゐゑをんゔゕゖ゚゛゜ゝゞゟ゠ァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロヮワヰヱヲンヴヵヶヷヸヹヺ・ーヽヾヿ㍐㍿1234567890";
        this.x = x;
        this.y = y;
        this.fontSize = fontSize;
        this.text = "";
        this.canvasHeight = canvasHeight;
      }
      draw(context) {
        this.text = this.characters.charAt(
          Math.floor(Math.random() * this.characters.length)
        );
        context.fillText(
          this.text,
          this.x * this.fontSize,
          this.y * this.fontSize
        );
        if (
          this.y * this.fontSize > this.canvasHeight &&
          Math.random() > 0.98
        ) {
          this.y = 0;
        } else {
          this.y += 1;
        }
      }
    }

    class Effect {
      constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.fontSize = 25;
        this.columns = this.canvasWidth / this.fontSize;
        this.symbol = [];
        this.#init();
      }
      #init() {
        for (let i = 0; i < this.columns; i++) {
          this.symbol[i] = new Symbol(i, 0, this.fontSize, this.canvasHeight);
        }
      }
      resize(width, height) {
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.columns = this.canvasWidth / this.fontSize;
        this.symbol = [];
        this.#init();
      }
    }

    const effect = new Effect(c.width, c.height);
    let lastTime = 0;
    const fps = 30;
    const nextFrame = 1000 / fps;
    let timer = 0;

    const animate = (timeStamp) => {
      const deltaTime = timeStamp - lastTime;
      lastTime = timeStamp;
      if (timer > nextFrame) {
        ctx.fillStyle = "rgba(0,0,0,.05)";
        ctx.textAlign = "center";
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.fillStyle = gradient; //'#0aff0a';
        ctx.font = effect.fontSize + "px monospace";
        effect.symbol.forEach((symbal) => symbal.draw(ctx));
        timer = 0;
      } else {
        timer += deltaTime;
      }
      requestAnimationFrame(animate);
    };
    animate(0);

    window.addEventListener("resize", function () {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
      effect.resize(c.width, c.height);
      gradient = ctx.createLinearGradient(0, 0, c.width, c.height);
      gradient.addColorStop(0, "red");
      gradient.addColorStop(0.2, "yellow");
      gradient.addColorStop(0.4, "green");
      gradient.addColorStop(0.6, "cyan");
      gradient.addColorStop(0.8, "blue");
      gradient.addColorStop(1, "magenta");
    });
  }

  return <canvas className="canvas" ref={canvas}></canvas>;
};

export default Canvas;
