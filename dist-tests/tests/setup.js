"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@testing-library/jest-dom/vitest");
const react_1 = require("@testing-library/react");
const vitest_1 = require("vitest");
// Runs a cleanup after each test case (e.g. clearing jsdom)
(0, vitest_1.afterEach)(() => {
    (0, react_1.cleanup)();
});
