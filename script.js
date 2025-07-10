let segundos = 0;
let temporizadorActivo = false;
let intervalo;
let ejercicios = [];
let historial = JSON.parse(localStorage.getItem("historial")) || [];
let sesionesAnteriores = JSON.parse(localStorage.getItem("ultimasSesiones")) || {};

const bibliotecaEjercicios = {
  pecho: ["Press banca", "Press inclinado", "Aperturas con mancuernas"],
  espalda: ["Dominadas", "Remo con barra", "Peso muerto"],
  piernas: ["Sentadillas", "Prensa", "Zancadas"],
  brazos: ["Curl bíceps", "Fondos", "Extensión tríceps polea"],
  hombros: ["Press militar", "Elevaciones laterales", "Pájaros"],
  core: ["Planchas", "Crunch abdominal", "Elevaciones de piernas"]
};

function iniciarTemporizador() {
  if (!temporizadorActivo) {
    temporizadorActivo = true;
    intervalo = setInterval(() => {
      segundos++;
      document.getElementById("temporizador").textContent = formatearTiempo(segundos);
    }, 1000);
  }
}

function formatearTiempo(seg) {
  const h = String(Math.floor(seg / 3600)).padStart(2, '0');
  const m = String(Math.floor((seg % 3600) / 60)).padStart(2, '0');
  const s = String(seg % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function mostrarSeccion(id) {
  document.querySelectorAll("section").forEach(s => s.classList.remove("visible"));
  document.getElementById(id).classList.add("visible");
  if (id === "calendario") mostrarCalendario();
}

function cargarEjerciciosGrupo() {
  const grupo = document.getElementById("grupo-muscular").value;
  const selector = document.getElementById("selector-ejercicio");
  const contenedor = document.getElementById("contenedor-tablas");

  selector.innerHTML = "";
  contenedor.innerHTML = "";

  if (!grupo || !bibliotecaEjercicios[grupo]) return;

  const select = document.createElement("select");
  select.id = "ejercicio-selector";

  const opciones = bibliotecaEjercicios[grupo].map(ej => {
    return `<option value="${ej}">${ej}</option>`;
  }).join("");

  select.innerHTML = `<option value="">-- Elige un ejercicio --</option>${opciones}`;
  select.onchange = () => {
    if (select.value !== "") agregarTablaEjercicio(select.value);
  };

  selector.appendChild(select);
}

function agregarTablaEjercicio(nombre) {
  if (ejercicios.find(e => e.nombre === nombre)) return;
  const contenedor = document.getElementById("contenedor-tablas");
  const anterior = sesionesAnteriores[nombre] || { kg: "-", reps: "-" };

  const tabla = document.createElement("table");
  tabla.innerHTML = `
    <thead>
      <tr><th colspan="5">${nombre}</th></tr>
      <tr><th>Anterior</th><th>Peso</th><th>Reps</th><th>✅</th><th>🗑</th></tr>
    </thead>
    <tbody id="cuerpo-${nombre.replace(/\s+/g, '-')}"></tbody>
  `;

  const btnAdd = document.createElement("button");
  btnAdd.textContent = "+ Añadir serie";
  btnAdd.className = "anadir-serie";
  btnAdd.onclick = () => anadirSerie(nombre, anterior);

  contenedor.appendChild(tabla);
  contenedor.appendChild(btnAdd);

  ejercicios.push({ nombre, series: [] });
  anadirSerie(nombre, anterior);
}

function anadirSerie(nombre, anterior) {
  const cuerpo = document.getElementById(`cuerpo-${nombre.replace(/\s+/g, '-')}`);
  const fila = document.createElement("tr");

  fila.innerHTML = `
    <td>${anterior.kg}kg x ${anterior.reps}</td>
    <td><input type="number" onchange="guardarSerie('${nombre}', this, 'kg')"></td>
    <td><input type="number" onchange="guardarSerie('${nombre}', this, 'reps')"></td>
    <td><button class="hecho" onclick="marcarHecho(this)">✅</button></td>
    <td><button class="cancelar" onclick="eliminarFila(this)">🗑</button></td>
  `;

  cuerpo.appendChild(fila);
}

function guardarSerie(nombre, input, campo) {
  const fila = input.closest("tr");
  const inputs = fila.querySelectorAll("input");
  const kg = parseFloat(inputs[0].value) || 0;
  const reps = parseInt(inputs[1].value) || 0;

  const ejercicio = ejercicios.find(e => e.nombre === nombre);
  const index = Array.from(fila.parentNode.children).indexOf(fila);
  ejercicio.series[index] = { kg, reps };
}

function marcarHecho(btn) {
  btn.closest("tr").classList.add("realizado");
}

function eliminarFila(btn) {
  const fila = btn.closest("tr");
  const nombre = fila.closest("table").querySelector("th").textContent;
  const index = Array.from(fila.parentNode.children).indexOf(fila);
  fila.remove();
  const ej = ejercicios.find(e => e.nombre === nombre);
  ej.series.splice(index, 1);
}

function cancelarEntrenamiento() {
  ejercicios = [];
  clearInterval(intervalo);
  segundos = 0;
  temporizadorActivo = false;
  document.getElementById("temporizador").textContent = "00:00:00";
  document.getElementById("contenedor-tablas").innerHTML = "";
  document.getElementById("selector-ejercicio").innerHTML = "";
}

function finalizarSesion() {
  clearInterval(intervalo);
  temporizadorActivo = false;

  ejercicios.forEach(e => {
    if (e.series.length > 0) {
      const ult = e.series[e.series.length - 1];
      sesionesAnteriores[e.nombre] = { kg: ult.kg || "-", reps: ult.reps || "-" };
    }
  });

  localStorage.setItem("ultimasSesiones", JSON.stringify(sesionesAnteriores));

  historial.push({
    fecha: new Date().toISOString().split("T")[0],
    ejercicios: JSON.parse(JSON.stringify(ejercicios)),
    tiempo: formatearTiempo(segundos)
  });

  localStorage.setItem("historial", JSON.stringify(historial));
  cancelarEntrenamiento();
}

function mostrarCalendario() {
  const contenedor = document.getElementById("calendario-interactivo");
  contenedor.innerHTML = "";
  const dias = historial.map(h => h.fecha);
  dias.reverse().forEach(fecha => {
    const btn = document.createElement("button");
    btn.textContent = fecha;
    btn.onclick = () => mostrarGraficaPorDia(fecha);
    contenedor.appendChild(btn);
  });
}

function mostrarGraficaPorDia(fecha) {
  const sesiones = historial.filter(h => h.fecha === fecha);
  const porGrupo = {};

  sesiones.forEach(s => {
    s.ejercicios.forEach(e => {
      const grupo = Object.entries(bibliotecaEjercicios).find(([g, lista]) => lista.includes(e.nombre));
      if (!grupo) return;
      const nombreGrupo = grupo[0];
      if (!porGrupo[nombreGrupo]) porGrupo[nombreGrupo] = [];
      const totalKg = e.series.reduce((acc, s) => acc + s.kg, 0);
      porGrupo[nombreGrupo].push({ nombre: e.nombre, totalKg });
    });
  });

  const grafContainer = document.getElementById("graficas-por-dia");
  grafContainer.innerHTML = "";

  Object.entries(porGrupo).forEach(([grupo, datos]) => {
    const canvas = document.createElement("canvas");
    grafContainer.appendChild(canvas);

    new Chart(canvas, {
      type: "bar",
      data: {
        labels: datos.map(d => d.nombre),
        datasets: [{
          label: `Grupo: ${grupo}`,
          data: datos.map(d => d.totalKg),
          backgroundColor: "#4CAF50"
        }]
      },
      options: {
        plugins: {
          title: { display: true, text: `Progreso del ${fecha}` }
        }
      }
    });
  });
}
