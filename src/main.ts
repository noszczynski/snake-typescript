import "./style.css";
import { startGame } from "./app.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <canvas width="625" height="625" id="game"></canvas>
`;

startGame();
