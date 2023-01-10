import anime from 'animejs';
import Animations from './animations';
import Utils from './utils.js';

/*

  Based on A canvas experiment by Kenneth Cachia http://www.kennethcachia.com
  https://github.com/kennethcachia/Shape-Shifter 

*/

const XOFFSET = 40;
const USEWORKERS = true;
const RESHAPEDURATION = 10000;
const SWITCHFAST = false;
const TEXTHEIGHT = 4;
const GAPBETWEENPARTICLES = 1;
const DOTSIZE = 1;
const FONTSIZE = 30;
const FONTFAMILY = 'Bison, sans-serif';
const EASING = "easeInQuint";
const MAX_PARTICLE_SPEED = 4;
const MIN_PARTICLE_SPEED = 3;

class ParticleManager {
  constructor(myCanvas, todoTitle) {
    this.canvasProcessor = new Worker('/scripts/processCanvas.js');      
    
    this.switchingShape = true;
    this.winding = false;
    this.breakingApart = false;

    this.todoTitle = todoTitle;
    this.drawing = new Drawing(myCanvas + " " + '.canvas', this);
    this.shape = new Shape(this);
    
    let deleteButton = document.querySelector(myCanvas + " " + ".checkTaskButton");
    deleteButton.addEventListener('click', function (e) {
      this.performAction("breakApart");
    }.bind(this));

    document.body.classList.add('body--ready');
    
    let myFont = new FontFace('Bison', 'url(Bison-Bold.ttf)')
    myFont.load().then(function(font){
      // with canvas, if this is ommited won't work
      document.fonts.add(font);      
      this.performAction(todoTitle);
    }.bind(this));

    this.drawing.loop(function () {
      this.shape.render();
    }.bind(this));
  }                  
  
  performAction(value) {          
    if (value == "breakApart") {            
      this.shape.breakApart();         
    } else {           
      this.shape.scheduleSwitchShape(this.drawing.letter(value), SWITCHFAST)                
    }
  }  
}

class Drawing {
  constructor(element, particleManager) {
    this.particleManager = particleManager;
    this.canvas = document.querySelector(element);
    this.canvasProcessor = particleManager.canvasProcessor;
    this.context;
    this.renderFn = undefined;
    this.imageData;
    this.shapeCanvas = document.createElement('canvas');
    this.shapeContext = this.shapeCanvas.getContext('2d');
    this.requestFrame = window.requestAnimationFrame ||
                  window.webkitRequestAnimationFrame ||
                  window.mozRequestAnimationFrame    ||
                  window.oRequestAnimationFrame      ||
                  window.msRequestAnimationFrame     ||
                  function(callback) {
                    window.setTimeout(callback, 1000 / 1000);
                  }; 
    this.context = this.canvas.getContext('2d');
    this.adjustCanvas();  

    window.addEventListener('resize', function (e) {
      this.adjustCanvas();
    });
  }    

  setFontSize(s) {
    //shapeContext.font = 'bold ' + s + 'px ' + FONTFAMILY;
    this.shapeContext.font = s + 'px ' + FONTFAMILY;
  }

  processCanvas() {
    let pixels = this.shapeContext.getImageData(0, 0, this.shapeCanvas.width, this.shapeCanvas.height).data;
    let dots = [],        
          x = 0,
          y = 0,
          fx = this.shapeCanvas.width,
          fy = this.shapeCanvas.height,
          w = 0,
          h = 0;

    if (window.Worker && USEWORKERS) {      
      this.canvasProcessor.postMessage([pixels, this.shapeCanvas.width, this.shapeCanvas.height]);
      return this.canvasProcessor;
    } else {            
      for (let p = 0; p < pixels.length; p += 4) {
        if (pixels[p] > 0) {        
          dots.push({
            x: x,
            y: y
          });
          
          w = x > w ? x : w;
          h = y > h ? y : h;
          fx = x < fx ? x : fx;
          fy = y < fy ? y : fy;
        }
        
        x += 1;              

        if (x >= this.canvas.width) {
          x = 0;
          y += 1;        
        }
      } 

      return { dots: dots, w: w + fx, h: h + fy };
    }
  }

  loop(fn) {
    this.renderFn = !this.renderFn ? fn : this.renderFn;
    if (this.particleManager.switchingShape || this.particleManager.winding || this.particleManager.breakingApart)
      this.clearFrame();        
    this.renderFn();
    this.requestFrame.call(window, this.loop.bind(this));
  }

  adjustCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = 350;

    this.shapeCanvas.width = this.canvas.width;
    this.shapeCanvas.height = this.canvas.height;
  }

  clearFrame() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  getArea() {
    return { w: this.canvas.width, h: this.canvas.height };
  }

  drawImage() {      
    if (this.imageData != undefined) {
      this.context.putImageData(this.imageData, XOFFSET, 0);
    }
  }

  drawParticle(p, c) {
    this.context.fillStyle = c.render();
    this.context.fillRect(p.x, p.y, p.dotSize, p.dotSize);
  }     

  letter(letter) {
    //setFontSize(FONTSIZE);        
    
    let s = Math.min(FONTSIZE,
                (this.canvas.width / this.context.measureText(letter).width) * 0.8 * FONTSIZE, 
                (this.canvas.height / FONTSIZE) * (Utils.isNumber(letter) ? 1 : 0.45) * FONTSIZE);
    this.setFontSize(s); 
    
    this.shapeContext.clearRect(0, 0, this.shapeCanvas.width, this.shapeCanvas.height);
    this.shapeContext.fillStyle = 'rgba(255, 255, 255, 1)';
    // add a space between letters - 8200 widest, 8203 thinnest
    letter = letter.split("").join(String.fromCharCode(8201)) 
    this.shapeContext.fillText(letter, XOFFSET, this.shapeCanvas.height / 2);
    
    
    //this.drawImage();      
    
    return this.processCanvas();
  }     
          
  /* f = function name
  - "easeInQuint"
  */
  easingFunction(f) {
    // The letiable x represents the absolute progress of the animation in the bounds of
    // 0 (beginning of the animation) and 1 (end of animation).
    switch(f) {
      case "easeInQuint":
        return (x) => { 
          return x * x * x * x * x;
        }
        break;
      default: 
        return (x) => { 
          return x * x * x * x * x;
        }
    }  
  }
}

class Color {
  constructor (r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  };

  render() {
    return 'rgba(' + this.r + ',' +  + this.g + ',' + this.b + ',' + this.a + ')';
  }
}

export class Dot {
  constructor (x, y, uniqueId, speed = 0.07, drawing) {
    this.drawing = drawing;
    this.x = x;
    this.y = y;
    this.dotSize = DOTSIZE;
    this.a = 1;
    this.h = 0;  
  
    this.moving = false;
  
    this.speed = speed; // this is more like Max Speed
    this.s = true;  
  
    this.c = new Color(255, 255, 255, this.a);
  
    this.t = this.clone();
    this.target = this.clone();
    this.q = [];
  
    this.id = uniqueId;
    this.moveTime = -1;    
  }

  clone() {
    return {
      x: this.x,
      y: this.y,
      dotSize: this.dotSize,
      a: this.a,
      h: this.h
    };
  }

  _draw() {    
    this.c.a = this.a;
    this.drawing.drawParticle({
      x: this.x,
      y: this.y,
      dotSize: this.dotSize,
      a: this.a,
      h: this.h
    },
      this.c);
  }    
  
  _debug(message) {
    if (this.id === 500)
      console.log(message);
  } 

  distanceTo(n, details) {
    let dx = this.x - n.x,
        dy = this.y - n.y,
        d = Math.sqrt(dx * dx + dy * dy);

    return details ? [dx, dy, d] : d;
  }

  setSpeed(speed) {
    this.speed = speed;
  }

  setMoveTime(moveInSeconds) {
    this.moveTime = moveInSeconds;
  }

  move(p, avoidStatic) {
    this.target.x = p.x;
    this.target.y = p.y;
    this.target.a = p.a;
    this.target.dotSize = p.dotSize;
    this.moving = true;
  }      

  renderAnime() {    
    this._draw();
  }
}



class Shape {
  constructor(particleManager) {
    this.dots = [];
    this.width = 0;
    this.height = 0;
    this.cx = 0;
    this.cy = 0;
    this.particleManager = particleManager;
    this.drawing = particleManager.drawing;
    this.rendered = false;
  }

  // adjusts the text to line up in the center, based on text size
  compensate() {
    let a = this.drawing.getArea();

    //cx = a.w / 2 - width / 2;
    this.cy = a.h / 2 - this.height / 2;
  }

  calculateIntersection(p1, p2, p3, p4) {    
    let c2x = p3.x - p4.x; // (x3 - x4)
    let c3x = p1.x - p2.x; // (x1 - x2)
    let c2y = p3.y - p4.y; // (y3 - y4)
    let c3y = p1.y - p2.y; // (y1 - y2)
  
    // down part of intersection point formula
    let d  = c3x * c2y - c3y * c2x;
  
    if (d == 0) {
      // placed breakpoint here to analyze this issue
      //debugger;
      throw new Error('Number of intersection points is zero or infinity.');
    }
  
    // upper part of intersection point formula
    let u1 = p1.x * p2.y - p1.y * p2.x; // (x1 * y2 - y1 * x2)
    let u4 = p3.x * p4.y - p3.y * p4.x; // (x3 * y4 - y3 * x4)
  
    // intersection point formula
    
    let px = (u1 * c2x - c3x * u4) / d;
    let py = (u1 * c2y - c3y * u4) / d;
    
    let p = { x: px, y: py };
  
    return p;
  }    

  shake(shakeStrength, duration) {    
    Animations.shake(shakeStrength, duration);
  }

  breakApart() {
    this.particleManager.breakingApart = true;                     
    this.shake(2, 5);
    Animations.breakApart(this.dots, this.drawing.getArea(), FONTSIZE, XOFFSET, this.width, this.height, this.cx, this.cy)
    .then(function() {
      this.particleManager.breakingApart = false
    }.bind(this));        
  }  
       
  scheduleSwitchShape(workerOrData, fast) {
    if (window.Worker && USEWORKERS) {
      workerOrData.onmessage = function(e) {
        this.switchShape(e.data, fast);          
      }.bind(this);
    } else {        
      this.switchShape(workerOrData, fast);
    }
  }

  switchShape(n, fast) {      
    this.particleManager.switchingShape = true;  
    this.width = n.w;
    this.height = n.h;
    this.compensate();

    Animations.switchShape(n, fast, this.dots, this.drawing.getArea(), DOTSIZE, this.width, this.height, this.cx, this.cy, this.drawing)    
    .then(function() {
      this.particleManager.switchingShape = false
    }.bind(this));                 
  }

  render() {
    if (!this.rendered) {
      this.rendered = true;
    }
    if (this.particleManager.switchingShape || this.particleManager.winding || this.particleManager.breakingApart)       
      for (let d = 0; d < this.dots.length; d++) {
        this.dots[d].renderAnime();
      }            
  }
}
  
export default ParticleManager;
  