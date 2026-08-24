"use strict";
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
exports.Switch = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const React = __importStar(require("react"));
const SwitchPrimitive = __importStar(require("@radix-ui/react-switch"));
const utils_1 = require("@/lib/utils");
const Switch = React.forwardRef(({ className, ...props }, ref) => ((0, jsx_runtime_1.jsx)(SwitchPrimitive.Root, { className: (0, utils_1.cn)("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent", "transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]", "disabled:cursor-not-allowed disabled:opacity-50", "data-[state=checked]:bg-[var(--brand)] data-[state=unchecked]:bg-[var(--surface-overlay)]", className), ...props, ref: ref, children: (0, jsx_runtime_1.jsx)(SwitchPrimitive.Thumb, { className: (0, utils_1.cn)("pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm ring-0", "transition-transform duration-150 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") }) })));
exports.Switch = Switch;
Switch.displayName = SwitchPrimitive.Root.displayName;
