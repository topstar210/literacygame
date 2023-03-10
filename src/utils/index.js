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
    },

    calcKeywordPoint: async (keywords, answer) => {
        let extraKeyword = 0;
        for (let i = 0; i < keywords.length; i++) {
            let keyword = keywords[i];
            if (answer.indexOf(keyword[0]) > -1) {
                extraKeyword += parseInt(keyword[1]);
            }
        }
        return extraKeyword;
    },

    exportResultToCSV: (data,state) => {        
        console.log(data,state);
        // Variable to store the final csv data
        var csv_data = ["Username, Gamepine, Question Number, Question, Answer, Votes, Points"];
        for (var i = 0; i < data.length; i++) {
            var cols = data[i];
            var csvrow = `${String(cols['username'])},${cols['gamepine']},${cols['quesInd']*1+1},${state.questions[state.currQuestion]['val']},${cols['answer']},${cols['finalsVotes']?cols['finalsVotes']:cols['votes']},${cols['finalsPoints']?cols['finalsPoints']:cols['points']}`;
            csv_data.push(csvrow);
        }
        // combine each row data with new line character
        csv_data = csv_data.join('\n');
        // Call this function to download csv file 
        downloadCSVFile(csv_data, state.gamename, state.currQuestion);
    }
}

export default utils;

function downloadCSVFile(csv_data, gamename, currQuestion) {
    // Create CSV file object and feed our
    // csv_data into it
    let CSVFile = new Blob([csv_data], { type: "text/csv;charset=utf-8" });
    // Create to temporary link to initiate
    // download process
    var temp_link = document.createElement('a');
    // Download csv file
    temp_link.download = gamename+"_"+(currQuestion*1+1)+".csv";
    var url = window.URL.createObjectURL(CSVFile);
    temp_link.href = url;
    // This link should not be displayed
    temp_link.style.display = "none";
    document.body.appendChild(temp_link);
    // Automatically click the link to trigger download
    temp_link.click();
    document.body.removeChild(temp_link);
}