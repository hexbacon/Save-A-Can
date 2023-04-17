import { UserAuth } from "../components/auth/AuthContext";
import { useNavigate } from "react-router-dom";
const Prediction = () => {
    const { user, logout } = UserAuth();
    const navigate = useNavigate();
    const handleLogOut = async () => {
        try {
            await logout();
            navigate('/');
            console.log("You are logged out!");
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <h1>Welcome</h1>
            <p>User Email: {user && user.email}</p>
            <button onClick={handleLogOut}>LogOut</button>
        </>
    )
}

export default Prediction;