import { BrowserRouter, Route, Routes } from "react-router-dom";
import io from 'socket.io-client';

import { library } from "@fortawesome/fontawesome-svg-core";
import { 
  faUsers, 
  faPenAlt, 
  faBusinessTime, 
  faPlusCircle, 
  faClock, 
  faUser, 
  faRemove, 
  faRotateBackward, 
  faSave,
  faDownload 
} from "@fortawesome/free-solid-svg-icons";

import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/Signup";

import CreateGame from "./pages/admin/GreateGame";
import GameSetting from "./pages/admin/GameSetting";
import GameReview from "./pages/admin/GameReview";

import StartGame from "./pages/game/Firstpage";
import AnswerQuestions from "./pages/game/AnswerQuestions";
import Leaderboard from "./pages/shared-components/Leaderboard";

library.add(faUsers, faPenAlt, faBusinessTime, faPlusCircle, faClock, faUser, faRemove, faRotateBackward, faSave, faDownload);

const socket = io(process.env.REACT_APP_SOCKETURL);

const App = () => {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />

          <Route path="/admin" element={<CreateGame socket={socket} role={true} />} />
          <Route path="/admin/:gamepine/setting" element={<GameSetting socket={socket} />} />
          <Route path="/admin/:gamepine/review" element={<GameReview socket={socket} role={true} />} />

          <Route path="/" element={<StartGame socket={socket} />} />
          <Route path="/game/:gamepine" element={<AnswerQuestions socket={socket} />} />
          <Route path="/game/:gamepine/review" element={<GameReview socket={socket} role={false} />} />
          <Route path="/game/:gamepine/leaderboard" element={<Leaderboard socket={socket} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;