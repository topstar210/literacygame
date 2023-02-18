import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import localstore from '../../utils/localstore';
import Answercard from '../../components/Answercard';
import API from '../../provider/API';

let voteInfo = [{
    point: 50, answerId: ""
}, {
    point: 25, answerId: ""
}, {
    point: 10, answerId: ""
}];
let myVote = [1, 2, 3];

const GameReview = ({ socket, role }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;

    const [gameData, setGameData] = useState({});
    const { currQuestion, questions } = gameData;
    const [answers, setAnswers] = useState([]);
    const [readOnly, setReadOnly] = useState(localStorage.getItem('game_is_vote') ?? 0);

    /**
     * handle click answer to vote the answer
     * @param {Object} answer 
     * @param {Number} ind 
     */
    const handleClickVote = (answer, ind) => {
        if (readOnly * 1 === 1) {
            toast.warning('Voting finished... Please wait to next round.');
            return;
        }

        let currVote = 1;
        let vote = 0;

        currVote = answer?.myVote ? answer.myVote : 4 - myVote.length;

        if (!answer?.myVote) {
            myVote = myVote.sort();
            vote = myVote[0];
            myVote.splice(0, 1);
            voteInfo[vote * 1 - 1].answerId = answer?._id;
        } else {
            myVote.push(answer?.myVote);
            vote = 0;
            voteInfo[answer?.myVote * 1 - 1].answerId = "";
        }

        let tempAnswers = [...answers];
        tempAnswers[ind]['myVote'] = vote;
        setAnswers(tempAnswers);
    }

    /**
     * get answers from backend api
     */
    const getAnswers = () => {
        API.game.getAnswer({
            role: state?.role,
            gamepine: state?.aData?.gamepine,
            quesInd: state?.aData?.currQuestion,
            groupInd: state?.aData?.groupInd
        }).then((res) => {
            setAnswers(res.data);
        })
    }

    /**
     * when click ready btn
     * @param {Number} role 1: admin, 0: user
     */
    const handleClickReady = (role) => {
        if (readOnly * 1) return;
        if (!role) {
            API.game.saveVote({
                voteInfo,
                gamepine: state?.aData?.gamepine,
                quesInd: state?.aData?.currQuestion,
                groupInd: state?.aData?.groupInd
            }).then((res) => {
                setReadOnly(true)
                localStorage.setItem("game_is_vote", 1);
                socket.emit("get_answers", state?.aData?.gamepine);
            })
        } else {
            navigate(`/game/${state?.aData?.gamepine}/leaderboard`);
            socket.emit("goto_leaderboard", state?.aData?.gamepine);
        }
    }
    /**
     * changing username
     * @param {Event} e 
     */
    const onBlurUsername = (e, id) => {
        API.game.changeUsername({
            username: e.target.value,
            gamepine: state?.aData?.gamepine,
            answerId: id
        }).then(() => {
            toast.success("Successfully Changed.")
        })
    }


    /**
     * delete answer by admin
     * @param {answer_id} id 
     * @returns 
     */
    const removeAnswer = (id) => {
        if (!window.confirm("Do you want to delete?")) return;
        API.game.removeAnswer({
            gamepine: state?.aData?.gamepine,
            answerId: id
        }).then(() => {
            const deleteAnswers = [...answers].filter((answer) => answer._id !== id);
            setAnswers(deleteAnswers);
            toast.success("Successfully Removed.")
        })
    }

    useEffect(() => {
        socket.on("answer_list", () => {
            getAnswers();
        })
        socket.on("goto_leaderboard", () => {
            localStorage.setItem("game_is_vote", 0);
            navigate(`/game/${state?.aData?.gamepine}/leaderboard`);
        })

        const gameState = localstore.getObj('game_state');
        if (gameState) {
            getAnswers();
            setGameData(gameState);
        }
    }, [])

    return (
        <div className="h-screen w-full bg-blue-400 px-16 lg:px-20">
            <ToastContainer />
            <div className="h-12 flex items-center px-5 text-white">
                {!role ? "Vote for 3 best answers:" : ""}
            </div>
            <div className="min-h-full bg-white rounded-t-3xl py-5">
                <div>
                    {currQuestion > -1 &&
                        <div className="-ml-6 flex justify-between items-center">
                            <div className="text-white text-2xl rounded-l-full mb-4 bg-sky-600 font-bold py-2 pl-7 break-words w-11/12">
                                <span className="uppercase mr-3">
                                    Question {currQuestion + 1}:
                                </span>
                                {questions[currQuestion].val}
                            </div>
                        </div>
                    }
                    {answers.length > 0 &&
                        answers.map((v, i) =>
                            <Answercard
                                ind={i}
                                key={i} v={v} role={role}
                                removeAnswer={removeAnswer}
                                handleClickVote={handleClickVote}
                                onBlurUsername={onBlurUsername} />
                        )
                    }
                    {
                        answers?.length === 0 &&
                        <div className="loading">
                            <div className="flex justify-center">
                                <img src="/images/processing.gif" alt="" />
                            </div>
                            <div className="text-center text-4xl"> Waiting Answers ...  </div>
                        </div>
                    }
                </div>
                <div className="flex justify-end px-2">
                    {
                        Boolean(readOnly * 1) &&
                        <button
                            onClick={() => handleClickReady(role)}
                            className="uppercase bg-transparent hover:bg-sky-600 text-sky-600 font-semibold hover:text-white py-2 px-4 border border-sky-600 hover:border-transparent rounded">
                            {role ? "Complete" : "Ready For Next"}
                        </button>
                    }
                </div>
            </div>
        </div>
    )
}

export default GameReview;