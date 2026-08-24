"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFlowraTheme = useFlowraTheme;
exports.ThemeProvider = ThemeProvider;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = __importStar(require("react"));
const next_themes_1 = require("next-themes");
const FlowraThemeContext = React.createContext({
    accent: "purple",
    setAccent: () => { },
});
function useFlowraTheme() {
    return React.useContext(FlowraThemeContext);
}
function ThemeProvider({ children }) {
    const [accent, setAccentState] = React.useState("purple");
    // Load saved accent from localStorage
    React.useEffect(() => {
        const saved = localStorage.getItem("flowra-accent");
        if (saved) {
            setAccentState(saved);
            applyAccent(saved);
        }
    }, []);
    function applyAccent(a) {
        const root = document.documentElement;
        if (a === "purple") {
            root.removeAttribute("data-accent");
        }
        else {
            root.setAttribute("data-accent", a);
        }
    }
    function setAccent(a) {
        setAccentState(a);
        applyAccent(a);
        localStorage.setItem("flowra-accent", a);
    }
    return ((0, jsx_runtime_1.jsx)(FlowraThemeContext.Provider, { value: { accent, setAccent }, children: (0, jsx_runtime_1.jsx)(next_themes_1.ThemeProvider, { attribute: "class", defaultTheme: "system", enableSystem: true, disableTransitionOnChange: false, children: children }) }));
}
