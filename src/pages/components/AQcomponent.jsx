import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AQcomponent = (props) => {
    const { currQuestion, questions, settings, countDownTime, clickSaveReply, readonly,
        answer, setAnswer, answerLen, setAnswerlen   } = props;

    /**
     * action of when change answer textarea
     * @param {Event} e 
     */
    const handleChangeAnswer = e => {
        let sVal = e.target.value;
        if(sVal.length <= settings.limitChars){
            setAnswerlen(sVal.length);
            setAnswer(sVal)
        }
    }

    return (
        <div className="">
            <div className="-ml-6 flex justify-between items-center">
                <div className="text-white text-2xl rounded-l-3xl bg-sky-600 font-bold py-2 pl-7 break-words  w-11/12">
                    <span className="uppercase mr-3">
                        Question {currQuestion + 1}:
                    </span>
                    {questions[currQuestion].val}
                </div>
                <div className="font-bold text-xl text-custom">
                    {countDownTime}
                    <FontAwesomeIcon icon="clock" className="mx-1" />
                </div>
            </div>
            <div className="container md:flex justify-between">
                <div className="md:w-8/12 p-5 flex justify-center">
                    <div className="w-5/6">
                        <textarea
                            value={answer}
                            readOnly = {readonly}
                            onChange={e => handleChangeAnswer(e)}
                            className="focus:outline-none border border-custom indent-2 w-full p-2 min-h-[200px]" cols="30"></textarea>
                        <div className="flex items-center">
                            <button
                                onClick={() => clickSaveReply()}
                                disabled={readonly?'disabled':false}
                                className="uppercase bg-transparent hover:bg-sky-600 text-sky-600 font-semibold hover:text-white py-2 px-4 border border-sky-600 hover:border-transparent rounded">save reply</button>
                            <div className="ml-5">{answerLen} / {settings.limitChars}</div>
                        </div>
                    </div>
                </div>
                <div className="md:w-4/12 flex justify-center p-5">
                    <div className="">
                        {questions[currQuestion]?.img !== "" &&
                            <img src={`${process.env.REACT_APP_SERVERURL}${questions[currQuestion]?.img}`} width="100%" alt="PT" />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AQcomponent;