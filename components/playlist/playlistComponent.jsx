import { useState, useEffect, useRef } from 'react'
import cx from 'classnames'

import VirtualScroll from 'virtual-scroll'

import styles from './PlaylistComponent.module.scss'
import Animator from '../particles/animationManager'

const Playlist = ( { list } ) => {  
  const [currentList, setCurrentList] = useState(list);
  const [numItems, setNumItems] = useState(10);
  const scroller = useRef(null);
  const scrollingList = useRef(list.map(item => item));
  const orderList = useRef(Array.apply(null, Array(list.length)).map(function (x, i) { return i; }))
  const maxHeight = useRef(0);
  //const maxNumItems = useRef(0);

  function handleScroll(event) {
    console.log(event.deltaY);
    if (event.deltaY > 0) {          
      /*
      let first = scrollingList.current.shift();
      scrollingList.current.push(first);
      setCurrentList(scrollingList.current.map(item => item));
      */

      let first = orderList.current.shift();
      orderList.current.push(first);
    } else {
      /*
      let last = scrollingList.current.pop();
      scrollingList.current.unshift(last);
      setCurrentList(scrollingList.current.map(item => item));
      */

      let last = orderList.current.pop();
      orderList.current.unshift(last);
    }
    positionElements(numItems, maxHeight.current);
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

  function positionElements(maxItems, maxHeight) {
    let wrapper = document.querySelector("." + styles.wrapper);
    let topPosition = wrapper.getBoundingClientRect().y;
    let wrapperHeight = wrapper.clientHeight;
    let center = topPosition + wrapperHeight/2;
    let allElements = document.querySelectorAll("." + styles.element);    
    allElements.forEach( (e, index) => {             
      e.style.position = "absolute";
      //e.style.top = center - index * maxHeight
      
      // get properly sorted index
      let newIndex = 0;
      orderList.current.find(function(e2, index2) {        
        if (e2 == index) {
          newPosition = index2;
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
      
      e.style.top = topPosition + newIndex * maxHeight + "px";
    })
  }

  useEffect( () => {
    console.log(currentList);
  }, [currentList] )

  useEffect(() => {
    scroller.current = new VirtualScroll();
    scroller.current.on(handleScroll);
    
    let maxHeight = calculateMaxHeight();
    let maxNumItems = calculateMaxNumberOfItems(maxHeight);    
    setNumItems(maxNumItems);
    positionElements(maxNumItems, maxHeight);

    return () => scroller.current.off(handleScroll);
  }, [])

  return (
    <div className={styles.wrapper}>
      { 
        currentList.map( (item, index) => {    

          return (
            <div key={item.name} className={cx("hoverableIsntWorkingAtm", styles.element)}>
              <p>{item.name}</p>
            </div>
          )
        }) 
      }      
    </div>
  );

}

export default Playlist;