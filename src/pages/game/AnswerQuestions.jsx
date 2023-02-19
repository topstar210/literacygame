import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AQcomponent from "../components/AQcomponent";
import localstore from "../../utils/localstore";
import API from "../../provider/API";
import utils from "../../utils";

const AnswerQuestions = ({ socket }) => {
    let interVal = null;
    let isCountDown = false;

    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;

    const [gameData, setGameData] = useState({});
    const { currQuestion, questions, settings } = gameData;

    const [countDownTime, setCountDownTime] = useState(0);
    const [readonly, setReadonly] = useState(false);
    const [answer, setAnswer] = useState("");
    const [answerLen, setAnswerlen] = useState(0);

    const saveReply = () => {
        clearInterval(interVal);
        if (answer === "") return;

        const groupInfo = utils.getGroupByUsername(gameData?.settings?.group, gameData.users, state.username);
        const aData = {
            ...gameData,
            quesInd: gameData.currQuestion,
            username: state.username,
            groupInd: groupInfo.userGroupInd,
            answer
        }
        API.game.answer(aData).then((res) => {
            setReadonly(true);
            localStorage.setItem('game_areply_readyonly', true);
            toast.success("Saved and Replied Successfully");

            setTimeout(() => {
                navigate(`/game/${state.gamePine}/review`, { state: { ...aData, role: 0 } });
                socket.emit("get_answers", aData?.gamepine)
            }, 3000);
        })
    }

    /**
     * function for count down
     * @param {Number} limitTime 
     */
    const countDownFuc = (limitTime) => {
        if (limitTime <= 0) return;
        if (isCountDown) return;
        isCountDown = true;

        let ind = 0;
        interVal = setInterval(() => {
            const currSec = limitTime - ind;
            localStorage.setItem("game_writing_time", currSec);
            setCountDownTime(currSec);
            if (currSec <= 0) {
                clearInterval(interVal);
                saveReply();
                console.log('interVal bug', interVal)
                return;
            }
            ind++;
        }, 1000)
    }

    // when load
    useEffect(() => {
        socket.emit('identity', state.gamePine, state.username);

        socket.on("do_game", (data) => {
            localstore.saveObj("game_state", data);
            countDownFuc(data?.settings?.writingTimer);
            setGameData(data);
            console.log("the game was started, socket", data);
        })

        const gameState = localstore.getObj("game_state") ?? {};
        console.log("the game was started, reload", gameState);
        countDownFuc(localStorage.getItem('game_writing_time'));
        setReadonly(localStorage.getItem('game_areply_readyonly') ?? false);
        setGameData(gameState);
    }, [])

    return (
        <div className="h-screen w-full bg-blue-400 px-16 lg:px-20 pt-10">
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
            <ToastContainer />
        </div>
    )
}

export default AnswerQuestions;