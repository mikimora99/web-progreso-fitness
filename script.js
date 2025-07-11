let sesionIniciada = false;

function cambiarSeccion(id) {
  document.querySelectorAll("main section").forEach(sec => sec.classList.remove("visible"));
  document.getElementById(id).classList.add("visible");
}

// INICIAR Y CANCELAR SESIÓN
function iniciarSesion() {
  sesionIniciada = true;
  document.getElementById("finalizar-entrenamiento").style.display = "inline-block";
  document.getElementById("cancelar-entrenamiento").style.display = "inline-block";
  document.getElementById("grupo-muscular").disabled = false;
}

function cancelarSesion() {
  clearInterval(timerInterval);
  sesionIniciada = false;
  document.getElementById("finalizar-entrenamiento").style.display = "none";
  document.getElementById("cancelar-entrenamiento").style.display = "none";
  document.getElementById("grupo-muscular").value = "";
  document.getElementById("grupo-muscular").disabled = true;
  document.getElementById("ejercicios").innerHTML = "";
  document.getElementById("tabla-ejercicios").innerHTML = "";
}

function finalizarSesion() {
  clearInterval(timerInterval);
  document.getElementById("popup-final").style.display = "flex";
}

// POPUP FINAL
function cerrarPopup() {
  document.getElementById("popup-final").style.display = "none";
  marcarDiaCalendario();
  cancelarSesion();
}

// GRUPO MUSCULAR → EJERCICIOS
document.getElementById("grupo-muscular").addEventListener("change", function () {
  const grupo = this.value;
  const ejerciciosPorGrupo = {
    piernas: ["Sentadillas", "Prensa", "Zancadas", "Peso muerto rumano", "Curl femoral"],
    espalda: ["Dominadas", "Remo con barra", "Jalones", "Peso muerto", "Pull over"],
    pecho: ["Press banca", "Press inclinado", "Flexiones", "Fondos", "Aperturas"],
    brazos: ["Curl bíceps", "Martillo", "Fondos paralelas", "Press francés", "Curl concentrado"],
    hombros: ["Press militar", "Elevaciones laterales", "Pájaros", "Arnold press"]
  };

  const select = document.getElementById("ejercicios");
  select.innerHTML = "";
  document.getElementById("tabla-ejercicios").innerHTML = "";

  if (ejerciciosPorGrupo[grupo]) {
    ejerciciosPorGrupo[grupo].forEach(ej => {
      const option = document.createElement("option");
      option.textContent = ej;
      select.appendChild(option);
    });
    select.disabled = false;
  }
});

// EJERCICIO → TABLA
document.getElementById("ejercicios").addEventListener("change", function () {
  const ejercicio = this.value;
  if (!ejercicio) return;

  const tabla = document.createElement("table");
  tabla.innerHTML = `
    <thead><tr><th>Serie</th><th>Peso (kg)</th><th>Reps</th><th></th><th></th></tr></thead>
    <tbody id="cuerpo-tabla"></tbody>
  `;
  document.getElementById("tabla-ejercicios").innerHTML = "";
  document.getElementById("tabla-ejercicios").appendChild(tabla);
  añadirSerie();
});

function añadirSerie() {
  const cuerpo = document.getElementById("cuerpo-tabla");
  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td>${cuerpo.children.length + 1}</td>
    <td><input type="number" /></td>
    <td><input type="number" /></td>
    <td class="barra-descanso"></td>
    <td><button onclick="completarSerie(this)">✔</button></td>
  `;
  cuerpo.appendChild(fila);
}

// TIMER ENTRE SERIES
let timerInterval;
function completarSerie(boton) {
  const fila = boton.parentElement.parentElement;
  fila.style.opacity = "0.4";
  iniciarTimerDescanso(fila.querySelector(".barra-descanso"));
}

function iniciarTimerDescanso(barra) {
  barra.classList.add("barra-activa");
  setTimeout(() => barra.classList.remove("barra-activa"), 5000);
}

// FOTO DE PERFIL
function mostrarFoto(input) {
  const preview = document.querySelector("#preview-foto img");
  const file = input.files[0];
  const reader = new FileReader();
  reader.onloadend = () => preview.src = reader.result;
  if (file) reader.readAsDataURL(file);
}

// DESPLEGABLES USUARIO
function toggleSubseccion(id) {
  const el = document.getElementById(id);
  el.style.display = el.style.display === "none" ? "block" : "none";
}

// CALENDARIO
function generarCalendario() {
  const grid = document.getElementById("calendario-interactivo");
  const nombreMes = document.getElementById("mes-calendario");
  const hoy = new Date();
  const mes = hoy.getMonth();
  const año = hoy.getFullYear();
  const dias = new Date(año, mes + 1, 0).getDate();
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
                 "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  nombreMes.textContent = meses[mes];
  grid.innerHTML = "";

  for (let i = 1; i <= dias; i++) {
    const dia = document.createElement("div");
    dia.textContent = i;
    dia.onclick = () => alert(`Sesión del día ${i} (pronto mostraremos el resumen aquí)`);
    grid.appendChild(dia);
  }
}

function marcarDiaCalendario() {
  const hoy = new Date().getDate();
  const elementos = document.querySelectorAll("#calendario-interactivo div");
  elementos.forEach(el => {
    if (parseInt(el.textContent) === hoy) {
      el.classList.add("completado");
    }
  });
}

// IA — PLAN PERSONALIZADO BÁSICO (beta)
function generarPlanIA() {
  const objetivo = document.getElementById("objetivo").value;
  const tipo = document.getElementById("tipo-entreno").value;
  const dias = document.getElementById("dias-semana").value;

  document.getElementById("resultado-plan").textContent =
    `Plan generado: objetivo ${objetivo}, tipo ${tipo}, ${dias} días/semana. 
    (Este sistema IA se actualizará con recomendaciones más avanzadas).`;
}

// INICIALIZACIÓN
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("finalizar-entrenamiento").style.display = "none";
  document.getElementById("cancelar-entrenamiento").style.display = "none";
  document.getElementById("grupo-muscular").disabled = true;
  generarCalendario();
});
