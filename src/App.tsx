import { Navigate, Route, Routes } from "react-router-dom";
import SiteHeader from "./components/nav/SiteHeader";
import MarchMadnessMomentsPage from "./pages/MarchMadnessMomentsPage";

const SHOW_SITE_HEADER = false;

function App() {
  return (
    <>
      {SHOW_SITE_HEADER ? <SiteHeader /> : null}
      <Routes>
        <Route path="/" element={<MarchMadnessMomentsPage />} />
        <Route
          path="/march-madness-moments"
          element={<MarchMadnessMomentsPage />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
