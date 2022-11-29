import styles from './styles.module.css';
import RoomAndUsersColumn from './room-and-users';
import MessagesReceived from './messages';
import BotMessagesReceived from './botmessages';
import SendMessage from './send-message';

const Chat = ({ username, room, socket }) => {
    if (username === 'ChatBot') {
        return (
            <div className={styles.chatContainer}>

                <RoomAndUsersColumn socket={socket} username={username} room={room} />

                <div>
                    <BotMessagesReceived socket={socket} />
                    <SendMessage socket={socket} username={username} room={room} />
                </div>
            </div>
        );
    }
    else {
        return (
            <div className={styles.chatContainer}>

                <RoomAndUsersColumn socket={socket} username={username} room={room} />

                <div>
                    <MessagesReceived socket={socket} />
                    <SendMessage socket={socket} username={username} room={room} />
                </div>
            </div>
        );
    }
};

export default Chat;