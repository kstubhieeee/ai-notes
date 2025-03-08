import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chat from "./pages/Chat";
import SavedNotes from "./pages/SavedNotes";
import NoteDetail from "./pages/NoteDetail";
import "./index.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/saved-notes" element={<SavedNotes />} />
        <Route path="/note/:id" element={<NoteDetail />} />
      </Routes>
    </Router>
  );
};

export default App;