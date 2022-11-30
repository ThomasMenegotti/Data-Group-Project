var axios = require('axios');


//This will be called everytime someone sends a new message in the Chat App.
function harperSaveMessage(message, username, room) {
    const dbUrl = process.env.HARPERDB_URL;
    const dbPw = process.env.HARPERDB_PW;
    if (!dbUrl || !dbPw) return null;

    //JSON file == data
    var data = JSON.stringify({
        operation: 'insert',
        schema: 'realtime_chat_app',
        table: 'messages',
        records: [
            {
                message,
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

    //Checks to see if an error will occur
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

module.exports = harperSaveMessage;