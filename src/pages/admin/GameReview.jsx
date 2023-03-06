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
let voteUsers = [];

const GameReview = ({ socket, role }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;

    const [gameData, setGameData] = useState({});
    const { currQuestion, questions } = gameData;
    const [answers, setAnswers] = useState([]);
    const [readOnly, setReadOnly] = useState(localStorage.getItem('game_is_vote') ?? 0);
    const [groups, setGroups] = useState(1);
    const [currGroup, setCurrGroup] = useState(-1);
    const [writingTimer, setWritingTimer] = useState(0);
    const [votingTimer, setVotingTimer] = useState(0);

    /**
     * handle click answer to vote the answer
     * @param {Object} answer 
     * @param {Number} ind 
     */
    const handleClickVote = (answer, ind) => {
        if (readOnly * 1 === 1) {
            toast.warning('Voting has finished... Please wait for the next round.');
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
        utils.clearInvervalVals();
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
                socket.emit("get_answers", state?.gamepine, state.username);
            })
        } else {
            if (!state?.nowVoting) {
                startVoting();
            } else {
                gotoLeaderboard();
            }
        }
    }

    const gotoLeaderboard = () => {
        setWritingTimer(0);
        setVotingTimer(0);
        localStorage.removeItem("game_writing_time");
        localStorage.removeItem("game_voting_time");
        socket.emit("goto_leaderboard", state?.gamepine);
    }

    const startVoting = () => {
        setWritingTimer(0);
        setVotingTimer(0);
        localStorage.removeItem("game_writing_time");
        localStorage.removeItem("game_voting_time");
        navigate(`/admin/${state?.gamepine}/review?voting=1`, { state: { ...state, role: role, nowVoting: true } });
        socket.emit('start_vote', state?.gamepine);
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
     * rewrite the answer request
     * @param {answer_id} id 
     * @returns 
     */
    const rewriteRequest = (id) => {
        // if (!window.confirm("Do you want to delete?")) return;
        socket.emit("rewrite_answer_request", {
            gamepine: state?.gamepine,
            answerId: id
        })
    }

    /**
     * change event of group select
     * @param {Event} e 
     */
    const onChangeGroups = e => {
        const groupInd = e.target.value;
        getAnswers(groupInd < 0 ? null : groupInd);
        setCurrGroup(groupInd);
    }

    // when admin, display writing time
    useEffect(() => {
        if (!role) return;
        const interval = setTimeout(() => {
            if (writingTimer > 0) {
                const leftTime = writingTimer * 1 - 1;
                // console.log("left writing time is ", leftTime);

                setWritingTimer(leftTime);
                localStorage.setItem("game_writing_time", leftTime);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [writingTimer]);

    // voting timer
    useEffect(() => {
        const interval = setTimeout(() => {
            if (votingTimer > 0) {
                const leftTime = votingTimer * 1 - 1;
                // console.log("left voting time is ", leftTime);

                setVotingTimer(leftTime);
                localStorage.setItem("game_voting_time", leftTime);
                if (!role && leftTime <= 0) {
                    handleClickReady(role);
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [votingTimer]);

    useEffect(() => {
        if (state?.nowVoting) {
            const timer = localStorage.getItem("game_voting_time");
            setVotingTimer(timer ? timer * 1 : state?.settings.votingTimer); // when reload, voting timeing
        } else {
            const timer = localStorage.getItem("game_writing_time");
            setWritingTimer(timer ? timer * 1 : state?.settings.writingTimer); // when reload, writing timeing
        }
    }, [state?.nowVoting])

    // when load
    useEffect(() => {
        if (!role) {
            socket.emit('identity', state.gamepine, state.username);
        } else {
            socket.emit('identity_admin', state.gamepine)
        }

        socket.on("get_answers", (username) => {
            const params = new Proxy(new URLSearchParams(window.location.search), {
                get: (searchParams, prop) => searchParams.get(prop),
            });
            let queryVal = params.voting;
            if(state?.role && queryVal) {                
                if(voteUsers.indexOf(username) < 0) voteUsers.push(username);
                console.log(voteUsers.length, state.users.length);
                if(voteUsers.length >= state.users.length){
                    voteUsers = [];
                    gotoLeaderboard();
                }
            }
            getAnswers();
        })

        socket.on("goto_leaderboard", () => {
            localStorage.setItem("game_is_vote", 0);
            navigate(`/game/${state?.gamepine}/leaderboard`, { state: { ...state, role: role } });
        })

        const groups = utils.getTotalGroup(state.settings?.group, localstore.getObj('game_state').users ?? []);
        setGroups(groups);

        const gameState = localstore.getObj('game_state');
        setGameData(gameState);
        if (!role && !state?.isFinalsVote) {
            getAnswers(state?.groupInd);
        } else getAnswers();

        return () => {
            socket.off('get_answers');
            socket.off('goto_leaderboard');
        };
    }, [])

    return (
        <div className="flex justify-center">
            <div className="h-screen w-full bg-blue-400 px-5 sm:px-10 md:px-20 max-w-[1200px] animate-fadeIn">
                <ToastContainer />
                <div className="flex flex-wrap py-3 items-center justify-between px-5 text-white">
                    {!role ? <div className="text-xl font-bold">{state?.isFinalsVote ? "Finals " : ""} Vote for 3 best answers:</div> : ""}
                    {!role && !Boolean(readOnly * 1) &&
                        <button
                            onClick={() => handleClickReady(role)}
                            className="bg-white text-sky-600 font-semibold px-5 border rounded-full text-2xl">
                            {state?.isFinalsVote ? "Done" : "Submit!"}
                        </button>
                    }
                    {role && !state?.isFinalsVote &&
                        <>
                            <select className="text-sky-600" onChange={(e) => onChangeGroups(e)} defaultValue={currGroup}>
                                <option value={-1}>All</option>
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
                                className="bg-white text-sky-600 font-semibold px-5 border rounded-full text-2xl">
                                {state?.nowVoting ? "Show Leaderboard" : "Start Voting"}
                            </button>
                        </>
                    }
                    {role && state?.isFinalsVote &&
                        <>
                            <div className="text-xl font-bold">Finals Vote</div>
                            <button
                                onClick={() => handleClickReady(role)}
                                className="bg-white text-sky-600 font-semibold px-5 border rounded-full text-2xl">
                                Complete Voting
                            </button>
                        </>
                    }
                </div>
                <div className="min-h-full bg-white rounded-t-3xl py-5">
                    <div>
                        {currQuestion > -1 &&
                            <div className="-ml-6 flex justify-between items-center">
                                <div className="text-white text-2xl rounded-l-full mb-5 bg-sky-600 font-bold py-2 pl-7 break-words w-11/12">
                                    <span className="uppercase mr-3">
                                        Question {currQuestion + 1}:
                                    </span>
                                    {questions[currQuestion].val}
                                </div>
                                <div className="font-bold text-xl text-custom">
                                    {state?.nowVoting ? votingTimer : writingTimer}
                                    <FontAwesomeIcon icon="clock" className="mx-1" />
                                </div>
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
                                    rewriteRequest={rewriteRequest}
                                    handleClickVote={handleClickVote}
                                    onBlurUsername={onBlurUsername} />
                            )
                        }
                        {
                            answers?.length === 0 && <div className="flex justify-center text-2xl"> No Answers </div>
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
        </div>
    )
}

export default GameReview;