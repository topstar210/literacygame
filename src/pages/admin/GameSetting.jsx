import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from "../../provider/API.js";
import AddQuestion from "../../components/AddQuestion";
import Slider from "../../components/Slider";
import localstore from "../../utils/localstore.js";

const questionObj = { 
    val: "", 
    img: "", 
    keywords:[] 
}

const GameSetting = ({ socket }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const { gamename, gamepine } = state ?? { gamename: localStorage.game_name, gamepine: localStorage.game_pine };

    const [startLoad, setStartLoad] = useState(false);
    const [currentusers, setCurrentusers] = useState([]);
    const [questions, setQuestions] = useState([{...questionObj}]);
    const [currRule, setCurrRule] = useState('C');
    const [settings, setSettings] = useState({
        group: 10,
        limitChars: 800,
        writingTimer: 300,
        votingTimer: 70
    });

    /**
     * handle event of changing of question textarea
     * @param {Event} e 
     * @param {Number} qInd 
     */
    const changeQuestion = (e, qInd) => {
        let tempQ = [...questions];
        tempQ[qInd]['val'] = e.target.value;
        setQuestions(tempQ);
    }

    /**
     * add extra keyword
     * @param {Object} data 
     * @param {Number} qInd 
     */
    const addExtraKeyword = (data, qInd) => {
        let tempQ = [...questions];
        let tempEk = [...tempQ[qInd]['keywords'], data];
        tempQ[qInd]['keywords'] = tempEk;
        setQuestions(tempQ);
    }

    const removeExtraKeyword = (ind, qInd) => {
        let tempQ = [...questions];
        let tempEk = [...tempQ[qInd]['keywords']];
        tempEk.splice(ind,1)
        tempQ[qInd]['keywords'] = tempEk;
        setQuestions(tempQ);
    }

    /**
     * Action of when click "Add Question"
     */
    const handleClickAddQuestion = () => {
        setQuestions([...questions, {...questionObj}]);
    }

    /**
     * Action of when click "Start Game"
     */
    const handleClickStartGame = () => {
        if (!questions || questions?.length === 0) {
            toast.warning("Add one question at least"); return;
        }
        if (currentusers.length === 0) {
            toast.warning("There are no connected users, at least one user is required to start the game."); return;
        }

        const gameData = {
            gamename: gamename,
            gamepine: gamepine,
            questions,
            settings
        }
        API.game.saveSetting(gameData).then(() => {
            setStartLoad(true);
            const gameState = {
                ...gameData,
                currRule,
                currQuestion: 0,
                users: currentusers
            }
            localstore.saveObj('game_state', gameState);
            setTimeout(() => {
                navigate(`/admin/${gamepine}/review`, { state: { ...gameState, role: 1 } });
                socket.emit('start_game', gameState);
            }, 3000)
        }).catch(err => {
            toast.error("Server Error!");
        })
    }

    /**
     * handle change  event of file input
     * @param {Event} e 
     * @param {Number} qInd 
     */
    const handlePicture = (e, qInd) => {
        const data = new FormData()
        data.append("picture", e.target.files[0]);
        data.append("filename", `${gamepine}-${qInd}`);

        API.file.save(data).then((res) => {
            const filedata = res.data;
            let tempQ = [...questions];
            tempQ[qInd]['img'] = filedata.filename;
            setQuestions(tempQ);
        }).catch(err => {
            toast.error("Server Error!");
        })
    }

    /**
     * setting game rule 
     *  NORMAL as N
        SPEEDY as S
        RELAXED as R
        ENDLESS as E
        CUSTOM as C
     * @param {String} rule 
     */
    const ruleSelect = (rule) => {
        setCurrRule(rule);
        let setting = {};
        if (rule === "N") {
            setting = {
                group: 5,
                limitChars: 800,
                writingTimer: 300,
                votingTimer: 70
            }
        } else if (rule === "S") {
            setting = {
                group: 3,
                limitChars: 800,
                writingTimer: 60,
                votingTimer: 40
            }
        } else if (rule === "R") {
            setting = {
                group: 7,
                limitChars: 800,
                writingTimer: 240,
                votingTimer: 60
            }
        } else if (rule === "E") {
            setting = {
                group: 10,
                limitChars: 800,
                writingTimer: 0,
                votingTimer: 0
            }
        } else {
            setting = {
                group: 10,
                limitChars: 800,
                writingTimer: 300,
                votingTimer: 70
            }
        }
        setSettings(setting);
    }

    /**
     * when a student enter in game, do plus conneted user.
     */
    useEffect(() => {
        // when load, getting settings and questions
        API.game.getSetting({ gamepine: gamepine }).then((res) => {
            res.data.settings && setSettings(res.data.settings);
            res.data.questions && setQuestions(res.data.questions);
        })
        // when load, getting currnet users
        socket.emit('joinGame', gamepine);

        socket.on("curr_users", ({ users }) => {
            // console.log('joined users', users)
            setCurrentusers(users);
        })
    }, [])

    return (
        <div className="flex justify-center">
            <div className="h-screen w-full bg-blue-400 lg:flex justify-between max-w-[1200px] animate-fadeIn">
                {
                    startLoad &&
                    <div className="absolute top-0 left-0 w-full h-full z-30 flex justify-center items-center">
                        <img src="/images/321.gif" width={200} alt="" />
                    </div>
                }
                <ToastContainer />
                <div className="w-full lg:w-1/3">
                    <div className="xl::px-20 lg:px-10 px-10 mt-20">
                        <div className="game-name h-40 pt-10">
                            <div className="absolute -mt-5 -ml-5 uppercase text-white text-2xl rounded-xl bg-sky-600 font-bold py-2 px-5">{gamename}</div>
                            <div className="bg-slate-100 rounded-b-3xl p-6 text-center text-stone-600 text-4xl font-600">{gamepine}</div>
                        </div>
                        <div className="game-users my-16">
                            <div className="absolute -mt-5 -ml-5 uppercase text-white text-2xl rounded-full bg-sky-600 font-bold py-2 px-5">Connected User:</div>
                            <div className="bg-slate-100 rounded-b-3xl p-5 text-stone-600 pt-10">
                                <ul>
                                    {currentusers?.length > 0 &&
                                        currentusers.map((v, i) =>
                                            <li key={i}
                                                onClick={() => console.log(v.socketId)}
                                                className="p-1 text-xl bg-gradient" >{v.username}</li>)
                                    }
                                    {(!currentusers || currentusers?.length === 0) &&
                                        <li>No Users</li>
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="mb-6 rounded bg-white px-6 py-4">
                        <div className="w-full flex justify-end mb-4">
                            <button
                                onClick={() => handleClickStartGame()}
                                className="rounded-full bg-custom font-bold text-white p-5 py-3 text-3xl">START GAME</button>
                        </div>
                        <div className="w-full flex flex-wrap justify-around md:justify-between items-center">
                            <span className="font-medium text-custom text-base font-bold mb-4">RULES</span>
                            <button onClick={() => ruleSelect('N')} className={`rounded-full border border-custom mb-4 p-2 px-4 font-normal text-sm text-custom ${currRule === "N" ? "bg-custom text-white" : ""}`}>NORMAL</button>
                            <button onClick={() => ruleSelect('S')} className={`rounded-full border border-custom mb-4 p-2 px-4 font-normal text-sm text-custom ${currRule === "S" ? "bg-custom text-white" : ""}`}>SPEEDY</button>
                            <button onClick={() => ruleSelect('R')} className={`rounded-full border border-custom mb-4 p-2 px-4 font-normal text-sm text-custom ${currRule === "R" ? "bg-custom text-white" : ""}`}>RELAXED</button>
                            <button onClick={() => ruleSelect('E')} className={`rounded-full border border-custom mb-4 p-2 px-4 font-normal text-sm text-custom ${currRule === "E" ? "bg-custom text-white" : ""}`}>ENDLESS</button>
                            <button onClick={() => ruleSelect('C')} className={`rounded-full border border-custom mb-4 p-2 px-4 font-normal text-sm text-custom ${currRule === "C" ? "bg-custom text-white" : ""}`}>CUSTOM</button>
                        </div>
                        <div className="w-full flex flex-wrap justify-around md:justify-between">
                            <div className="w-40 rounded flex flex-col items-center bg-custom mx-2 p-2 mb-4 md:mb-0">
                                <FontAwesomeIcon icon="users" className="text-white text-3xl mb-2" />
                                <span className="uppercase font-normal text-white text-sm">GROUP NUMBERS</span>
                                <div className="h-1 w-full mb-3">
                                    <Slider
                                        min={0}
                                        max={10}
                                        defaultValue={settings.group}
                                        currentValue={settings.group}
                                        setCurrentValue={(val) => setSettings({ ...settings, group: val })}
                                    />
                                </div>
                                <span className="font-medium text-white text-2xl">{settings.group}</span>
                            </div>
                            <div className="w-40 rounded flex flex-col items-center bg-custom mx-2 p-2 mb-4 md:mb-0">
                                <FontAwesomeIcon icon="pen-alt" className="text-white text-3xl mb-2" />
                                <span className="uppercase font-normal text-white text-sm">Character limit</span>
                                <div className="h-1 w-full mb-3">
                                    <Slider
                                        min={0}
                                        max={800}
                                        defaultValue={settings.limitChars}
                                        currentValue={settings.limitChars}
                                        setCurrentValue={(val) => setSettings({ ...settings, limitChars: val })}
                                    />
                                </div>
                                <span className="font-medium text-white text-2xl">{settings.limitChars}</span>
                            </div>
                            <div className="w-40 rounded flex flex-col items-center bg-custom mx-2 p-2 mb-4 md:mb-0">
                                <FontAwesomeIcon icon="business-time" className="text-white text-3xl mb-2" />
                                <span className="uppercase font-normal text-white text-sm">Writing Timer</span>
                                <div className="h-1 w-full mb-3">
                                    <Slider
                                        min={1}
                                        max={300}
                                        defaultValue={settings.writingTimer}
                                        currentValue={settings.writingTimer}
                                        setCurrentValue={(val) => setSettings({ ...settings, writingTimer: val })}
                                    />
                                </div>
                                <span className="font-medium text-white text-2xl">{settings.writingTimer}</span>
                            </div>
                            <div className="w-40 rounded flex flex-col items-center bg-custom mx-2 p-2 mb-4 md:mb-0">
                                <FontAwesomeIcon icon="business-time" className="text-white text-3xl mb-2" />
                                <span className="uppercase font-normal text-white text-sm">Voting Timer</span>
                                <div className="h-1 w-full mb-3">
                                    <Slider
                                        min={1}
                                        max={70}
                                        defaultValue={settings.votingTimer}
                                        currentValue={settings.votingTimer}
                                        setCurrentValue={(val) => setSettings({ ...settings, votingTimer: val })}
                                    />
                                </div>
                                <span className="font-medium text-white text-2xl">{settings.votingTimer}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4 rounded bg-white px-6 py-4 pb-20 relative">
                        {
                            questions && questions.map(
                                (v, i) => <AddQuestion key={i} qInd={i} 
                                    question={v}
                                    addExtraKeyword={addExtraKeyword}
                                    removeExtraKeyword={removeExtraKeyword}
                                    handleChangePicture={handlePicture}
                                    handleChangeQuestion={changeQuestion} />
                            )
                        }

                        <div className="absolute bottom-8 w-[95%]">
                            <div className="flex justify-between w-full">
                                <div className="border-custom border-dashed border-b-4 w-[45%]"></div>
                                <div className="relative">
                                    <button
                                        title="Create A Question"
                                        onClick={() => handleClickAddQuestion()}
                                        className="absolute -top-[12px] -left-[12px]">
                                        <FontAwesomeIcon icon="plus-circle" className="text-custom text-3xl" />
                                    </button>
                                </div>
                                <div className="border-custom border-dashed border-b-4 w-[45%]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GameSetting;