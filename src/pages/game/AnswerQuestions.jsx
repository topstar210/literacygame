import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const AnswerQuestions = ({ socket }) => {
    const location = useLocation();
    const { state } = location;

    // when load
    useEffect(()=>{
        socket.emit('identity', state.gamePine, state.username);
    },[])

    return (
        <div className="h-screen w-full bg-blue-400 px-16 lg:px-20 pt-10">
            <div className="min-h-full bg-white rounded-t-3xl py-5">
                <div className="flex justify-center">
                    <img src="/images/processing.gif" alt="" />
                </div>
                <div className="text-center text-4xl"> Waiting To Start The Game ...  </div>
            </div>
        </div>
    )
}

export default AnswerQuestions;