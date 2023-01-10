import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import { useState, useEffect, useRef } from 'react'
import { Client, APIErrorCode, LogLevel } from "@notionhq/client"
import Utils from '../components/particles/utils.js';
import Animator from '../components/particles/animationManager';
import Thoughts from '../components/thoughtComponent';
import Cursor from '../components/cursor/cursorComponent';
import Playlist from '../components/playlist/playlistComponent';

import image1 from '../public/images/robin-schreiner.jpg'
import image2 from '../public/images/jean-philippe.jpg'
import image3 from '../public/images/zoltan-tasi.jpg'

const inter = Inter({ subsets: ['latin'] })
// use it like so
// <h2 className={inter.className}>

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const database_id = process.env.NOTION_DATABASE_ID

//export async function getServerSideProps(): Promise<{props: {todos: any}}> {
export async function getServerSideProps() {  

  let images = [
    { 
      src: image2.src,
      scale: 0.5,
      width: image2.width,
      height: image2.height
    },
    { 
      src: image3.src,
      scale: 0.5,
      width: image3.width,
      height: image3.height
    },
  ]

  let meditations = [
    {
      name: "Intuition Deep Knowing Relaxation Practice by Tracee Stanley",
      src: "/meditations/Intuition Deep Knowing Relaxation Practice - Tracee Stanley.mp3"
    },
    {
      name: "Mind Peaceful Mind Relaxation Practice by Tracee Stanley",
      src: "/meditations/Mind Peaceful Mind Relaxation Practice - Tracee Stanley.mp3"
    },
    {
      name: "Body Grounding Deep Relaxation Practice by Tracee Stanley",
      src: "/meditations/Body Grounding Deep Relaxation Practice - Tracee Stanley.mp3"
    },
    {
      name: "Bliss Divine Connection Practice by Tracee Stanley",
      src: "/meditations/Bliss Divine Connection Practice - Tracee Stanley.mp3"
    },
    {
      name: "Healing Your Inner Child by Rising Woman",
      src: "/meditations/Healing Your Inner Child - Rising Woman.mp3"
    },    
  ]

  let music = [
    {
      src: "/music/Serendipity - Ari Urban.mp3"
    },
  ]

  return Promise.resolve({
    props: {      
      images,
      meditations,
      music
    },
  });
}


export default function Home({ images, meditations, music }) {  
  const [currentImage, setCurrentImage] = useState(0);    
  const [alteredImages, setAlteredImages] = useState(images);
  const [imageContainers, setImageContainers] = useState([]);
  const [thoughts, setThoughts] = useState([]);
  const currentInterval = useRef(null);  
  const transitionDuration = useRef(100);
  const totalDurationPerChunk = 16000;
  const meditationAudio = useRef(null);
  const musicAudio = useRef(null);

  useEffect(() => {        
    addEventListener("resize", (event) => {
      console.log("resizing");
      setAlteredImages(alteredImages.map( (image) => {      
        if (image.width*image.scale <= window.innerWidth || image.height*image.scale <= window.innerHeight)
          image.backgroundSize = "cover";
        else
          image.backgroundSize = "initial";
        return image;
      })
    )});
    
    meditationAudio.current = new Audio(meditations[0].src);  
    musicAudio.current = new Audio(music[0].src);      
    musicAudio.current.volume = 0.15;

    //changeSongButton.addEventListener("click", changeSong);  
    function changeSong() {
      if (currentSong === "mp3-1") {
        currentSong = "mp3-2"
      } else {
        currentSong = "mp3-1"
      }

      meditationAudio.current.src = "newsrc";
      meditationAudio.current.addEventListener("canplaythrough", (event) => {
        /* the audio is now playable; play it if permissions allow */
        meditationAudio.current.play();
      });
    }  
       
  }, []);

  useEffect(() => {    
    Animator.fadeOutIn(".overlay", 3000, 3000, transitionDuration.current*1000)
  }, [imageContainers])

  useEffect(() => {
    alteredImages.forEach( (image) => {      
      if (image.width*image.scale <= window.innerWidth || image.height*image.scale <= window.innerHeight)
        image.backgroundSize = "cover";
      else
        image.backgroundSize = "initial";
    })

    setImageContainers(alteredImages.map( (image, index) => {     
      let top = 0,
        left = 0;
      
      if (image.scale == 0.5) {
        top = left = "-50%";      
      }
  
      if (image.scale == 0.25) {
        top = left = "-150%";      
      }
  
      return (
        <div key={index} className="imageContainer">
          <div className="overlay"
            
          >          
          </div>          
          <div className="main-image" 
            style={{
              backgroundImage: `url(${image.src})`,
              scale: "" + image.scale, 
              height: Math.max(100/image.scale, 100) + "vh",
              width: Math.max(100/image.scale, 100) + "vw",
              transition: `background-position ${transitionDuration.current}s ease`,
              top: top,
              backgroundSize: image.backgroundSize,
              left: left,              
            }}
          >
          </div>                          
          <div className="lines">
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
          </div>
        </div> 
      )
    }))
  }, [alteredImages]);

  useEffect(() => {    
    let xChange = 100;
    let yChange = 100;   

    Animator.animateImage(".main-image", xChange, yChange);
    Animator.fadeOutIn(".overlay", 3000, 3000, transitionDuration.current*1000)
    let interval = setInterval(() => {
      setCurrentImage((currentImage + 1) % alteredImages.length);      
    }, transitionDuration.current*1000);  // Change image every 2 seconds
    currentInterval.current = interval;
    return () => clearInterval(interval);
  }, [currentImage]); // end useEffect


  function clickHandler(e) {
    /*clearInterval(currentInterval.current);
    setCurrentImage((currentImage + 1) % alteredImages.length); 
    */

    if (meditationAudio.current.readyState === HTMLMediaElement.HAVE_FUTURE_DATA
      || meditationAudio.current.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA) {
        meditationAudio.current.play();
    } else {
      meditationAudio.current.addEventListener("canplaythrough", (event) => {
        /* the audio is now playable; play it if permissions allow */
        meditationAudio.current.play();
      });
    }

    meditationAudio.current.addEventListener("ended", (event) => {
      /* the audio is now playable; play it if permissions allow */
      meditationAudio.current.play();
      musicAudio.current.pause();
    });

    if (musicAudio.current.readyState === HTMLMediaElement.HAVE_FUTURE_DATA
      || musicAudio.current.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA) {
        musicAudio.current.play();
        musicAudio.current.loop = true;
    } else {
      musicAudio.current.addEventListener("canplaythrough", (event) => {
        /* the audio is now playable; play it if permissions allow */
        musicAudio.current.play();
        musicAudio.current.loop = true;
      });
    }
    
    /*
    // fullscreen test
    const elem = document.querySelector(".main-image");      
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
    */
  }  

  return (
    <>
      <Head>
        <title>Meditation</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Cursor/>      
      <main id="main" onClick={clickHandler}>        
        {imageContainers[currentImage]}     
        <Playlist list={meditations}/>
      </main>      
    </>
  )
}
