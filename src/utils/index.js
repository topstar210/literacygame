const utils = {
    getGroupByUsername: (groupMems, users, username) => {
        let groupInd;
        let totalGroups;
        if (groupMems > 1) {
            const uInd = users.findIndex((user) => {
                return user.username === username;
            });
            if (uInd < 0) {
                groupInd = 1
            } else {
                groupInd = Math.ceil((uInd + 1) / groupMems);
            }
            totalGroups = Math.ceil((users.length) / groupMems);
        } else {
            groupInd = 1;
            totalGroups = 1;
        }
        return {
            userGroupInd: groupInd,
            totalGroups
        };
    },

    getTotalGroup: (groupMems, users) => {
        if (groupMems > 1) {
            return Math.ceil((users.length) / groupMems);
        } else return 1;
    },

    clearInvervalVals: () => {
        // Get a reference to the last interval + 1
        const interval_id = window.setInterval(function () { }, Number.MAX_SAFE_INTEGER);

        // Clear any timeout/interval up to that id
        for (let i = 1; i < interval_id; i++) {
            window.clearInterval(i);
        }
    }
}

export default utils;