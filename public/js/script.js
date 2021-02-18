const socket = io();
const form = document.getElementById('form');
const blockmessages = document.getElementById('blockmessages');
const sujetname = document.getElementById('sujet');
const userlist = document.getElementById('userlist');

// l'utilisateur et le sujet depuis l'url
const { user, sujet } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// Joindre un sujet
socket.emit('joinSujet', { user, sujet });
socket.on('userSujet', ({ sujetname, userslist }) => {
    listUser(userslist);
    sujetName(sujetname);
});
// afficher la liste des utilisateurs
function listUser(users) {
    userlist.innerHTML = `${
        users.map(user => 
            `<li class="user list-group-item bg-transparent text-white fw-bold "><i class="bi bi-award-fill "></i> ${user.user} </li>` )
            .join('')
    }`;
};
// inserer le nom du sujet dans le dom
function sujetName(sujet) {
    sujetname.innerHTML = sujet;
};
// affichage de message
socket.on('message', message => {
    attribution(message);
});
//evenement de click
form.addEventListener('submit', function(e) {
    e.preventDefault();
    const textMessage = document.getElementById('msg');
    if (textMessage.value != '') {
        socket.emit('chatMessage', textMessage.value);
        textMessage.value = '';
        textMessage.focus();
    }
});
// fonction pour afficher le contenu du message
function attribution(content) {
    let div = document.createElement(`div`);
    div.className = `message text-start p-2 mb-2 border border-primary`;
    div.style.background = `rgba(23, 69, 221, 0.267)`;
    div.style.borderRadius = `20px`;
    let b = document.createElement('b');
    b.className = `sender text-uppercase`;
    b.appendChild(document.createTextNode(content.user));
    let span = document.createElement('span');
    span.classList.add('time');
    span.appendChild(document.createTextNode(` (${content.time})`));
    let p = document.createElement('p');
    p.classList.add('messagetext');
    p.appendChild(document.createTextNode(content.msg));
    div.appendChild(b);
    div.appendChild(span);
    div.appendChild(p);
    blockmessages.appendChild(div);
    //scroll
    blockmessages.scrollTop = blockmessages.scrollHeight;
}