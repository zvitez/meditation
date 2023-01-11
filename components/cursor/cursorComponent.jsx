import { useState, useEffect, useRef } from 'react'
import cx from 'classnames'

import styles from './CursorComponent.module.scss'
import Animator from '../particles/animationManager';

const Cursor = ( {} ) => {
  
  function onInactive(ms, cb) {
    var wait = setTimeout(cb, ms);
    document.onmousemove = document.mousedown = document.mouseup = document.onkeydown = document.onkeyup = document.focus = function () {
        clearTimeout(wait);
        Animator.fadeIn(".cursor__ball", 1000, 0);
        wait = setTimeout(cb, ms);
    };
  }

  useEffect(() => {        
    const $bigBall = document.querySelector('.cursor__ball--big');
    const $smallBall = document.querySelector('.cursor__ball--small');
    const $hoverables = document.querySelectorAll('.hoverable');

    // Listeners
    document.body.addEventListener('mousemove', onMouseMove);
    for (let i = 0; i < $hoverables.length; i++) {
      $hoverables[i].addEventListener('mouseenter', onMouseHover);
      $hoverables[i].addEventListener('mouseleave', onMouseHoverOut);
    }

    // Move the cursor
    function onMouseMove(e) {
      TweenMax.to($bigBall, .4, {
        x: e.pageX - 15,
        y: e.pageY - 15
      })
      TweenMax.to($smallBall, .1, {
        x: e.pageX - 5,
        y: e.pageY - 7
      })
    }

    // Hover an element
    function onMouseHover() {
      TweenMax.to($bigBall, .3, {
        scale: 4
      })
    }
    function onMouseHoverOut() {
      TweenMax.to($bigBall, .3, {
        scale: 1
      })
    }

    TweenMax.to($bigBall, .4, {
      x: window.innerWidth/2,
      y: window.innerHeight/2
    })
    TweenMax.to($smallBall, .1, {
      x: window.innerWidth/2,
      y: window.innerHeight/2
    })

    Animator.fadeIn(".cursor__ball", 1000, 2000);

    onInactive(5000, function () {
      console.log("inactive");
      Animator.fadeOut(".cursor__ball", 1000, 0);
    });
  }, []);

  return (
    <>
      <div className={styles.cursor}>
        <div className={cx("cursor__ball", "cursor__ball--big", styles.cursor__ball, styles["cursor__ball--bif"])}>
          <svg height="30" width="30">
            <circle className={styles['cursor__ball-circle']} cx="15" cy="15" r="12" strokeWidth="0"></circle>
          </svg>
        </div>        
        <div className={cx("cursor__ball", "cursor__ball--small", styles.cursor__ball, styles["cursor__ball--small"])}>
          <svg height="10" width="10">
            <circle className={styles['cursor__ball-circle']} cx="5" cy="5" r="4" strokeWidth="0"></circle>
          </svg>
        </div>
      </div>
      <script async src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.20.3/TweenMax.min.js"></script>
    </>
  );

}

export default Cursor;