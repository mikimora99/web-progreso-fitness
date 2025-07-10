// Variables globales
let sesionIniciada = false;
let temporizadorActivo = false;
let tiempoDescanso = 30;
let progresoNivel = 0;
let puntos = 0;
let racha = 0;
let nivel = 1;
const logros = [];

// DOMContentLoaded
window.onload = () => {
  generarCalendario();
  document.getElementById("tiempo-descanso").addEventListener("input", e => {
    tiempoDescanso = e.target.value;
  });
};

// Mostrar secciones
function mostrarSeccion(id) {
  document.querySelectorAll("main section").forEach(sec => sec.classList.remove("visible"));
  document.getElementById(id).classList.add("visible");
}

// Iniciar entrenamiento
function iniciarTemporizador() {
  sesionIniciada = true;
  document.getElementById("grupo-muscular").disabled = false;
  document.getElementById("temporizador").textContent = "00:00:00";
  temporizadorActivo = true;
  temporizador();
}

function temporizador() {
  let seg = 0;
  setInterval(() => {
    if (!temporizadorActivo) return;
    seg++;
    const h = String(Math.floor(seg / 3600)).padStart(2, "0");
    const m = String(Math.floor((seg % 3600) / 60)).padStart(2, "0");
    const s = String(seg % 60).padStart(2, "0");
    document.getElementById("temporizador").textContent = `${h}:${m}:${s}`;
  }, 1000);
}

// Cancelar entrenamiento
function cancelarEntrenamiento() {
  location.reload();
}

// Finalizar entrenamiento
function finalizarSesion() {
  temporizadorActivo = false;
  document.getElementById("popup-finalizar").classList.add("show");
}

function cerrarPopup() {
  document.getElementById("popup-finalizar").classList.remove("show");
  guardarSesion();
}

function guardarSesion() {
  const fecha = new Date();
  const dia = fecha.getDate();
  document.querySelectorAll("#calendario-interactivo button")[dia - 1].style.backgroundColor = "#deff77";
  sumarPuntos(10);
  racha++;
  actualizarStats();
}

// Cargar ejercicios
function cargarEjerciciosGrupo() {
  const grupo = document.getElementById("grupo-muscular").value;
  const selector = document.getElementById("selector-ejercicio");
  const contenedor = document.getElementById("contenedor-tablas");
  selector.innerHTML = "";
  contenedor.innerHTML = "";

  if (!grupo) return;

  const ejercicios = obtenerEjercicios(grupo);
  const select = document.createElement("select");
  select.innerHTML = `<option value="">-- Elegir Ejercicio --</option>` +
    ejercicios.map(ej => `<option value="${ej}">${ej}</option>`).join("");
  select.addEventListener("change", e => crearTablaEjercicio(e.target.value));
  selector.appendChild(select);
}

function obtenerEjercicios(grupo) {
  const base = {
    pecho: ["Press Banca", "Press Inclinado", "Aperturas", "Fondos", "Crossover"],
    espalda: ["Dominadas", "Remo", "Jalón al Pecho", "Peso muerto", "Pull over"],
    piernas: ["Sentadillas", "Prensa", "Zancadas", "Extensión Cuádriceps", "Curl femoral"],
    brazos: ["Curl Biceps", "Press Francés", "Martillo", "Polea", "Curl concentrado"],
    hombros: ["Press Militar", "Elevaciones Laterales", "Pájaros", "Arnold Press", "Face Pull"],
    core: ["Plancha", "Crunch", "Elevaciones Piernas", "Russian Twist", "Mountain Climbers"]
  };
  return base[grupo] || [];
}

function crearTablaEjercicio(nombre) {
  const tabla = document.createElement("table");
  tabla.innerHTML = `<thead><tr><th>Serie</th><th>Kg Anterior</th><th>Reps Anteriores</th><th>Kg Hoy</th><th>Reps Hoy</th><th>✔</th></tr></thead>`;
  const tbody = document.createElement("tbody");

  for (let i = 1; i <= 3; i++) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i}</td>
      <td>${Math.floor(Math.random() * 40 + 20)}</td>
      <td>${Math.floor(Math.random() * 8 + 4)}</td>
      <td><input type="number" /></td>
      <td><input type="number" /></td>
      <td><button class="hecho" onclick="marcarRealizado(this, ${i})">HECHO</button></td>
    `;
    tbody.appendChild(tr);

    const barra = document.createElement("div");
    barra.className = "barra-descanso";
    barra.innerHTML = `<div style="width: 0%"></div>`;
    tbody.appendChild(barra);
  }

  tabla.appendChild(tbody);

  const div = document.createElement("div");
  div.appendChild(document.createElement("h4")).textContent = nombre;
  div.appendChild(tabla);

  const btnSerie = document.createElement("button");
  btnSerie.textContent = "Añadir Serie";
  btnSerie.classList.add("anadir-serie");
  btnSerie.onclick = () => crearNuevaFila(tabla);
  div.appendChild(btnSerie);

  document.getElementById("contenedor-tablas").appendChild(div);
}

function crearNuevaFila(tabla) {
  const i = tabla.rows.length;
  const fila = tabla.insertRow();
  fila.innerHTML = `
    <td>${i}</td>
    <td>${Math.floor(Math.random() * 30 + 10)}</td>
    <td>${Math.floor(Math.random() * 6 + 4)}</td>
    <td><input type="number" /></td>
    <td><input type="number" /></td>
    <td><button class="hecho" onclick="marcarRealizado(this, ${i})">HECHO</button></td>
  `;
  const barra = document.createElement("div");
  barra.className = "barra-descanso";
  barra.innerHTML = `<div style="width: 0%"></div>`;
  tabla.appendChild(barra);
}

function marcarRealizado(btn, index) {
  btn.classList.add("realizado");
  const barra = btn.closest("tbody").querySelectorAll(".barra-descanso > div")[index - 1];
  if (barra) iniciarCuentaAtras(barra);
}

function iniciarCuentaAtras(barra) {
  let tiempo = tiempoDescanso;
  const total = tiempo;
  const intervalo = setInterval(() => {
    tiempo--;
    barra.style.width = `${((total - tiempo) / total) * 100}%`;
    if (tiempo <= 0) clearInterval(intervalo);
  }, 1000);
}

// Desplegables
function toggleDesplegable(id) {
  document.getElementById(id).classList.toggle("active");
}

// Calendario
function generarCalendario() {
  const hoy = new Date();
  const dias = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate();
  document.getElementById("mes-calendario").textContent = hoy.toLocaleDateString("es-ES", { month: "long", year: "numeric" });

  const calendario = document.getElementById("calendario-interactivo");
  calendario.innerHTML = "";

  for (let i = 1; i <= dias; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.onclick = () => mostrarSesionDia(i);
    calendario.appendChild(btn);
  }
}

function mostrarSesionDia(dia) {
  const container = document.getElementById("graficas-por-dia");
  container.innerHTML = `<p>Sesión del día ${dia}: ejercicios realizados, intensidad y notas se mostrarán aquí.</p>`;
}

// Gamificación
function sumarPuntos(cantidad) {
  puntos += cantidad;
  if (puntos >= nivel * 100) {
    puntos -= nivel * 100;
    nivel++;
    logros.push(`Nivel ${nivel} alcanzado`);
  }
  actualizarStats();
}

function actualizarStats() {
  document.getElementById("puntos-usuario").textContent = puntos;
  document.getElementById("racha-usuario").textContent = racha;
  document.getElementById("nivel-usuario").textContent = nivel;
  document.getElementById("barra-progreso-nivel").style.setProperty("width", `${(puntos / (nivel * 100)) * 100}%`);

  const contenedor = document.getElementById("logros-visual");
  contenedor.innerHTML = "";
  logros.forEach(l => {
    const badge = document.createElement("div");
    badge.className = "logro";
    badge.textContent = l;
    contenedor.appendChild(badge);
  });
}
