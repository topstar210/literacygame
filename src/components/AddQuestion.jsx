import { useRef, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const AddQuestion = (props) => {
    const fileRef = useRef(null);

    const { qInd, question, handleChangeQuestion, handleChangePicture, addExtraKeyword, removeExtraKeyword } = props;
    const [showModal, setShowModal] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [point, setPoint] = useState(0);

    const handleClickPicture = () => {
        fileRef.current?.click();
    }

    const saveExtraKeyword = () => {
        addExtraKeyword([keyword, point], qInd);
        setKeyword("");
        setPoint(0)
        setShowModal(false);
    }

    return (
        <div className="flex justify-between mb-2">
            <div className="w-7/12">
                <div className="text-xl font-bold">Question {qInd + 1}:</div>
                <hr className="border-b-1 border-dashed border-custom my-2" />
                <textarea
                    rows="4"
                    value={question.val}
                    onChange={(e) => handleChangeQuestion(e, qInd)}
                    className="focus:outline-none w-full"
                    placeholder="This is the prompt that the students will answer. Add your question or activity here." ></textarea>
                <div className="flex flex-wrap">
                    <button
                        type="button"
                        onClick={() => setShowModal(true)}
                        className="px-2 border border-custom border-dashed text-custom rouned">Add Extra Keyword+</button>
                    <div className="flex flex-wrap">
                        {question.keywords?.length > 0 && 
                            question.keywords.map((v, i)=>
                            <div className="pl-2" key={i}>
                                {v[0]}: {v[1]} 
                                <button type="button" onClick={() => removeExtraKeyword(i, qInd)}>
                                    <FontAwesomeIcon icon="remove" className="mx-1 text-custom text-md" />
                                </button>
                            </div>
                            )
                        }
                    </div>
                </div>
            </div>
            <div>
                <img onClick={() => handleClickPicture()} width="235" src={question.img === "" ? `/images/defualt_img.png` : `${process.env.REACT_APP_FILEURL}${question.img}`} alt="DF" />
                <form action="" method="post" className="hidden" encType="multipart/form-data">
                    <input
                        type="file"
                        name="fileName"
                        accept=".jpg, .jpeg, .png, .gif"
                        ref={fileRef}
                        onChange={(e) => handleChangePicture(e, qInd)} />
                </form>
            </div>

            {showModal ? (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <div className="relative p-6 flex-auto flex items-center">
                                    <input type="text" 
                                        placeholder="Extra Keyword"
                                        value={keyword}
                                        onChange={e => setKeyword(e.target.value)}
                                        className="border mx-1 px-1 border-custom" />
                                    <input 
                                        type="number" 
                                        placeholder="Point"
                                        value={point}
                                        onChange={e => setPoint(e.target.value)}
                                        min={0}
                                        className="border px-1 mx-1 text-right border-custom w-[100px]" />
                                    <button type="button" onClick={() => saveExtraKeyword()}>
                                        <FontAwesomeIcon icon="save" className="mx-1 text-custom text-2xl" />
                                    </button>
                                    <button type="button" onClick={() => setShowModal(false)}>
                                        <FontAwesomeIcon icon="remove" className="mx-1 text-custom text-2xl" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}

        </div>
    )
}

export default AddQuestion;