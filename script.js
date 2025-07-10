let segundos = 0;
let temporizadorActivo = false;
let intervalo;
let ejerciciosActuales = [];
let historial = JSON.parse(localStorage.getItem("historial")) || [];

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
  if (id === "calendario") cargarHistorial();
}

const bibliotecaEjercicios = {
  pecho: ["Press banca", "Press inclinado", "Aperturas con mancuernas"],
  espalda: ["Dominadas", "Remo con barra", "Peso muerto"],
  piernas: ["Sentadillas", "Prensa", "Zancadas"],
  brazos: ["Curl bíceps", "Fondos", "Extensión tríceps polea"],
  hombros: ["Press militar", "Elevaciones laterales", "Pájaros"],
  core: ["Planchas", "Crunch abdominal", "Elevaciones de piernas"]
};

const sesionesAnteriores = JSON.parse(localStorage.getItem("ultimasSesiones")) || {};

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

function agregarEjercicioDesdeBiblioteca(nombre) {
  const anterior = sesionesAnteriores[nombre] || { kg: "-", reps: "-" };

  const ejercicio = {
    nombre,
    kgAnterior: anterior.kg,
    repsAnterior: anterior.reps,
    kgActual: "",
    repsActual: "",
    hecho: false
  };
  ejerciciosActuales.push(ejercicio);
  renderizarEjercicios();
}

function renderizarEjercicios() {
  const lista = document.getElementById("lista-ejercicios");
  lista.innerHTML = "";
  ejerciciosActuales.forEach((ej, i) => {
    const li = document.createElement("li");
    li.className = "ejercicio" + (ej.hecho ? " realizado" : "");

    li.innerHTML = `
      <strong>${ej.nombre}</strong><br>
      Anterior: ${ej.kgAnterior} kg x ${ej.repsAnterior} reps<br>
      Actual: 
      <input type="number" placeholder="Kg" value="${ej.kgActual}" onchange="actualizarCampo(${i}, 'kgActual', this.value)" />
      x
      <input type="number" placeholder="Reps" value="${ej.repsActual}" onchange="actualizarCampo(${i}, 'repsActual', this.value)" />
      <br>
      <button class="hecho" onclick="marcarHecho(${i})">✅ Hecho</button>
      <button class="cancelar" onclick="eliminarEjercicio(${i})">🗑 Cancelar</button>
    `;
    lista.appendChild(li);
  });
}

function actualizarCampo(index, campo, valor) {
  ejerciciosActuales[index][campo] = valor;
}

function marcarHecho(index) {
  ejerciciosActuales[index].hecho = true;
  renderizarEjercicios();
}

function eliminarEjercicio(index) {
  ejerciciosActuales.splice(index, 1);
  renderizarEjercicios();
}

function cancelarEntrenamiento() {
  if (confirm("¿Seguro que quieres cancelar el entrenamiento actual?")) {
    ejerciciosActuales = [];
    segundos = 0;
    clearInterval(intervalo);
    temporizadorActivo = false;
    document.getElementById("temporizador").textContent = "00:00:00";
    renderizarEjercicios();
  }
}

function finalizarSesion() {
  if (ejerciciosActuales.length === 0) {
    alert("No hay ejercicios en la sesión.");
    return;
  }

  ejerciciosActuales.forEach(ej => {
    sesionesAnteriores[ej.nombre] = {
      kg: ej.kgActual || "-",
      reps: ej.repsActual || "-"
    };
  });

  localStorage.setItem("ultimasSesiones", JSON.stringify(sesionesAnteriores));

  const fecha = new Date().toLocaleString();
  historial.push({
    fecha,
    ejercicios: [...ejerciciosActuales],
    duracion: formatearTiempo(segundos)
  });

  localStorage.setItem("historial", JSON.stringify(historial));

  alert("¡Sesión guardada con éxito!");
  cancelarEntrenamiento(); // limpia
}

function cargarHistorial() {
  const lista = document.getElementById("historial-sesiones");
  lista.innerHTML = "";
  historial.slice().reverse().forEach(sesion => {
    const item = document.createElement("li");
    item.innerHTML = `<strong>${sesion.fecha}</strong> - duración: ${sesion.duracion}<ul>` +
      sesion.ejercicios.map(e => `<li>${e.nombre}: ${e.kgActual} kg x ${e.repsActual} reps</li>`).join("") +
      `</ul>`;
    lista.appendChild(item);
  });
}
