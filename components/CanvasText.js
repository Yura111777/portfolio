import { useRef, useState, useEffect } from "react";

const CanvasText = () => {
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
    const textElement = document.querySelector(".folder-title");
    ctx = c.getContext("2d");
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    let particleArray = [];
    let adjustX = 0;
    let adjustY = -77;
    let gradient = ctx.createLinearGradient(0, 0, c.width, c.height);
    gradient.addColorStop(0, "red");
    gradient.addColorStop(0.2, "yellow");
    gradient.addColorStop(0.4, "green");
    gradient.addColorStop(0.6, "cyan");
    gradient.addColorStop(0.8, "blue");
    gradient.addColorStop(1, "magenta");
    const mouse = {
      x: null,
      y: null,
      radius: 100,
    };

    window.addEventListener("mousemove", function (e) {
      mouse.x = e.x;
      mouse.y = e.y;
    });

    ctx.fillStyle = "#fff";
    ctx.font = "bold 10px Arial";
    ctx.textAlign = 'center'
    let sizeX = window.innerWidth > 800 ? 9 : 3
    ctx.fillText("FULL STACK DEVELOPER", c.width/2/sizeX, 100);
    const textCoordinates = ctx.getImageData(0, 0, c.width, c.height);
    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = window.innerWidth > 800 ? 3 : 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = Math.random() * 30 + 1;
      }
      draw(color = '#fff') {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
      update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dx / distance;
        let maxDitance = mouse.radius;
        let force = (maxDitance - distance) / maxDitance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;
        if (distance < mouse.radius) {
          this.x -= directionX;
          this.y -= directionY;
          this.draw(gradient)
        } else {
          if (this.x !== this.baseX) {
            let dx = this.x - this.baseX;
            this.x -= dx / 10;
          }
          if (this.y !== this.baseY) {
            let dy = this.y - this.baseY;
            this.y -= dy / 10;
          }
        }
      }
    }

    const init = () => {
      particleArray = [];

      for (let y = 0, y2 = textCoordinates.height; y < y2; y++) {
        for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {
          if (
            textCoordinates.data[y * 4 * textCoordinates.width + x * 4 + 3] >
            128
          ) {
            let positionX = x + adjustX;
            let positionY = y + adjustY;
            let sizeX = window.innerWidth > 800 ? 9 : 3
            let sizeY = window.innerWidth > 800 ? 20 : 10
            particleArray.push(new Particle(positionX * sizeX, positionY * sizeY));
          }
        }
      }
    };
    init();
   

    const animate = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].draw();
        particleArray[i].update();
      }
      connect()
      requestAnimationFrame(animate);
    };
    animate();

    function connect () {
      let opacityValue = 1;
      let distanceSize = window.innerWidth > 800 ? 20 : 10
      for (let a = 0; a < particleArray.length; a++) {
        for (let b = a; b < particleArray.length; b++) {
         let dx = particleArray[a].x - particleArray[b].x;
         let dy = particleArray[a].y - particleArray[b].y;
         let distance = Math.sqrt(dx*dx + dy*dy);
          
         if(distance < distanceSize){
          opacityValue = 0.5;
          ctx.strokeStyle=`rgba(255,255,255, ${opacityValue})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particleArray[a].x, particleArray[a].y);
          ctx.lineTo(particleArray[b].x, particleArray[b].y);
          ctx.stroke()
          
         }
          
        }
      }
    }
  }

  return <canvas className="canvas-text" ref={canvas}></canvas>;
};

export default CanvasText;
