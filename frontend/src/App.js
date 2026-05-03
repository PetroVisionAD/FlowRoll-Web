import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Dashboard from "@/pages/Dashboard";
import Library from "@/pages/Library";
import SituationView from "@/pages/SituationView";
import Lesson from "@/pages/Lesson";
import Logger from "@/pages/Logger";
import Progress from "@/pages/Progress";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Profile from "@/pages/Profile";
import SavedProgress from "@/pages/SavedProgress";
import TrainingHistory from "@/pages/TrainingHistory";
import Community from "@/pages/Community";
import Coaching from "@/pages/Coaching";
import Schools from "@/pages/Schools";
import Store from "@/pages/Store";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="App" data-testid="app-root">
      <AuthProvider>
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

              {/* Auth */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />

              {/* Account */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/saved" element={<SavedProgress />} />
              <Route path="/history" element={<TrainingHistory />} />

              {/* Discover */}
              <Route path="/community" element={<Community />} />
              <Route path="/coaching" element={<Coaching />} />
              <Route path="/schools" element={<Schools />} />
              <Route path="/store" element={<Store />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Toaster position="bottom-right" theme="dark" />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
