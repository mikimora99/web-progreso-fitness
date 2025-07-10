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

document.getElementById("formulario-ejercicio").addEventListener("submit", (e) => {
  e.preventDefault();
  const [nombre, peso, repeticiones] = e.target.elements;
  const item = document.createElement("li");
  item.textContent = `${nombre.value} - ${peso.value}kg x ${repeticiones.value} reps`;
  document.getElementById("lista-ejercicios").appendChild(item);
  nombre.value = "";
  peso.value = "";
  repeticiones.value = "";
});

function mostrarSeccion(id) {
  document.querySelectorAll("section").forEach(s => s.classList.remove("visible"));
  document.getElementById(id).classList.add("visible");
}
