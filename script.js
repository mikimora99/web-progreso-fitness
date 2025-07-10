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
  if (id === "calendario") mostrarGrafica();
}

function cargarEjercicios() {
  const grupo = document.getElementById("grupo-muscular").value;
  const contenedor = document.getElementById("tabla-ejercicios");
  contenedor.innerHTML = "";

  if (!grupo) return;

  const tabla = document.createElement("table");
  tabla.innerHTML = `
    <tr>
      <th>Ejercicio</th>
      <th>Anterior (kg x reps)</th>
      <th>Actual (kg x reps)</th>
      <th>Hecho</th>
      <th>Eliminar</th>
    </tr>
  `;

  bibliotecaEjercicios[grupo].forEach(ej => {
    const anterior = sesionesAnteriores[ej] || { kg: "-", reps: "-" };
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${ej}</td>
      <td>${anterior.kg} kg x ${anterior.reps}</td>
      <td>
        <input type="number" placeholder="kg" onchange="guardarDato('${ej}', 'kg', this.value)" />
        x
        <input type="number" placeholder="reps" onchange="guardarDato('${ej}', 'reps', this.value)" />
      </td>
      <td><button class="hecho" onclick="marcarHecho(this)">✅</button></td>
      <td><button class="cancelar" onclick="eliminarFila(this)">🗑</button></td>
    `;

    tabla.appendChild(fila);
  });

  contenedor.appendChild(tabla);
}

function guardarDato(nombre, campo, valor) {
  let ej = ejercicios.find(e => e.nombre === nombre);
  if (!ej) {
    ej = { nombre, kg: "", reps: "" };
    ejercicios.push(ej);
  }
  ej[campo] = valor;
}

function marcarHecho(boton) {
  boton.closest("tr").style.backgroundColor = "#d4edda";
}

function eliminarFila(boton) {
  const fila = boton.closest("tr");
  const nombre = fila.querySelector("td").innerText;
  fila.remove();
  ejercicios = ejercicios.filter(e => e.nombre !== nombre);
}

function cancelarEntrenamiento() {
  if (confirm("¿Seguro que quieres cancelar el entrenamiento?")) {
    ejercicios = [];
    clearInterval(intervalo);
    segundos = 0;
    temporizadorActivo = false;
    document.getElementById("temporizador").textContent = "00:00:00";
    document.getElementById("tabla-ejercicios").innerHTML = "";
  }
}

function finalizarSesion() {
  if (ejercicios.length === 0) return alert("No hay ejercicios cargados.");
  ejercicios.forEach(e => {
    sesionesAnteriores[e.nombre] = { kg: e.kg || "-", reps: e.reps || "-" };
  });
  localStorage.setItem("ultimasSesiones", JSON.stringify(sesionesAnteriores));

  historial.push({
    fecha: new Date().toLocaleDateString(),
    ejercicios: [...ejercicios],
    tiempo: formatearTiempo(segundos)
  });
  localStorage.setItem("historial", JSON.stringify(historial));

  alert("Sesión guardada correctamente.");
  cancelarEntrenamiento();
}

function mostrarGrafica() {
  const canvas = document.getElementById("graficaProgreso");
  const datos = {};

  historial.forEach(sesion => {
    sesion.ejercicios.forEach(e => {
      if (!datos[e.nombre]) datos[e.nombre] = [];
      datos[e.nombre].push(Number(e.kg || 0));
    });
  });

  const etiquetas = historial.map(s => s.fecha);
  const datasets = Object.entries(datos).map(([nombre, pesos]) => ({
    label: nombre,
    data: pesos,
    borderWidth: 2,
    fill: false
  }));

  new Chart(canvas, {
    type: "line",
    data: { labels: etiquetas, datasets },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Progreso de carga (kg)' }
      }
    }
  });
}
