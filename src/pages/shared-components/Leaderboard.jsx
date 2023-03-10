import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import API from "../../provider/API";
import utils from "../../utils";
import localstore from "../../utils/localstore";

const Leaderboard = ({ socket }) => {
    let navigate = useNavigate();
    let { gamepine } = useParams();
    const location = useLocation();
    const { state } = location;
    const { role } = state ?? {};

    const [answers, setAnswers] = useState([]);
    const [groups, setGroups] = useState(1);
    const [currGroup, setCurrGroup] = useState(1);
    const [extraKey, setExtraKey] = useState();

    const completeQuestion = (role) => {
        if (groups > 1 && !state?.isFinalsVote) {
            socket.emit("goto_finals_vote", state?.gamepine);
        } else {
            socket.emit("goto_next_question", state?.gamepine);
        }
    }

    /**
     * change event of group select
     * @param {Event} e 
     */
    const onChangeGroups = e => {
        const groupInd = e.target.value;
        console.log(groupInd)
        getAnswers(groupInd < 0 ? null : groupInd);
        setCurrGroup(groupInd);
    }

    const getAnswers = (gInd) => {
        let params = {
            gamepine,
            quesInd: state?.currQuestion,
        }
        if (!state?.isFinalsVote) {
            params.groupInd = gInd
        } else {
            params.byFinals = state?.isFinalsVote;
        }
        API.game.getAnswer(params).then((res) => {
            setAnswers(res.data);
        })
    }

    useEffect(() => {
        if (!role) {
            socket.emit('identity', state.gamepine, state.username);
        } else {
            socket.emit('identity_admin', state.gamepine)
        }

        socket.on('goto_next_question', () => {
            const nextQind = state?.currQuestion + 1;
            localstore.saveObj("game_state", { ...localstore.getObj("game_state"), currQuestion: nextQind })
            localStorage.removeItem('game_areply_readyonly');
            localStorage.removeItem('game_writing_time');
            localStorage.removeItem('game_voting_time');

            let navlink = role ? `/admin` : `/`;
            if (state?.questions?.length !== nextQind) {
                navlink = role ? `/admin/${state?.gamepine}/review` : `/game/${state?.gamepine}`;
                navigate(navlink, { state: { ...state, currQuestion: nextQind, isFinalsVote: false, nowVoting: false } });
            } else {
                // window.location.href = navlink;
                navigate(navlink)
            }
        });

        socket.on('goto_finals_vote', () => {
            localStorage.removeItem('game_voting_time');
            let navlink = role ? `/admin/${state?.gamepine}/review` : `/game/${state?.gamepine}/review`;
            navigate(navlink, { state: { ...state, isFinalsVote: true } });
        })

        const groups = utils.getTotalGroup(state?.settings?.group, localstore.getObj("game_state").users ?? []);
        setGroups(groups);
        getAnswers();

        const currQues = state.questions[state.currQuestion];
        setExtraKey(currQues?.keywords)

        return () => {
            socket.off('goto_next_question');
            socket.off('goto_finals_vote');
        };
    }, [])

    return (
        <div className="flex justify-center">
            <div className="fixed left-0 top-20 max-w-[150px]">
                {extraKey &&
                    extraKey.map((v, i) =>
                        <div key={i} className="bg-red-600 rounded-r-full text-white text-lg px-2 mb-3">
                            {v[0]}: {v[1]}
                        </div>
                    )
                }
            </div>
            <div className="h-screen w-full bg-blue-400 px-5 sm:px-10 md:px-20 max-w-[1200px] animate-fadeIn">
                <div className="flex flex-wrap py-3 items-center justify-between px-5 text-white">
                    {role &&
                        <>
                            {!state?.isFinalsVote &&
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
                            }
                            {state?.isFinalsVote &&
                                <div className="uppercase text-xl font-bold">leaderboard</div>
                            }
                            <div>
                                <button
                                    onClick={() => utils.exportResultToCSV(answers, state)}
                                    className="bg-white text-sky-600 font-semibold px-5 border rounded-full text-2xl"
                                    title="Download The Result to CSV File">
                                    <FontAwesomeIcon icon="download" className="" />
                                </button>
                                <button
                                    onClick={() => completeQuestion(role)}
                                    className="bg-white text-sky-600 font-semibold px-5 border rounded-full text-2xl">
                                    {groups > 1 ? (state?.isFinalsVote ? (state?.questions.length !== (state?.currQuestion + 1) ? "Next Question" : "Complete") : "Finals Vote") : (state?.questions.length !== (state?.currQuestion + 1) ? "Next Question" : "Complete")}
                                </button>
                            </div>
                        </>
                    }
                </div>
                <div className="bg-white rounded-t-3xl py-5 flex justify-around">
                    {answers.length === 0 &&
                        <div className="text-2xl">No Results</div>
                    }
                    {answers.length > 0 &&
                        <div className="w-1/3 px-3 lg:px-5 flex">
                            <div className="bg-sky-600 rounded-t-3xl pt-3">
                                <div className="flex justify-center text-white text-3xl">
                                    {answers[0].username}
                                </div>
                                <div className="flex justify-center py-34">
                                    <img src="/images/winner1.png" width="80%" alt="winner 1" />
                                </div>
                                <div className="flex justify-center text-white text-xl">
                                    {role &&
                                        <div className="flex">
                                            Votes: {!state?.isFinalsVote ? (answers[0].votes ? answers[0].votes : 0) : (answers[0].finalsVotes ? answers[0].finalsVotes : 0)}  &nbsp;&nbsp;
                                            <div className="text-left">
                                                <div>
                                                    Points: {!state?.isFinalsVote ? (answers[0].points ? answers[0].points : 0) : (answers[0].finalsPoints ? answers[0].finalsPoints : 0)}
                                                </div>
                                                {/* <div>
                                                    Extra: {answers[0].extraPoints}
                                                </div> */}
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div className="flex justify-center p-5">
                                    {answers[0].answer}
                                </div>
                            </div>
                        </div>
                    }

                    {answers.length > 1 &&
                        <div className="w-2/3 flex flex-col">
                            <div className="flex justify-between items-end">
                                <div className="flex flex-col px-3 lg:px-5 w-1/2">
                                    <div className="flex justify-center text-sky-600 text-3xl my-3">
                                        {answers[1].username}
                                    </div>
                                    <div className="bg-sky-600 rounded-t-3xl pt-5 pb-10">
                                        <div className="flex justify-center">
                                            <img src="/images/winner2.png" alt="winner 2" width="75%" />
                                        </div>
                                        <div className="flex justify-center text-white text-xl">
                                            {role &&
                                                <div className="flex">
                                                    Votes: {!state?.isFinalsVote ? (answers[1].votes ? answers[1].votes : 0) : (answers[1].finalsVotes ? answers[1].finalsVotes : 0)}  &nbsp;&nbsp;
                                                    <div className="text-left">
                                                        <div>
                                                            Points: {!state?.isFinalsVote ? (answers[1].points ? answers[1].points : 0) : (answers[1].finalsPoints ? answers[1].finalsPoints : 0)}
                                                        </div>
                                                        {/* <div>
                                                            Extra: {answers[1].extraPoints}
                                                        </div> */}
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                {answers.length > 2 &&
                                    <div className="flex flex-col px-3 lg:px-5 mt-10 w-1/2">
                                        <div className="flex justify-center text-sky-600 text-3xl my-3">
                                            {answers[2].username}
                                        </div>
                                        <div className="bg-sky-600 rounded-t-3xl pt-5 w-full">
                                            <div className="flex justify-center">
                                                <img src="/images/winner3.png" alt="winner 2" width="70%" />
                                            </div>
                                            <div className="flex justify-center text-white text-xl">
                                                {
                                                    role &&
                                                    <div className="flex">
                                                        Votes: {!state?.isFinalsVote ? (answers[2].votes ? answers[2].votes : 0) : (answers[2].finalsVotes ? answers[2].finalsVotes : 0)}  &nbsp;&nbsp;
                                                        <div className="text-left">
                                                            <div>
                                                                Points: {!state?.isFinalsVote ? (answers[2].points ? answers[2].points : 0) : (answers[2].finalsPoints ? answers[2].finalsPoints : 0)}
                                                            </div>
                                                            {/* <div>
                                                                Extra: {answers[2].extraPoints}
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                            {answers.length > 3 &&
                                ([...answers].splice(3, answers.length)).map((answer, i) =>
                                    <div className="mt-4 -ml-5" key={i}>
                                        <div className="flex justify-between p-4 rounded-full bg-sky-600 mb-4 ml-5 text-xl text-white pl-4 w-[101%]">
                                            <div className="flex">
                                                <div className="rounded-full p-1 h-8 w-8 bg-white text-sky-600 flex items-center justify-center mr-4">{i + 1}</div>
                                                {answer.username}
                                            </div>
                                            <div className="text-white text-xl">
                                                {role &&
                                                    <>
                                                        Votes: {!state?.isFinalsVote ? (answer.votes ? answer.votes : 0) : (answer.finalsVotes ? answer.finalsVotes : 0)}  &nbsp;&nbsp;
                                                        Points: {!state?.isFinalsVote ? (answer.points ? answer.points : 0) : (answer.finalsPoints ? answer.finalsPoints : 0)}
                                                        {/* (Extra: {answer.extraPoints}) */}
                                                    </>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Leaderboard;