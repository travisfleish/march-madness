import { Navigate, Route, Routes } from "react-router-dom";
import MarchMadnessMomentsPage from "./pages/MarchMadnessMomentsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MarchMadnessMomentsPage />} />
      <Route
        path="/march-madness-moments"
        element={<MarchMadnessMomentsPage />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
