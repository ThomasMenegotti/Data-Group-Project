import styles from './styles.module.css';
import { useNavigate } from 'react-router-dom';

const Home = ({ username, setUsername, room, setRoom, socket }) => {

    const navigate = useNavigate();

    const joinRoom = () => {
        if (room !== '' && username !== '') {
            socket.emit('join_room', { username, room });
        }
        navigate('/chat', { replace: true });
    }

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <h1>{'Chat Room Testing!'}</h1>
                <div className={styles.username}>
                    <label for='username'>Username:</label>
                    <input
                        id='username'
                        className={styles.input}
                        placeholder='Input Username Here'
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <select
                    className={styles.input}
                    id='chatRoomList'
                    onChange={(e) => setRoom(e.target.value)}
                >
                    <option>Please Select Your Room</option>
                    <option value='dms'>Data Management Systems</option>
                    <option value='daa'>Design & Analys. of Algorithms</option>
                    <option value='mca'>Micropro. & Computer Architect</option>
                    <option value='sp'>Systems Programming</option>
                    <option value='sda'>Software Design & Architecture</option>
                </select>

                <button
                    className='btn btn-secondary'
                    style={{ width: '100%' }}
                    onClick={joinRoom}
                >
                    Start Chatting
                </button>
            </div>
        </div>
    );
};

export default Home;