import './App.css';
import Home from './pages/HomePage/Home';
import Cart from './pages/Cart/Cart';
import Profile from './pages/Profile/Profile';
import UploadProduct from './pages/UploadProduct/UploadProduct';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Rules from './pages/Rules/Rules';
import LeaderBoard from './pages/LeaderBoard/LeaderBoard';
import Exchange from "./pages/Exchange/Exchange";

function App() {
  return (
    <div className="">
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/uploadproduct" element={<UploadProduct/>} />
          <Route path="/productdetails" element={<ProductDetails/> } />
          <Route path="/rules" element={<Rules/> } />
          <Route path="/leaderboard" element={<LeaderBoard/> } />
          <Route path="/exchange" element={<Exchange/> } />
        </Routes>
    </div>
  );
}

export default App;
