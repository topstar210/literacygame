import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";


const Topbar = () => {
    const sapp = useSelector((state) => state.sapp);

    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        if (sapp.accToken) {
            setIsLogin(true);
        }
    }, [sapp.accToken])

    return (
        <div className="flex justify-center fixed top-0 w-full">
            <div className="flex justify-between items-center w-full max-w-[1200px] px-5">
                <div className="log text-3xl font-bold text-white py-5">LiteracyGame</div>
                <div className="flex text-xl">
                    {!isLogin &&
                        <>
                            <div className="pr-3">Are you a teacher?</div>
                            <ul className="flex">
                                <li className="px-2 text-white font-bold">
                                    <Link to="/login">Login</Link>
                                </li>
                                <li className="px-2 text-white font-bold">
                                    <Link to="/register">Register</Link>
                                </li>
                            </ul>
                        </>
                    }
                </div>

            </div>
        </div>
    )
}

export default Topbar;