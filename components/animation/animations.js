import anime from 'animejs';
import Utils from './utils';
import { Dot } from "./particleManager";

let Animations = {
  shake: function(shakeStrength, duration) {
    let keyFrames = [],
      shakeOverTime = shakeStrength;
    
    for (let frame = 0; frame < 120; frame++) {
      keyFrames.push({ 
        //translateX: (shakeOverTime-frame*2) * (frame % 2 ? -1 : 1),
        //translateY: (shakeOverTime-frame*2) * (frame % 2 ? -1 : 1),
        translateX: Utils.randomBetween(-shakeOverTime, shakeOverTime),
        translateX: Utils.randomBetween(-shakeOverTime, shakeOverTime),
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

  breakApart: function(dots, area, fontSize, xOffset, width, height, cx, cy) {  
    return new Promise(function(resolve, reject){
      dots.sort( function( a , b) {
        if(a.x > b.x) return 1;
        if(a.x < b.x) return -1;
        return 0;
      })

      let currentSet = new Array();
      let leftOverSet = new Array();
      let moveTime = 0;

      let timelines = [];
      let timeline;
      
      let duration = 4000;

      let estimatedCenterOfWord = xOffset + width/2; // = area.w/2 if middle
      
      let distanceFromCenter = fontSize/6.7;

      for (let index = 0, currentX = -100; index < dots.length; index++) {                        
        let xFactor = dots[index].x - estimatedCenterOfWord;

        // try with and without abs below
        xFactor = Math.abs(xFactor);
        xFactor = (xFactor - xFactor*Math.random()) / 50;
        
        if (Math.abs(parseInt(dots[index].y) + Utils.randomBetween(-3, 3) - area.h/2) > distanceFromCenter + distanceFromCenter*xFactor ) {                    
          /*
          dots[index].target.x = dots[index].x;
          dots[index].target.y = dots[index].y;
          */          
          //dots[index].c = new S.Color(0, 0, 0, dots[index].a);
          dots[index].move({
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
        p.x = p.x + Utils.randomBetween(-20, 20 + 100*xFactor);
        p.y = p.y + Utils.randomBetween(-20 + 50*xFactor , 20 - 50*xFactor);
        
        dots[index].move({
          x: p.x,
          y: p.y,
          a: 1 - Math.random()*0.4,
          dotSize: 1,
          h: 0          
        });

        //dots[index].c = new S.Color(255, 230 + Utils.randomBetween(-10, 10), 230 + Utils.randomBetween(-10, 10), dots[index].a);
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
        resolve();
      });      

      timelines.push(timeline);      
    })
  },

  switchShape: function(n, fast, dots, a, dotSize, width, height, cx, cy, drawing) {
    return new Promise(function(resolve, reject) {    
      if (n.dots.length > dots.length) {
        let size = n.dots.length - dots.length;
        for (var d = 1; d <= size; d++) {
          dots.push(new Dot(Math.random()*a.w, Math.random()*a.h, d, 0.07, drawing));
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
          dots[d].move({
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
              dotSize: dotSize, 
              duration: duration,
              easing: 'easeOutExpo',
            });
            currentSet = new Array();
          }
        } 
      } else {
        while (n.dots.length > 0) {
          i = Math.floor(Math.random() * n.dots.length);        
          dots[d].move({
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
              dotSize: dotSize, 
              duration: duration,
              easing: 'easeOutExpo',
            });
            currentSet = new Array();          
          }
          
          d++;
        }   
      }   

      if (currentSet != undefined) {
        timeline = anime.timeline();
        timelines.push(timeline);
        timeline.add({
          targets: currentSet,
          x: function(p) { return p.target.x; },
          y: function(p) { return p.target.y; },    
          a: 1,    
          dotSize: dotSize, 
          duration: duration,
          easing: 'easeOutExpo',
        }).finished.then(() => resolve());            
      }

      timelines.forEach((timeline) => timeline.speed = 1);

      /* removes the dots that aren't needed */      
      dots.splice(d);   
    })
  }
}

export default Animations;