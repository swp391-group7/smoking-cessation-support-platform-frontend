// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layout";
import Home from "./pages/home";
import About from "./pages/platform/about";
import Contact from "./pages/platform/contact";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
      </Route>
    </Routes>
  </Router>
);
export default App;
