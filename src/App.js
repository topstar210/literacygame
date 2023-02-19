import { BrowserRouter, Route, Routes } from "react-router-dom";
import io from 'socket.io-client';

import { library } from "@fortawesome/fontawesome-svg-core";
import { faUsers, faPenAlt, faBusinessTime, faPlusCircle, faClock, faUser, faRemove } from "@fortawesome/free-solid-svg-icons";

import CreateGame from "./pages/admin/GreateGame";
import GameSetting from "./pages/admin/GameSetting";
import GameReview from "./pages/admin/GameReview";

import StartGame from "./pages/game/Firstpage";
import AnswerQuestions from "./pages/game/AnswerQuestions";
import Leaderboard from "./pages/components/Leaderboard";

library.add(faUsers, faPenAlt, faBusinessTime, faPlusCircle, faClock, faUser, faRemove);

const socket = io(process.env.REACT_APP_SERVERURL);

const App = () => {
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<CreateGame socket={socket} />}></Route>
          <Route path="/admin/:gamepine/setting" element={<GameSetting socket={socket} />}></Route>
          <Route path="/admin/:gamepine/review" element={<GameReview socket={socket} role={true} />}></Route>

          <Route path="/" element={<StartGame socket={socket} />}></Route>
          <Route path="/game/:gamepine" element={<AnswerQuestions socket={socket} />}></Route>
          <Route path="/game/:gamepine/review" element={<GameReview socket={socket} role={false} />}></Route>
          <Route path="/game/:gamepine/leaderboard" element={<Leaderboard socket={socket} />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;