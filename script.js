let sesionIniciada = false;
let datosEntrenamiento = [];

function cambiarSeccion(id) {
  document.querySelectorAll("main section").forEach(sec => {
    sec.classList.remove("visible");
  });
  document.getElementById(id).classList.add("visible");
}

function iniciarSesion() {
  sesionIniciada = true;
  document.getElementById("finalizar-entrenamiento").style.display = "inline-block";
  document.getElementById("cancelar-entrenamiento").style.display = "inline-block";
  document.getElementById("grupo-muscular").disabled = false;
}

function finalizarSesion() {
  clearInterval(timerInterval);
  document.getElementById("popup-final").style.display = "flex";
}

function cancelarSesion() {
  clearInterval(timerInterval);
  sesionIniciada = false;
  document.getElementById("finalizar-entrenamiento").style.display = "none";
  document.getElementById("cancelar-entrenamiento").style.display = "none";
  document.getElementById("grupo-muscular").disabled = true;
  document.getElementById("ejercicios").innerHTML = "";
  document.getElementById("tabla-ejercicios").innerHTML = "";
}

function cerrarPopup() {
  document.getElementById("popup-final").style.display = "none";
  marcarDiaCalendario();
  cancelarSesion();
}

document.getElementById("grupo-muscular").addEventListener("change", function () {
  const grupo = this.value;
  const selectEjercicios = document.getElementById("ejercicios");
  selectEjercicios.innerHTML = "";
  document.getElementById("tabla-ejercicios").innerHTML = "";

  if (grupo) {
    selectEjercicios.disabled = false;
    const ejercicios = {
      piernas: ["Sentadillas", "Prensa", "Zancadas", "Peso muerto rumano", "Extensiones", "Curl femoral"],
      espalda: ["Dominadas", "Remo con barra", "Jalones al pecho", "Peso muerto", "Pull over"],
      pecho: ["Press banca", "Press inclinado", "Aperturas", "Fondos", "Flexiones"],
      brazos: ["Curl bíceps", "Press francés", "Fondos paralelas", "Martillo", "Curl concentrado"],
      hombros: ["Press militar", "Elevaciones laterales", "Pájaros", "Arnold press", "Press con mancuernas"]
    };

    ejercicios[grupo].forEach(ej => {
      const opt = document.createElement("option");
      opt.textContent = ej;
      selectEjercicios.appendChild(opt);
    });
  }
});

document.getElementById("ejercicios").addEventListener("change", function () {
  const ejercicio = this.value;
  if (!ejercicio) return;

  const tabla = document.createElement("table");
  tabla.innerHTML = `
    <thead><tr><th>Serie</th><th>Peso (kg)</th><th>Reps</th><th></th><th></th></tr></thead>
    <tbody id="cuerpo-tabla">
    </tbody>
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

function completarSerie(boton) {
  const fila = boton.parentElement.parentElement;
  fila.style.opacity = "0.4";
  iniciarTimerDescanso(fila.querySelector(".barra-descanso"));
}

let timerInterval;
function iniciarTimerDescanso(barra) {
  barra.classList.add("barra-activa");
  setTimeout(() => {
    barra.classList.remove("barra-activa");
  }, 5000);
}

function mostrarFoto(input) {
  const preview = document.querySelector("#preview-foto img");
  const file = input.files[0];
  const reader = new FileReader();

  reader.onloadend = () => {
    preview.src = reader.result;
  };
  if (file) {
    reader.readAsDataURL(file);
  }
}

function toggleSubseccion(id) {
  const el = document.getElementById(id);
  el.style.display = el.style.display === "none" ? "block" : "none";
}

function generarPlanIA() {
  const objetivo = document.getElementById("objetivo").value;
  const tipo = document.getElementById("tipo-entreno").value;
  const dias = document.getElementById("dias-semana").value;

  document.getElementById("resultado-plan").textContent = `Plan creado: ${objetivo}, en modo ${tipo}, ${dias} días/semana. (Versión IA BETA – se mejorará pronto con formularios más completos).`;
}

function marcarDiaCalendario() {
  const hoy = new Date();
  const dia = hoy.getDate();
  const elementos = document.querySelectorAll("#calendario-interactivo div");
  elementos.forEach(el => {
    if (parseInt(el.textContent) === dia) {
      el.classList.add("completado");
    }
  });
}

function generarCalendario() {
  const grid = document.getElementById("calendario-interactivo");
  const nombreMes = document.getElementById("mes-calendario");
  const hoy = new Date();
  const mesActual = hoy.getMonth();
  const año = hoy.getFullYear();

  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
                 "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  nombreMes.textContent = meses[mesActual];

  const diasMes = new Date(año, mesActual + 1, 0).getDate();
  grid.innerHTML = "";

  for (let i = 1; i <= diasMes; i++) {
    const dia = document.createElement("div");
    dia.textContent = i;
    dia.onclick = () => alert(`Sesión del día ${i} (pronto se mostrará toda la info aquí)`);
    grid.appendChild(dia);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("finalizar-entrenamiento").style.display = "none";
  document.getElementById("cancelar-entrenamiento").style.display = "none";
  document.getElementById("grupo-muscular").disabled = true;
  generarCalendario();
});
