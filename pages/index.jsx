import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import { useState, useEffect, useRef } from 'react'
import { Client, APIErrorCode, LogLevel } from "@notionhq/client"
import Utils from '../components/particles/utils.js';
import Animator from '../components/particles/animationManager';
import Thoughts from '../components/thoughtComponent';

import VirtualScroll from 'virtual-scroll'
import mountains from '../public/images/massimiliano-morosinotto-3i5PHVp1Fkw-unsplash.jpg'
import image2 from '../public/images/massimiliano-morosinotto-T0AIx4PdjQM-unsplash.jpg'
import image4 from '../public/images/KiZa19_amethyst_pyramid_c5c10360-c328-41ec-b2f8-fad7c7144dfe.png'
import image3 from '../public/images/massimiliano-morosinotto-3-K-OU5GO8w-unsplash.jpg'
import africa from '../public/images/cosmic-timetraveler--SFhuMwFClk-unsplash.jpg'

const inter = Inter({ subsets: ['latin'] })
// use it like so
// <h2 className={inter.className}>

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const database_id = process.env.NOTION_DATABASE_ID

//export async function getServerSideProps(): Promise<{props: {todos: any}}> {
export async function getServerSideProps() {  
  const payload = {
    path: `databases/${database_id}/query`,
    method: 'POST',
  }

  const notionPayload = await notion.request(payload);

  let images = [
    { 
      src: image4.src,
      scale: 1,
      width: image4.width,
      height: image4.height
    },
    { 
      src: mountains.src,
      scale: 0.5,
      width: mountains.width,
      height: mountains.height
    },
    { 
      src: africa.src,
      scale: 0.5,
      width: africa.width,
      height: africa.height
    },
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

  let thoughts = notionPayload.results;
  //console.log(thoughts);  
  
  let thoughtParagraphs = [];

  await Promise.all(thoughts.map( async (thought) => {    
    /*
    let response = await notion.pages.retrieve({ page_id: thought.id });      
    console.log(response);
    response = await notion.pages.properties.retrieve({ page_id: thought.id, property_id: thought.properties.Name.id });
    console.log("Name");      
    console.log(response);      
    console.log("Name content");      
    */
   let newThought = { name: thought.properties.Name.title[0].plain_text };
   let paragraphs = [];

    let response = await notion.blocks.children.list({
      block_id: thought.id,
      page_size: 50,
    });
    if (response != undefined) {
      response.results.forEach( (paragraph) => {
        let p = paragraph.paragraph;
        if (p.rich_text && p.rich_text.length > 0) {
          paragraphs.push(p.rich_text[0].plain_text);
        }
      })
    }      

    newThought.paragraphs = paragraphs;
    thoughtParagraphs.push(newThought);    
  }));    

  return Promise.resolve({
    props: {      
      images,
      thoughtParagraphs
    },
  });
}


export default function Home({ images, thoughtParagraphs }) {  
  const [currentImage, setCurrentImage] = useState(0);    
  const [alteredImages, setAlteredImages] = useState(images);
  const [imageContainers, setImageContainers] = useState([]);
  const [thoughts, setThoughts] = useState([]);
  const currentInterval = useRef(null);  
  const transitionDuration = useRef(100);
  const totalDurationPerChunk = 16000;

  async function deleteTodoHandler(todoID) {
    fetch('/api/dotodo', {
      method: "POST",
      body: JSON.stringify({todoID: todoID}),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json().then(data => console.log(data)))

    setTimeout(() => {
      //setCurrentTodos( (prevTodos) => prevTodos.filter( (todo) => todo.id != todoID));
    }, 5000);    
  }

  useEffect(() => {    
    const scroller = new VirtualScroll()
    scroller.on(event => {
      let moveDistance = document.querySelector("#soundCloudContainer").clientHeight;       
      if (event.deltaY > 0) {
        moveDistance = 0;
      } 
      Animator.smoothTranslation("#soundCloudContainer", "", 0, "bottom", moveDistance*-1, 1000, "easeInOutQuart")
    })
    
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

function onInactive(ms, cb) {
    var wait = setTimeout(cb, ms);
    document.onmousemove = document.mousedown = document.mouseup = document.onkeydown = document.onkeyup = document.focus = function () {
        clearTimeout(wait);
        Animator.fadeIn(".cursor__ball", 1000, 0);
        wait = setTimeout(cb, ms);
    };
}

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
    console.log("Done loading thoughts");
    console.log(thoughtParagraphs);
    transitionDuration.current = (totalDurationPerChunk/1000) * thoughtParagraphs[0].paragraphs.length/3;
    console.log("Transition Duration");
    console.log(transitionDuration.current);
    setThoughts(thoughtParagraphs);
  }, [thoughtParagraphs]);

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
    clearInterval(currentInterval.current);
    setCurrentImage((currentImage + 1) % alteredImages.length); 
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
        <title>Something Beautiful</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="cursor">
        <div className="cursor__ball cursor__ball--big ">
          <svg height="30" width="30">
            <circle cx="15" cy="15" r="12" strokeWidth="0"></circle>
          </svg>
        </div>
        
        <div className="cursor__ball cursor__ball--small">
          <svg height="10" width="10">
            <circle cx="5" cy="5" r="4" strokeWidth="0"></circle>
          </svg>
        </div>
      </div>

      <main id="main" onClick={clickHandler}>        
        {imageContainers[currentImage]}     
        <Thoughts thoughts={thoughts} totalDurationPerChunk={totalDurationPerChunk}/>     
        <div id="soundCloudContainer">     
        
          <iframe width="100%" height="450" scrolling="no" frameBorder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/508485912&color=%2354403c&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false"></iframe>     
          
        </div>
        
      </main>

      <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.20.3/TweenMax.min.js"></script>
    </>
  )
}
