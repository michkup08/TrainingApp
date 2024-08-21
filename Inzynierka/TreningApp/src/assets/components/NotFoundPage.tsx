import { Link } from "react-router-dom";
import "./init";

const HomePage = () => {
    return(
        <div>
            <h1>404 Not Found</h1>
            <Link to='/'>Go home</Link>
        </div>
    )
}

export default HomePage