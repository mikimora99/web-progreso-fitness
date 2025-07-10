let tiempo = 0;
let temporizadorInterval = null;
let entrenamientos = [];
let historial = {};
let usuario = {
  nombre: "",
  foto: "",
  descanso: 30,
  medidas: {},
  puntos: 0,
  nivel: 1,
  racha: 0,
  ultimaFecha: ""
};

function mostrarSeccion(id) {
  document.querySelectorAll("section").forEach(sec => sec.classList.remove("visible"));
  document.getElementById(id).classList.add("visible");
  if (id === "usuario") actualizarCalendario();
}

function iniciarTemporizador() {
  document.getElementById("grupo-muscular").disabled = false;
  tiempo = 0;
  temporizadorInterval = setInterval(() => {
    tiempo++;
    const horas = String(Math.floor(tiempo / 3600)).padStart(2, '0');
    const minutos = String(Math.floor((tiempo % 3600) / 60)).padStart(2, '0');
    const segundos = String(tiempo % 60).padStart(2, '0');
    document.getElementById("temporizador").textContent = `${horas}:${minutos}:${segundos}`;
  }, 1000);
}

function cancelarEntrenamiento() {
  clearInterval(temporizadorInterval);
  document.getElementById("grupo-muscular").disabled = true;
  document.getElementById("grupo-muscular").value = "";
  document.getElementById("selector-ejercicio").innerHTML = "";
  document.getElementById("contenedor-tablas").innerHTML = "";
  document.getElementById("temporizador").textContent = "00:00:00";
}

function finalizarSesion() {
  clearInterval(temporizadorInterval);
  document.getElementById("popup-finalizar").classList.add("show");
}

function cerrarPopup() {
  const fecha = new Date().toISOString().split('T')[0];
  if (!historial[fecha]) historial[fecha] = [];
  historial[fecha].push(...entrenamientos);
  entrenamientos = [];

  // Lógica gamificada
  usuario.puntos += 5;
  if (usuario.ultimaFecha) {
    const ayer = new Date(usuario.ultimaFecha);
    ayer.setDate(ayer.getDate() + 1);
    if (fecha === ayer.toISOString().split('T')[0]) {
      usuario.racha++;
      usuario.puntos += 3;
    } else {
      usuario.racha = 1;
    }
  } else {
    usuario.racha = 1;
  }
  usuario.ultimaFecha = fecha;
  actualizarNivel();
  actualizarCalendario();
  actualizarStats();
  cancelarEntrenamiento();
  document.getElementById("popup-finalizar").classList.remove("show");
}

function cargarEjerciciosGrupo() {
  const grupo = document.getElementById("grupo-muscular").value;
  if (!grupo) return;
  const ejerciciosPorGrupo = {
    pecho: ["Press banca", "Aperturas", "Fondos"],
    espalda: ["Dominadas", "Remo", "Jalón"],
    piernas: ["Sentadilla", "Prensa", "Zancadas"],
    brazos: ["Curl bíceps", "Extensión tríceps", "Martillo"],
    hombros: ["Press militar", "Elevaciones laterales", "Pájaros"],
    core: ["Crunch", "Planchas", "Elevaciones piernas"]
  };
  const selector = document.getElementById("selector-ejercicio");
  selector.innerHTML = `<select id="ejercicio-grupo" onchange="agregarTablaEjercicio()">
    <option value="">-- ELEGIR EJERCICIO --</option>
    ${ejerciciosPorGrupo[grupo].map(e => `<option value="${e}">${e}</option>`).join("")}
  </select>`;
}

function agregarTablaEjercicio() {
  const nombre = document.getElementById("ejercicio-grupo").value;
  if (!nombre) return;

  const contenedor = document.getElementById("contenedor-tablas");
  const tabla = document.createElement("table");
  tabla.innerHTML = `
    <thead>
      <tr><th>${nombre}</th><th>KG Ant</th><th>Reps Ant</th><th>KG</th><th>Reps</th><th>✔</th></tr>
    </thead>
    <tbody></tbody>
  `;
  const tbody = tabla.querySelector("tbody");
  contenedor.appendChild(tabla);

  const btnAnadir = document.createElement("button");
  btnAnadir.className = "anadir-serie";
  btnAnadir.textContent = "+ AÑADIR SERIE";
  btnAnadir.onclick = () => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${nombre}</td>
      <td>--</td>
      <td>--</td>
      <td><input type="number" /></td>
      <td><input type="number" /></td>
      <td><button class="hecho" onclick="marcarHecho(this)">✔</button></td>
    `;
    tbody.appendChild(tr);
  };
  contenedor.appendChild(btnAnadir);
}

function marcarHecho(boton) {
  boton.classList.add("realizado");
  usuario.puntos += 1;
  actualizarStats();
  iniciarDescanso();
}

function iniciarDescanso() {
  const descanso = parseInt(document.getElementById("tiempo-descanso").value) || 30;
  let restante = descanso;
  const originalTitle = document.title;
  const interval = setInterval(() => {
    document.title = `⏳ Descanso: ${restante}s`;
    restante--;
    if (restante < 0) {
      clearInterval(interval);
      document.title = originalTitle;
      alert("¡Descanso terminado!");
    }
  }, 1000);
}

function actualizarCalendario() {
  const calendario = document.getElementById("calendario-interactivo");
  const mesTexto = document.getElementById("mes-calendario");
  calendario.innerHTML = "";
  const hoy = new Date();
  const año = hoy.getFullYear();
  const mes = hoy.getMonth();
  const mesesNombres = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
  mesTexto.textContent = mesesNombres[mes];

  const primerDia = new Date(año, mes, 1).getDay();
  const diasMes = new Date(año, mes + 1, 0).getDate();

  for (let i = 0; i < primerDia; i++) {
    calendario.innerHTML += "<div></div>";
  }

  for (let dia = 1; dia <= diasMes; dia++) {
    const fechaStr = `${año}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    const btn = document.createElement("button");
    btn.textContent = dia;
    btn.onclick = () => mostrarGrafica(fechaStr);
    if (historial[fechaStr]) btn.style.backgroundColor = "#deff77";
    calendario.appendChild(btn);
  }
}

function mostrarGrafica(fecha) {
  const canvasId = `grafica-${fecha}`;
  const contenedor = document.getElementById("graficas-por-dia");
  contenedor.innerHTML = `<canvas id="${canvasId}"></canvas>`;
  const ejercicios = historial[fecha] || [];
  const datos = {};
  ejercicios.forEach(e => {
    if (!datos[e.nombre]) datos[e.nombre] = { kg: 0, reps: 0 };
    datos[e.nombre].kg += parseInt(e.kg || 0);
    datos[e.nombre].reps += parseInt(e.reps || 0);
  });

  const ctx = document.getElementById(canvasId).getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(datos),
      datasets: [
        {
          label: "KG Totales",
          data: Object.values(datos).map(d => d.kg),
          backgroundColor: "#deff77"
        },
        {
          label: "Reps Totales",
          data: Object.values(datos).map(d => d.reps),
          backgroundColor: "#aaff44"
        }
      ]
    }
  });
}

function actualizarStats() {
  document.getElementById("puntos-usuario").textContent = usuario.puntos;
  document.getElementById("racha-usuario").textContent = usuario.racha;
  document.getElementById("nivel-usuario").textContent = usuario.nivel;
}

function actualizarNivel() {
  const niveles = [0, 100, 250, 500, 1000, 2000, 3500, 5000, 7000];
  for (let i = niveles.length - 1; i >= 0; i--) {
    if (usuario.puntos >= niveles[i]) {
      usuario.nivel = i + 1;
      break;
    }
  }
}

// Inputs usuario
document.getElementById("foto-usuario").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (ev) {
      document.getElementById("preview-foto").innerHTML = `<img src='${ev.target.result}'/>`;
      usuario.foto = ev.target.result;
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById("nombre-usuario").addEventListener("input", (e) => {
  usuario.nombre = e.target.value.toUpperCase();
});
