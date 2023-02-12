import { useState } from "react";
import { useNavigate } from "react-router-dom";
import cryptoRandomString from 'crypto-random-string';

const CreateGame = () => {
    const navigate = useNavigate();
    const [gamename, setGamename] = useState("");
    const [isShowGname, setIsShowGname] = useState(false);

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
        const gamepine = cryptoRandomString({length: 8});
        localStorage.setItem('game_name', gamename)
        localStorage.setItem('game_pine', gamepine)
        navigate(`/admin/${gamepine}/setting`, { 
            state: { gameName: gamename, gamePine: gamepine }
        });
    }

    /**
     * Action of when change input named "game name" 
     */
    const handleChangeGameName = (e) => {
        setGamename( e.target.value );
    }

    return (
        <div className="h-screen bg-blue-400 flex justify-center place-items-center">
            <div>
                <button 
                    onClick={ () => handleClickCreate() }
                    className="uppercase rounded-full border-4 border-white -mt-5 px-14 py-4 text-white text-3xl font-bold">create game</button>
                {isShowGname &&
                    <div className="px-5 absolute m-auto left-0 right-0 w-[300px]">
                        <div className="bg-slate-100 rounded-b-3xl p-2">
                            <div className="text-sky-600">Game Name: </div>
                            <input 
                                onChange={ (e) => handleChangeGameName(e) }
                                value={ gamename } 
                                type="text" 
                                className="p-1 my-2 focus:outline-none w-full" 
                                placeholder="Test Game" />

                            <div className="flex justify-end mb-2">
                                <button 
                                    onClick = { () => handleClickSaveGame() }
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