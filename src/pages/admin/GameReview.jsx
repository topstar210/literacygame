const GameReview = () => {
    return (
        <div className="h-screen w-full bg-blue-400 px-16 lg:px-20 pt-10">
            <div className="min-h-full bg-white rounded-t-3xl py-5">
                <div className="flex justify-center">
                    <img src="/images/processing.gif" alt="" />
                </div>
                <div className="text-center text-4xl"> Waiting Answers ...  </div>
            </div>
        </div>
    )
}

export default GameReview;