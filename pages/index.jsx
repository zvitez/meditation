import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import { useState, useEffect, useRef } from 'react'
import { Client, APIErrorCode, LogLevel } from "@notionhq/client"
import Utils from '../components/particles/utils.js';
import Animator from '../components/particles/animationManager';
import Cursor from '../components/cursor/cursorComponent';
import Playlist from '../components/playlist/playlistComponent';
import PlayButton from '../components/play_button/playButtonComponent';

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
      scale: 0.25,
      width: image2.width,
      height: image2.height
    },
    { 
      src: image3.src,
      scale: 0.25,
      width: image3.width,
      height: image3.height
    },
  ]

  let meditations = [
    {
      name: "Intuition deep knowing relaxation practice",
      guide: "Tracee Stanley",
      src: "/meditations/Intuition Deep Knowing Relaxation Practice - Tracee Stanley.mp3"
    },
    {
      name: "10 min meditation",
      guide: "Marlene Zehnter",
      src: "/meditations/10 min meditation by Marlene Zehnter.mp3"
    },    
    {
      name: "Peaceful mind relaxation practice",
      guide: "Tracee Stanley",
      src: "/meditations/Mind Peaceful Mind Relaxation Practice - Tracee Stanley.mp3"
    },
    {
      name: "Body grounding deep relaxation practice",
      guide: "Tracee Stanley",
      src: "/meditations/Body Grounding Deep Relaxation Practice - Tracee Stanley.mp3"
    },
    {
      name: "Bliss divine connection practice",
      guide: "Tracee Stanley",
      src: "/meditations/Bliss Divine Connection Practice - Tracee Stanley.mp3"
    },
    {
      name: "Healing your inner child",
      guide: "Rising Woman",
      src: "/meditations/Healing Your Inner Child - Rising Woman.mp3"
    },
  ]

  let music = [
    {
      //src: "/music/Low Tide Unguided Meditation Conor_1.2_Nrmlzd2_30mins_VBR5-quiet.mp3"
      src: "/music/Serendipity - Ari Urban - quiet.mp3"
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
  const currentInterval = useRef(null);  
  const transitionDuration = useRef(40);
  const totalDurationPerChunk = 16000;
  const meditationAudio = useRef(null);
  const musicAudio = useRef(null);
  const nextMeditation = useRef();
  const playing = useRef(false);

  useEffect(() => {        
    addEventListener("resize", (event) => {
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
       
  }, []);

  useEffect(() => {    
    Animator.fadeOut(".overlay", 3000, 3000, transitionDuration.current*1000)
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
              //transition: `background-position ${transitionDuration.current}s ease`,
              backgroundPosition: "25% 25%",
              animationDuration: `${transitionDuration.current}s`,
              animationName: "moveAround",
              animationIterationCount: "infinite",
              animationDirection: "alternate",
              animationTimingFunction: "easeInOut",
              animationDelay: "1s",
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

    let interval = setTimeout(() => {
      let image = document.querySelector(".main-image");
      image.style.backgroundPositionX = "100%";
      image.style.backgroundPositionY = "100%";
    }, 3000);
    /*
    Animator.animateImage(".main-image", xChange, yChange, transitionDuration.current*1000);    
    Animator.fadeOutIn(".overlay", 3000, 3000, transitionDuration.current*1000)
    let interval = setInterval(() => {
      setCurrentImage((currentImage + 1) % alteredImages.length);      
    }, transitionDuration.current*1000);  // Change image every 2 seconds
    currentInterval.current = interval;
    return () => clearInterval(interval);
    */
    return () => clearInterval(interval);
  }, [currentImage]); // end useEffect

  function setNewMeditation(next) {
    nextMeditation.current = next;
    playing.current = false;
  }

  function playMeditationHandler() {
    if (playing.current == true && meditationAudio.current.paused) {
      meditationAudio.current.play();      
      musicAudio.current.play();      
      return;
    } else if (playing.current == true){
      meditationAudio.current.pause();      
      musicAudio.current.pause();      
      return;
    }

    meditationAudio.current.src = nextMeditation.current.src;  
    musicAudio.current.src = music[0].src;      
    
    setTimeout(() => {
      meditationAudio.current.play();      
      musicAudio.current.play();      
      musicAudio.current.loop = true;
      playing.current = true;
    }, 500)

    
    meditationAudio.current.addEventListener(["canplaythrough", "canplay"], (event) => {
      /* the audio is now playable; play it if permissions allow 
      meditationAudio.current.play();
      */
    });    

    meditationAudio.current.addEventListener("ended", (event) => {
      /* the audio is now playable; play it if permissions allow */
      musicAudio.current.pause();
    });

    musicAudio.current.addEventListener("canplaythrough", (event) => {
      /* the audio is now playable; play it if permissions allow 
      musicAudio.current.play();
      musicAudio.current.loop = true;
      */
    });
  }

  function changeMeditationHandler(nextMeditation) {    
    return;
    meditationAudio.current.src = nextMeditation.src;  
    musicAudio.current.src = music[0].src;      

    meditationAudio.current.addEventListener("canplaythrough", (event) => {
      /* the audio is now playable; play it if permissions allow */
      meditationAudio.current.play();
    });    

    meditationAudio.current.addEventListener("ended", (event) => {
      /* the audio is now playable; play it if permissions allow */
      musicAudio.current.pause();
    });

    musicAudio.current.addEventListener("canplaythrough", (event) => {
      /* the audio is now playable; play it if permissions allow */
      musicAudio.current.play();
      musicAudio.current.loop = true;
    });

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
      <main id="main">        
        {imageContainers[currentImage]}     
        <div className="backgroundWrapper">
          <div className="darkBackground">
          </div>
        </div>
        <Playlist setNewMeditation={setNewMeditation} changeMeditationHandler={changeMeditationHandler} list={meditations}/>
        <PlayButton clickHandler={playMeditationHandler} />
      </main>      
    </>
  )
}
