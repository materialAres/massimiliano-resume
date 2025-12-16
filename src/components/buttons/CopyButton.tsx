import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyButton({ textToCopy }: { textToCopy: string }) {
  const [isPressed, setIsPressed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for mobile/older browsers
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopied(true);
      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 100);
      setTimeout(() => setCopied(false), 2000);

      const canvas = document.querySelector("canvas");
      if (canvas) {
        canvas.focus();
      }
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Failed to copy. Please allow clipboard access.");
    }
  };

  return (
    <div className="mt-2">
      <button
        onClick={handleCopy}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        className={`
          pointer-events-auto relative px-4 py-1 font-bold text-[8px]
          ${copied ? "bg-green-700" : "bg-amber-700"} 
          text-amber-100
          border-2 border-black
          transition-all duration-75
          ${isPressed ? "translate-y-1" : "translate-y-0"}
          ${!copied && "hover:bg-amber-600"}
          active:bg-amber-800
        `}
      >
        <div className="flex items-center gap-3">
          {copied ? (
            <>
              <Check size={12} strokeWidth={1} />
              <span>COPIED!</span>
            </>
          ) : (
            <>
              <Copy size={12} strokeWidth={1} />
              <span>COPY E-MAIL</span>
            </>
          )}
        </div>
      </button>
    </div>
  );
}
