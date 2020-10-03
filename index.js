//Basic code to get it running
const express = require('express');

//not sure about db

const postsRouter = require("./posts/posts-router");

const server = express();
const port = 9000;
server.use(express.json()) 
server.use(postsRouter);


server.use('/', (req, res) => res.send('API up and running! Confirmed.'));


server.listen(port, () => console.log('API running on port 9000'));

//!! Why do you sometimes do 'npm start' and 'npm run server' and sometimes 'node index.js'. Is that due to package.json code?
//It seemds like 'npm start' and 'npm run server' might need to be defined inside the "scripts" part of package.son. E.g. "start" : "node index.js" For everything but start/test need to put "run" which is why "npm run server" works. 