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

 router.get("/posts/:id", (req, res) => {
     //!! Returns empty array if wrong id, why
    posts.findById(req.params.id)
    .then((post) => {
        //The second bit of this serves no purpose but was a failed attempt to make bad ids not send blank arrays
        if (post && post != []) {
            res.status(201).json(post);
        } else {
            res.status(404).json({
                message: "Post not found",
            })
        }
        
    } )
    .catch( (error) => {
        res.status(500).json({
        error: "Error retrieving the user"
        })})

 })

 router.get("/posts/:id/comments", (req, res) => {
    //!! Returns empty array if wrong id, why
   posts.findPostComments(req.params.id)
   .then((post) => {
       
       if (post && post != []) {
           res.status(201).json(post);
       } else {
           res.status(404).json({
               message: "Post not found",
           })
       }
       
   } )
   .catch( (error) => {
       res.status(500).json({
       error: "Error retrieving the user"
       })})

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

 router.post("/posts/:id/comments", (req, res) => {

    if (!req.body.text) {
        res.status(400).json({
			errorMessage: "Please provide text for the comment.",
		}) 
    }
     let possiblePost = null;
    !posts.findById(req.params.id)
    .then((post) => {
        possiblePost = post;
        //!!!None of my 404s work. Why?
        if(possiblePost === []) {
            res.status(404).json({
                errorMessage: "Post not found",
            }) 
        }
    })
    .catch((error) => {
        res.status(404).json({
			errorMessage: "Post not found",
		}) 
    })
   

    posts.insertComment(req.body)
    .then((post) => {
        // res.status(201).json(post)
        //Roundabout way to post comment
        
        console.log("test console");
        posts.findCommentById(post.id)
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
    
        console.log(error)
        res.status(500).json({
            message: "Could not add comment",
        })
    })


 })

 router.delete("/posts/:id", (req, res) => {
	posts.remove(req.params.id)
		.then((count) => {
			if (count > 0) {
				res.status(200).json({
					message: "The post has been deleted",
				})
			} else {
				res.status(404).json({
					message: "The post could not be found",
				})
			}
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				message: "Error removing the post",
			})
		})
})


router.put("/posts/:id", (req, res) => {
	if (!req.body.title || !req.body.contents) {
		return res.status(400).json({
			message: "Missing body or contents",
		})
	}

	posts.update(req.params.id, req.body)
		.then((post) => {
			if (post > 0) {
				res.status(200).json(user)
			} else {
				res.status(404).json({
					message: "The post could not be found",
				})
			}
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				message: "Error updating the post",
			})
		})
})


module.exports = router