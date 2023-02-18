import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react';

const Answercard = (props) => {
    const { ind, v, role, onBlurUsername, handleClickVote, removeAnswer } = props;

    const [username, setUsername] = useState("");

    useEffect(() => {
        setUsername(v.username)
    }, [])

    return (
        <div
            onClick={e => handleClickVote(v, ind)}
            className="flex justify-between items-center ml-10 p-3 mb-4 border-l-[8px] border-custom bg-sky-600 rounded-tr-3xl relative">

            {role &&
                <button
                    onClick={() => removeAnswer(v._id)}
                    className="rounded-full w-[25px] h-[25px] absolute -right-[13px] -top-[13px] bg-sky-600">
                    <FontAwesomeIcon icon="remove" className="text-sm text-white" />
                </button>
            }
            <div className="answer w-5/6 break-words">
                {v.answer}
                <div className="flex text-white mt-2">
                    <div className="">
                        <FontAwesomeIcon icon="user" className="" />
                        {role ?
                            <input
                                type="text"
                                value={username}
                                onBlur={e => onBlurUsername(e, v._id)}
                                onChange={e => setUsername(e.target.value)}
                                className="bg-transparent" />
                            : v.username
                        }
                    </div>
                </div>
            </div>
            <div className="block text-white">
                {role &&
                    <>
                        <div className="text-right">{v.votes ? v.votes : 0} Votes</div>
                        <div className="text-right">{v.points ? v.points : 0} Points</div>
                    </>
                }
                {!role &&
                    <div username={username} vote={0}>
                        {v?.myVote > 0 &&
                            <div className="flex items-center justify-center rounded-full text-sky-600 font-bold bg-white w-[35px] h-[35px]">{v?.myVote}</div>
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default Answercard;