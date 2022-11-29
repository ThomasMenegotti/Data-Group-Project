import styles from './styles.module.css';
import { useState, useEffect, useRef } from 'react';

const BotMessages = ({ socket }) => {
    const [botMessagesReceived, setMessagesReceived] = useState([]);

    const messagesColumnRef = useRef(null);



    //Runs whenever a socket event is received from the server
    useEffect(() => {
        socket.on('bot_receive_message', (data) => {
            console.log(data);
            setMessagesReceived((state) => [
                ...state,
                {
                    message: data.message,
                    username: data.username,
                    __createdtime__: data.__createdtime__,
                },
            ]);
        });
        //remove event listener on component unmount
        return () => socket.off('bot_receive_message');
    }, [socket]);


    useEffect(() => {
        messagesColumnRef.current.scrollTop = messagesColumnRef.current.scrollHeight;
    }, [botMessagesReceived]);


    //dd/mm/yyyy, hh:mm:ss
    function formatDateFromTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }


    return (
        <div className={styles.messagesColumn} ref={messagesColumnRef}>
            {botMessagesReceived.map((msg, i) => (
                <div className={styles.messageBot} key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span className={styles.msgMetaBot}>{msg.username}</span>
                        <span className={styles.msgMetaBot}>
                            {formatDateFromTimestamp(msg.__createdtime__)}
                        </span>
                    </div>
                    <p className={styles.msgTextBot}>{msg.message}</p>
                    <br />
                </div>
            ))}
        </div>
    );
};

export default BotMessages;