import '@google/model-viewer';
import './style.css';
import { sillas, colores } from './sillas.js';

const visor = document.querySelector('#visor');
const tabs = document.querySelector('#tabs');
const swatches = document.querySelector('#colores');
const error = document.querySelector('#error');
let actual = sillas[0];

function material() {
  const mats = visor.model?.materials ?? [];
  return mats.find((m) => m.name === actual.material) ?? mats[0];
}

function cambiarColor(hex) {
  material()?.pbrMetallicRoughness.setBaseColorFactor(hex);
}

function cambiarAcabado(rug) {
  material()?.pbrMetallicRoughness.setRoughnessFactor(Number(rug));
}

function seleccionar(i) {
  actual = sillas[i];
  error.hidden = true;
  visor.src = actual.archivo;
  visor.alt = `Silla ${actual.nombre}`;
  document.querySelector('#nombre').textContent = actual.nombre;
  document.querySelector('#precio').textContent = actual.precio;
  document.querySelector('#categoria').textContent = actual.categoria;
  [...tabs.children].forEach((b, n) => b.classList.toggle('on', n === i));
  document.querySelectorAll('.seg button').forEach((b, n) => b.classList.toggle('on', n === 0));
}

sillas.forEach((s, i) => {
  const b = document.createElement('button');
  b.textContent = s.nombre;
  b.onclick = () => seleccionar(i);
  tabs.appendChild(b);
});

colores.forEach((hex) => {
  const b = document.createElement('button');
  b.style.background = hex;
  b.setAttribute('aria-label', hex);
  b.onclick = () => cambiarColor(hex);
  swatches.appendChild(b);
});

document.querySelectorAll('.seg button').forEach((b) => {
  b.onclick = () => {
    document.querySelectorAll('.seg button').forEach((x) => x.classList.remove('on'));
    b.classList.add('on');
    cambiarAcabado(b.dataset.rug);
  };
});

visor.addEventListener('load', () => {
  console.log('Materiales del modelo:', visor.model.materials.map((m) => m.name));
});
visor.addEventListener('error', () => (error.hidden = false));

seleccionar(0);
