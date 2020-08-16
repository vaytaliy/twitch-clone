const express = require('express');
const cors = require('cors');
const monk = require('monk');
const rateLimit = require("express-rate-limit");
//const MONGO_URI = "mongodb+srv://twitterclone.ik0i2.mongodb.net/seeposts";

const Filter = require('bad-words');
process.env.MONGO_URI = "mongodb+srv://admin:Te8aL>>@twitterclone.ik0i2.mongodb.net/seeposts?retryWrites=true&w=majority";

const app = express();

const db = monk(process.env.MONGO_URI || 'localhost/seeposts'); //seeposts is the db name
const allPosts = db.get('posts');
const filter = new Filter();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: "test"
    });
});

const limiter = rateLimit({
    windowMs: 0.5 * 60 * 1000, // 15 minutes
    max: 1 // limit each IP to 100 requests per windowMs
  });
   
  //  apply to all requests
  

function isValidPost(post) {
    return post.name && post.name.toString().trim() !== '' &&
        post.content && post.content.toString().trim() !== '';
}

app.get('/post', (req, res) => {
    allPosts
        .find()
        .then(posts => {
            res.json(posts);
        });
});

app.use(limiter);

app.post('/post', (req, res) => {
    if (isValidPost(req.body)) {
        const post = {
            name: filter.clean(req.body.name.toString()),
            content: filter.clean(req.body.content.toString()),
            createdDate: new Date()
        }
        
        allPosts
            .insert(post)
            .then(createdPost => {
                res.json(createdPost);
            });
        }

    else {
        res.status(422);
        res.json({
            message: 'Name and content are required'
        })
    }
})

app.listen(5000, () => {
    console.log('listening on 5500');
});