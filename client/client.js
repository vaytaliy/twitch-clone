const form = document.querySelector('form');
const loadingElement = document.querySelector('.loader');
const postElement = document.querySelector('.post');
const API_URL = 'http://localhost:5000/post';

loadingElement.style.display = 'none';

listAllPosts();

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const content = formData.get('content');
    const post = {
        name,
        content
    };

    form.style.display = 'none';
    loadingElement.style.display = '';

    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(post),
        headers: {
            'content-type': 'application/json'
        }
    }).then(res => res.json())
      .then(createdPost => {
            console.log(createdPost);
            form.reset();
            setTimeout(() => {
                form.style.display = '';
            }, 30000)
            loadingElement.style.display = 'none';    
            listAllPosts();
        });
});

function listAllPosts() {
    postElement.innerHTML = '';
    fetch(API_URL)
        .then(response => response.json())
        .then(createdPosts => {
            createdPosts.reverse();
            createdPosts.forEach(post => {
                const div = document.createElement('div');
                const header = document.createElement('h3');
                header.textContent = post.name;
                
                const contents = document.createElement('p');
                contents.textContent = post.content;

                const date = document.createElement('small');
                date.textContent = post.createdDate;

                div.appendChild(header);
                div.appendChild(contents);
                div.appendChild(date);

                postElement.appendChild(div);

                console.log(post);
            });
            loadingElement.style.display = 'none';
        })
}