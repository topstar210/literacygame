import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import localstore from '../../utils/localstore';
import Answercard from '../../components/Answercard';
import API from '../../provider/API';
import utils from '../../utils';

let voteInfo = [{
    point: 50, answerId: ""
}, {
    point: 25, answerId: ""
}, {
    point: 10, answerId: ""
}];
let myVote = [1, 2, 3];

const GameReview = ({ socket, role }) => {
    let voteInterVal = null;
    let isCountDown = false;
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;

    const [gameData, setGameData] = useState({});
    const { currQuestion, questions } = gameData;
    const [answers, setAnswers] = useState([]);
    const [readOnly, setReadOnly] = useState(localStorage.getItem('game_is_vote') ?? 0);
    const [groups, setGroups] = useState(1);
    const [currGroup, setCurrGroup] = useState(1);
    const [countDownTime, setCountDownTime] = useState(0);


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
        if (currVote > 3) return;

        if (!answer?.myVote) {
            myVote = myVote.sort();
            vote = myVote[0];
            myVote.splice(0, 1);
            console.log('vote', vote);
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
    const getAnswers = (groupInd = null) => {
        if (!state?.role && myVote.length < 3) return;  // user is voting now so return..

        API.game.getAnswer({
            role: state?.role,
            gamepine: state?.gamepine,
            quesInd: state?.currQuestion,
            groupInd: groupInd ? groupInd : state?.groupInd,
            isFinalsVote: state?.isFinalsVote,
            groupCnt: groups
        }).then((res) => {
            setAnswers(res.data);
        })
    }

    /**
     * when click ready btn
     * @param {Number} role 1: admin, 0: user
     */
    const handleClickReady = (role) => {
        if (!role) {
            if (readOnly * 1) return;

            myVote = [1, 2, 3];
            API.game.saveVote({
                voteInfo,
                gamepine: state?.gamepine,
                quesInd: state?.currQuestion,
                groupInd: state?.groupInd,
                isFinalsVote: state?.isFinalsVote
            }).then((res) => {
                setReadOnly(true)
                localStorage.setItem("game_is_vote", 1);
                socket.emit("get_answers", state?.gamepine);
            })
        } else {
            socket.emit("goto_leaderboard", state?.gamepine);
        }
    }
    /**
     * changing username
     * @param {Event} e 
     */
    const onBlurUsername = (e, id) => {
        API.game.changeUsername({
            username: e.target.value,
            gamepine: state?.gamepine,
            answerId: id
        }).then(() => {
            toast.success("Username Successfully Changed.");
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
            gamepine: state?.gamepine,
            answerId: id
        }).then(() => {
            const deleteAnswers = [...answers].filter((answer) => answer._id !== id);
            setAnswers(deleteAnswers);
            toast.success("Successfully Removed.")
        })
    }

    /**
     * change event of group select
     * @param {Event} e 
     */
    const onChangeGroups = e => {
        const groupInd = e.target.value;
        getAnswers(groupInd);
        setCurrGroup(groupInd);
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
        voteInterVal = setInterval(() => {
            const currSec = limitTime - ind;
            localStorage.setItem("game_voting_time", currSec);
            setCountDownTime(currSec);
            if (currSec <= 0) {
                clearInterval(voteInterVal);
                handleClickReady(role);
                return;
            }
            ind++;
        }, 1000)
    }

    useEffect(() => {
        if (!role) {
            socket.emit('identity', state.gamepine, state.username);
        } else {
            socket.emit('identity_admin', state.gamepine)
        }

        socket.on("answer_list", ({ users }) => {
            getAnswers();
        })

        socket.on("goto_leaderboard", () => {
            localStorage.setItem("game_is_vote", 0);
            navigate(`/game/${state?.gamepine}/leaderboard`, { state: { ...state, role: role } });
        })

        const groups = utils.getTotalGroup(state.settings?.group, localstore.getObj('game_state').users ?? []);
        setGroups(groups);

        countDownFuc(localStorage.getItem('game_voting_time') ?? state?.settings?.votingTimer);

        const gameState = localstore.getObj('game_state');
        setGameData(gameState);
        getAnswers();
    }, [])

    return (
        <div className="h-screen w-full bg-blue-400 px-16 lg:px-20">
            <ToastContainer />
            <div className="h-12 flex items-center justify-between px-5 text-white">
                {!role ? <div className="text-xl font-bold">{state?.isFinalsVote ? "Finals " : ""} Vote for 3 best answers:</div> : ""}
                {!role && !Boolean(readOnly * 1) &&
                    <button
                        onClick={() => handleClickReady(role)}
                        className="bg-white text-sky-600 font-semibold px-2 border hover:border-transparent rounded">
                        {state?.isFinalsVote ? "Done" : "Ready For Next"}
                    </button>
                }
                {role && !state?.isFinalsVote &&
                    <>
                        <select className="text-sky-600" onChange={(e) => onChangeGroups(e)} defaultValue={currGroup}>
                            {
                                [...Array(groups)].map(
                                    (v, i) =>
                                        <option value={i + 1} key={i}>
                                            Group {i + 1}
                                        </option>
                                )
                            }
                        </select>
                        <button
                            onClick={() => handleClickReady(role)}
                            className="bg-white text-sky-600 font-semibold px-2 border hover:border-transparent rounded">
                            Go to Leaderboard
                        </button>
                    </>
                }
                {role && state?.isFinalsVote &&
                    <>
                        <div className="text-xl font-bold">Finals Vote</div>
                        <button
                            onClick={() => handleClickReady(role)}
                            className="bg-white text-sky-600 font-semibold px-2 border hover:border-transparent rounded">
                            Complete Voting
                        </button>
                    </>
                }
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
                            {
                                !role &&
                                <div className="font-bold text-xl text-custom">
                                    {countDownTime}
                                    <FontAwesomeIcon icon="clock" className="mx-1" />
                                </div>
                            }
                        </div>
                    }
                    {answers.length > 0 &&
                        answers.map((v, i) =>
                            <Answercard
                                ind={i}
                                key={i} v={v}
                                role={role}
                                readOnly={readOnly}
                                isFinalsVote={state?.isFinalsVote}
                                removeAnswer={removeAnswer}
                                handleClickVote={handleClickVote}
                                onBlurUsername={onBlurUsername} />
                        )
                    }
                    {
                        answers?.length === 0 && <div className="flex justify-center"> No Answers </div>
                        // <div className="loading">
                        //     <div className="flex justify-center">
                        //         <img src="/images/processing.gif" alt="" />
                        //     </div>
                        //     <div className="text-center text-4xl"> Waiting Answers ...  </div>
                        // </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default GameReview;