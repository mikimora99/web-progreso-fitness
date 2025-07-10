let puntos = 0;
let racha = 0;
let nivel = 1;
let descanso = 0;
let timerDescanso;
let tiempoDescanso = 60;
let serieActual = null;

function mostrarSeccion(id) {
  document.querySelectorAll("section").forEach((s) => s.classList.remove("visible"));
  document.getElementById(id).classList.add("visible");
  document.querySelectorAll("nav button").forEach((btn) => btn.classList.remove("active"));
  document.querySelector(`nav button[onclick="mostrarSeccion('${id}')"]`).classList.add("active");
}

function iniciarTemporizador() {
  document.getElementById("grupo-muscular").disabled = false;
  document.getElementById("temporizador").textContent = "EN MARCHA";
}

function cancelarEntrenamiento() {
  location.reload();
}

function finalizarSesion() {
  document.getElementById("popup-finalizar").classList.add("activo");
  actualizarCalendario();
  sumarPuntos(10);
}

function cerrarPopup() {
  document.getElementById("popup-finalizar").classList.remove("activo");
}

function cargarEjerciciosGrupo() {
  const grupo = document.getElementById("grupo-muscular").value;
  const ejercicios = {
    pecho: ["Press banca", "Aperturas", "Flexiones"],
    espalda: ["Dominadas", "Remo", "Jalón al pecho"],
    piernas: ["Sentadillas", "Prensa", "Zancadas"],
    brazos: ["Curl bíceps", "Tríceps polea", "Martillo"],
    hombros: ["Press militar", "Elevaciones laterales", "Pájaro"],
    core: ["Plancha", "Crunch", "Elevaciones piernas"]
  };
  const lista = ejercicios[grupo] || [];
  let html = `<select onchange="crearTablaEjercicio(this.value)">`;
  html += `<option value="">-- Elegir ejercicio --</option>`;
  lista.forEach((ej) => (html += `<option>${ej}</option>`));
  html += `</select>`;
  document.getElementById("selector-ejercicio").innerHTML = html;
}

function crearTablaEjercicio(ejercicio) {
  const tabla = document.createElement("table");
  tabla.innerHTML = `
    <thead>
      <tr><th>${ejercicio}</th><th>Kg anterior</th><th>Reps</th><th>Kg actual</th><th>Reps</th><th></th></tr>
    </thead>
    <tbody id="body-${ejercicio.replaceAll(' ', '-')}"></tbody>
  `;
  const div = document.createElement("div");
  div.appendChild(tabla);
  const btn = document.createElement("button");
  btn.className = "anadir-serie";
  btn.innerText = "AÑADIR SERIE";
  btn.onclick = () => añadirSerie(ejercicio);
  div.appendChild(btn);
  document.getElementById("contenedor-tablas").appendChild(div);
}

function añadirSerie(ejercicio) {
  const id = `body-${ejercicio.replaceAll(" ", "-")}`;
  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td></td>
    <td>${Math.floor(Math.random() * 50)}</td>
    <td>${Math.floor(Math.random() * 12)}</td>
    <td><input></td>
    <td><input></td>
    <td><button onclick="marcarSerie(this)">✔</button></td>
  `;
  document.getElementById(id).appendChild(fila);
}

function marcarSerie(btn) {
  const fila = btn.parentNode.parentNode;
  fila.style.opacity = "0.4";
  iniciarDescanso(fila);
}

function iniciarDescanso(fila) {
  tiempoDescanso = parseInt(document.getElementById("tiempo-descanso").value);
  if (isNaN(tiempoDescanso) || tiempoDescanso <= 0) return;

  const barra = document.createElement("div");
  barra.className = "barra-descanso";
  const progreso = document.createElement("div");
  progreso.className = "progreso";
  barra.appendChild(progreso);
  fila.after(barra);

  let segundos = 0;
  clearInterval(timerDescanso);
  timerDescanso = setInterval(() => {
    segundos++;
    const porcentaje = (segundos / tiempoDescanso) * 100;
    progreso.style.width = `${porcentaje}%`;
    if (segundos >= tiempoDescanso) {
      clearInterval(timerDescanso);
      barra.remove();
    }
  }, 1000);
}

function mostrarImagenPerfil(event) {
  const file = event.target.files[0];
  const img = document.querySelector("#preview-foto img");
  img.src = URL.createObjectURL(file);
}

function toggleDesplegable(id) {
  const div = document.getElementById(id);
  div.classList.toggle("activo");
  div.style.display = div.classList.contains("activo") ? "block" : "none";
}

function actualizarCalendario() {
  const dias = document.querySelectorAll("#calendario-interactivo div");
  const hoy = new Date().getDate();
  dias.forEach((dia) => {
    if (parseInt(dia.textContent) === hoy) {
      dia.classList.add("completado");
    }
  });
}

function cargarCalendario() {
  const contenedor = document.getElementById("calendario-interactivo");
  const nombreMes = document.getElementById("mes-calendario");
  const hoy = new Date();
  const dias = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate();
  contenedor.innerHTML = "";
  nombreMes.textContent = hoy.toLocaleDateString("es-ES", { month: "long" });
  for (let i = 1; i <= dias; i++) {
    const dia = document.createElement("div");
    dia.textContent = i;
    dia.onclick = () => mostrarSesionDia(i);
    contenedor.appendChild(dia);
  }
}

function mostrarSesionDia(dia) {
  const graf = document.getElementById("graficas-por-dia");
  graf.innerHTML = `<p>Sesión del día ${dia}: ejercicios completados y progreso.</p>`;
}

function sumarPuntos(cantidad) {
  puntos += cantidad;
  racha++;
  if (puntos >= 300) nivel = 4;
  else if (puntos >= 150) nivel = 3;
  else if (puntos >= 75) nivel = 2;
  document.getElementById("puntos-usuario").textContent = puntos;
  document.getElementById("racha-usuario").textContent = racha;
  document.getElementById("nivel-usuario").textContent = nivel;
}

window.onload = cargarCalendario;
