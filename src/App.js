import { BrowserRouter, Route, Routes } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUsers, faPenAlt, faBusinessTime, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

import CreateGame from "./pages/admin/GreateGame";
import GameSetting from "./pages/admin/GameSetting";
import GameReview from "./pages/admin/GameReview";

library.add(faUsers, faPenAlt, faBusinessTime, faPlusCircle);

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CreateGame />}></Route>
          <Route path="/admin/:gamepine/setting" element={<GameSetting />}></Route>
          <Route path="/admin/:gamepine/review" element={<GameReview />}></Route>
          <Route path="/wordgame" element={<CreateGame />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;