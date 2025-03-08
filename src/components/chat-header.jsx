import { Link } from 'react-router-dom';

const ChatHeader = () => {
  return (
    <div className="bg-card border-b border-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-lg">
            AI
          </div>
          <div className="ml-3">
            <h1 className="text-xl font-semibold text-foreground">AI Assistant</h1>
            <p className="text-sm text-muted-foreground">Kaustubh</p>
          </div>
        </div>
        <Link
          to="/saved-notes"
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors border border-accent/20"
        >
          Saved Notes
        </Link>
      </div>
    </div>
  );
};

export default ChatHeader;