import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import localstore from "utils/localstore.js";

import API from "../../provider/API.js";
import Topbar from "../shared-components/Topbar.jsx";

const Firstpage = ({socket}) => {
    const navigate = useNavigate();
    const [isShowGname, setIsShowGname] = useState(false);
    const [pineCode, setPineCode] = useState("");
    const [username, setUsername] = useState("");

    /**
     * Action of when click button named "Start Game"
     */
    const clickStartGame = () => {
        if(!username) toast.warning("Name is Required Fields")
        if(!pineCode) toast.warning("Enter Valid Game Pin")
        API.game.checkpine({pineCode, username}).then((res)=>{
            if(res.data === "dont_exist_game"){
                toast.warning("Game pin does not exist. Please use another game pin");return;
            } else {
                socket.emit('identity', pineCode, username);
                navigate(`/game/${pineCode}`, {
                    state: { gamepine: pineCode, username }
                });
            }
        }).catch(err => {
            toast.error("Server Error!");
        })
    }

    useEffect(()=>{
        localstore.clearLocalStoreVariables()
    },[])

    return (
        <div className="h-screen bg-blue-400 flex justify-center place-items-center">
            <Topbar />
            <div className="animate-fadeIn -mt-[100px]">
                <button
                    onClick={() => setIsShowGname(!isShowGname)}
                    className="uppercase rounded-full border-4 border-white -mt-5 px-14 py-4 text-white text-3xl font-bold">start game</button>
                {isShowGname &&
                    <div className="px-5 absolute m-auto left-0 right-0 w-[300px]">
                        <div className="bg-slate-100 rounded-b-3xl p-2">
                            <input
                                type="text"
                                onChange={e => setPineCode(e.target.value)}
                                value={pineCode}
                                className="p-1 my-2 focus:outline-none w-full"
                                placeholder="Game Pin" />
                            <input
                                type="text"
                                onChange={e => setUsername(e.target.value)}
                                value={username}
                                className="p-1 my-2 focus:outline-none w-full"
                                placeholder="Your Name" />
                            <div className="flex justify-end mb-2">
                                <button
                                    onClick={() => clickStartGame()}
                                    className="uppercase text-white rounded-full bg-sky-600 py-1 px-5">start</button>
                            </div>
                        </div>
                    </div>
                }
            </div>
            <ToastContainer />
        </div>
    )
}

export default Firstpage;