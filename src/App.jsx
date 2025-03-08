import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import { ChatProvider } from "./context/chat-context"
import { Toaster } from "./components/ui/toaster"
import Chat from "./pages/Chat"
import SavedNotes from "./pages/SavedNotes"
import NoteDetail from "./pages/NoteDetail"
import Settings from "./pages/Settings"
import "./index.css"

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark">
      <ChatProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="/saved-notes" element={<SavedNotes />} />
            <Route path="/note/:id" element={<NoteDetail />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
          <Toaster />
        </Router>
      </ChatProvider>
    </ThemeProvider>
  )
}

export default App

