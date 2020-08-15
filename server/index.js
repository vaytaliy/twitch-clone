const express = require('express');
const cors = require('cors');
const monk = require('monk');

const app = express();

const db = monk('localhost/seeposts'); //seeposts is the db name
const allPosts = db.get('posts');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: "test"
    });
});

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

app.post('/post', (req, res) => {
    if (isValidPost(req.body)) {
        const post = {
            name: req.body.name.toString(),
            content: req.body.content.toString(),
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