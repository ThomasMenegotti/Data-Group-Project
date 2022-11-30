import styles from './styles.module.css';
import React, { useState } from 'react';


/*FOR FUTURE FUNCTIONALITY*/
const BotSendMessage = ({ socket, username, room }) => {
    const [message, setMessage] = useState('');

    const botSendMessage = () => {
        if (message !== '') {
            const __createdtime__ = Date.now();
            //Send message to server. We can't specify who we send the message to from the front
            socket.emit('bot_send_message', { username, room, message, __createdtime__ });
            setMessage('');
        }
    };


    return (
        <div className={styles.sendMessageContainer}>
            <input
                className={styles.messageInputBot}
                placeholder='Message...'
                onChange={(e) => setMessage(e.target.value)}
                value={message}
            />
            <button className='btn btn-primary' onClick={botSendMessage}>
                Send Message
            </button>
        </div>
    );
};

export default BotSendMessage;