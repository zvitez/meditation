
/*

  Shape Shifter
  =============
  A canvas experiment by Kenneth Cachia
  http://www.kennethcachia.com

  Updated code
  ------------
  https://github.com/kennethcachia/Shape-Shifter 

*/
let Todo = function(myCanvas, todoTitle) {

  let colors = ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C'];
  
  let tap = ('ontouchstart' in window || navigator.msMaxTouchPoints) ? 'touchstart' : 'mousedown';
  let pointerX = 0;
  let pointerY = 0;
  
  function updateCoords(e) {
    pointerX = e.clientX || e.touches[0].clientX;
    pointerY = e.clientY || e.touches[0].clientY;
  }
  
  let updates = 0;
  const XOFFSET = 40;
  const USEWORKERS = true;
  const RESHAPEDURATION = 10000;
  const SWITCHFAST = false;
  const TEXTHEIGHT = 4;
  const ACTION_SPEED = 50;
  const GAPBETWEENPARTICLES = 1;
  const DOTSIZE = 1;
  const FONTSIZE = 30;
  const FONTFAMILY = 'Bison, sans-serif';
  const EASING = "easeInQuint";
  const MAX_PARTICLE_SPEED = 4;
  const MIN_PARTICLE_SPEED = 3;
  let canvasProcessor;
  let switchingShape = true;
  let winding = false;
  let breakingApart = false;
  
  let S = {
    init: function () {
      let action = window.location.href,
          i = action.indexOf('?a=');
  
      S.Drawing.init(myCanvas + " " + '.canvas');
      document.body.classList.add('body--ready');
  
      canvasProcessor = new Worker('/scripts/processCanvas.js');
  
      if (i !== -1) {
        S.UI.simulate(decodeURI(action).substring(i + 3));
      }
  
      S.Drawing.loop(function () {
        S.Shape.render();
      });
    }
  };
  
  
  S.Drawing = (function () {
    let canvas,
        context,
        renderFn,
        imageData,
        shapeCanvas = document.createElement('canvas'),
        shapeContext = shapeCanvas.getContext('2d'),            
        requestFrame = window.requestAnimationFrame       ||
                       window.webkitRequestAnimationFrame ||
                       window.mozRequestAnimationFrame    ||
                       window.oRequestAnimationFrame      ||
                       window.msRequestAnimationFrame     ||
                       function(callback) {
                         window.setTimeout(callback, 1000 / 1000);
                       };
  
  
    function setFontSize(s) {
      //shapeContext.font = 'bold ' + s + 'px ' + FONTFAMILY;
      shapeContext.font = s + 'px ' + FONTFAMILY;
    }

    function isNumber(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }  
  
    function processCanvas () {
      let pixels = shapeContext.getImageData(0, 0, shapeCanvas.width, shapeCanvas.height).data;
      let dots = [],        
            x = 0,
            y = 0,
            fx = shapeCanvas.width,
            fy = shapeCanvas.height,
            w = 0,
            h = 0;
  
      if (window.Worker && USEWORKERS) {      
        canvasProcessor.postMessage([pixels, shapeCanvas.width, shapeCanvas.height]);
        return canvasProcessor;
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
  
          if (x >= canvas.width) {
            x = 0;
            y += 1;        
          }
        } 
  
        return { dots: dots, w: w + fx, h: h + fy };
      }
  
  /*     // create particles
      for (let p = 0; p < pixels.length; p += (4 * GAPBETWEENPARTICLES)) {
        if (pixels[p + 4] > 0) {
          dots.push({
            x: x,
            y: y
          });
  
          w = x > w ? x : w;
          h = y > h ? y : h;
          fx = x < fx ? x : fx;
          fy = y < fy ? y : fy;
        }
  
        x += GAPBETWEENPARTICLES;
  
        if (x >= canvas.width) {
          x = 0;
          y += GAPBETWEENPARTICLES;
          p += GAPBETWEENPARTICLES * TEXTHEIGHT * canvas.width;
        }
      } */
    }
  
    return {
      init: function (el) {      
        canvas = document.querySelector(el);
        context = canvas.getContext('2d');
        this.adjustCanvas();
  
        /*
        let img = new Image();
        img.onload = function() {        
          shapeContext.drawImage(img, 0, 0, 100, 100);
          imageData = shapeContext.getImageData(0, 0, canvas.width, canvas.height);
        };
        img.src = 'elephant3.png';
        */  
  
        let myFont = new FontFace('Bison', 'url(Bison-Bold.ttf)')
        myFont.load().then(function(font){
          // with canvas, if this is ommited won't work
          document.fonts.add(font);
          S.UI.simulate(todoTitle);
        });
  
        window.addEventListener('resize', function (e) {
          S.Drawing.adjustCanvas();
        });
      },
  
      loop: function (fn) {
        renderFn = !renderFn ? fn : renderFn;
        if (switchingShape || winding || breakingApart)
          this.clearFrame();        
        renderFn();
        requestFrame.call(window, this.loop.bind(this));
      },
  
      adjustCanvas: function () {
        canvas.width = window.innerWidth;
        canvas.height = 350;
  
        shapeCanvas.width = canvas.width;
        shapeCanvas.height = canvas.height;
      },
  
      clearFrame: function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
      },
  
      getArea: function () {
        return { w: canvas.width, h: canvas.height };
      },
  
      drawImage: function () {      
        if (imageData != undefined) {
          context.putImageData(imageData, XOFFSET, 0);
        }
      },
  
      drawParticle: function (p, c) {
        context.fillStyle = c.render();
        context.fillRect(p.x, p.y, p.dotSize, p.dotSize);
      },
  
      drawCircle: function (p, c) {      
        context.fillStyle = c.render();
        context.beginPath();
        context.arc(p.x, p.y, p.dotSize, 0, 2 * Math.PI, true);      
        context.closePath();
        context.fill();
      },
  
      letter: function (letter) {
        let s = 0;
  
        setFontSize(FONTSIZE);
        
        /* 
        s = Math.min(FONTSIZE,
                    (canvas.width / context.measureText(letter).width) * 0.8 * FONTSIZE, 
                    (canvas.height / FONTSIZE) * (isNumber(letter) ? 1 : 0.45) * FONTSIZE);
        setFontSize(s); */
        
        shapeContext.clearRect(0, 0, shapeCanvas.width, shapeCanvas.height);
        shapeContext.fillStyle = 'rgba(255, 255, 255, 1)';
        // add a space between letters - 8200 widest, 8203 thinnest
        letter = letter.split("").join(String.fromCharCode(8201)) 
        shapeContext.fillText(letter, XOFFSET, shapeCanvas.height / 2);
        
        
        //this.drawImage();      
        
        return processCanvas();
      },
  
      drawLetter: function (letter) {
        let s = 0;
  
        setFontSize(FONTSIZE);
        
        /* 
        s = Math.min(FONTSIZE,
                    (canvas.width / context.measureText(letter).width) * 0.8 * FONTSIZE, 
                    (canvas.height / FONTSIZE) * (isNumber(letter) ? 1 : 0.45) * FONTSIZE);
        setFontSize(s); */
        
  
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'rgba(255, 255, 255, 1)';
        context.fillText(letter, canvas.width / 2, canvas.height / 2);      
      },          
  
      renderMyParticles: function(anim) {
        for (let i = 0; i < anim.animatables.length; i++) {
          anim.animatables[i].target.renderAnime();
        }
      },
  
      renderParticles: function(anim) {
        for (let i = 0; i < anim.animatables.length; i++) {
          anim.animatables[i].target.draw();
        }
      },
  
      animeUpdate: function() {
        //S.Drawing.clearFrame();
      },
  
      /* f = function name
    - "easeInQuint"
      */
      easingFunction: function (f) {
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
      },
      
    }
  }());
  
  
  S.UI = (function () {
    let overlay = document.querySelector('.overlay'),
        canvas = document.querySelector(myCanvas + " " + '.canvas'),
        deleteButton = document.querySelector(myCanvas + " " + ".checkTaskButton"),
        interval,
        isTouch = false, //('ontouchstart' in window || navigator.msMaxTouchPoints),
        currentAction,
        resizeTimer,
        time,
        maxShapeSize = 30,
        firstAction = true,
        sequence = [],
        cmd = '#';
  
    function formatTime(date) {
      let h = date.getHours(),
          m = date.getMinutes();
      m = m < 10 ? '0' + m : m;
      return h + ':' + m;
    }
  
    function getValue(value) {
      return value && value.split(' ')[1];
    }
  
    function getAction(value) {
      value = value && value.split(' ')[0];
      return value && value[0] === cmd && value.substring(1);
    }
  
    function timedAction(fn, delay, max, reverse) {
      clearInterval(interval);
      currentAction = reverse ? max : 1;
      fn(currentAction);
  
      if (!max || (!reverse && currentAction < max) || (reverse && currentAction > 0)) {
        interval = setInterval(function () {
          currentAction = reverse ? currentAction - 1 : currentAction + 1;
          fn(currentAction);
  
          if ((!reverse && max && currentAction === max) || (reverse && currentAction === 0)) {
            clearInterval(interval);
          }
        }, delay);
      }
    }
  
    function reset(destroy) {
      clearInterval(interval);
      sequence = [];
      time = null;
      destroy && S.Shape.scheduleSwitchShape(S.Drawing.letter(''));
    }
  
    function performAction(value) {
      let action,
          current;
  
      if (value == "breakApart") {            
        S.Shape.breakApart(); 
        /*
        setTimeout(S.Shape.breakApart.bind(S.Shape), 750)
        setTimeout(S.Shape.breakApart.bind(S.Shape), 1000)
        */
      } else {      
        overlay.classList.remove('overlay--visible');
        sequence = typeof(value) === 'object' ? value : sequence.concat(value.split('|'));
  
        timedAction(function (index) {
          current = sequence.shift();
          action = getAction(current);
        
          S.Shape.scheduleSwitchShape(S.Drawing.letter(current[0] === cmd ? 'What?' : current), SWITCHFAST);                
        }, ACTION_SPEED, sequence.length);
      }
    }
  
    function bindEvents() {    
      deleteButton.addEventListener('click', function (e) {
        performAction("breakApart");
      });
    }
  
    function init() {
      bindEvents();
    }
  
    // Init
    init();
  
    return {
      simulate: function (action) {
        performAction(action);
      }
    }
  }());        
  
  S.Color = function (r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  };
  
  S.Color.prototype = {
    render: function () {
      return 'rgba(' + this.r + ',' +  + this.g + ',' + this.b + ',' + this.a + ')';
    }
  };
  
  
  S.Dot = function (x, y, uniqueId, speed = 0.07) {
    this.x = x;
    this.y = y;
    this.dotSize = DOTSIZE;
    this.a = 1;
    this.h = 0;  
  
    this.moving = false;
  
    this.speed = speed; // this is more like Max Speed
    this.s = true;  
  
    this.c = new S.Color(255, 255, 255, this.a);
  
    this.t = this.clone();
    this.target = this.clone();
    this.q = [];
  
    this.id = uniqueId;
    this.moveTime = -1;  
  
    this.xWhenMoveStarted = 0;
    this.yWhenMoveStarted = 0;
    this.timeToLive = 0;
    this.timeToLiveInitial = 0;
  };
  
  S.Dot.prototype = {
    clone: function () {
      return {
        x: this.x,
        y: this.y,
        dotSize: this.dotSize,
        a: this.a,
        h: this.h
      };
    },
  
    _draw: function () {
      this.c.a = this.a;
      S.Drawing.drawParticle({
        x: this.x,
        y: this.y,
        dotSize: this.dotSize,
        a: this.a,
        h: this.h
      },
        this.c);
    },
  
    // absolute progress of animation, 0 to 1
    _currentSpeed: function (animationProgress) {    
      return this.speed - this.speed * S.Drawing.easingFunction("easeInQuint")(animationProgress);
    },
  
    _moveTowards: function (n) {    
      let details = this.distanceTo(n, true),
          dx = details[0],
          dy = details[1],
          d = details[2];
  
      if (winding || breakingApart) {
        if (this.timeToLive <= 0) {
          speed = 0;
          this.x = n.x;
          this.y = n.y
          return true;
        } else {
          let animationProgress = 1 - (this.timeToLive / this.timeToLiveInitial);        
          speed = this._currentSpeed(animationProgress);
          this.timeToLive -= 1;
        }      
      } else {
        speed = this.speed * d;
      }    
  
      if (this.h === -1) {
        this.x = n.x;
        this.y = n.y;
        return true;
      }
  
      if (d > 1) {
        this.x -= ((dx / d) * speed);
        this.y -= ((dy / d) * speed);
      } else {
        if (this.h > 0) {
          this.h--;
        } else {
          return true;
        }
      }
  
      return false;
    },
    
    _debug: function(message) {
      if (this.id === 500)
        console.log(message);
    }, 
  
    distanceTo: function (n, details) {
      let dx = this.x - n.x,
          dy = this.y - n.y,
          d = Math.sqrt(dx * dx + dy * dy);
  
      return details ? [dx, dy, d] : d;
    },
  
    setSpeed: function(speed) {
      this.speed = speed;
    },
  
    setTimeToLive: function(time) {
      this.timeToLiveInitial = time;
      this.timeToLive = time;
    },
  
    setMoveTime: function(moveInSeconds) {
      this.moveTime = moveInSeconds;
    },
  
    move: function (p, avoidStatic) {
      if (!avoidStatic || (avoidStatic && this.distanceTo(p) > 1)) {
        this.q.push(p);
      }
    },
  
    moveWithAnime: function (p) {    
      this.target.x = p.x;
      this.target.y = p.y;
      this.target.a = p.a;
      this.target.dotSize = p.dotSize;
      this.moving = true;
    },
  
    renderAnime: function() {    
      this._draw();
    }
  }
  
  S.Shape = (function () {
    let dots = [],
        width = 0,
        height = 0,
        cx = 0,
        cy = 0;
  
    // adjusts the text to line up in the center, based on text size
    function compensate() {
      let a = S.Drawing.getArea();
  
      //cx = a.w / 2 - width / 2;
      cy = a.h / 2 - height / 2;
    }
  
    function calculateIntersection(p1, p2, p3, p4) {
  
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
  
    function randomBetween(min, max) {
      return Math.random() * (max - min) + min;
    }
  
    return {    
      shake: function(shakeStrength, duration) {
        let keyFrames = [],
          shakeOverTime = shakeStrength;
        
        for (let frame = 0; frame < 120; frame++) {
          keyFrames.push({ 
            //translateX: (shakeOverTime-frame*2) * (frame % 2 ? -1 : 1),
            //translateY: (shakeOverTime-frame*2) * (frame % 2 ? -1 : 1),
            translateX: randomBetween(-shakeOverTime, shakeOverTime),
            translateX: randomBetween(-shakeOverTime, shakeOverTime),
            duration: duration
          })
          shakeOverTime -= shakeStrength / 60;
        }
  
        anime({
          targets: 'body',
          keyframes: keyFrames,        
          easing: 'spring(1, 80, 10, 0)',
        })
      },
  
      breakApart: function() {
        breakingApart = true;                     
        this.shake(2, 5);
  
        dots.sort( function( a , b) {
          if(a.x > b.x) return 1;
          if(a.x < b.x) return -1;
          return 0;
        })
  
        var size,
        area = S.Drawing.getArea();
        
        let currentSet = new Array();
        let leftOverSet = new Array();
        let moveTime = 0;
  
        let timelines = [];
        let timeline;
        
        let duration = 4000;
  
        let estimatedCenterOfWord = XOFFSET + width/2; // = area.w/2 if middle
        
        let distanceFromCenter = FONTSIZE/6.7

        for (let index = 0, currentX = -100; index < dots.length; index++) {                        
          let xFactor = dots[index].x - estimatedCenterOfWord;
  
          // try with and without abs below
          xFactor = Math.abs(xFactor);
          xFactor = (xFactor - xFactor*Math.random()) / 50;
          
          if (Math.abs(parseInt(dots[index].y) + randomBetween(-3, 3) - area.h/2) > distanceFromCenter + distanceFromCenter*xFactor ) {                    
            /*
            dots[index].target.x = dots[index].x;
            dots[index].target.y = dots[index].y;
            */          
            //dots[index].c = new S.Color(0, 0, 0, dots[index].a);
            dots[index].moveWithAnime({
              x: dots[index].x + anime.random(-20, 20),
              y: dots[index].y + anime.random(-20, 20),
              a: 0,            
            });
            leftOverSet.push(dots[index]);
            continue;
          }
                  
          if (dots[index].x > currentX) {
            currentX = dots[index].x;
            timeline = anime.timeline().add({
              targets: currentSet,
              keyframes: [
                {
                  x: function(p) { return p.target.x; },
                  y: function(p) { return p.target.y; },
                  a: function(p) { return p.target.a; },              
                  dotSize: function(p) { return p.target.dotSize; },                
                },
                {
                  a: 0,
                }              
                /*
                { 
                  x: function(p) { return p.target.x + 100; },
                  y: function(p) { return p.target.y + 100; },     
                },
                */
              ],            
              //a: function(p) { return p.moving ? 0 : p.a },
              duration: duration + Math.random()*1000,            
              easing: 'cubicBezier(0.050, 0.900, 0.000, 0.995)',        
              delay: moveTime,
            //},'-=' + 985);
            }).add({
              targets: currentSet,
              keyframes: [
                {
                  a: 0,
                },
              ],            
              //a: function(p) { return p.moving ? 0 : p.a },
              duration: duration + Math.random()*1000,            
              easing: 'cubicBezier(0.050, 0.900, 0.000, 0.995)',        
            //},'-=' + 985);
            }, '-=1985');
  
            timelines.push(timeline);
            currentSet = new Array();
            moveTime += 4;
          }
  
          currentSet.push(dots[index]);
  
          let belowTheFold = dots[index].y - area.h/2 > 0;
          let yIncrement = 25;
          let y = belowTheFold ? area.h/2 + yIncrement : area.h/2 - yIncrement;
          let p1 = { x: 0, y: y };
          let p2 = { x: area.w, y: y };
          
          let p3 = { x: dots[index].x, y: area.h/2 }; 
          let p4 = { x: dots[index].x, y: dots[index].y }
  
          // surround in try catch
          let p;
          try {
            p = calculateIntersection(p1, p2, p3, p4);  // intersection point        
          } catch (error) {
            p = {x: dots[index].x, y: dots[index].y};
          }
          p.x = p.x + randomBetween(-20, 20 + 100*xFactor);
          p.y = p.y + randomBetween(-20 + 50*xFactor , 20 - 50*xFactor);
          
          dots[index].moveWithAnime({
            x: p.x,
            y: p.y,
            a: 1 - Math.random()*0.4,
            dotSize: 1,
            h: 0          
          });
  
          //dots[index].c = new S.Color(255, 230 + randomBetween(-10, 10), 230 + randomBetween(-10, 10), dots[index].a);
          //dots.splice(index, 1);
        }
  
        // animate the parts of the word that weren't broken
        anime.timeline().add({
          targets: leftOverSet,
          keyframes: [
            {            
              x: function(p) { return p.target.x; },              
              y: function(p) { return p.target.y; },            
              a: { 
                value: function(p) { return p.target.a; },
                easing: "easeInOutSine",
              },          
            },
                      
          ],            
          //a: function(p) { return p.moving ? 0 : p.a },
          duration: duration + Math.random()*1000,                    
          easing: 'cubicBezier(0.050, 0.900, 0.000, 0.995)',        
          delay: moveTime,    
        });
  
        timeline = anime.timeline().add({
          targets: currentSet,
          keyframes: [
            {
              x: function(p) { return p.target.x; },
              y: function(p) { return p.target.y; },     
              a: { 
                value: function(p) { return p.target.a; },
                easing: "easeInOutSine",
              },
              dotSize: { 
                value: function(p) { return p.target.dotSize; },
                easing: "easeInOutSine"
              }
            },
            
            /*
            { 
              x: function(p) { return p.target.x + 100; },
              y: function(p) { return p.target.y + 100; },     
            },
            */
          ],            
          //a: function(p) { return p.moving ? 0 : p.a },
          duration: duration + Math.random()*1000,                    
          easing: 'cubicBezier(0.050, 0.900, 0.000, 0.995)',        
          delay: moveTime,    
          update: function(anim) {
  
          }          
        //},'-=' + 985);
        });
        
        timeline.finished.then(() => {
          breakingApart = false;        
          //this.scheduleSwitchShape(S.Drawing.letter('Very very very long todo'))
          setTimeout( ()  => this.scheduleSwitchShape(S.Drawing.letter('Very very very long todo')), 2*1000);
          //setTimeout(this.scheduleSwitchShape.bind(this), 0.001*1000);
        });      
  
        timelines.push(timeline);
  
  
        /*
        .add({
            targets: '.overlay',
            keyframes: [
              { 
                opacity: 1,
                duration: 100,
              },
              { 
                opacity: 0,
                duration: 100,
                delay: 150
              },
            ],
            //a: function(p) { return p.moving ? 0 : p.a },
            easing: 'linear',                
          }, '-=2000').finished.then(() => {
            //breakingApart = false;
            console.log("Done flashing");
           // setTimeout(this.finishBreaking.bind(this), 0.001*1000);
          });
          */
          
      },  
      finishBreaking: function() {      
        //breakingApart = true;                          
  
        dots.sort( function( a , b) {
          if(a.x > b.x) return 1;
          if(a.x < b.x) return -1;
          return 0;
        })
  
        let size,
        area = S.Drawing.getArea();
        
        let timeline = anime.timeline();
        let currentSet = new Array();
        let moveTime = 0;
        
        for (let index = 0, currentX = -100; index < dots.length; index++) {                
          let yIncrement = 200;
          let y = dots[index].y - area.h/2 > 0 ? area.h/2 + yIncrement : area.h/2 - yIncrement;
          let p1 = { x: 0, y: y };
          let p2 = { x: area.w, y: y };
          
          let p3 = { x: dots[index].x, y: area.h/2 }; 
          let p4 = { x: dots[index].x, y: dots[index].y }
  
          // surround in try catch
          let p;
          try {
            p = calculateIntersection(p1, p2, p3, p4);  // intersection point        
          } catch (error) {
            p = {x: dots[index].x, y: dots[index].y};
          }
          p.x = p.x + randomBetween(-20, 20);
          p.y = p.y + randomBetween(-20, 20);
          
          dots[index].moveWithAnime({
            x: Math.random() * area.w + area.w/2,
            y: Math.random() * area.h - 100,
            a: 0,
            dotSize: 0,
            h: 0          
          });
  
          //dots[index].c = new S.Color(255, 230 + randomBetween(-10, 10), 230 + randomBetween(-10, 10), dots[index].a);
          //dots.splice(index, 1);
        }
  
        updates = 0;
        
        anime.timeline().add({
          targets: dots,
          keyframes: [
            {
              x: function(p) { return p.target.x; },
              y: function(p) { return p.target.y; },     
              a: { 
                value: function(p) { return p.target.a; },
                easing: "easeInOutSine",
              },
              dotSize: { 
                value: function(p) { return p.target.dotSize; },
                easing: "easeInOutSine"
              }
            },
            
            /*
            { 
              x: function(p) { return p.target.x + 100; },
              y: function(p) { return p.target.y + 100; },     
            },
            */
          ],            
          //a: function(p) { return p.moving ? 0 : p.a },
          duration: 20000,            
          //easing: 'cubicBezier(0.570, 0.105, 0.010, 0.500)', //good one     
          easing: 'cubicBezier(1.000, 0.045, 0.280, 0.720)',
        //},'-=' + 985);
        }).finished.then(() => {
          //breakingApart = false;
          console.log("Done breaking apart");                
        });
        
      },    
  
      scheduleSwitchShape: function(workerOrData, fast) {
        if (window.Worker && USEWORKERS) {
          workerOrData.onmessage = (e) => {
            console.log("Worker done");
            this.switchShape(e.data);          
          }
        } else {
          switchShape(workerOrData, fast);
        }
      },
  
      switchShape: function (n, fast) {      

        switchingShape = true;
         
        var size,
            a = S.Drawing.getArea();
  
        width = n.w;
        height = n.h;
  
        // align the text with the center of the screen
        compensate();
        //cy = FONTSIZE/2 - 15;
  
        if (n.dots.length > dots.length) {
          size = n.dots.length - dots.length;
          for (var d = 1; d <= size; d++) {
            dots.push(new S.Dot(Math.random()*a.w, Math.random()*a.h, d));
          }
        }
        
        let timelines = [];
        let timeline;
              
        let duration = 1200;
  
        var d = 0,
            i = 0;
        let currentSet = new Array();
        let testing = false;
        if (testing) {
          for (d = 0; d < n.dots.length; d++) {
            dots[d].moveWithAnime({
              x: n.dots[d].x + cx,
              y: n.dots[d].y + cy,          
              a: 1,
              dotSize: 50,
              h: 0          
            });
  
            currentSet.push(dots[d]);
            if (i % 500 == 0) {
              timeline = anime.timeline();
              timelines.push(timeline);
              timeline.add({
                targets: currentSet,
                x: function(p) { return p.target.x; },
                y: function(p) { return p.target.y; },    
                a: 1,    
                dotSize: DOTSIZE, 
                duration: duration,
                easing: 'easeOutExpo',
                //update: S.Drawing.renderMyParticles
              });
              currentSet = new Array();
            }
          } 
        } else {
          while (n.dots.length > 0) {
            i = Math.floor(Math.random() * n.dots.length);        
            dots[d].moveWithAnime({
              x: n.dots[i].x + cx,
              y: n.dots[i].y + cy,          
              a: 1,
              dotSize: 50,
              h: 0          
            });
            n.dots = n.dots.slice(0, i).concat(n.dots.slice(i + 1));
  
            currentSet.push(dots[d]);
            if (d % 500 == 0) {           
              timeline = anime.timeline();
              timelines.push(timeline); 
              timeline.add({
                targets: currentSet,
                x: function(p) { return p.target.x; },
                y: function(p) { return p.target.y; },    
                a: 1,    
                dotSize: DOTSIZE, 
                duration: duration,
                easing: 'easeOutExpo',
                //update: S.Drawing.renderMyParticles
              });
              currentSet = new Array();          
            }
            
            d++;
          }   
        }   
  
        if (currentSet != undefined)
        timeline = anime.timeline();
        timelines.push(timeline);
        timeline.add({
          targets: currentSet,
          x: function(p) { return p.target.x; },
          y: function(p) { return p.target.y; },    
          a: 1,    
          dotSize: DOTSIZE, 
          duration: duration,
          easing: 'easeOutExpo',
          //update: S.Drawing.renderMyParticles
        }).finished.then(() => switchingShape = false);            
  
        /* removes the dots that aren't needed */      
        dots.splice(d);           
      },
  
      render: function () {
        if (switchingShape || winding || breakingApart)       
          for (let d = 0; d < dots.length; d++) {
            dots[d].renderAnime();
          }            
      }
    }
  }());
  
  
  S.init();
  
  };
  
  console.log("hello");
  
  
  