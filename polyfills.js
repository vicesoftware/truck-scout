if (typeof URL.canParse !== 'function') {
  URL.canParse = function(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
}