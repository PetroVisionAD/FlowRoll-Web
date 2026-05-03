import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Dashboard from "@/pages/Dashboard";
import Library from "@/pages/Library";
import SituationView from "@/pages/SituationView";
import Lesson from "@/pages/Lesson";
import Logger from "@/pages/Logger";
import Progress from "@/pages/Progress";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="App" data-testid="app-root">
      <BrowserRouter>
        <Navbar />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/library" element={<Library />} />
            <Route path="/library/:positionId" element={<SituationView />} />
            <Route
              path="/lesson/:positionId/:scenarioId"
              element={<Lesson />}
            />
            <Route path="/logger" element={<Logger />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Toaster position="bottom-right" theme="dark" />
      </BrowserRouter>
    </div>
  );
}

export default App;
