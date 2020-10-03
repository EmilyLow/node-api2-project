const express = require("express");
//database
const posts = require("../data/db");
const router = express.Router();

router.get("/posts", (req, res) => {
    posts.find()
        .then((posts) => {
            res.status(200).json(posts);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({message: "Error retrieving the posts"})
        })
 })

 router.post("/posts", (req, res) => {
    if(!req.body.title || !req.body.contents) {
        //!!When do you use return and when is it automatic?
       res.status(400).json({errorMessage: "Please provide title and contents for the post."
    })
    }

    console.log("req.body", req.body)

    posts.insert(req.body)
        .then((post) => {
            //This was a roundabout way to return the actual post and not just the id. Was there a better way?
            let postContent;
            console.log("test console");
            posts.findById(post.id)
            .then((result) => {
                res.status(201).json(result);
            } )
            .catch(( (error) => 
                res.status(500).json({
                error: "There was an error while saving the post to the database after posting but while locating." 
            })

            ))
            
            
        })
        .catch((error) => {
            console.log(error, "Insert error");
            //! Does this count as returning the json?
            res.status(500).json({
                 error: "There was an error while saving the post to the database" 
            })
        })


 })





module.exports = router