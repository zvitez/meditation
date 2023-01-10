https://youtu.be/JNGtnkLi5Js?t=129

# Todo

## Cursor
Try this https://codepen.io/gabrielcojea/pen/jOWRBrL

## Font
Optimize fonts
https://nextjs.org/docs/basic-features/font-optimization

## Pause everything except sound on visibility change
CSS Transitions and animations:
https://stackoverflow.com/questions/43096144/how-do-i-pause-css-transition

Timeouts
https://stackoverflow.com/questions/3969475/javascript-pause-settimeout

Animator
check init function in Animator


## Functionality
Don't wanna embed Instagram posts because I don't wanna support them, and their terms are bad

Content type:
- poems
- photos
- affirmations
- positive ideas
- audio
  - could embed soundcloud in a little tab that displays from below

Settings sidebar 
Chose content type
Chose transition speed

History
Keep a history of all the elements that were already played -> use notion for that
Use a checkbox and reset them all when they have all been played
and/or
Store date when it was last played

Load the data from the Notion table

Play

## Cursor
https://www.onedesigncompany.com/news/a-pointed-look-at-custom-cursors-in-javascript
https://codepen.io/MikeMcChillin/pen/pQbpqN
Added - turn it on after a little while, and hide on inactivity

## Already exists
https://app.lofi.co/?auth=verified
Can find all the songs in Network

Beautiful player
https://github.com/jkoo0604/React_MusicPlayer

Meditation app
https://github.com/ramirezandradesara/meditation-app-react

https://github.com/Sudeshna-9331/Meditation-App -- music

https://github.com/jaden/relax-reddit

https://github.com/usmanmunara/PomodoroClock

## Display image
https://nextjs.org/docs/api-reference/next/image

## Embed Spotify
```
<iframe src="https://open.spotify.com/embed/playlist/14jQYL7gU2rXm33ecsHMuS?utm_source=generator&theme=0" width="100%" height="80" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
```

## Embed Unsplash
https://awik.io/generate-random-images-unsplash-without-using-api/


## See if I can find audio creators that will wanna allow me to use their music

## Audio apis
https://www.programmableweb.com/category/music/api

https://radio.co/pricing

## Git commands
git init
git add .
commit -m "message"
git branch -M main
git remote add origin git@github.com:zvitez/somethingbeautiful.git
git push -u origin main

## Smooth Blob
https://georgefrancis.dev/writing/build-a-smooth-animated-blob-with-svg-and-js/

## Working with Notion
https://developers.notion.com/docs
https://developers.notion.com/reference/request-limits

Develop a notion api server proxy so I can monitor the rate limits of the different apps


## Background music
https://github.com/pfrlv/plofier-web
https://plofier.com/


##
Can't change iframe content
https://stackoverflow.com/questions/36512542/edit-css-of-elements-within-iframe

Cursor
https://www.onedesigncompany.com/news/a-pointed-look-at-custom-cursors-in-javascript
https://codepen.io/MikeMcChillin/pen/pQbpqN

## NextJS Specific stuff

To display an image as css background
```
<div id="main-image" style={ { backgroundImage: `url(${mountains.src})` }}></div>        
```

To display an image with `<img>`:
```
<Image
  id="mountains"
  alt="Mountains"
  src={mountains}
  width={700}
  height={475}
  sizes="100vw"
  style={{
    width: '100%',
    height: 'auto',
    scale: imageScale,
  }}
/>
```

## Backup
```
<div key={paragraph.slice(0, 5).replace(/\s+/g, "")} className={ styles.paragraphOverlay }>
</div>
```

## Smooth Scrolling
https://www.everyday3d.com/smooth-scrolling-with-virtualscroll/
https://www.npmjs.com/package/virtual-scroll

# Content

## Images
https://unsplash.com/@therawhunter
https://unsplash.com/photos/ugdGj_qnR1I

## Text
http://lightbeingscommunity.org/# -- scroll down, there are activations at the bottom

## Audio
```
<iframe width="100%" height="166" scrolling="no" frameBorder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1405410841&color=%2354403c&auto_play=true&hide_related=false&show_comments=false&show_user=false&show_reposts=false&show_teaser=false"></iframe>

<iframe width="100%" height="450" scrolling="no" frameBorder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/508485912&color=%2354403c&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false"></iframe>

<iframe width="100%" height="300" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1047202084&color=%2354403c&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"></iframe>
```

## Setup Server
```
pm2 start npm --name "startupguideweb" -- run start --watch
```


