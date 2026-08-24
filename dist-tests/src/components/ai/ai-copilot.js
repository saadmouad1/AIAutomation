"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiCopilot = AiCopilot;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@ai-sdk/react");
const ai_1 = require("ai");
const lucide_react_1 = require("lucide-react");
const react_2 = require("react");
const button_1 = require("@/components/ui/button");
const utils_1 = require("@/lib/utils");
const framer_motion_1 = require("framer-motion");
function AiCopilot() {
    const [isOpen, setIsOpen] = (0, react_2.useState)(false);
    const [inputValue, setInputValue] = (0, react_2.useState)("");
    const { messages, sendMessage, status } = (0, react_1.useChat)({
        transport: new ai_1.DefaultChatTransport({ api: "/api/chat" }),
    });
    const isLoading = status === "streaming" || status === "submitted";
    const messagesEndRef = (0, react_2.useRef)(null);
    // Auto-scroll to bottom
    (0, react_2.useEffect)(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);
    const handleSubmit = (e) => {
        e.preventDefault();
        const text = inputValue.trim();
        if (!text || isLoading)
            return;
        sendMessage({ text });
        setInputValue("");
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { children: !isOpen && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { scale: 0, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0, opacity: 0 }, className: "fixed bottom-6 right-6 z-50", children: (0, jsx_runtime_1.jsxs)(button_1.Button, { onClick: () => setIsOpen(true), className: "h-14 w-14 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 hover:from-amber-600 hover:to-orange-500 text-white shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] transition-all p-0 overflow-hidden group", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Sparkles, { className: "h-6 w-6 group-hover:scale-110 transition-transform" })] }) })) }), (0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { children: isOpen && ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 20, scale: 0.95 }, transition: { type: "spring", stiffness: 300, damping: 25 }, className: "fixed bottom-6 right-6 z-50 w-[400px] h-[600px] max-h-[85vh] bg-background/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col", children: [(0, jsx_runtime_1.jsxs)("div", { className: "px-5 py-4 border-b border-white/5 bg-white/5 flex justify-between items-center relative overflow-hidden", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent pointer-events-none" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 relative", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-10 w-10 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center border border-amber-500/30", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Bot, { className: "h-5 w-5" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-foreground text-sm", children: "Flowra AI" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-muted-foreground", children: "Workflow Assistant" })] })] }), (0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "icon", className: "rounded-full h-8 w-8 text-muted-foreground hover:text-foreground relative", onClick: () => setIsOpen(false), children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-4 w-4" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent", children: [messages.length === 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "h-full flex flex-col items-center justify-center text-center opacity-70", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Sparkles, { className: "h-8 w-8 text-amber-500/80" }) }), (0, jsx_runtime_1.jsx)("h4", { className: "text-lg font-medium text-foreground mb-2", children: "How can I help?" }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-muted-foreground max-w-[250px]", children: "Ask me to build a workflow, explain a node, or write a custom script." })] })), messages.map((message) => {
                                    // In AI SDK v7, text content lives in parts
                                    const textContent = message.parts
                                        .filter((p) => p.type === "text")
                                        .map((p) => p.text)
                                        .join("");
                                    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, utils_1.cn)("flex gap-3", message.role === "user" ? "flex-row-reverse" : "flex-row"), children: [(0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)("h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 border", message.role === "user"
                                                    ? "bg-primary text-primary-foreground border-primary/50"
                                                    : "bg-white/5 text-amber-500 border-white/10"), children: message.role === "user" ? ((0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-4 w-4" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Bot, { className: "h-4 w-4" })) }), (0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)("px-4 py-3 rounded-2xl max-w-[80%] text-sm leading-relaxed", message.role === "user"
                                                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                                                    : "bg-white/5 text-foreground border border-white/5 rounded-tl-sm"), children: textContent })] }, message.id));
                                }), isLoading && ((0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-8 w-8 rounded-full bg-white/5 text-amber-500 border border-white/10 flex items-center justify-center flex-shrink-0", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Bot, { className: "h-4 w-4" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "px-4 py-3 rounded-2xl bg-white/5 border border-white/5 rounded-tl-sm flex items-center gap-1.5", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 rounded-full bg-amber-500/50 animate-bounce", style: { animationDelay: "0ms" } }), (0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 rounded-full bg-amber-500/50 animate-bounce", style: { animationDelay: "150ms" } }), (0, jsx_runtime_1.jsx)("div", { className: "w-2 h-2 rounded-full bg-amber-500/50 animate-bounce", style: { animationDelay: "300ms" } })] })] })), (0, jsx_runtime_1.jsx)("div", { ref: messagesEndRef })] }), (0, jsx_runtime_1.jsx)("div", { className: "p-4 border-t border-white/5 bg-background", children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "relative flex items-center", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: inputValue, onChange: (e) => setInputValue(e.target.value), placeholder: "Ask Flowra AI...", className: "w-full bg-white/5 border border-white/10 rounded-full pl-5 pr-12 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 text-foreground placeholder:text-muted-foreground transition-all" }), (0, jsx_runtime_1.jsx)(button_1.Button, { type: "submit", size: "icon", disabled: !inputValue.trim() || isLoading, className: "absolute right-1.5 h-9 w-9 rounded-full bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-50 disabled:bg-white/10 disabled:text-white/30", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Send, { className: "h-4 w-4 ml-0.5" }) })] }) })] })) })] }));
}
