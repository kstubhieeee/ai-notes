import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { marked } from 'marked';

const NoteCard = ({ note, index }) => {
  const preview = note.content.slice(0, 200);
  const htmlPreview = marked(preview + (note.content.length > 200 ? '...' : ''));

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300">
      <div className="p-6">
        <div 
          className="prose prose-invert max-w-none text-sm mb-4"
          dangerouslySetInnerHTML={{ __html: htmlPreview }}
        />
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-muted-foreground">
            Saved on: {new Date(note.savedAt).toLocaleString()}
          </span>
          <Link
            to={`/note/${index}`}
            className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors"
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
};

const SavedNotes = () => {
  const [savedNotes, setSavedNotes] = useState([]);

  useEffect(() => {
    const notes = JSON.parse(localStorage.getItem('savedNotes') || '[]');
    setSavedNotes(notes);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6 bg-card p-4 rounded-lg border border-border">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Saved Notes</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {savedNotes.length} {savedNotes.length === 1 ? 'note' : 'notes'} saved
            </p>
          </div>
          <Link
            to="/"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Chat
          </Link>
        </div>
        
        {savedNotes.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-muted-foreground">No saved notes yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1">
            {savedNotes.map((note, index) => (
              <NoteCard
                key={index}
                note={note}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedNotes;