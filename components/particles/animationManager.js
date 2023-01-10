import { createNoise2D } from "simplex-noise";
import anime from 'animejs';
import Utils from './utils';

let Animator = {
  init: function() {
    anime.suspendWhenDocumentHidden = false; // default true
  },

  fadeOut: function(target, duration, fadeOutDelay) {           
    if (target) 
      anime({
        targets: target,
        keyframes: [
          { 
            opacity: 0,
            duration: duration,
            delay: fadeOutDelay,
          }
        ],    
        easing: 'linear',
      })
  },

  fadeOutIn: function(target, duration, fadeInDelay, fadeOutDelay) {           
    Animator.init();
    if (target) 
      anime({
        targets: target,
        keyframes: [
          { 
            opacity: 0,
            duration: duration,
            delay: fadeInDelay,
          },
          { 
            opacity: 1,            
            delay: fadeOutDelay - (duration*2 + fadeInDelay),
            duration: duration,
          },
        ],    
        easing: 'linear',
      })
  },

  fadeInOut: function(target, duration, fadeInDelay, fadeOutDelay) {           
    Animator.init();
    if (target) 
      anime({
        targets: target,
        keyframes: [
          { 
            opacity: 1,
            duration: duration,
            delay: fadeInDelay,
          },
          { 
            opacity: 0,            
            delay: fadeOutDelay - (duration + fadeInDelay),
            duration: duration,
          },
        ],    
        easing: 'linear',
      })
  },

  fadeIn: function(target, duration, delay, display = "block") {     
    Animator.init();  
    if (target) 
      //target.style.display = display;
      anime({
        targets: target,        
        opacity: 1,      
        easing: 'linear',
        delay: delay,
        duration: duration
      })
  },

  smoothTranslation: function(target, xProperty, xChange, yProperty, yChange, duration, easeFunction) {    
    let keyFrames = [];
    Animator.init();
    for (let frame = 0; frame < 1; frame++) {
      let keyFrame = {
        duration: duration,
        easing: easeFunction,
      };

      if (xProperty != "") 
        keyFrame[xProperty] = xChange;
      if (yProperty != "")
        keyFrame[yProperty] = yChange;

      keyFrames.push(keyFrame)
    }

    anime({
      targets: target,
      keyframes: keyFrames,        
      easing: 'linear',
    })      
  },

  animateImage: function(target, xChange, yChange) {
    Animator.init();
    setTimeout( function() {
      let keyFrames = [];
    
      for (let frame = 0; frame < 1; frame++) {
        keyFrames.push({         
          "background-position-x": `${xChange}%`,
          "background-position-y": `${yChange}%`,
          duration: 1000,
          easing: "steps(1)",
        })
      }

      anime({
        targets: target,
        keyframes: keyFrames,        
        easing: 'linear',
      })  
    }, 1000)    
  },

  smoothTranslationWithNoise: function(target) {
    const noise2D = createNoise2D();

    let noiseStep = 0.005;
    let location = {
      originX: 0,
      originY: 0,
      x: 0,
      y: 0,
      noiseOffsetX: 0,
      noiseOffsetY: 0,
    }

    let keyFrames = [];
    
    for (let frame = 0; frame < 60; frame++) {

      // return a pseudo random value between -1 / 1 based on this point's current x, y positions in "time"
      const nX = noise2D(location.noiseOffsetX, location.noiseOffsetX);
      const nY = noise2D(location.noiseOffsetY, location.noiseOffsetY);

      // map this noise value to a new value, somewhere between it's original location -20 and it's original location + 20
      const x = Utils.map(nX, -1, 1, location.originX - 1500, location.originX + 1500);
      const y = Utils.map(nY, -1, 1, location.originY - 1500, location.originY + 1500);

      // update the point's current coordinates
      location.x = x;
      location.y = y;

      // progress the point's x, y values through "time"
      location.noiseOffsetX += noiseStep;
      location.noiseOffsetY += noiseStep;

      keyFrames.push({ 
        //translateX: (shakeOverTime-frame*2) * (frame % 2 ? -1 : 1),
        //translateY: (shakeOverTime-frame*2) * (frame % 2 ? -1 : 1),
        translateX: location.x,
        translateY: location.y,
        duration: 10000,
      })
    }

    anime({
      targets: target,
      keyframes: keyFrames,        
      easing: 'spring(1, 80, 10, 0)',
    })  
  }
}

export default Animator;