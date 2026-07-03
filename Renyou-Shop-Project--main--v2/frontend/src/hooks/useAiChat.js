/**
 * useAiChat.js — Extracted AI chat logic from AppContent.jsx
 * Handles: messages, send, typing effect, stop, clear, copy, session
 * Fixes:
 *   - stopGenerating() was inverted (true/false swapped)
 *   - typeText() stale closure on displayedText
 *   - intervalRef (old) replaced by single timeoutRef mechanism
 *   - Double scroll effect removed
 *   - Proper cleanup on unmount
 */
import { useState, useRef, useCallback, useEffect } from "react";

export function useAiChat({ user }) {
  const [messages,       setMessages]       = useState([]);
  const [inputValue,     setInputValue]     = useState("");
  const [isTyping,       setIsTyping]       = useState(false);
  const [isGenerating,   setIsGenerating]   = useState(false);
  const [displayedText,  setDisplayedText]  = useState("");
  const [copiedIndex,    setCopiedIndex]    = useState(null);

  const sessionIdRef    = useRef(null);
  const timeoutRef      = useRef(null);
  const stopTypingRef   = useRef(false);
  const messagesEndRef  = useRef(null);
  const containerRef    = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Auto-scroll — single effect (was duplicated)
  useEffect(() => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const nearBottom = scrollHeight - scrollTop - clientHeight < 120;
    if (nearBottom) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, displayedText]);

  // ── Send message ──────────────────────────────────
  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    setMessages(prev => [...prev, { sender: "human", text: userText }]);
    setInputValue("");
    stopTypingRef.current = false;
    setIsTyping(true);
    setIsGenerating(true);

    try {
      const res = await fetch("http://localhost:5000/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          query: userText,
          session_id: sessionIdRef.current || undefined,
          user_id: user?.id || user?._id || undefined,
        }),
      });

      const data = await res.json();
      if (data.session_id) sessionIdRef.current = data.session_id;

      setIsTyping(false);

      if (data.result) {
        // Typing effect — fixes stale closure by using index + full string only
        const aiText = data.result;
        let index = 0;
        setDisplayedText("");

        const type = () => {
          if (stopTypingRef.current) {
            // Use the current displayed slice, not stale state
            setMessages(prev => [...prev, { sender: "ai", text: aiText.slice(0, index) }]);
            setDisplayedText("");
            setIsGenerating(false);
            setIsTyping(false);
            return;
          }

          setDisplayedText(aiText.slice(0, index + 1));
          index++;

          if (index < aiText.length) {
            timeoutRef.current = setTimeout(type, 18);
          } else {
            setMessages(prev => [...prev, { sender: "ai", text: aiText }]);
            setDisplayedText("");
            setIsGenerating(false);
            setIsTyping(false);
          }
        };
        type();
      } else {
        setMessages(prev => [...prev, { sender: "ai", text: "❌ Error fetching AI response" }]);
        setIsGenerating(false);
        setIsTyping(false);
      }
    } catch {
      setMessages(prev => [...prev, { sender: "ai", text: "❌ Could not reach the server. Please try again." }]);
      setIsGenerating(false);
      setIsTyping(false);
    }
  }, [inputValue, user]);

  // ── Stop typing — FIXED (was inverted) ───────────
  const handleStop = useCallback(() => {
    stopTypingRef.current = true; // was: false (bug)
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsGenerating(false);       // was: setIsGenerating(true) (bug)
    setIsTyping(false);
    setDisplayedText("");
  }, []);

  // ── Clear chat ────────────────────────────────────
  const handleClearChat = useCallback(async () => {
    if (sessionIdRef.current) {
      try {
        await fetch("http://localhost:5000/api/ai/clear", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionIdRef.current }),
        });
      } catch { /* silent */ }
    }
    sessionIdRef.current = null;
    setMessages([]);
    setDisplayedText("");
    setIsGenerating(false);
    setIsTyping(false);
  }, []);

  // ── Copy message ──────────────────────────────────
  const handleCopy = useCallback((text, index) => {
    const clean = text.replace(/<[^>]*>/g, "");
    navigator.clipboard?.writeText(clean);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  }, []);

  return {
    messages, inputValue, setInputValue,
    isTyping, isGenerating, displayedText, copiedIndex,
    messagesEndRef, containerRef,
    handleSendMessage, handleStop, handleClearChat, handleCopy,
  };
}
