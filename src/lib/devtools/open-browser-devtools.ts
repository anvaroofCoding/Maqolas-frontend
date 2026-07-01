function isApplePlatform() {
  return /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
}

function dispatchShortcut(
  init: Pick<
    KeyboardEventInit,
    "key" | "code" | "ctrlKey" | "shiftKey" | "altKey" | "metaKey"
  >,
) {
  const event = new KeyboardEvent("keydown", {
    ...init,
    bubbles: true,
    cancelable: true,
  });

  window.dispatchEvent(event);
  document.dispatchEvent(event);
}

function isDevToolsLikelyOpen() {
  const widthGap = window.outerWidth - window.innerWidth;
  const heightGap = window.outerHeight - window.innerHeight;
  return widthGap > 140 || heightGap > 140;
}

export function logConsoleBanner() {
  console.clear();
  console.log(
    "%cMaqolas",
    "font-size:22px;font-weight:700;color:#7c3aed;",
    "— developer console",
  );
  console.log("URL:", window.location.href);
  console.log("Vaqt:", new Date().toISOString());
}

export function openBrowserConsole() {
  logConsoleBanner();

  const isMac = isApplePlatform();

  if (isMac) {
    dispatchShortcut({
      key: "j",
      code: "KeyJ",
      metaKey: true,
      altKey: true,
    });
  } else {
    dispatchShortcut({
      key: "J",
      code: "KeyJ",
      ctrlKey: true,
      shiftKey: true,
    });
    dispatchShortcut({
      key: "F12",
      code: "F12",
    });
  }

  return isDevToolsLikelyOpen();
}

export function getElementSelector(element: Element) {
  if (element.id) {
    return `#${CSS.escape(element.id)}`;
  }

  const parts: string[] = [];
  let current: Element | null = element;

  while (current && current !== document.body && parts.length < 4) {
    let part = current.tagName.toLowerCase();

    if (current.classList.length) {
      const className = [...current.classList]
        .slice(0, 2)
        .map((name) => `.${CSS.escape(name)}`)
        .join("");
      part += className;
    }

    parts.unshift(part);
    current = current.parentElement;
  }

  return parts.join(" > ");
}

const OUTLINE_CLASS = "maqolas-inspect-flash";

export function flashInspectTarget(element: Element) {
  element.classList.add(OUTLINE_CLASS);
  window.setTimeout(() => {
    element.classList.remove(OUTLINE_CLASS);
  }, 1800);
}

export function inspectElement(element: Element) {
  element.scrollIntoView({ block: "center", behavior: "smooth" });
  flashInspectTarget(element);

  const selector = getElementSelector(element);

  console.group("Maqolas — Inspect");
  console.log("Element:", element);
  console.log("Selector:", selector);
  console.dir(element);
  console.groupEnd();

  const isMac = isApplePlatform();

  if (isMac) {
    dispatchShortcut({
      key: "c",
      code: "KeyC",
      metaKey: true,
      shiftKey: true,
    });
  } else {
    dispatchShortcut({
      key: "C",
      code: "KeyC",
      ctrlKey: true,
      shiftKey: true,
    });
  }

  return {
    selector,
    devToolsOpen: isDevToolsLikelyOpen(),
  };
}

export function devToolsShortcutHints() {
  const isMac = isApplePlatform();
  return {
    console: isMac ? "Cmd+Option+J" : "Ctrl+Shift+J",
    inspect: isMac ? "Cmd+Shift+C" : "Ctrl+Shift+C",
  };
}
