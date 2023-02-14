import express from 'express';
// controllers
import game from '../controllers/game.js';

const router = express.Router();

router
  .post('/create', game.create)
  .post('/checkpine', game.checkpine)
  .post('/:gamepine/setting', game.saveSetting)
  .get('/:gamepine/setting', game.getSetting)

export default router;