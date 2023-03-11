import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cryptoRandomString from 'crypto-random-string';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from "../../provider/API.js";
import localstore from "utils/localstore.js";
import { useSelector } from "react-redux";
import Topbar from "../shared-components/Topbar.jsx";

const CreateGame = ({socket}) => {
    const navigate = useNavigate();
    const [gamename, setGamename] = useState("");
    const [isShowGname, setIsShowGname] = useState(false);
    const sapp = useSelector((state) => state.sapp);
    useEffect(() => {
        if(sapp.accToken && sapp.accToken==="Invalid_Token"){
            navigate("/login");
        }
    },[sapp.accToken])

    /**
     * Action of when click button named "Create Game"
     */
    const handleClickCreate = () => {
        setIsShowGname(!isShowGname);
    }

    /**
     * Action of when click button named "save"
     */
    const handleClickSaveGame = () => {
        const gamepine = cryptoRandomString({ length: 8 });
        API.game.create({
            gamename, gamepine
        }).then(() => {
            socket.emit('joinGame', gamepine);

            localStorage.setItem('game_name', gamename);
            localStorage.setItem('game_pine', gamepine);
            navigate(`/admin/${gamepine}/setting`, {
                state: { gamename: gamename, gamepine: gamepine }
            });
        }).catch(err => {
            toast.error("Server Error!");
        })
    }
    
    useEffect(()=>{
        localstore.clearLocalStoreVariables();
    },[])

    return (
        <div className="h-screen bg-blue-400 flex justify-center place-items-center">
            <ToastContainer />
            <Topbar />
            <div className="animate-fadeIn">
                <button
                    onClick={() => handleClickCreate()}
                    className="uppercase rounded-full border-4 border-white -mt-5 px-14 py-4 text-white text-3xl font-bold">create game</button>
                {isShowGname &&
                    <div className="px-5 absolute m-auto left-0 right-0 w-[300px]">
                        <div className="bg-slate-100 rounded-b-3xl p-2">
                            {/* <div className="text-sky-600">Game Name: </div> */}
                            <input
                                onChange={(e) => setGamename(e.target.value)}
                                value={gamename}
                                type="text"
                                className="p-2 my-2 focus:outline-none w-full"
                                placeholder="Test Game" />

                            <div className="flex justify-end mb-2">
                                <button
                                    onClick={() => handleClickSaveGame()}
                                    className="uppercase text-white rounded-full bg-sky-600 py-1 px-5">save</button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default CreateGame;