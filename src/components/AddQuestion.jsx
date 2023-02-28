import { useRef } from "react";

const AddQuestion = (props) => {
    const fileRef = useRef(null);

    const handleClickPicture = () => {
        fileRef.current?.click();
    }
    const { qInd, question, handleChangeQuestion, handleChangePicture } = props;

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
            </div>
            <div>
                <img onClick={ ()=>handleClickPicture() } width="235" src={question.img===""?`/images/defualt_img.png`:`${process.env.REACT_APP_FILEURL}${question.img}`} alt="DF" />
                <form action="" method="post" className="hidden" encType="multipart/form-data">
                    <input
                        type="file"
                        name="fileName"
                        accept=".jpg, .jpeg, .png, .gif"
                        ref={fileRef}
                        onChange={(e)=>handleChangePicture(e, qInd)} />
                </form>
            </div>
        </div>
    )
}

export default AddQuestion;