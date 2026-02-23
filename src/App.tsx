import { Navigate, Route, Routes } from "react-router-dom";
import SiteHeader from "./components/nav/SiteHeader";
import IframeTestPage from "./pages/iframe-test";
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
        <Route path="/iframe-test" element={<IframeTestPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
