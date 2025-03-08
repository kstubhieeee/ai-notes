import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MessageBubble from '../components/message-bubble';

const NoteDetail = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('savedNotes') || '[]');
    const selectedNote = savedNotes[parseInt(id)];
    if (selectedNote) {
      setNote(selectedNote);
    }
  }, [id]);

  if (!note) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-foreground mb-4">Note not found</h2>
          <Link
            to="/saved-notes"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Saved Notes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6 bg-card p-4 rounded-lg border border-border">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Note Details</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Saved on: {new Date(note.savedAt).toLocaleString()}
            </p>
          </div>
          <Link
            to="/saved-notes"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Saved Notes
          </Link>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <MessageBubble message={note} />
        </div>
      </div>
    </div>
  );
};

export default NoteDetail;