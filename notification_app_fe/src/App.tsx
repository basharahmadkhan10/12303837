import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Priority from './pages/Priority';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/priority" element={<Priority />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;