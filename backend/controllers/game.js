import Game from "../models/Game.js";

export default {
    create: async (req, res) => {
        var gameData = new Game({
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
            if (game) {
                res.send("okay");
            }
        });
    },
    getSetting: async (req, res) => {
        Game.findOne({ 'pineCode': req.params.gamepine }, {'_id':0, 'updatedAt':0, 'createdAt':0}, (err, game) => {
            res.send(JSON.stringify(game))
        });
    },
}