import Terminal from '../../lightweight-animated-javascript-terminal.js';

const editor = Terminal({
  containerSelector: "#editor",
  leaveCursor: false,
  delay: { 
    lines: 500,
    characters: 40,
    replayable: true,
  },
});

const shell = Terminal({
  containerSelector: "#shell",
  delay: { start: 2000 },
  replayable: false,
  callback: () => {
    const s = document.querySelector("#shell");
    const e = document.querySelector("#editor");

    e.style.opacity = "100";
    s.style.display = "none";

    editor.start();
  },
});

