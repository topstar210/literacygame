import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axiosJWT from "provider/API";

const Topbar = () => {
    const navigate = useNavigate();
    const sapp = useSelector((state) => state.sapp);

    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        if (sapp.accToken && sapp.accToken!=="Invalid_Token") {
            setIsLogin(true);
        }
    }, [sapp.accToken])

    const logout = () => {
        axiosJWT.auth.logout().then(()=>{
            // navigate("/")
            window.location.href = "/";
        })
    }

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
                    {isLogin && 
                    <button className="text-white" onClick={()=>logout()}>Logout</button>
                    }
                </div>

            </div>
        </div>
    )
}

export default Topbar;