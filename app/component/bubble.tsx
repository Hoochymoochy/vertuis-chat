
export default function ChatBubble({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-start">
      <div className="bg-gradient-to-r from-gold/20 to-gold/10 backdrop-blur-sm border border-gold/30 rounded-2xl px-4 py-3 shadow-lg">
        <p className="text-white text-sm leading-relaxed">
          {message || "I'm ready to help you with anything you need!"}
        </p>
      </div>
    </div>
  );
}