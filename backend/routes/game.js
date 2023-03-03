import express from 'express';
// controllers
import game from '../controllers/Game.js';

const router = express.Router();

router
  .post('/create', game.create)
  .post('/checkpine', game.checkpine)
  
  .post('/:gamepine/setting', game.saveSetting)
  .get('/:gamepine/setting', game.getSetting)

  .post('/:gamepine/answer', game.saveAnswer)
  .get('/:gamepine/answer', game.getAnswers)
  .delete('/:gamepine/answer/:id', game.deleteAnswer)

  .post('/:gamepine/vote', game.saveVote)
  .post('/:gamepine/changeusername', game.changeUsername)


export default router;