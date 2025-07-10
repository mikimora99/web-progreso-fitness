let entrenamientoEnCurso = false;
let datosSesion = [];
let datosHistoricos = {};
let puntos = 0;
let racha = 0;
let nivel = 1;

// MOSTRAR SECCIONES
function mostrarSeccion(id) {
  document.querySelectorAll('section').forEach(sec => sec.classList.remove('visible'));
  document.getElementById(id).classList.add('visible');
}

// INICIAR SESIÓN
function iniciarTemporizador() {
  entrenamientoEnCurso = true;
  document.getElementById("grupo-muscular").disabled = false;
  iniciarCuentaAtras("temporizador", 3600);
}

// CUENTA ATRÁS GENERAL
function iniciarCuentaAtras(idElemento, segundos) {
  const display = document.getElementById(idElemento);
  let restante = segundos;
  const timer = setInterval(() => {
    const hrs = Math.floor(restante / 3600);
    const mins = Math.floor((restante % 3600) / 60);
    const secs = restante % 60;
    display.textContent = `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    if (--restante < 0) clearInterval(timer);
  }, 1000);
}

// CARGAR GRUPO MUSCULAR
function cargarEjerciciosGrupo() {
  const grupo = document.getElementById("grupo-muscular").value;
  const ejercicios = {
    pecho: ["Press banca", "Aperturas", "Fondos", "Press inclinado"],
    espalda: ["Dominadas", "Remo", "Peso muerto", "Jalón"],
    piernas: ["Sentadillas", "Prensa", "Zancadas", "Elevación talones"],
    brazos: ["Curl bíceps", "Extensión triceps", "Curl martillo", "Fondos banco"],
    hombros: ["Press militar", "Elevaciones laterales", "Pájaros", "Arnold press"],
    core: ["Plancha", "Crunch", "Elevaciones", "Twist ruso"]
  };

  const selector = document.getElementById("selector-ejercicio");
  selector.innerHTML = "";
  if (!ejercicios[grupo]) return;

  const select = document.createElement("select");
  select.innerHTML = `<option value="">-- Elige ejercicio --</option>`;
  ejercicios[grupo].forEach(ej => {
    const op = document.createElement("option");
    op.value = ej;
    op.textContent = ej;
    select.appendChild(op);
  });
  select.onchange = () => crearTablaEjercicio(select.value, grupo);
  selector.appendChild(select);
}

// CREAR TABLA DE EJERCICIO
function crearTablaEjercicio(ejercicio, grupo) {
  if (!ejercicio) return;
  const contenedor = document.getElementById("contenedor-tablas");
  const tabla = document.createElement("table");
  tabla.innerHTML = `
    <thead>
      <tr><th colspan="6">${ejercicio}</th></tr>
      <tr><th>Serie</th><th>Anterior KG</th><th>Anterior Reps</th><th>KG</th><th>Reps</th><th>Hecho</th></tr>
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
    cuerpo.appendChild(tr);

    const barra = document.createElement("div");
    barra.classList.add("barra-descanso");
    const progreso = document.createElement("div");
    barra.appendChild(progreso);
    cuerpo.appendChild(barra);
  }

  agregarFila(1);

  const btnAdd = document.createElement("button");
  btnAdd.textContent = "AÑADIR SERIE";
  btnAdd.className = "anadir-serie";
  btnAdd.onclick = () => agregarFila(tabla.querySelectorAll("tbody tr").length / 2 + 1);

  contenedor.appendChild(tabla);
  contenedor.appendChild(btnAdd);
}

// MARCAR COMO HECHO
function marcarHecho(btn) {
  const fila = btn.closest("tr");
  fila.classList.add("realizado");
  iniciarDescanso(fila.nextElementSibling.querySelector("div"));
}

// TIMER DESCANSO
function iniciarDescanso(barra) {
  const segundos = parseInt(document.getElementById("tiempo-descanso").value);
  let actual = 0;
  const timer = setInterval(() => {
    actual++;
    barra.style.width = `${(actual / segundos) * 100}%`;
    if (actual >= segundos) clearInterval(timer);
  }, 1000);
}

// FINALIZAR ENTRENAMIENTO
function finalizarSesion() {
  document.getElementById("popup-finalizar").classList.add("show");
  sumarPuntos(10);
  actualizarCalendario();
}

// CANCELAR ENTRENAMIENTO
function cancelarEntrenamiento() {
  location.reload();
}

// POPUP FINAL
function cerrarPopup() {
  document.getElementById("popup-finalizar").classList.remove("show");
}

// IMAGEN PERFIL
function mostrarImagenPerfil(event) {
  const archivo = event.target.files[0];
  const lector = new FileReader();
  lector.onload = e => {
    document.querySelector("#preview-foto img").src = e.target.result;
  };
  lector.readAsDataURL(archivo);
}

// DESPLEGABLES
function toggleDesplegable(id) {
  const box = document.getElementById(id);
  box.classList.toggle("active");
}

// CALENDARIO
function actualizarCalendario() {
  const calendario = document.getElementById("calendario-interactivo");
  calendario.innerHTML = "";
  const hoy = new Date();
  const dia = hoy.getDate();
  const mes = hoy.toLocaleString("default", { month: "long" });
  document.getElementById("mes-calendario").textContent = mes.toUpperCase();

  for (let i = 1; i <= 31; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === dia) btn.style.backgroundColor = "var(--color-acento)";
    btn.onclick = () => mostrarSesionDia(i);
    calendario.appendChild(btn);
  }
}

function mostrarSesionDia(dia) {
  const cont = document.getElementById("graficas-por-dia");
  cont.innerHTML = `<p>Entrenamiento del día ${dia}:</p><p>[Gráficas por grupo muscular]</p>`;
}

// PUNTOS Y NIVELES
function sumarPuntos(cantidad) {
  puntos += cantidad;
  document.getElementById("puntos-usuario").textContent = puntos;
  racha++;
  document.getElementById("racha-usuario").textContent = racha;

  const umbralNivel = 100;
  if (puntos >= nivel * umbralNivel) {
    nivel++;
    document.getElementById("nivel-usuario").textContent = nivel;
    mostrarLogro(`¡Nivel ${nivel} alcanzado!`);
  }

  document.querySelector("#barra-progreso-nivel::after")?.style?.setProperty("width", `${(puntos % umbralNivel)}%`);
}

function mostrarLogro(texto) {
  const logro = document.createElement("div");
  logro.className = "logro";
  logro.textContent = texto;
  document.getElementById("logros-visual").appendChild(logro);
}
