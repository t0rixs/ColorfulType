import { HashRouter, Routes, Route } from "react-router-dom";
import Home from './Home'
import Game from './Game'

  function App() {

  return (
    <>
      <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
      </Routes>
      </HashRouter>
    </>
  )
}

export default App
