import styles from './ThoughtComponent.module.scss'
import React, { useState, useEffect, useRef } from 'react'
import cx from 'classnames'
import { Montserrat, Raleway, Barlow } from '@next/font/google'
import Animator from './particles/animationManager';

const lato = Barlow({ 
  subsets: ['latin'],
  weight: '300'
});

const Thoughts = ({ thoughts, totalDurationPerChunk }) => {
  const [thought, setThought] = useState(null);
  const [thoughtChunks, setThoughtChunks] = useState([]);
  const [thoughtName, setThoughtName] = useState("");
  const thoughtId = useRef(0);

  let slideUp = (target, duration=500, opacityDuration=500, opacityDelay=0) => {
    target.style.transition = `
                              opacity ${opacityDuration}ms ${opacityDelay}ms,
                              height ${duration}ms 0ms,
                              margin ${duration}ms 0ms,
                              padding ${duration}ms 0ms`;
    target.style.transitionTimingFunction = "easeOut";
    target.style.opacity = 0;
    target.style.boxSizing = 'border-box';
    target.style.height = target.offsetHeight + 'px';
    target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout( () => {
          target.style.display = 'none';
          target.style.removeProperty('height');
          target.style.removeProperty('padding-top');
          target.style.removeProperty('padding-bottom');
          target.style.removeProperty('margin-top');
          target.style.removeProperty('margin-bottom');
          target.style.removeProperty('overflow');
          target.style.removeProperty('transition-duration');
          target.style.removeProperty('transition-property');
          //alert("!");
    }, duration);
  }

  let slideDown = (target, duration=500, opacityDuration=1000, opacityDelay=400) => {
    target.style.removeProperty('display');
    let display = window.getComputedStyle(target).display;
    if (display === 'none') display = 'block';
    target.style.display = display;
    let height = target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.boxSizing = 'border-box';
    target.style.transition = `
                              opacity ${opacityDuration}ms ${opacityDelay}ms,
                              height ${duration}ms 0ms,
                              margin ${duration}ms 0ms,
                              padding ${duration}ms 0ms
                              `;    
    target.style.opacity = 0.8;
    target.style.transitionTimingFunction = "easeOut";
    target.style.height = height + 'px';
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    window.setTimeout( () => {
      target.style.removeProperty('height');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
    }, duration);
  }    

  useEffect(() => {
    let wrapper = document.querySelector(".allWrapper");
    
    if (wrapper) {
      Animator.fadeInOut(document.querySelector(".allWrapper"), totalDurationPerChunk/8, totalDurationPerChunk/8, totalDurationPerChunk - totalDurationPerChunk/8);
    }        
    
    if (document.querySelector(".paragraphWrapper p")) {
      let paragraphs = document.querySelectorAll(".paragraphWrapper p");
      let delay = totalDurationPerChunk/8;
      let delayIncrement = totalDurationPerChunk/10.5;
      paragraphs.forEach((p) => {
        setTimeout(function() {
          slideDown(p, totalDurationPerChunk/16, delayIncrement, 250);
        }, delay)        
        delay += delayIncrement;        
      })      
    }
  }, [thought]);

  useEffect(() => {
    let currentThoughtChunk = thoughtChunks[0];

    if (currentThoughtChunk) {
      thoughtId.current +=1;
      setThought(
        (
          <div key={thoughtId.current} className={cx("allWrapper", lato.className, styles.opaqueBackground, styles.halfScreen)}>
            <div className={ styles.paragraphsWrapper }>
              { currentThoughtChunk.map((paragraph) => {                  
                  return (
                    <div className={ cx("paragraphWrapper", styles.paragraphWrapper )}>                    
                      <p>{ paragraph }</p>
                    </div>
                  )
                })
              }
            </div>
          </div>
        )
      )
    }        
    
    

    if (thoughtChunks.length != 0) {
      setTimeout(function() {      
        setThoughtChunks( (prevChunks) => {
          return prevChunks.slice(1);
        })
      }, totalDurationPerChunk);
    }
    
  }, [thoughtChunks]);

  useEffect(() => {
    console.log("Thought Component");
    console.log(thoughts);
    let finalChunks = [];

    thoughts.forEach((thought) => {    
      let tempParagraphs = [];
      thought.paragraphs.forEach( (paragraph, index) => {
        tempParagraphs.push(paragraph);   
        if ((index+1) % 3 == 0) {
          finalChunks.push(tempParagraphs);
          tempParagraphs = [];
        }
      });
      if (tempParagraphs.length != 0) {
        finalChunks.push(tempParagraphs);
        tempParagraphs = [];
      }
    })

    setThoughtChunks(finalChunks);

  }, [thoughts]);

  if (!thoughts || thoughts.length == 0)
    return (<></>);  

  return (    
    <div className={styles.wrapper}>      
      
        { thought }
      
    </div>      
  );
}

export default Thoughts;