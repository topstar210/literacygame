import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import AddQuestion from "../../components/AddQuestion";

const GameSetting = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const { gameName, gamePine } = state;
    
    const [ questions, setQuestions ] = useState([{val:"",img:""}]);
    const [ settings, setSettings ] = useState({
        group: 10,
        limitChars: 400,
        writingTimer: 300,
        votingTimer: 70
    });
    
    /**
     * handle event of changing of question textarea
     * @param {Event} e 
     * @param {Number} qInd 
     */
    const changeQuestion = ( e, qInd ) => {
        let tempQ = [ ...questions ];
        tempQ[qInd]['val'] = e.target.value;
        setQuestions(tempQ);
    }

    /**
     * Action of when click "Add Question"
     */
    const handleClickAddQuestion = () => {
        setQuestions([ ...questions, {val:"",img:""} ]);
    }

    /**
     * Action of when click "Start Game"
     */
    const handleClickStartGame = () => {
        if( !questions ) return;
        
        console.log("questions", questions);

        navigate(`/admin/${gamePine}/review`);
    }
    return (
        <div className="h-screen w-full bg-blue-400 lg:flex justify-between">
            <div className="w-full lg:w-1/3">
                <div className="xl::px-20 lg:px-10 px-10 mt-20">
                    <div className="game-name h-40 pt-10">
                        <div className="absolute -mt-5 -ml-5 uppercase text-white text-2xl rounded-xl bg-sky-600 font-bold py-2 px-5">{ gameName }</div>
                        <div className="bg-slate-100 rounded-b-3xl p-6 text-center text-stone-600 text-4xl font-600">{ gamePine }</div>
                    </div>
                    <div className="game-users mt-20">
                        <div className="absolute -mt-5 -ml-5 uppercase text-white text-2xl rounded-full bg-sky-600 font-bold py-2 px-5">Connected User:</div>
                        <div className="bg-slate-100 rounded-b-3xl p-5 text-stone-600 pt-10">
                            <ul>
                                <li className="p-1 text-xl bg-gradient">user1</li>
                                <li className="p-1 text-xl bg-gradient">user2</li>
                                <li className="p-1 text-xl bg-gradient">user3</li>
                                <li className="p-1 text-xl bg-gradient">user3</li>
                                <li className="p-1 text-xl bg-gradient">user5</li>
                                <li className="p-1 text-xl bg-gradient">user3</li>
                                <li className="p-1 text-xl bg-gradient">user3</li>
                                <li className="p-1 text-xl bg-gradient">user3</li>
                                <li className="p-1 text-xl bg-gradient">user3</li>
                                <li className="p-1 text-xl bg-gradient">user10</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div className="mb-6 rounded bg-white px-6 py-4">
                    <div className="w-full flex justify-end mb-4">
                        <button
                            onClick={ () => handleClickStartGame() }
                            className="rounded-full bg-custom font-bold text-white p-5 py-3 text-3xl">START GAME</button>
                    </div>
                    <div className="w-full flex justify-between items-center mb-4">
                        <span className="font-medium text-custom text-base font-bold">RULES</span>
                        <button className="rounded-full border border-custom p-2 px-4 font-normal text-sm text-custom">NORMAL</button>
                        <button className="rounded-full border border-custom p-2 px-4 font-normal text-sm text-custom">SPEEDY</button>
                        <button className="rounded-full border border-custom p-2 px-4 font-normal text-sm text-custom">RELAXED</button>
                        <button className="rounded-full border border-custom p-2 px-4 font-normal text-sm text-custom">ENDLESS</button>
                        <button className="rounded-full bg-custom border border-custom p-2 px-4 font-normal text-sm text-white">CUSTOM</button>
                    </div>
                    <div className="w-full flex justify-between">
                        <div className="w-40 rounded flex flex-col items-center bg-custom mx-2 p-2">
                            <FontAwesomeIcon icon="users" className="text-white text-3xl mb-2" />
                            <span className="uppercase font-normal text-white text-sm">GROUP NUMBERS</span>
                            <div className="h-1 w-full bg-white rounded-full relative after:w-3 after:h-3 after:bg-white after:rounded-full after:left-3/5 mb-1"></div>
                            <span className="font-medium text-white text-2xl">10</span>
                        </div>
                        <div className="w-40 rounded flex flex-col items-center bg-custom mx-2 p-2">
                            <FontAwesomeIcon icon="pen-alt" className="text-white text-3xl mb-2" />
                            <span className="uppercase font-normal text-white text-sm">Character limit</span>
                            <div className="h-1 w-full bg-white rounded-full relative after:w-3 after:h-3 after:bg-white after:rounded-full after:left-3/5 mb-1"></div>
                            <span className="font-medium text-white text-2xl">400</span>
                        </div>
                        <div className="w-40 rounded flex flex-col items-center bg-custom mx-2 p-2">
                            <FontAwesomeIcon icon="business-time" className="text-white text-3xl mb-2" />
                            <span className="uppercase font-normal text-white text-sm">Writing Timer</span>
                            <div className="h-1 w-full bg-white rounded-full relative after:w-3 after:h-3 after:bg-white after:rounded-full after:left-3/5 mb-1"></div>
                            <span className="font-medium text-white text-2xl">300</span>
                        </div>
                        <div className="w-40 rounded flex flex-col items-center bg-custom mx-2 p-2">
                            <FontAwesomeIcon icon="business-time" className="text-white text-3xl mb-2" />
                            <span className="uppercase font-normal text-white text-sm">Voting Timer</span>
                            <div className="h-1 w-full bg-white rounded-full relative after:w-3 after:h-3 after:bg-white after:rounded-full after:left-3/5 mb-1"></div>
                            <span className="font-medium text-white text-2xl">70</span>
                        </div>
                    </div>
                </div>

                
                <div className="mb-4 rounded bg-white px-6 py-4 pb-20 relative">
                    {
                        questions && questions.map((v, i)=><AddQuestion qInd={ i } question={v} handleChangeQuestion={changeQuestion} />)
                    }

                    <div className="absolute bottom-8 w-[95%]">
                        <div className="flex justify-between w-full">
                            <div className="border-custom border-dashed border-b-4 w-[45%]"></div>
                            <button 
                                onClick={ () => handleClickAddQuestion() }
                                className="mb-2 absolute -top-3 m-auto left-0 right-0">
                                <FontAwesomeIcon icon="plus-circle" className="text-custom text-3xl" />
                            </button>
                            <div className="border-custom border-dashed border-b-4 w-[45%]"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GameSetting;