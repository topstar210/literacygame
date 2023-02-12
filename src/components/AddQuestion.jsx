const AddQuestion = (props) => {
    const { qInd, question, handleChangeQuestion } = props;

    return (
        <div className="flex justify-between">
            <div className="w-7/12">
                <div className="text-xl font-bold">Question { qInd+1 }:</div>
                <hr className="border-b-1 border-dashed border-custom my-2" />
                <textarea
                    rows="4"
                    value={question.val}
                    onChange={(e) => handleChangeQuestion(e, qInd)}
                    className="focus:outline-none w-full"
                    placeholder="This is the propmpt that the students will see." ></textarea>
            </div>
            <div>
                <img src="/images/defualt_img.png" alt="DF" />
            </div>
        </div>
    )
}

export default AddQuestion;