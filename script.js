let entrenamientos = [];
let timerDescanso = null;
let tiempoDescanso = 30;

function cambiarSeccion(id) {
  document.querySelectorAll("section").forEach(sec => sec.classList.remove("visible"));
  document.getElementById(id).classList.add("visible");
}

document.getElementById("nombre-usuario").addEventListener("click", () => cambiarSeccion('inicio'));

function iniciarSesion() {
  document.getElementById("iniciar-entrenamiento").disabled = true;
  document.getElementById("finalizar-entrenamiento").style.display = "inline-block";
  document.getElementById("cancelar-entrenamiento").style.display = "inline-block";
  document.getElementById("grupo-muscular").disabled = false;
  document.getElementById("ejercicios").disabled = false;
}

function cancelarSesion() {
  if (timerDescanso) clearTimeout(timerDescanso);
  reiniciarSesion();
}

function reiniciarSesion() {
  document.getElementById("iniciar-entrenamiento").disabled = false;
  document.getElementById("finalizar-entrenamiento").style.display = "none";
  document.getElementById("cancelar-entrenamiento").style.display = "none";
  document.getElementById("grupo-muscular").value = "";
  document.getElementById("ejercicios").innerHTML = "";
  document.getElementById("tabla-ejercicios").innerHTML = "";
}

function finalizarSesion() {
  if (timerDescanso) clearTimeout(timerDescanso);
  document.getElementById("popup-final").style.display = "flex";
}

function cerrarPopup() {
  document.getElementById("popup-final").style.display = "none";
  guardarSesion();
  reiniciarSesion();
}

function guardarSesion() {
  const fecha = new Date();
  entrenamientos.push(fecha.toISOString().split("T")[0]);
  generarCalendario(new Date().getFullYear(), new Date().getMonth());
}

function seleccionarGrupo() {
  const grupo = document.getElementById("grupo-muscular").value;
  const select = document.getElementById("ejercicios");
  const ejerciciosPorGrupo = {
    piernas: ["Sentadillas", "Prensa", "Zancadas", "Peso muerto rumano", "Extensiones", "Curl femoral"],
    espalda: ["Dominadas", "Remo", "Peso muerto", "Jalones", "Pullover"],
    pecho: ["Press banca", "Aperturas", "Fondos", "Press inclinado"],
    brazos: ["Curl bíceps", "Press francés", "Martillo", "Extensión triceps"],
    hombros: ["Press militar", "Elevaciones laterales", "Pájaros", "Remo mentón"]
  };
  select.innerHTML = ejerciciosPorGrupo[grupo].map(ej => `<option value="${ej}">${ej}</option>`).join("");
  select.onchange = generarTablaEjercicios;
}

function generarTablaEjercicios() {
  const ejercicio = document.getElementById("ejercicios").value;
  const tabla = document.getElementById("tabla-ejercicios");
  tabla.innerHTML = `
    <table>
      <tr><th>Serie</th><th>Anterior</th><th>Actual</th><th></th></tr>
      <tbody id="series-body">
        <tr>
          <td>1</td>
          <td>50kg x 10</td>
          <td><input type="text" placeholder="kg x rep" /></td>
          <td><button onclick="completarSerie(this)">✔</button></td>
        </tr>
      </tbody>
    </table>
    <button onclick="anadirSerie()">Añadir Serie</button>
  `;
}

function anadirSerie() {
  const tbody = document.getElementById("series-body");
  const serieNum = tbody.rows.length + 1;
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${serieNum}</td>
    <td>50kg x 10</td>
    <td><input type="text" placeholder="kg x rep" /></td>
    <td><button onclick="completarSerie(this)">✔</button></td>
  `;
  tbody.appendChild(row);
}

function completarSerie(boton) {
  const fila = boton.parentElement.parentElement;
  fila.style.opacity = "0.5";
  iniciarDescanso(fila);
}

function iniciarDescanso(fila) {
  const barra = document.createElement("div");
  barra.className = "barra-descanso barra-activa";
  fila.insertAdjacentElement('afterend', barra);

  if (timerDescanso) clearTimeout(timerDescanso);
  timerDescanso = setTimeout(() => {
    barra.remove();
  }, tiempoDescanso * 1000);
}

function mostrarFoto(input) {
  const preview = document.getElementById("preview-foto");
  const file = input.files[0];
  const reader = new FileReader();
  reader.onload = e => {
    preview.innerHTML = `<img src="${e.target.result}" alt="foto perfil" />`;
  };
  if (file) reader.readAsDataURL(file);
}

function generarCalendario(año, mes) {
  const contenedor = document.getElementById("calendario-interactivo");
  contenedor.innerHTML = "";
  const fecha = new Date(año, mes, 1);
  const diaInicio = fecha.getDay();
  const diasMes = new Date(año, mes + 1, 0).getDate();
  const mesActual = document.getElementById("mes-calendario");
  mesActual.innerText = `${fecha.toLocaleDateString("es-ES", { month: "long" })} ${año}`;

  for (let i = 0; i < diaInicio; i++) {
    contenedor.innerHTML += `<div></div>`;
  }

  for (let d = 1; d <= diasMes; d++) {
    const diaStr = `${año}-${String(mes + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const clase = entrenamientos.includes(diaStr) ? "completado" : "";
    contenedor.innerHTML += `<div class="${clase}">${d}</div>`;
  }
}

function toggleSubseccion(id) {
  const sub = document.getElementById(id);
  sub.style.display = sub.style.display === "block" ? "none" : "block";
}

function generarPlanIA() {
  const objetivo = document.getElementById("objetivo").value;
  const tipo = document.getElementById("tipo-entreno").value;
  const dias = document.getElementById("dias-semana").value;

  let resultado = `Plan para objetivo: ${objetivo} en modalidad ${tipo}, entrenando ${dias} días.`;

  if (objetivo === "fuerza") {
    resultado += " Se recomienda trabajar torso/pierna con carga progresiva.";
  } else if (objetivo === "resistencia") {
    resultado += " Alterna días de cardio con circuitos funcionales.";
  } else {
    resultado += " Trabaja cuerpo completo, prioriza técnica y alimentación limpia.";
  }

  document.getElementById("resultado-plan").innerText = resultado;
}

window.onload = () => {
  generarCalendario(new Date().getFullYear(), new Date().getMonth());
  document.getElementById("finalizar-entrenamiento").style.display = "none";
  document.getElementById("cancelar-entrenamiento").style.display = "none";
  document.getElementById("grupo-muscular").addEventListener("change", seleccionarGrupo);
  document.getElementById("ejercicios").disabled = true;
};
