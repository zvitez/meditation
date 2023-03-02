## Purpose
Remove friction from meditating with a super simple guided meditation player, that's aesthetically pleasing and can load custom meditations. You can use your own meditations by adding them to the public meditations folder and adjusting the meditations list in the index.jsx file.

## Major functions
Using Next.js, the app loads local audio files and displays them on the page. Anime.js is used to animate the scroll transitions between the different files. A simple play button controls the play/pause of the meditations. A background is animated using animejs and css as well.

## Dependencies
Node.js - https://nodejs.org/en/

## Build/Deploy

Run the following commands in the root folder of the project to start a local instance listening on port 9006

```
npm install
npm run dev
```

To deploy to Vercel or other provider that supports Next.js follow their specific instructions
https://vercel.com/docs/concepts/deployments/overview

To deploy on your own bare metal server you can use pm2
It will be deployed to port 9007 - changeable in .env file.
```
npm run build
pm2 start npm --name "meditationprod" -- run start --watch
```
