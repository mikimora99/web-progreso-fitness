// Secciones y navegación
function mostrarSeccion(id) {
  document.querySelectorAll("section").forEach((s) => s.classList.remove("visible"));
  document.getElementById(id).classList.add("visible");
  document.querySelectorAll("nav button").forEach((b) => b.classList.remove("activo"));
  document.querySelectorAll("nav button").forEach((b) => {
    if (b.textContent.toLowerCase() === id) b.classList.add("activo");
  });
}

// Nombre de usuario
function actualizarNombre() {
  const nombre = document.getElementById("nombre").value.toUpperCase();
  document.getElementById("nombre-usuario").textContent = nombre || "USUARIO";
}

// Click en nombre vuelve a inicio
document.getElementById("nombre-usuario").addEventListener("click", () => mostrarSeccion("inicio"));

// Desplegables usuario
function toggleDesplegable(id) {
  const seccion = document.getElementById(id);
  seccion.style.display = seccion.style.display === "block" ? "none" : "block";
}

// Imagen perfil
function mostrarImagenPerfil(e) {
  const img = document.querySelector("#preview-foto img");
  const archivo = e.target.files[0];
  if (archivo) {
    const lector = new FileReader();
    lector.onload = () => (img.src = lector.result);
    lector.readAsDataURL(archivo);
  }
}

// Temporizador visual
let temporizadorActivo = false;
function iniciarTemporizador() {
  document.getElementById("grupo-muscular").disabled = false;
  temporizadorActivo = true;
}

function iniciarDescansoVisual(callback) {
  const contenedor = document.getElementById("temporizador");
  let tiempo = parseInt(document.getElementById("tiempo-descanso").value);
  const cuenta = setInterval(() => {
    contenedor.textContent = `Descanso: ${tiempo}s`;
    tiempo--;
    if (tiempo < 0) {
      clearInterval(cuenta);
      contenedor.textContent = "";
      if (callback) callback();
    }
  }, 1000);
}

// Ejercicios
const ejercicios = {
  pecho: ["Press banca", "Aperturas", "Press inclinado", "Fondos"],
  espalda: ["Dominadas", "Remo", "Jalón", "Peso muerto"],
  piernas: ["Sentadilla", "Zancadas", "Prensa", "Curl femoral"],
  brazos: ["Curl bíceps", "Tríceps polea", "Martillo", "Fondos"],
  hombros: ["Press militar", "Elevaciones laterales", "Pájaro", "Arnold press"],
  core: ["Plancha", "Crunch", "Elevaciones piernas", "Bicicleta"]
};

function cargarEjerciciosGrupo() {
  const grupo = document.getElementById("grupo-muscular").value;
  const selector = document.getElementById("selector-ejercicio");
  selector.innerHTML = "";

  if (!grupo) return;

  const sel = document.createElement("select");
  sel.id = "ejercicio-select";
  sel.innerHTML = `<option value="">-- Elegir ejercicio --</option>`;
  ejercicios[grupo].forEach((e) => {
    sel.innerHTML += `<option value="${e}">${e}</option>`;
  });
  sel.onchange = () => generarTablaEjercicio(grupo, sel.value);
  selector.appendChild(sel);
}

function generarTablaEjercicio(grupo, ejercicio) {
  if (!ejercicio) return;
  const contenedor = document.getElementById("contenedor-tablas");
  const tabla = document.createElement("table");
  tabla.innerHTML = `
    <thead><tr><th>Serie</th><th>KG Anterior</th><th>Reps Anterior</th><th>KG Hoy</th><th>Reps Hoy</th><th>✔</th></tr></thead>
    <tbody id="tbody-${grupo}-${ejercicio}"></tbody>
    <tfoot><tr><td colspan="6"><button onclick="añadirSerie('${grupo}','${ejercicio}')">AÑADIR SERIE</button></td></tr></tfoot>
  `;
  contenedor.appendChild(tabla);
}

function añadirSerie(grupo, ejercicio) {
  const tbody = document.getElementById(`tbody-${grupo}-${ejercicio}`);
  const num = tbody.rows.length + 1;
  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td>${num}</td>
    <td>${Math.floor(Math.random()*20)+20}</td>
    <td>${Math.floor(Math.random()*5)+8}</td>
    <td><input type="number" /></td>
    <td><input type="number" /></td>
    <td><span class="check-completado" onclick="completarSerie(this)">✔</span></td>
  `;
  tbody.appendChild(fila);
}

function completarSerie(el) {
  const fila = el.parentElement.parentElement;
  fila.classList.add("fila-completada");
  iniciarDescansoVisual();
}

// Finalizar sesión
function finalizarSesion() {
  document.getElementById("popup-finalizar").style.display = "block";
  sumarPuntos(10);
  actualizarRacha();
  actualizarNivel();
}

function cerrarPopup() {
  document.getElementById("popup-finalizar").style.display = "none";
}

// Cancelar
function cancelarEntrenamiento() {
  document.getElementById("grupo-muscular").disabled = true;
  document.getElementById("selector-ejercicio").innerHTML = "";
  document.getElementById("contenedor-tablas").innerHTML = "";
}

// Calendario
function crearCalendario() {
  const contenedor = document.getElementById("calendario-interactivo");
  contenedor.innerHTML = "";
  for (let i = 1; i <= 31; i++) {
    const dia = document.createElement("div");
    dia.className = "dia";
    dia.textContent = i;
    dia.onclick = () => mostrarEntrenoDia(i);
    if (i % 5 === 0) dia.classList.add("completado"); // simulado
    contenedor.appendChild(dia);
  }
}

function mostrarEntrenoDia(dia) {
  const contenedor = document.getElementById("graficas-por-dia");
  contenedor.innerHTML = `<h4>Sesión del día ${dia}</h4><p>Progreso por grupos musculares...</p>`;
}

crearCalendario();

// IA
function mostrarFormularioIA() {
  const f = document.getElementById("formulario-ia");
  f.style.display = f.style.display === "none" ? "block" : "none";
}

function generarPlanIA() {
  const objetivo = document.getElementById("ia-objetivo").value;
  const nivel = document.getElementById("ia-nivel").value;
  const dias = document.getElementById("ia-dias").value;
  const tipo = document.getElementById("ia-tipo").value;
  const equipamiento = document.getElementById("ia-equipamiento").value;

  const plan = `
    <h4>Plan Personalizado – ${objetivo.toUpperCase()}</h4>
    <p>Nivel: ${nivel}</p>
    <p>Días: ${dias}, Tipo: ${tipo}, Equipamiento: ${equipamiento || "no especificado"}</p>
    <p>✅ El plan se adapta a tu perfil, dividiendo ejercicios por días y grupos musculares.</p>
  `;
  document.getElementById("plan-generado").innerHTML = plan;
}

// Gamificación
let puntos = 0;
let racha = 0;
let nivel = 1;

function sumarPuntos(cantidad) {
  puntos += cantidad;
  document.getElementById("puntos-usuario").textContent = puntos;
}

function actualizarRacha() {
  racha++;
  document.getElementById("racha-usuario").textContent = racha;
}

function actualizarNivel() {
  if (puntos >= nivel * 100) {
    nivel++;
    document.getElementById("nivel-usuario").textContent = nivel;
  }
}
