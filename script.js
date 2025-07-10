let segundos = 0;
let temporizadorActivo = false;
let intervalo;

function iniciarTemporizador() {
  if (!temporizadorActivo) {
    temporizadorActivo = true;
    intervalo = setInterval(() => {
      segundos++;
      document.getElementById("temporizador").textContent = formatearTiempo(segundos);
    }, 1000);
  }
}

function formatearTiempo(segundos) {
  const h = Math.floor(segundos / 3600).toString().padStart(2, '0');
  const m = Math.floor((segundos % 3600) / 60).toString().padStart(2, '0');
  const s = (segundos % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function mostrarSeccion(id) {
  document.querySelectorAll("section").forEach(s => s.classList.remove("visible"));
  document.getElementById(id).classList.add("visible");
}

const bibliotecaEjercicios = {
  pecho: ["Press banca", "Press inclinado", "Aperturas con mancuernas"],
  espalda: ["Dominadas", "Remo con barra", "Peso muerto"],
  piernas: ["Sentadillas", "Prensa", "Zancadas"],
  brazos: ["Curl bíceps", "Fondos", "Extensión tríceps polea"],
  hombros: ["Press militar", "Elevaciones laterales", "Pájaros"],
  core: ["Planchas", "Crunch abdominal", "Elevaciones de piernas"]
};

function cargarEjercicios() {
  const grupo = document.getElementById("grupo-muscular").value;
  const lista = document.getElementById("ejercicios-lista");
  lista.innerHTML = "";

  if (grupo && bibliotecaEjercicios[grupo]) {
    bibliotecaEjercicios[grupo].forEach(ejercicio => {
      const btn = document.createElement("button");
      btn.textContent = `➕ ${ejercicio}`;
      btn.onclick = () => agregarEjercicioDesdeBiblioteca(ejercicio);
      lista.appendChild(btn);
    });
  }
}

function agregarEjercicioDesdeBiblioteca(nombreEjercicio) {
  const peso = prompt(`¿Cuánto peso usaste en "${nombreEjercicio}"? (kg)`);
  const repeticiones = prompt(`¿Cuántas repeticiones hiciste?`);
  if (peso && repeticiones) {
    const item = document.createElement("li");
    item.textContent = `${nombreEjercicio} - ${peso}kg x ${repeticiones} reps`;
    document.getElementById("lista-ejercicios").appendChild(item);
  }
}
