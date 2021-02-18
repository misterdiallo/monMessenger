const users = [];
// ajouter un utlisateur pour un sujet
function userJoin(id, user, sujet) {
    const userinfo = { id, user, sujet };
    users.push(userinfo);
    return userinfo;
}
// l'utilisateur actuel
function getUser(id) {
    return users.find(users => users.id === id);
}
// Quand l'utilisateur quitte
function leaveUser(id) {
    const index = users.find(users => users.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// les utilisateurs d'un sujet
function getSujetUsers(sujet) {
    return users.filter(users => users.sujet === sujet);
}

module.exports = {
    userJoin,
    getUser,
    leaveUser,
    getSujetUsers
};