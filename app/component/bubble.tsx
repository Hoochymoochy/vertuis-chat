
export default function ChatBubble({ message }: { message: string }) {
  return (
    <div className="max-w-xs mx-auto">
      <div className="bg-gradient-to-r from-gold/20 to-gold/10 backdrop-blur-sm border border-gold/30 rounded-2xl px-4 py-3 shadow-lg">
        <p className="text-white text-sm leading-relaxed">
          {message || "I'm ready to help you with anything you need!"}
        </p>
      </div>
      {/* Chat bubble tail */}
      <div className="flex justify-center mt-1">
        <div className="w-3 h-3 bg-gold/20 border-l border-b border-gold/30 transform rotate-45 -mt-1.5"></div>
      </div>
    </div>
  );
}