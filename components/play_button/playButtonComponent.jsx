import { useState, useEffect, useRef } from 'react'
import cx from 'classnames'

import VirtualScroll from 'virtual-scroll'

import styles from './playButtonComponent.module.scss'
import Animator from '../particles/animationManager'
import anime from 'animejs';

const PlayButton = ( { clickHandler } ) => {  
 
  return (
    <div onClick={clickHandler} className={styles.glightbox_video}> 
      <svg width="80" height="80" viewBox="0 0 131 131" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path className={styles.inner_circle} d="M65 21C40.1488 21 20 41.1488 20 66C20 90.8512 40.1488 111 65 111C89.8512 111 110 90.8512 110 66C110 41.1488 89.8512 21 65 21Z" fill="white"></path>
          <circle className={styles.outer_circle} cx="65.5" cy="65.5" r="64" stroke="white"></circle>
          <path className={styles.play} fillRule="evenodd" clipRule="evenodd" d="M60 76V57L77 66.7774L60 76Z" fill="#cd772d"></path>
      </svg>
    </div>
  );

}

export default PlayButton;