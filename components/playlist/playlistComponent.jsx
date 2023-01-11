import { useState, useEffect, useRef } from 'react'
import cx from 'classnames'

import VirtualScroll from 'virtual-scroll'

import styles from './PlaylistComponent.module.scss'
import Animator from '../particles/animationManager'
import anime from 'animejs';

const Playlist = ( { list, changeMeditationHandler, setNewMeditation } ) => {  
  const [currentList, setCurrentList] = useState(list);
  const [numItems, setNumItems] = useState(10);
  const scroller = useRef(null);
  const scrollingList = useRef(list.map(item => item));
  const orderList = useRef(Array.apply(null, Array(list.length)).map(function (x, i) { return i; }))
  const maxHeight = useRef(0);
  const centerElementIndex = useRef(0);
  const maxNumItems = useRef(0);
  const scrolledUp = useRef(false);
  const scrolling = useRef(false);

  function handleScroll(event) {
    if (scrolling.current) {
      return;
    }

    if (event.deltaY < 0) {          
      /*
      let first = scrollingList.current.shift();
      scrollingList.current.push(first);
      setCurrentList(scrollingList.current.map(item => item));
      */

      let first = orderList.current.shift();
      orderList.current.push(first);      
      
      scrolledUp.current = false;
    } else {
      /*
      let last = scrollingList.current.pop();
      scrollingList.current.unshift(last);
      setCurrentList(scrollingList.current.map(item => item));
      */

      let last = orderList.current.pop();
      orderList.current.unshift(last);
      
      scrolledUp.current = true;
    }
    
    positionElements(maxNumItems.current, maxHeight.current);
  }

  function calculateMaxHeight() {
    let allElements = document.querySelectorAll("." + styles.element);    
    allElements.forEach( (e) => { 
      if (e.clientHeight > maxHeight.current)
        maxHeight.current = e.clientHeight;
    })
    allElements.forEach( (e) => {       
      e.style.minHeight = maxHeight.current + "px";
    })
    return maxHeight.current;
  }

  function calculateMaxNumberOfItems(elementMaxHeight) {
    let wrapper = document.querySelector("." + styles.wrapper);
    let a = wrapper.clientHeight / elementMaxHeight;
    a = Math.floor(a);     
    // comment this if I don't wanna wanna have only 1-3-5 elements
    a = a % 2 == 0 ? a - 1 : a;            
    return a;
  }

  function setScrolling(state) {
    scrolling.current = state;
  }

  function positionElements(maxItems, maxHeight) {
    setScrolling(true);

    let wrapper = document.querySelector("." + styles.wrapper);
    let topPosition = wrapper.getBoundingClientRect().top;
    let bottomPosition = wrapper.getBoundingClientRect().bottom;
    let wrapperHeight = wrapper.clientHeight;
    let center = topPosition + wrapperHeight/2;
    let allElements = document.querySelectorAll("." + styles.element);    
    allElements.forEach( function(e, index) {             
      e.style.position = "absolute";
      //e.style.top = center - index * maxHeight
      
      // get properly sorted index
      let newIndex = 0;
      orderList.current.find(function(e2, index2) {        
        if (e2 == index) {
          newIndex = index2;
          return true;
        } else {
          return false
        }        
      })
      
      /* assign different animations based on different edge cases 
        - element disappears top
        - element disappears bottom
        - element is in the middle
        - element is smaller
        - element is even smaller
      */
      let centerId = Math.floor(maxItems/2);      
      //e.style.top = topPosition + newIndex * maxHeight + "px";
      let duration = 250;
      let easing = "easeInOutQuad";
      if (newIndex == centerId) {
        
        setNewMeditation(list[index]);

        anime({
          targets: e,
          keyframes: [
            { 
              opacity: 1,
              top: newIndex * maxHeight + "px",
              duration: duration,
            }
          ],    
          easing: easing,
        }).finished.then(() => setScrolling(false))
      } else if (scrolledUp.current && newIndex == 0) {
        anime({
          targets: e,
          keyframes: [
            { 
              opacity: 0,
              top: wrapperHeight + "px",
              duration: duration/2,
            },
            { 
              top: 0 - maxHeight + "px",
              duration: 0,
            },
            { 
              opacity: 0.25,
              top: 0 + "px",
              duration: duration/2,
            },
          ],    
          easing: easing,
        }).finished.then(() => setScrolling(false))
      } else if (!scrolledUp.current && newIndex == (orderList.current.length - 1)) {
        anime({
          targets: e,
          keyframes: [
            { 
              opacity: 0,
              top: 0 - maxHeight + "px",
              duration: duration/2,
            },
            { 
              top: wrapperHeight + "px",
              duration: 0,
            },
            { 
              opacity: 0.25,
              top: newIndex * maxHeight + "px",
              duration: duration/2,
            },
          ],    
          easing: easing,
        }).finished.then(() => setScrolling(false))
      } else if (newIndex == (orderList.current.length - 1) || newIndex == 0) {
        anime({
          targets: e,
          keyframes: [
            { 
              opacity: 0.25,
              top: newIndex * maxHeight + "px",
              duration: duration,
            }
          ],    
          easing: easing,
        }).finished.then(() => setScrolling(false))
      } else if (newIndex >= maxItems) {
        anime({
          targets: e,
          keyframes: [
            { 
              opacity: 0,
              top: newIndex * maxHeight + "px",
              duration: duration,
            }
          ],    
          easing: easing,
        }).finished.then(() => setScrolling(false))
      } else if (newIndex == maxItems - 1) {
        anime({
          targets: e,
          keyframes: [
            { 
              opacity: 0.25,
              top: newIndex * maxHeight + "px",
              duration: duration,
            }
          ],    
          easing: easing,
        }).finished.then(() => setScrolling(false))
      } else {
        anime({
          targets: e,
          keyframes: [
            { 
              opacity: 0.5,
              top: newIndex * maxHeight + "px",
              duration: duration,
            }
          ],    
          easing: easing,
        }).finished.then(() => setScrolling(false))
      }
    })
  }

  useEffect( () => {
    
  }, [currentList] )

  useEffect(() => {
    scroller.current = new VirtualScroll();
    scroller.current.on(handleScroll);
    
    let maxHeight = calculateMaxHeight();
    maxNumItems.current = calculateMaxNumberOfItems(maxHeight);    
    centerElementIndex.current = Math.floor(maxNumItems.current / 2);
    setNumItems(maxNumItems.current);    
    positionElements(maxNumItems.current, maxHeight);

    return () => scroller.current.off(handleScroll);
  }, [])

  return (
    <div className={styles.wrapper}>
      { 
        currentList.map( (item, index) => {    

          return (
            <div onClick={() => changeMeditationHandler(item)} key={item.name} className={cx("hoverableIsntWorkingAtm", styles.element)}>
              <p>{item.name}</p>
            </div>
          )
        }) 
      }      
    </div>
  );

}

export default Playlist;