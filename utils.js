/**
 * utils.js — shared helper functions
 */

const Utils = (() => {

  /**
   * Format a number to human-readable form (1.2K, 4.5M, etc.)
   */
  function formatNum(n) {
    const num = parseInt(n, 10) || 0;
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1_000)     return (num / 1_000).toFixed(1).replace(/\.0$/, '')     + 'K';
    return num.toLocaleString();
  }

  /**
   * Read a File object as a data URL, returns a Promise<string>
   */
  function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = e => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Could not read file'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Escape HTML special characters to prevent XSS in innerHTML
   */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Show a short toast notification
   */
  function toast(msg, duration = 2200) {
    let el = document.getElementById('toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast';
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove('show'), duration);
  }

  /**
   * Get initials from a string (up to 2 chars)
   */
  function initials(str) {
    return String(str).trim().slice(0, 2).toUpperCase() || 'U';
  }

  return { formatNum, readFileAsDataURL, escapeHtml, toast, initials };
})();
