const Terminal = function (opt) {
  let options = { delay: {} };

  let container = document.querySelector(opt.containerSelector);
  let lines;

  options.hideOnLoad = "hideOnLoad" in opt ? opt.hideOnLoad : true;
  options.leaveCursor = "leaveCursor" in opt ? opt.leaveCursor : true;
  options.replayable = "replayable" in opt ? opt.replayable : true;
  options.callback = "callback" in opt ? opt.callback : false;

  if (!("delay" in opt)) {
    opt.delay = {};
  }

  options.delay.characters =
    "characters" in opt.delay ? opt.delay.characters : 90;
  options.delay.lines = "lines" in opt.delay ? opt.delay.lines : 1200;

  prepare();

  if ("start" in opt.delay) {
    start(opt.delay.start);
  }

  return {
    start: start,
  }

  function prepare() {
    lines = container.querySelectorAll("code");

    if (options.hideOnLoad) {
      const style = getComputedStyle(container);

      container.style.width = style.width;
      container.style.minHeight = style.height;

      container.innerHTML = "";

      const placeholderCursor = constructPlaceholderCursor();
      container.appendChild(placeholderCursor);
    }
  }

  async function start(ms) {
    if (ms !== undefined) {
      await delay(ms);
    }

    container.innerHTML = "";

    let numLines = lines.length;

    for (let line of lines) {
      if (line.hasAttribute("data-term-input")) {
        await line.setAttribute("data-term-cursor", true);
        await type(line);
      } else {
        container.appendChild(line);
      }

      if (line.hasAttribute("data-term-delay")) {
        await delay(line.getAttribute("data-term-delay"));
      } else {
        await delay(options.delay.lines);
      }

      if (!--numLines && options.leaveCursor) {
        await line.setAttribute("data-term-cursor", true);
      } else {
        await line.removeAttribute("data-term-cursor");
      }
    }

    if (opt.replayable) {
      const replayCtrl = constructReplayCtrl();
      container.appendChild(replayCtrl);
    }

    if (opt.callback) {
      opt.callback();
    }
  }

  async function delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  async function type(line) {
    const chars = [...line.textContent];
    line.textContent = "";
    container.appendChild(line);

    for (let char of chars) {
      await delay(options.delay.characters);
      line.textContent += char;
    }
  }

  function constructPlaceholderCursor() {
    const cursor = document.createElement("code");
    cursor.setAttribute("data-term-input", true);
    cursor.setAttribute("data-term-cursor", true);

    return cursor;
  }

  function constructReplayCtrl() {
    const replayCtrl = document.createElement("span");
    replayCtrl.setAttribute("data-term-replay", true);
    replayCtrl.appendChild(document.createTextNode("Replay"));
    replayCtrl.onclick = (event) => {
      start();
    };

    return replayCtrl;
  }
}

export default Terminal;
module.exports = Terminal;
