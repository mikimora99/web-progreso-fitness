let tiempoInicio;
let intervaloTemporizador;

function mostrarSeccion(id) {
  document.querySelectorAll("section").forEach(s => s.classList.remove("visible"));
  document.getElementById(id).classList.add("visible");
}

function iniciarTemporizador() {
  tiempoInicio = new Date();
  intervaloTemporizador = setInterval(actualizarTemporizador, 1000);
  document.getElementById("grupo-muscular").disabled = false;
}

function actualizarTemporizador() {
  const ahora = new Date();
  const diff = new Date(ahora - tiempoInicio);
  const h = String(diff.getUTCHours()).padStart(2, "0");
  const m = String(diff.getUTCMinutes()).padStart(2, "0");
  const s = String(diff.getUTCSeconds()).padStart(2, "0");
  document.getElementById("temporizador").textContent = `${h}:${m}:${s}`;
}

function cargarEjerciciosGrupo() {
  const grupo = document.getElementById("grupo-muscular").value;
  const selector = document.getElementById("selector-ejercicio");
  const contenedor = document.getElementById("contenedor-tablas");
  selector.innerHTML = "";
  contenedor.innerHTML = "";

  if (!grupo) return;

  const ejerciciosPorGrupo = {
    pecho: ["Press banca", "Aperturas", "Press inclinado", "Fondos", "Flexiones"],
    espalda: ["Dominadas", "Remo", "Peso muerto", "Jalón al pecho", "Remo con mancuerna"],
    piernas: ["Sentadillas", "Prensa", "Zancadas", "Peso muerto rumano", "Extensiones"],
    brazos: ["Curl bíceps", "Press francés", "Curl martillo", "Fondos", "Patada triceps"],
    hombros: ["Press militar", "Elevaciones laterales", "Elevaciones frontales", "Pájaros", "Arnold press"],
    core: ["Plancha", "Crunch", "Elevaciones de piernas", "Russian twists", "Ab wheel"]
  };

  const ejercicios = ejerciciosPorGrupo[grupo] || [];
  const selectEj = document.createElement("select");
  selectEj.onchange = () => crearTablaEjercicio(selectEj.value, grupo);

  const defaultOption = document.createElement("option");
  defaultOption.textContent = "-- Elegir ejercicio --";
  defaultOption.value = "";
  selectEj.appendChild(defaultOption);

  ejercicios.forEach(ej => {
    const option = document.createElement("option");
    option.value = ej;
    option.textContent = ej;
    selectEj.appendChild(option);
  });

  selector.appendChild(selectEj);
}

function crearTablaEjercicio(ejercicio, grupo) {
  if (!ejercicio) return;
  const contenedor = document.getElementById("contenedor-tablas");
  const tabla = document.createElement("table");
  tabla.innerHTML = `
    <thead>
      <tr><th colspan="6">${ejercicio}</th></tr>
      <tr><th>Serie</th><th>Anterior KG</th><th>Anterior Reps</th><th>KG</th><th>Reps</th><th>✔</th></tr>
    </thead>
    <tbody></tbody>
  `;

  const cuerpo = tabla.querySelector("tbody");

  function agregarFila(num) {
    const tr = document.createElement("tr");
    const kgAnterior = Math.floor(Math.random() * 20 + 40);
    const repsAnterior = Math.floor(Math.random() * 4 + 8);

    tr.innerHTML = `
      <td>${num}</td>
      <td>${kgAnterior}</td>
      <td>${repsAnterior}</td>
      <td><input type="number" /></td>
      <td><input type="number" /></td>
      <td><button class="hecho" onclick="marcarHecho(this)">✔</button></td>
    `;

    const barraContenedor = document.createElement("tr");
    const barraCelda = document.createElement("td");
    barraCelda.colSpan = 6;

    const barra = document.createElement("div");
    barra.classList.add("barra-descanso");
    barra.style.margin = "auto";
    const progreso = document.createElement("div");
    progreso.classList.add("progreso");
    barra.appendChild(progreso);
    barraCelda.appendChild(barra);
    barraContenedor.appendChild(barraCelda);

    cuerpo.appendChild(tr);
    cuerpo.appendChild(barraContenedor);
  }

  agregarFila(1);

  const btnAdd = document.createElement("button");
  btnAdd.textContent = "AÑADIR SERIE";
  btnAdd.className = "anadir-serie";
  btnAdd.onclick = () => agregarFila(tabla.querySelectorAll("tbody tr").length / 2 + 1);

  contenedor.appendChild(tabla);
  contenedor.appendChild(btnAdd);
}

function marcarHecho(btn) {
  const fila = btn.closest("tr");
  fila.style.opacity = "0.5";
  const barraProgreso = fila.nextElementSibling.querySelector("div.progreso");
  iniciarDescanso(barraProgreso);
}

function iniciarDescanso(barra) {
  const segundos = parseInt(document.getElementById("tiempo-descanso").value);
  let actual = 0;
  barra.style.width = "0%";
  const timer = setInterval(() => {
    actual++;
    barra.style.width = `${(actual / segundos) * 100}%`;
    if (actual >= segundos) clearInterval(timer);
  }, 1000);
}

function finalizarSesion() {
  clearInterval(intervaloTemporizador);
  document.getElementById("popup-finalizar").classList.add("show");

  // ejemplo sistema puntos y racha
  let puntos = parseInt(localStorage.getItem("puntos") || 0);
  let racha = parseInt(localStorage.getItem("racha") || 0);
  let nivel = parseInt(localStorage.getItem("nivel") || 1);

  puntos += 20;
  racha += 1;

  if (puntos >= nivel * 150) {
    nivel += 1;
    puntos = 0;
  }

  localStorage.setItem("puntos", puntos);
  localStorage.setItem("racha", racha);
  localStorage.setItem("nivel", nivel);

  document.getElementById("puntos-usuario").textContent = puntos;
  document.getElementById("racha-usuario").textContent = racha;
  document.getElementById("nivel-usuario").textContent = nivel;
}

function cancelarEntrenamiento() {
  clearInterval(intervaloTemporizador);
  document.getElementById("temporizador").textContent = "00:00:00";
  document.getElementById("grupo-muscular").disabled = true;
  document.getElementById("grupo-muscular").value = "";
  document.getElementById("selector-ejercicio").innerHTML = "";
  document.getElementById("contenedor-tablas").innerHTML = "";
}

function cerrarPopup() {
  document.getElementById("popup-finalizar").classList.remove("show");
}

function mostrarImagenPerfil(event) {
  const img = document.querySelector("#preview-foto img");
  img.src = URL.createObjectURL(event.target.files[0]);
}

function toggleDesplegable(id) {
  const elem = document.getElementById(id);
  elem.classList.toggle("active");
}

// CALENDARIO
function crearCalendario() {
  const hoy = new Date();
  const year = hoy.getFullYear();
  const month = hoy.getMonth();
  const mesTexto = hoy.toLocaleString("default", { month: "long" });

  document.getElementById("mes-calendario").textContent = mesTexto.toUpperCase();

  const dias = new Date(year, month + 1, 0).getDate();
  const contenedor = document.getElementById("calendario-interactivo");
  contenedor.innerHTML = "";

  for (let d = 1; d <= dias; d++) {
    const btn = document.createElement("button");
    btn.textContent = d;
    if (Math.random() > 0.75) btn.style.background = "var(--color-acento)";
    btn.onclick = () => mostrarGrafica(d);
    contenedor.appendChild(btn);
  }
}

function mostrarGrafica(dia) {
  document.getElementById("graficas-por-dia").innerHTML = `<p>Progresión del día ${dia}.</p>`;
}

window.onload = crearCalendario;
