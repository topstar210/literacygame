import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AQcomponent from "../components/AQcomponent";
import localstore from "../../utils/localstore";
import API from "../../provider/API";

let interVal = null;

const AnswerQuestions = ({ socket }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;

    const [gameData, setGameData] = useState({});
    const { currQuestion, questions, settings } = gameData;

    const [countDownTime, setCountDownTime] = useState(0);
    const [readonly, setReadonly] = useState(false);
    const [ answer, setAnswer ] = useState("");
    const [ answerLen, setAnswerlen ] = useState(0);

    const saveReply = () => {
        clearInterval(interVal);
        if(answer === "") return;

        // calc my group ind
        let groupInd;
        const groupMems = gameData?.settings?.group;
        if(groupMems > 0 ){
            // const userLen = gameData.users.length;
            const uInd = gameData.users.findIndex((user)=>{
                return user.username === state.username;
            });
            if(uInd < 0){
                groupInd = 1    
            } else {
                groupInd = Math.ceil((uInd+1) / groupMems);
            }
        } else {
            groupInd = 1;
        }

        const aData = {
            ...gameData,
            quesInd: gameData.currQuestion,
            username: state.username,
            groupInd,
            answer
        }
        API.game.answer(aData).then((res) => {
            setReadonly(true);
            localStorage.setItem('game_areply_readyonly', true);
            toast.success("Saved and Replied Successfully");

            setTimeout(() => {
                navigate(`/game/${state.gamePine}/review`, { state: { aData, role:0 } });
                socket.emit("get_answers", aData?.gamepine)
            }, 3500);
        })
    }

    /**
     * function for count down
     * @param {Number} limitTime 
     */
    const countDownFuc = (limitTime) => {
        if (limitTime <= 0) return;
        let ind = 0;
        interVal = setInterval(() => {
            const currSec = limitTime - ind;
            localStorage.setItem("game_writing_time", currSec);
            setCountDownTime(currSec);
            if (currSec <= 0) {
                clearInterval(interVal);
                console.log('interVal bug',interVal)
                // saveReply();
                return;
            }
            ind++;
        }, 1000)
    }

    // when load
    useEffect(() => {
        // socket.emit('identity', state.gamePine, state.username);

        socket.on("do_game", (data) => {
            localstore.saveObj("game_state", data);
            countDownFuc(data?.settings?.writingTimer);
            setGameData(data);
            console.log("the game was started -----.....>.>");
        })

        const gameState = localstore.getObj("game_state");
        if (gameState) {
            countDownFuc(localStorage.getItem('game_writing_time'));
            setReadonly(localStorage.getItem('game_areply_readyonly'));
            setGameData(gameState);
        }
    }, [])

    return (
        <div className="h-screen w-full bg-blue-400 px-16 lg:px-20 pt-10">
            <ToastContainer />
            <div className="min-h-full bg-white rounded-t-3xl py-5">
                {!gameData?.questions &&
                    <div className="loading">
                        <div className="flex justify-center">
                            <img src="/images/processing.gif" alt="" />
                        </div>
                        <div className="text-center text-4xl"> Waiting To Start The Game ...  </div>
                    </div>
                }
                {currQuestion > -1 &&
                    <AQcomponent
                        socket={socket}
                        state={state}
                        currQuestion={currQuestion}
                        questions={questions}
                        settings={settings}
                        countDownTime={countDownTime}
                        clickSaveReply={saveReply}
                        readonly={readonly}
                        answer={answer}
                        setAnswer={setAnswer}
                        answerLen={answerLen}
                        setAnswerlen={setAnswerlen}
                    />
                }
            </div>
        </div>
    )
}

export default AnswerQuestions;