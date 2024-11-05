import { ComposerComponentProps, FeedComponentProps } from './types';
import './BlockStyles.css'
import { useEffect, useRef, useState } from 'react';
import p5 from 'p5';

const PIZZA_URL = 'https://firebasestorage.googleapis.com/v0/b/seam-social.appspot.com/o/miniappStatic%2FknifeThrow%2FPizza.png?alt=media';
const BALL_URL = 'https://firebasestorage.googleapis.com/v0/b/seam-social.appspot.com/o/miniappStatic%2FknifeThrow%2Fball.png?alt=media';
const DONUT_URL = 'https://firebasestorage.googleapis.com/v0/b/seam-social.appspot.com/o/miniappStatic%2FknifeThrow%2Fdonut.png?alt=media';
const KIWI_URL = 'https://firebasestorage.googleapis.com/v0/b/seam-social.appspot.com/o/miniappStatic%2FknifeThrow%2Fkiwi.png?alt=media';
const KNIFE_URL = 'https://firebasestorage.googleapis.com/v0/b/seam-social.appspot.com/o/miniappStatic%2FknifeThrow%2Fk3.png?alt=media';
const WOOD_URL = 'https://firebasestorage.googleapis.com/v0/b/seam-social.appspot.com/o/miniappStatic%2FknifeThrow%2Fwood.jpg?alt=media';
const PLAY_BUTTON_URL = 'https://firebasestorage.googleapis.com/v0/b/seam-social.appspot.com/o/miniappStatic%2FknifeThrow%2Fplay.png?alt=media';
const RESTART_BUTTON_URL = 'https://firebasestorage.googleapis.com/v0/b/seam-social.appspot.com/o/miniappStatic%2FknifeThrow%2Frestart.png?alt=media';
const SHARE_BUTTON_URL = 'https://firebasestorage.googleapis.com/v0/b/seam-social.appspot.com/o/miniappStatic%2FknifeThrow%2Fshare.png?alt=media';

// https://www.vecteezy.com : Images

interface KnifeGameCanvasProps {
  width: number;
  setImageDataURL: (url: string) => void;
  onSave: () => void;
}

const KnifeGameCanvas = ({ width, setImageDataURL, onSave }: KnifeGameCanvasProps): JSX.Element => {
  const canvasDivRef = useRef<HTMLDivElement>(null)
  const [_, setP5Instance] = useState<p5 | null>(null)
  /**A reference object accessible inside the p5 sketch */
  const p5PassInRef = useRef<KnifeGameCanvasProps>({ width, setImageDataURL, onSave })
  const canvasWidth = width

  /** /start p5 Sketch Code! */
  const sketch = (s: p5) => {
    const state = p5PassInRef;
    let target: Target;
    let knives: Knife[] = [];
    let targetNumber: number = 0;
    let canThrow = true;
    let score = 0;
    let gameOver = false;
    let gameStarted = false;
    let imgTarget: p5.Image[] = [];
    let imgKnife: p5.Image;
    let imgWood: p5.Image;
    let imgPlay: p5.Image;
    let imgRestart: p5.Image;
    let imgShare: p5.Image;
    let targetRotation: boolean = false;

    class Target {
      x: number;
      y: number;
      angle: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.angle = 0;
      }

      update() {
        if (targetRotation) this.angle += 0.02; else this.angle -= 0.02; // Rotate the target infinitely
        if (Math.random() >= 0.99) targetRotation = !targetRotation; // Randomly change rotation direction
        if (Math.random() >= 0.99) targetNumber = Math.floor(Math.random() * 4); // 4 different targets
      }

      display() {
        s.push();
        s.translate(this.x, this.y);
        s.rotate(this.angle);
        let size = [600, 500, 550, 650][targetNumber];
        s.image(imgTarget[targetNumber], 0, 0, size, size);
        s.pop();
      }
    }

    class Knife {
      x: number;
      y: number;
      speed: number;
      paused: boolean;
      attached: boolean;
      angle: number;
      distanceFromCenter: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.speed = 15;
        this.paused = false;
        this.attached = false;
        this.angle = 0;
        this.distanceFromCenter = 0;
      }

      update() {
        if (!this.paused) {
          this.y -= this.speed;
        } else if (this.attached) {
          let currentAngle = this.angle + target.angle;
          this.x = target.x + this.distanceFromCenter * s.cos(currentAngle);
          this.y = target.y + this.distanceFromCenter * s.sin(currentAngle);
        }
      }

      display() {
        s.push();
        s.translate(this.x, this.y);
        if (this.attached) {
          s.rotate(this.angle + target.angle - Math.PI / 2);
        }
        s.rotate(- Math.PI / 4);
        s.image(imgKnife, 0, 0, 70, 70);
        s.pop();
      }

      hits(target: Target) {
        let d = s.dist(this.x, this.y, target.x, target.y);
        return d < 275; // Collision detection with the target
      }

      hitsAnotherKnife(knives: Knife[]) {
        for (let other of knives) {
          if (other !== this) {
            let d = s.dist(this.x, this.y, other.x, other.y);
            if (d < 10) { // Collision detection with another knife
              return true;
            }
          }
        }
        return false;
      }

      pause() {
        this.paused = true;
      }

      attachToTarget(target: Target) {
        this.paused = true;
        this.attached = true;
        this.angle = s.atan2(this.y - target.y, this.x - target.x) - target.angle;
        this.distanceFromCenter = s.dist(this.x, this.y, target.x, target.y);
      }
    }

    s.preload = () => {
      let targetImgs = [PIZZA_URL, BALL_URL, DONUT_URL, KIWI_URL];
      targetImgs.forEach((img, i) => imgTarget[i] = s.loadImage(img));
      imgKnife = s.loadImage(KNIFE_URL);
      imgWood = s.loadImage(WOOD_URL);
      imgPlay = s.loadImage(PLAY_BUTTON_URL);
      imgRestart = s.loadImage(RESTART_BUTTON_URL);
      imgShare = s.loadImage(SHARE_BUTTON_URL);
    }
    
    s.setup = () => {
      // Create the canvas
      let initCanva = s.createCanvas(canvasWidth, 700);
       s.imageMode(s.CENTER);
      // Initialize the target
      target = new Target(s.width / 2, s.height / -10);
      // Font
      s.textFont("cursive");
      initCanva.mouseClicked(clickButton);
    }
    
    s.draw = () => {
      // Clear the canvas
      s.clear();
      // Display the wood background
      s.image(imgWood, s.width / 2, s.height, s.width, s.height * 2);

      // Draw the shadow
      let ctx = s.drawingContext; // Access the 2D context
      ctx.shadowOffsetX = 5;    // Horizontal shadow offset
      ctx.shadowOffsetY = 5;    // Vertical shadow offset
      ctx.shadowBlur = 10;      // Shadow blur radius
      ctx.shadowColor = 'rgba(0, 0, 0, .5)'; // Shadow color

      // Display the game elements
      if (!gameStarted) {

        // Main Menu
        s.fill(255, 236, 161, 200);
        s.textSize(12);
        s.text('Images : Vecteezy.com', s.width - 70, s.height - 15);
        s.fill(255, 236, 161);
        s.textSize(64);
        s.textAlign(s.CENTER, s.CENTER);
        s.text('Knive Throw', s.width / 2, s.height / 2 - 150);

        // Play button
        if (s.dist(s.width / 2, s.height / 2, s.mouseX, s.mouseY) < 50) {
          s.image(imgPlay, s.width / 2, s.height / 2, 105, 105);
        } else {
          s.image(imgPlay, s.width / 2, s.height / 2, 100, 100);
        }

      } else if (!gameOver) {

        // Display all the knives
        for (let knife of knives) {
          knife.update();
          knife.display();
          if (knife.hits(target)) {
            knife.attachToTarget(target);
          }
          if (knife.hitsAnotherKnife(knives)) {
            gameOver = true;
          }
        }

        // Update and display the target
        target.update();
        target.display();

        // Score text
        s.fill(255, 236, 161);
        s.textSize(40);
        s.textAlign(s.CENTER, s.CENTER);
        s.text('Score: ' + score, s.width / 2, s.height - 20);
      } else {
        // Display all the knives and the target
        for (let knife of knives) knife.display();
        target.display();

        // Game Over and Score text
        s.fill(255, 236, 161);
        s.textAlign(s.CENTER, s.CENTER);
        s.textSize(32);
        s.text('Game Over', s.width / 2, s.height / 2 - 250);
        s.textSize(64);
        s.text('Score: ' + score, s.width / 2, s.height / 2);

        // Restart button
        let restartX = s.width / 2;
        let restartY = s.height / 2 + 150;
        if (s.dist(restartX, restartY, s.mouseX, s.mouseY) < 55) {
          s.image(imgRestart, restartX, restartY, 110, 110);
        } else {
          s.image(imgRestart, restartX, restartY, 100, 100);
        }

        // Share button 
        let shareX = s.width / 2;
        let shareY = s.height / 2 + 250;
        if (s.dist(shareX, shareY, s.mouseX, s.mouseY) < 35) {
          s.image(imgShare, shareX, shareY, 75, 65);
        } else {
          s.image(imgShare, shareX, shareY, 70, 60);
        }
      }
    }


    const clickButton = () => {
      // Handle the mouse click
      if (!gameStarted) {
        // Start the game
        if (s.dist(s.width / 2, s.height / 2, s.mouseX, s.mouseY) < 50) gameStarted = true;
      } else if (canThrow && !gameOver) {
        // Throw a knife
        score++;
        let knife = new Knife(s.width / 2, s.height - 50);
        knives.push(knife);
        canThrow = false;
        setTimeout(() => canThrow = true, 200);
      } else if (gameOver) {
        // Restart the game
        if (s.dist(s.width / 2, s.height / 2 + 150, s.mouseX, s.mouseY) < 35) resetGame();
        if (s.dist(s.width / 2, s.height / 2 + 250, s.mouseX, s.mouseY) < 35) saveDataToSeamModel();
      }
    }

    const resetGame = () => {
      // Reset the game
      knives = [];
      canThrow = true;
      score = 0;
      gameOver = false;
    }

    const saveDataToSeamModel = () => {
      // Save the score
      const canvas: HTMLCanvasElement = s.drawingContext.canvas;
      const imageData = canvas.toDataURL();
      state.current.setImageDataURL(imageData);
      state.current.onSave();
    }
  }
  /** /end p5 Sketch Code! */

  /**Passes information in to the p5 context through ref */
  useEffect(() => { p5PassInRef.current = { width, setImageDataURL, onSave } }, [width, setImageDataURL, onSave])

  useEffect(() => {
    const myP5: p5 = new p5(sketch, canvasDivRef.current!);
    setP5Instance(myP5);
    return myP5.remove;
  }, []);

  return (
    <>
      <div className="flex justify-center touch-none w-full h-full" ref={canvasDivRef}></div>
    </>
  )
}

// _________________________________________________________________________________________________________________________


export const KnifeFeedComponent = ({ model }: FeedComponentProps) => {
  return (
    <>
      {model.data["imageData"] ?
        <img src={model.data["imageData"]} alt="Score" className='w-full object-contain'></img> :
        <div className="h-14 p-4 text-red-600 bg-red-100">Play Atleast 1 game to view score.</div>}
    </>
  );
}

export const KnifeComposerComponent = ({ model, done }: ComposerComponentProps) => {
  //s.to be called inside p5 sketch to save current canvas contents using HTMLCanvas.toDataU = () => )
  const setImageDataURL = (imageDataURL: string) => model.data["imageData"] = imageDataURL;
  return (
    <div className='flex flex-col items-center w-full select-none'>
      <KnifeGameCanvas
        width={500}
        setImageDataURL={setImageDataURL}
        onSave={() => done(model)}
      />
    </div>
  )
}