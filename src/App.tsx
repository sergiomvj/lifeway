import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dreams from "./pages/Dreams";

const App = () => {
  console.log("App component está sendo renderizado");
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dreams" element={<Dreams />} />
        <Route path="*" element={<div className="p-8"><h1>LifeWayUSA - Teste</h1><p>App funcionando!</p></div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;