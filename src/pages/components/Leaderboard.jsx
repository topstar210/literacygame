import { useEffect } from "react";

const Leaderboard = () => {

    useEffect(()=>{
        
    },[])

    return (
        <div className="h-screen w-full bg-blue-400 px-5 lg:px-16 lg:px-20 pt-10">
            <div className="min-h-full bg-white rounded-t-3xl py-5 flex justify-around">
                <div className="w-1/3 px-3 lg:px-5">
                    <div className="min-h-full bg-sky-600 rounded-t-3xl pt-3">
                        <div className="flex justify-center text-white text-3xl">
                            User 1
                        </div>
                        <div className="flex justify-center py-34">
                            <img src="/images/winner1.png" width="80%" alt="winner 1" />
                        </div>
                    </div>
                </div>
                <div className="w-2/3 flex flex-col">
                    <div className="flex justify-between items-end">
                        <div className="flex flex-col px-3 lg:px-5 w-1/2">
                            <div className="flex justify-center text-sky-600 text-3xl my-3">
                                User 2
                            </div>
                            <div className="bg-sky-600 rounded-t-3xl pt-5 flex justify-center pb-10">
                                <img src="/images/winner2.png" alt="winner 2" width="80%" />
                            </div>
                        </div>
                        <div className="flex flex-col px-3 lg:px-5 mt-10 w-1/2">
                            <div className="flex justify-center text-sky-600 text-3xl my-3">
                                User 3
                            </div>
                            <div className="bg-sky-600 rounded-t-3xl pt-5 flex justify-center w-full">
                                <img src="/images/winner3.png" alt="winner 3" width="80%" />
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 -ml-5">
                        <div className="flex p-3 rounded-full bg-sky-600 mb-4 ml-5 text-xl text-white pl-4 w-[101%]">
                            <div className="rounded-full p-1 h-8 w-8 bg-white text-sky-600 flex items-center justify-center mr-4">4</div>
                            user 4
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Leaderboard;