import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Maximize2, Minimize2, Send, Square, Copy, Check, Trash2, Mic } from "lucide-react";
import { formatAiText } from "../utils/formatAiText";

/* ─── Quick prompts ──────────────────────────────────── */
const QUICK_PROMPTS = [
  { text: "What's the best routine for dry skin ?" },
  { text: "Recommend a vitamin C serum"           },
  { text: "How to treat dark spots ?"              },
  { text: "Best sunscreen for sensitive skin"     },
];

/* ─── Bubble — extracted, tidy ─────────────────────── */
export function AiBubble({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Open Renyou AI"
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="
fixed
bottom-[100px]
right-5
z-[11000]
w-[60px]
h-[60px]
rounded-full
flex
items-center
justify-center
focus:outline-none
focus-visible:ring-2
focus-visible:ring-violet-400
hover:scale-105
active:scale-95
transition-all
duration-300
"
style={{
  background: "linear-gradient(135deg,#35316F,#6d28d9)",
  boxShadow: "var(--shadow-xl)",
}}
      style={{ background: "linear-gradient(135deg,#35316F,#6d28d9)" }}
    >
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-violet-500 opacity-30 animate-ping" />
      <img
        src="/assets/background/WhiteRenyouLogo.svg"
        alt="Renyou AI"
        className="w-[28px] h-[28px] object-contain relative z-10"
      />
    </motion.button>
  );
}

/* ─── Message bubble ────────────────────────────────── */
function MessageBubble({ msg, index, copiedIndex, onCopy }) {
  const isHuman = msg.sender === "human";
  const isCopied = copiedIndex === index;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`flex gap-2.5 ${isHuman ? "flex-row-reverse" : "flex-row"} items-start`}
    >
      {/* Avatar */}
<div
  className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold overflow-hidden"
  style={{
    background: isHuman
      ? "linear-gradient(135deg,#7c3aed,#6d28d9)"
      : "linear-gradient(135deg,var(--color-surface-secondary), var(--color-background))",
    boxShadow: "var(--shadow-sm)",
  }}
>
        {isHuman
          ? <span className="text-white font-bold text-[11px]">U</span>
          : <img src="/assets/background/IA.svg" alt="AI" className="w-full h-full object-cover" />
        }
      </div>

      {/* Content */}
      <div className={`group relative flex flex-col gap-1 max-w-[78%] ${isHuman ? "items-end" : "items-start"}`}>
<div
  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
    isHuman ? "rounded-tr-sm" : "rounded-tl-sm"
  }`}
  style={{
    background: isHuman
      ? "linear-gradient(135deg,#7c3aed,#6d28d9)"
      : "var(--color-surface)",
    color: isHuman
      ? "#fff"
      : "var(--color-text)",
    border: isHuman
      ? "none"
      : "1px solid var(--color-border)",
    boxShadow: "var(--shadow-sm)",
  }}
>
          {isHuman
            ? <span>{msg.text}</span>
            : <div className="ai-message-content" dangerouslySetInnerHTML={{ __html: formatAiText(msg.text) }} />
          }
        </div>

        {/* Copy — visible on hover + accessible via focus */}
        {!isHuman && (
<button
  onClick={() => onCopy(msg.text, index)}
  aria-label={isCopied ? "Copied" : "Copy message"}
  className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-200 self-start flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-lg"
  style={{
    color: isCopied
      ? "#10b981"
      : "var(--color-text-secondary)",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "var(--color-surface-secondary)";
    if (!isCopied) {
      e.currentTarget.style.color = "var(--accent)";
    }
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "transparent";
    e.currentTarget.style.color = isCopied
      ? "#10b981"
      : "var(--color-text-secondary)";
  }}
>
            {isCopied
              ? <><Check size={10} className="text-emerald-500" /> Copied</>
              : <><Copy size={10} /> Copy</>}
          </button>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Typing indicator ──────────────────────────────── */
function TypingIndicator() {
  return (
    <div className="flex gap-2.5 items-end">
      <div
  className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0"
  style={{
    background:
      "linear-gradient(135deg,var(--color-surface-secondary), var(--color-background))",
    boxShadow: "var(--shadow-sm)",
  }}
>
        <img src="/assets/background/IA.svg" alt="AI" className="w-full h-full object-cover" />
      </div>
      <div
  className="rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5"
  style={{
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    boxShadow: "var(--shadow-sm)",
  }}
>
        {[0, 1, 2].map(i => (
          <motion.span key={i}
            className="w-1.5 h-1.5 rounded-full bg-violet-400"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Streaming bubble ──────────────────────────────── */
function StreamingBubble({ text }) {
  return (
    <div className="flex gap-2.5">
      <div
  className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0"
  style={{
    background:
      "linear-gradient(135deg,var(--color-surface-secondary), var(--color-background))",
    boxShadow: "var(--shadow-sm)",
  }}
>
        <img src="/assets/background/IA.svg" alt="AI" className="w-full h-full object-cover" />
      </div>
      <div
  className="rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[78%]"
  style={{
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    boxShadow: "var(--shadow-sm)",
  }}
>
<div
  className="text-sm leading-relaxed ai-message-content"
  style={{
    color: "var(--color-text)",
  }}
  dangerouslySetInnerHTML={{ __html: formatAiText(text) }}
/>        
      </div>
    </div>
  );
}

/* ─── Welcome screen — premium redesign ────────────── */
function WelcomeScreen({ onPrompt }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center h-full px-5 py-6 text-center"
    >
      {/* Logo + glow */}
      <div className="relative mb-5">
        <div className="absolute inset-0 bg-violet-400 opacity-20 blur-2xl rounded-full scale-150" />
<div
  className="relative w-20 h-20 rounded-2xl overflow-hidden border"
  style={{
    background:
      "linear-gradient(135deg,var(--color-surface-secondary), var(--color-background))",
    borderColor: "var(--color-border)",
    boxShadow: "var(--shadow-md)",
  }}
>
          <img src="/assets/background/logo_renyou_ai.svg" alt="Renyou AI"
            className="w-full h-full object-contain p-3" />
        </div>
      </div>

      {/* Title + subtitle */}
      <h3
  className="text-[15px] font-bold mb-1 tracking-tight"
  style={{
    color: "var(--color-text)",
  }}
>
        Renyou AI Assistant
      </h3>
      <p
  className="text-[11.5px] leading-relaxed mb-6 max-w-[210px]"
  style={{
    color: "var(--color-text-secondary)",
  }}
>
        Ask me anything about skincare, products, routines or health tips.
      </p>

      {/* Quick prompts — premium glass cards */}
      <div className="w-full grid grid-cols-1 gap-2">
        {QUICK_PROMPTS.map((p, i) => (
          <motion.button
            key={p.text}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => onPrompt(p.text)}
className="
  group
  w-full
  flex
  items-center
  gap-3
  text-left
  text-[12px]
  font-medium
  px-3.5
  py-2.5
  rounded-xl
  transition-all
  duration-200
  hover:-translate-y-0.5
  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-violet-400
"
style={{
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  color: "var(--color-text)",
  boxShadow: "var(--shadow-sm)",
}}
onMouseEnter={(e) => {
  e.currentTarget.style.background = "var(--color-surface-secondary)";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.background = "var(--color-surface)";
}}
          >
            <span className="text-base flex-shrink-0">{p.icon}</span>
            <span className="flex-1 leading-snug">{p.text}</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs flex-shrink-0"
style={{
  color: "var(--accent)",
}}>↵</span>
          </motion.button>
        ))}
      </div>

      {/* Disclaimer */}
<p
  className="text-[10px] mt-5 transition-colors duration-300"
  style={{
    color: "var(--color-text-secondary)",
  }}
>
  Powered by Renyou AI · Not a medical substitute
</p>
    </motion.div>
  );
}

/* ─── Main AIPopup ──────────────────────────────────── */
export default function AIPopup({
  aiOpen, isMinimized, isMaximized, isMobile, position, dragging,
  setAiOpen, onMinimize, onToggleMaximize, onDragStart,
  messages, inputValue, setInputValue, isTyping, isGenerating,
  displayedText, copiedIndex, messagesEndRef, containerRef,
  onSend, onStop, onClear, onCopy,
}) {
  const [inputFocused, setInputFocused] = useState(false);
  const inputRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);
  const secondsRef = useRef(0);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    if (aiOpen && !isMinimized) setTimeout(() => inputRef.current?.focus(), 150);
  }, [aiOpen, isMinimized]);

  useEffect(() => {
    let interval;

    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }

    return () => clearInterval(interval);
  }, [isRecording]);

  const handleQuickPrompt = (text) => {
    setInputValue(text);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isGenerating && inputValue.trim()) onSend();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const recorder = new MediaRecorder(stream);

      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstart = () => {
        setIsRecording(true);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        const formData = new FormData();
        formData.append("audio", audioBlob, "voice.webm");

        try {
          const response = await fetch("http://localhost:5000/api/ai/transcribe", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Transcription failed");
          }

          const data = await response.json();

          if (data.success && data.text) {
            setInputValue(data.text);
            inputRef.current?.focus();
          }
        } catch (err) {
          console.error("Transcription error:", err);
          alert("Voice transcription failed.");
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();

      console.log("🎤 Recording started");
    } catch (err) {
      console.error("Microphone error:", err);
    }
  };

  const cancelRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    secondsRef.current = 0;
    setRecordingTime(0);

    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }

    audioChunksRef.current = [];
    setIsRecording(false);
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!mediaRecorderRef.current) return;

    if (mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }

    mediaRecorderRef.current.stream
      .getTracks()
      .forEach(track => track.stop());

    setIsRecording(false);

    console.log("🛑 Recording stopped");
  };

  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  if (!aiOpen) return null;

  /* Size & Position interpolations with smooth luxury curves */
  const motionDimensions = isMobile
    ? { width: "100vw", height: "100vh", top: 0, left: 0, borderRadius: "0px" }
    : isMaximized
    ? { width: "92vw", height: "88vh", top: "4vh", left: "4vw", borderRadius: "24px" }
    : { width: "400px", height: "590px", top: position.y, left: position.x, borderRadius: "16px" };

  return (
    <AnimatePresence>
      {!isMinimized && (
        <>
          {/* Backdrop */}
          <motion.div key="bd"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-black/30 backdrop-blur-[5px] z-[9990]"
            onClick={() => setAiOpen(false)}
          />

          {/* Popup */}
          <motion.div key="popup"
            layout="position"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, ...motionDimensions }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
              layout: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
            }}
  style={{
    position: "fixed",
    background: "var(--color-surface)",
    borderColor: "var(--color-border)",
    boxShadow: "var(--shadow-xl)",
  }}
  className="
    z-[10000]
    flex
    flex-col
    overflow-hidden
    pointer-events-auto
    border
    transition-all
    duration-300
  "
>

            {/* ══ HEADER ══ */}
            <div
              onMouseDown={!isMobile && !isMaximized ? onDragStart : undefined}
              className={`flex-shrink-0 flex items-center justify-between h-12 px-3.5 border-b select-none transition-all duration-300 ${
  !isMobile && !isMaximized ? "cursor-move" : ""
}`}
style={{
  background:
    "linear-gradient(90deg, color-mix(in srgb, var(--color-surface) 94%, var(--color-background)), var(--color-background))",
  borderColor: "var(--color-border)",
}}
            >
              {/* Left: logo_renyou_ai.svg + name + online dot */}
              <div className="flex items-center gap-2 min-w-0 -ml-1.5">
                <div className="w-8 h-8">
                  <img src="/assets/background/LOGO_renyou.svg" alt="Renyou AI"
                    className="w-full h-full object-contain p-1" />
                </div>
                <div className="flex flex-col leading-none min-w-0">
                  <span
  className="text-[13px] font-bold tracking-tight leading-tight truncate"
  style={{ color: "var(--color-text)" }}
>
  Renyou AI
</span>
                  <span
  className="text-[10px] flex items-center gap-1"
  style={{ color: "var(--color-text-secondary)" }}
>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse" />
                    Always ready to help !
                  </span>
                </div>
              </div>

              {/* Right: controls */}
              <div className="flex items-center gap-0.5 flex-shrink-0">
                {messages.length > 0 && (
                  <button onClick={onClear} aria-label="Clear" title="Clear conversation"
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
style={{
  color: "var(--color-text-secondary)",
}}
onMouseEnter={(e) => {
  e.currentTarget.style.background = "var(--color-surface-hover)";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.background = "transparent";
}}>
                    <Trash2 size={12} />
                  </button>
                )}
                <button onClick={onMinimize} aria-label="Minimize" title="Minimize"
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
style={{
  color: "var(--color-text-secondary)",
}}
onMouseEnter={(e) => {
  e.currentTarget.style.background = "var(--color-surface-hover)";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.background = "transparent";
}}>
                  <Minus size={13} />
                </button>
                {!isMobile && (
                  <button onClick={onToggleMaximize} aria-label={isMaximized ? "Restore" : "Maximize"} title={isMaximized ? "Restore" : "Maximize"}
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
style={{
  color: "var(--color-text-secondary)",
}}
onMouseEnter={(e) => {
  e.currentTarget.style.background = "var(--color-surface-hover)";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.background = "transparent";
}}>
                    {isMaximized ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                  </button>
                )}
                <button onClick={() => setAiOpen(false)} aria-label="Close" title="Close"
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
style={{
  color: "var(--color-text-secondary)",
}}
onMouseEnter={(e) => {
  e.currentTarget.style.background = "rgba(239,68,68,.12)";
  e.currentTarget.style.color = "#ef4444";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.background = "transparent";
  e.currentTarget.style.color = "var(--color-text-secondary)";
}}>
                  <X size={13} />
                </button>
              </div>
            </div>

            {/* ══ MESSAGES ══ */}
<div
  ref={containerRef}
  className="
    flex-1
    overflow-y-auto
    px-4
    py-4
    space-y-4
    scroll-smooth
    custom-scrollbar
    transition-all
    duration-300
  "
  style={{
    background:
      "linear-gradient(180deg, var(--color-surface-secondary) 0%, var(--color-background) 100%)",
  }}
>

              {messages.length === 0 && !isTyping && !displayedText && (
                <WelcomeScreen onPrompt={handleQuickPrompt} />
              )}

              {messages.map((msg, i) => (
                <MessageBubble key={i} msg={msg} index={i} copiedIndex={copiedIndex} onCopy={onCopy} />
              ))}

              {isTyping && <TypingIndicator />}
              {displayedText && <StreamingBubble text={displayedText} />}

              <div ref={messagesEndRef} />
            </div>

            {/* ══ INPUT ══ */}
            <div
  className="flex-shrink-0 px-3 pb-3 pt-2.5 border-t transition-all duration-300"
  style={{
    background:
      "linear-gradient(90deg, var(--color-background), var(--color-surface-secondary))",
    borderColor: "var(--color-border)",
  }}
>
              <div
  className={`flex items-end gap-2 rounded-2xl px-3 py-2 border-2 transition-all duration-200 ${
    inputFocused ? "border-violet-400" : ""
  }`}
  style={{
    background: "var(--color-surface)",
    borderColor: inputFocused
      ? "#8b5cf6"
      : "transparent",
    boxShadow: inputFocused
      ? "0 0 0 4px rgba(139,92,246,.15)"
      : "var(--shadow-sm)",
  }}
>
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  placeholder="Ask about skincare, products..."
                  rows={1}
                  aria-label="Message Renyou AI"
className="flex-1 bg-transparent resize-none outline-none text-sm leading-relaxed py-1 max-h-[110px]"
style={{
  minHeight: "24px",
  color: "var(--color-text)",
}}
placeholder="Ask about skincare, products..."
                  onInput={e => {
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 110) + "px";
                  }}
                />

                {isGenerating ? (
                  <button
                    onClick={onStop}
                    aria-label="Stop generating"
                    title="Stop"
                    className="w-8 h-8 rounded-xl bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-500 transition-all flex-shrink-0 mb-0.5"
                  >
                    <Square size={12} fill="currentColor" />
                  </button>
                ) : isRecording ? (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={cancelRecording}
                      className="w-8 h-8 rounded-xl bg-red-100 hover:bg-red-200 text-red-500 flex items-center justify-center"
                    >
                      <Trash2 size={15} />
                    </button>

                    <span className="text-xs font-semibold text-red-500 min-w-[45px] text-center">
                      {formatTime(recordingTime)}
                    </span>

                    <button
                      onClick={sendRecording}
                      className="w-8 h-8 rounded-xl bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center"
                    >
                      <Send size={15} />
                    </button>
                  </div>
                ) : inputValue.trim() ? (
                  <button
                    onClick={onSend}
                    aria-label="Send"
                    title="Send (Enter)"
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mb-0.5 bg-violet-600 hover:bg-violet-700 text-white shadow-md transition-all duration-200 hover:scale-105 active:scale-95" style={{
  boxShadow: "var(--shadow-md)",
}}
                  >
                    <Send size={13} />
                  </button>
                ) : (
<button
  onClick={startRecording}
  aria-label="Voice message"
  title="Voice message"
  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mb-0.5 transition-all duration-200 hover:scale-105 active:scale-95"
  style={{
    background: "var(--color-surface-secondary)",
    color: "var(--accent)",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.filter = "brightness(0.95)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.filter = "brightness(1)";
  }}
>
  <Mic size={16} />
</button>
                )}
              </div>

<p
  className="text-center text-[10px] mt-1.5 transition-colors duration-300"
  style={{
    color: "var(--color-text-secondary)",
  }}
>
  Renyou AI may make mistakes. Always consult a professional.
</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const sendRecording = () => {
  stopRecording();
};