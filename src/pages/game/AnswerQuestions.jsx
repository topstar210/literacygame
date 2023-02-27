import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AQcomponent from "../components/AQcomponent";
import localstore from "../../utils/localstore";
import API from "../../provider/API";
import utils from "../../utils";

const AnswerQuestions = ({ socket }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;

    const [gameData, setGameData] = useState({});
    const { currQuestion, questions, settings } = gameData;

    const [readonly, setReadonly] = useState(false);
    const [answer, setAnswer] = useState("");
    const [answerLen, setAnswerlen] = useState(0);
    const [writingTimer, setWritingTimer] = useState(0);

    const saveReply = () => {
        utils.clearInvervalVals();
        if (answer === "") return;

        const groupInfo = utils.getGroupByUsername(gameData?.settings?.group, gameData.users, state.username);
        console.log(gameData?.settings?.group, gameData.users, state.username, groupInfo);
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
            toast.success("Saved and Sent!");
            setTimeout(() => {
                socket.emit("get_answers", state?.gamepine, 1);
            }, 3000);
        })
    }

    useEffect(() => {
        const interval = setTimeout(() => {
            if(writingTimer > 0){
                const leftTime = writingTimer*1 - 1;
                // console.log("left writing time is ", leftTime);

                setWritingTimer(leftTime);
                localStorage.setItem("game_writing_time", leftTime);
                if(leftTime <= 0){
                    saveReply();
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [writingTimer]);

    // when load
    useEffect(() => {
        socket.emit('identity', state.gamepine, state.username);

        socket.on("start_game", (data) => {
            // console.log("start_game", data);
            localstore.saveObj("game_state", data);
            setGameData(data);
            socket.emit("get_answers", state?.gamepine);

            setWritingTimer(data.settings.writingTimer);
        })

        socket.on("start_vote", () => {
            const gameData = localstore.getObj("game_state") ?? {};
            const groupInfo = utils.getGroupByUsername(gameData?.settings?.group, gameData.users, state.username);
            navigate(`/game/${state.gamepine}/review`, { state: { ...state, ...gameData, groupInd: groupInfo.userGroupInd, nowVoting: true, role: 0 } });
        })

        const gameState = localstore.getObj("game_state") ?? {};
        if (gameState) {
            // console.log("gameState", gameState)
            setReadonly(localStorage.getItem('game_areply_readyonly') ?? false);
            setGameData(gameState);
        }

        const timer = localStorage.getItem("game_writing_time");
        setWritingTimer(timer ? timer*1 : state?.settings?.writingTimer); // when reload, writing timeing
    }, [])

    return (
        <div className="flex justify-center">
            <div className="h-screen w-full bg-blue-400 px-5 sm:px-10 md:px-20 pt-10 max-w-[1200px] animate-fadeIn">
                <div className="min-h-full bg-white rounded-t-3xl py-5">
                    {!gameData?.questions &&
                        <div className="loading">
                            <div className="flex justify-center">
                                <img src="/images/processing.gif" alt="" />
                            </div>
                            <div className="text-center text-4xl"> Please wait for the game to start...  </div>
                        </div>
                    }
                    {currQuestion > -1 &&
                        <AQcomponent
                            socket={socket}
                            state={state}
                            currQuestion={currQuestion}
                            questions={questions}
                            settings={settings}
                            countDownTime={writingTimer}
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
        </div>
    )
}

export default AnswerQuestions;