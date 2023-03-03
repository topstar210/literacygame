const localstore = {
    saveObj: (item, ary) => {
        return localStorage.setItem(item, JSON.stringify(ary));
    },

    getObj: (item) => {
        return JSON.parse(localStorage.getItem(item));
    },

    clearLocalStoreVariables: () => {
        localStorage.removeItem("game_name");
        localStorage.removeItem("game_pine");
        localStorage.removeItem("game_my_answer");
        localStorage.removeItem("game_areply_readyonly");
        localStorage.removeItem("game_writing_time");
        localStorage.removeItem("game_state");
        localStorage.removeItem("game_is_vote");
        localStorage.removeItem("game_writing_time");
        localStorage.removeItem("game_voting_time");
        localStorage.removeItem("game_is_vote");
    }
}

export default localstore;