/**
 * polyfills.js
 * Global fallbacks for SIUKAT to ensure browser stability.
 */

// Fix ReferenceError: process is not defined early on
if (typeof window !== 'undefined' && typeof window.process === 'undefined') {
    window.process = {
        env: { NODE_ENV: 'development' },
        nextTick: function(fn) { setTimeout(fn, 0); }
    };
}

export default {};
