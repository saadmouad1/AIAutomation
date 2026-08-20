"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type Accent = "purple" | "blue" | "cyan" | "green" | "orange" | "rose";

interface FlowraThemeContextValue {
  accent: Accent;
  setAccent: (accent: Accent) => void;
}

const FlowraThemeContext = React.createContext<FlowraThemeContextValue>({
  accent: "purple",
  setAccent: () => {},
});

export function useFlowraTheme() {
  return React.useContext(FlowraThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccentState] = React.useState<Accent>("purple");

  // Load saved accent from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem("flowra-accent") as Accent | null;
    if (saved) {
      setAccentState(saved);
      applyAccent(saved);
    }
  }, []);

  function applyAccent(a: Accent) {
    const root = document.documentElement;
    if (a === "purple") {
      root.removeAttribute("data-accent");
    } else {
      root.setAttribute("data-accent", a);
    }
  }

  function setAccent(a: Accent) {
    setAccentState(a);
    applyAccent(a);
    localStorage.setItem("flowra-accent", a);
  }

  return (
    <FlowraThemeContext.Provider value={{ accent, setAccent }}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange={false}
      >
        {children}
      </NextThemesProvider>
    </FlowraThemeContext.Provider>
  );
}
