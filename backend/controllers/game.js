import Game from "../models/Game.js";
import Answer from "../models/Answer.js";

export default {
    create: async (req, res) => {
        const gameData = new Game({
            gameName: req.body.gamename,
            pineCode: req.body.gamepine,
        });
        gameData.save()
            .then(item => {
                res.send("item saved to database");
            })
            .catch(err => {
                res.status(400).send("unable to save to database");
            });
    },

    checkpine: async (req, res) => {
        Game.findOne({ 'pineCode': req.body.pineCode }, 'pineCode', (err, game) => {
            if (err) return handleError(err);
            if (!game) res.send("dont_exist_game");
            if (game) {
                res.send("okay");
            }
        });
    },

    saveSetting: async (req, res) => {
        Game.findOneAndUpdate({ 'pineCode': req.body.gamepine }, req.body, (err, game) => {
            if (err) return handleError(err);
            if (!game) res.send("dont_exist_game");
            if (game) res.send("okay");
        });
    },

    getSetting: async (req, res) => {
        Game.findOne({ 'pineCode': req.params.gamepine }, { '_id': 0, 'updatedAt': 0, 'createdAt': 0 }, (err, game) => {
            res.send(JSON.stringify(game))
        });
    },

    saveAnswer: async (req, res) => {
        if(req.body.editable) {
            const conditions = {'_id': req.body.answerId}
            Answer.findOneAndUpdate(conditions, { answer: req.body.answer }, (err, answer) => {
                if (err) return handleError(err);
                if (answer) res.send(JSON.stringify(answer));
            });
        } else {
            const data = new Answer(req.body);
            data.save()
                .then(item => {
                    res.send(JSON.stringify(item));
                })
                .catch(err => {
                    res.status(400).send("unable to save to database");
                });
        }
    },

    getAnswers: async (req, res) => {
        const reqData = req.query;
        let conditions = reqData;

        let doc;
        if(reqData.isFinalsVote) {
            let result = [];
            for (let groupInd = 1; groupInd <= reqData.groupCnt+1; groupInd++) {
                const res = await Answer.find(
                    { 
                        gamepine: conditions.gamepine,
                        quesInd: conditions.quesInd,
                        groupInd
                    },
                    { 'updatedAt': 0, 'createdAt': 0 }
                ).sort({ finalsPoints: -1, createdAt: 1,  }).limit(3).exec();   
                result = result.concat(res);
            }
            doc = result;
        } else {
            let sortObj = {};
            if(reqData.byFinals){
                sortObj = { finalsPoints: -1, createdAt: 1 };
            } else {
                sortObj = { points: -1, createdAt: 1 };
            }
            doc = await Answer.find(
                conditions,
                { 'updatedAt': 0, 'createdAt': 0 }
            ).sort(sortObj).exec();
        }
        res.send(JSON.stringify(doc));
    },

    saveVote: async (req, res) => {
        const votes = req.body.voteInfo;

        for (let i = 0; i < votes.length; i++) {
            const vote = votes[i];
            if (vote['answerId']) {
                const conditions = {'_id': vote['answerId']}
                let incObj = {};
                if(req.body.isFinalsVote){
                    incObj = { finalsVotes: 1, finalsPoints: vote['point'] };
                } else {
                    incObj = { votes: 1, points: vote['point'] };
                }
                Answer.updateOne(
                    conditions,
                    { $inc: incObj }
                ).exec();
            }
        }
        res.send("okay")
    },

    changeUsername: async (req, res) => {
        const conditions = {'_id': req.body.answerId}
        Answer.findOneAndUpdate(conditions, { username: req.body.username }, (err, answer) => {
            if (err) return handleError(err);
            if (!answer) res.send("dont_exist_answer");
            if (answer) res.send("okay");
        });
    },

    deleteAnswer: async (req, res) => {
        console.log(req.params.id)
        Answer.deleteOne({ _id: req.params.id }).exec();
        res.send("okay")
    }
}