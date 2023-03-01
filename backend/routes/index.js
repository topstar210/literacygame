import express from 'express';
import mongoose from "mongoose";

// controllers
import users from '../controllers/user.js';
// middlewares
import { encode } from '../middlewares/jwt.js';

const router = express.Router();

router
  .post('/login/:userId', encode, (req, res, next) => { })
  // for dev
  .get('/clean_db', (req, res) => { 
    mongoose.connection.db.dropCollection('answers', function(err, result) {
      console.log("successfully drop the answers collection")
    });
    mongoose.connection.db.dropCollection('game', function(err, result) {
      console.log("successfully drop the game collection")
    });
    res.send("successfully drop the collections");
  })

export default router;