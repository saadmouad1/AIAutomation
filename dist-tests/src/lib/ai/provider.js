"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerProvider = registerProvider;
exports.getProvider = getProvider;
exports.requireProvider = requireProvider;
/**
 * Registry to retrieve the configured AI provider.
 * Returns null if no provider is available — consumers must handle gracefully.
 */
let _activeProvider = null;
function registerProvider(provider) {
    _activeProvider = provider;
}
function getProvider() {
    return _activeProvider;
}
function requireProvider() {
    if (!_activeProvider || !_activeProvider.isAvailable) {
        throw new Error("AI_PROVIDER_UNAVAILABLE");
    }
    return _activeProvider;
}
