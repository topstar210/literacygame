import express from 'express';
import mongoose from "mongoose";

// controllers
import Users, { Register, Login, Logout } from "../controllers/User.js";
// middlewares
import { verifyToken } from '../middlewares/jwt.js';
import { refreshToken } from "../controllers/RefreshToken.js";

const router = express.Router();

router
  .post('/users', Register)
  .post('/login', Login)
  .get('/token', refreshToken)
  .post('/logout', Logout)
  .post('/login/:userId', verifyToken, (req, res, next) => { })

  // for dev
  .get('/clean_db', (req, res) => {
    mongoose.connection.db.dropCollection('answers', function (err, result) {
      console.log("successfully drop the answers collection")
    });
    mongoose.connection.db.dropCollection('game', function (err, result) {
      console.log("successfully drop the game collection")
    });
    res.send("successfully drop the collections");
  })

export default router;