export function createPointsElement(): HTMLDivElement {
  const el = document.createElement("div");

  el.id = "points";
  el.classList.add("points");
  el.innerText = "0";

  return el;
}

export function getPointsElement() {
  return document.querySelector("#points") as HTMLDivElement;
}

export function createGameOverElement(): HTMLDivElement {
  const el = document.createElement("div");

  el.id = "result";
  el.classList.add("result");
  el.classList.add("hidden");

  el.innerHTML = `
    <div class="result">
      <h1 class="result__header">Game Over</h1>
      <p class="result__text" id="result-points">Points: 0</p>
      <p class="result__text">Press <strong>Enter</strong> to restart</p>
    </div>
  `

  return el;
}

export function getResultPointsElement() {
  return document.querySelector("#result-points") as HTMLParagraphElement;
}

export function getGameOverElement() {
  return document.querySelector("#result") as HTMLDivElement;
}

export function createCanvasElement(): HTMLCanvasElement {
  const el = document.createElement("canvas");

  el.width = 625;
  el.height = 625;
  el.id = "game";

  return el;
}

export function getCanvasElement() {
  return document.querySelector("#game") as HTMLCanvasElement;
}