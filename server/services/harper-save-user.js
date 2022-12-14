var axios = require('axios');


//This function is called everytime a new user joins any room, user will get added to DB with the corresponding room they joined
function harperSaveUser(username, room) {
    const dbUrl = process.env.HARPERDB_URL;
    const dbPw = process.env.HARPERDB_PW;
    if (!dbUrl || !dbPw) return null;

    var data = JSON.stringify({
        operation: 'insert',
        schema: 'realtime_chat_app',
        table: 'users',
        records: [
            {
                username,
                room,
            },
        ],
    });
    var config = {
        method: 'POST',
        url: dbUrl,
        headers: {
            'Content-Type': 'application/json',
            Authorization: dbPw,
        },
        data: data,
    };
    return new Promise((resolve, reject) => {
        axios(config)
            .then(function (response) {
                resolve(JSON.stringify(response.data));
            })
            .catch(function (error) {
                reject(error);
            });
    });
}

module.exports = harperSaveUser;