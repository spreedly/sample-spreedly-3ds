
/**
 * Wrapper around the regular `window` object. Allows us to simulate conditions that may trigger a 3DS1 flow.
 */
class MockFallbackBrowser {
  // instead of window.screen.width, height, etc
  screen = {
    width: "0",
    height: "0",
    colorDepth: "-1"
  };

  navigator = {
    javaEnabled: function () {
      return window.navigator.javaEnabled()
    },
    // window.navigator.userAgent
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) Spreedly 3DS Debugging MockFallbackBrowserFace",
    language: window.navigator.language
  }
}
