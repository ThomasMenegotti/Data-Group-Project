import styles from './styles.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RoomAndUsers = ({ socket, username, room }) => {
    const [roomUsers, setRoomUsers] = useState([]);

    //Checks for Users that are currently in the chat room
    const navigate = useNavigate();
    useEffect(() => {
        socket.on('chatroom_users', (data) => {
            console.log(data);
            setRoomUsers(data);
        });
        return () => socket.off('chatroom_users');
    }, [socket]);

    //If user presses 'leave' then it will run this function
    const leaveRoom = () => {
        const __createdtime__ = Date.now();
        socket.emit('leave_room', { username, room, __createdtime__ });
        //Redirect to the home page
        navigate('/', { replace: true });
    };

    //This will return the users and room column (left) in our chat room
    return (
        <div className={styles.roomAndUsersColumn}>
            <h2 className={styles.roomTitle}>{room}</h2>

            <div>
                {roomUsers.length > 0 && <h5 className={styles.usersTitle}>Users:</h5>}
                <ul className={styles.userList}>
                    {roomUsers.map((user) => (
                        <li
                            style={{
                                fontWeight: `${user.username === username ? 'bold' : 'normal'}`,
                            }}
                            key={user.id}
                        >
                            {user.username}
                        </li>
                    ))}
                </ul>
            </div>

            <button className='btn btn-outline' onClick={leaveRoom}>
                Leave
            </button>
        </div>
    );
};

export default RoomAndUsers;