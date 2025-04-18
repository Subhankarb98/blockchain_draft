import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/home";
import Chain from "./pages/chain";
import Transact from "./pages/transact";
import Mine from "./pages/mine";
import Wallet from "./pages/wallet";

function App() {
  return <Router>
  <Navbar />
  <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/chain" element={<Chain />} />
      <Route path="/transact" element={<Transact />} />
      <Route path="/mine" element={<Mine />} />
      <Route path="/wallet" element={<Wallet />} />
  </Routes>
</Router>
}

export default App;