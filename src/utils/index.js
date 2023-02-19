const utils = {
    getGroupByUsername: (groupMems, users, username) => {
        let groupInd;
        let totalGroups;
        if(groupMems > 0 ){
            const uInd = users.findIndex((user)=>{
                return user.username === username;
            });
            if(uInd < 0){
                groupInd = 1    
            } else {
                groupInd = Math.ceil((uInd+1) / groupMems);
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
    
    getTotalGroup:(groupMems, users) => {
        if(groupMems > 0 ) {
            return Math.ceil((users.length) / groupMems);
        } else return 1;
    }
}

export default utils;