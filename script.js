let datos = {
  usuario: {
    nombre: "",
    foto: "",
    medidas: {},
    intensidad: null,
    horario: "",
    comentario: "",
    descanso: 60
  },
  sesiones: [],
};

document.addEventListener("DOMContentLoaded", () => {
  const botonesNav = document.querySelectorAll("nav button");
  const secciones = document.querySelectorAll(".seccion");
  const nombreTitulo = document.getElementById("nombre-titulo");

  botonesNav.forEach((btn) => {
    btn.addEventListener("click", () => {
      botonesNav.forEach((b) => b.classList.remove("activo"));
      btn.classList.add("activo");
      secciones.forEach((sec) => sec.classList.remove("visible"));
      const id = btn.dataset.seccion;
      document.getElementById(id).classList.add("visible");
    });
  });

  nombreTitulo.addEventListener("click", () => {
    document.querySelectorAll("nav button").forEach(b => b.classList.remove("activo"));
    document.getElementById("inicio").classList.add("visible");
  });

  document.getElementById("siluetaPerfil").addEventListener("click", () => {
    document.getElementById("fotoPerfil").click();
  });

  document.getElementById("fotoPerfil").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        document.getElementById("siluetaPerfil").style.backgroundImage = `url('${reader.result}')`;
        datos.usuario.foto = reader.result;
      };
      reader.readAsDataURL(file);
    }
  });

  document.getElementById("inputNombre").addEventListener("input", (e) => {
    datos.usuario.nombre = e.target.value.toUpperCase();
    document.getElementById("nombreUsuario").innerText = datos.usuario.nombre;
  });

  document.getElementById("intensidad").addEventListener("input", (e) => {
    datos.usuario.intensidad = e.target.value;
  });

  document.getElementById("horario").addEventListener("change", (e) => {
    datos.usuario.horario = e.target.value;
  });

  document.getElementById("comentario").addEventListener("input", (e) => {
    datos.usuario.comentario = e.target.value;
  });

  document.getElementById("descanso").addEventListener("input", (e) => {
    datos.usuario.descanso = parseInt(e.target.value);
  });

  // Entrenamiento
  let sesionActiva = false;
  let grupoSeleccionado = "";
  let ejercicioSeleccionado = "";
  let tablaContainer = document.getElementById("tabla-ejercicios");

  document.getElementById("iniciarSesion").addEventListener("click", () => {
    sesionActiva = true;
    document.getElementById("finalizarSesion").style.display = "inline-block";
    document.getElementById("cancelarSesion").style.display = "inline-block";
  });

  document.getElementById("grupoMuscular").addEventListener("change", (e) => {
    if (!sesionActiva) return;
    grupoSeleccionado = e.target.value;
    cargarEjercicios(grupoSeleccionado);
  });

  function cargarEjercicios(grupo) {
    const lista = document.getElementById("ejercicio");
    lista.innerHTML = "";
    const ejercicios = {
      pecho: ["Press banca", "Aperturas", "Fondos"],
      espalda: ["Dominadas", "Remo", "Jalón"],
      pierna: ["Sentadilla", "Prensa", "Zancadas"],
      brazo: ["Curl biceps", "Triceps polea", "Martillo"],
      hombro: ["Press militar", "Elevaciones laterales", "Pájaros"]
    };
    ejercicios[grupo].forEach((ej) => {
      let opt = document.createElement("option");
      opt.value = ej;
      opt.innerText = ej;
      lista.appendChild(opt);
    });
  }

  document.getElementById("ejercicio").addEventListener("change", (e) => {
    ejercicioSeleccionado = e.target.value;
    renderTabla();
  });

  function renderTabla() {
    tablaContainer.innerHTML = "";
    let tabla = document.createElement("table");
    tabla.className = "tabla-ejercicio";

    let thead = document.createElement("thead");
    thead.innerHTML = `
      <tr>
        <th>KG Anteriores</th><th>Reps Ant.</th>
        <th>KG Hoy</th><th>Reps Hoy</th>
        <th>✔</th>
      </tr>`;
    tabla.appendChild(thead);

    let tbody = document.createElement("tbody");

    for (let i = 0; i < 3; i++) {
      let fila = document.createElement("tr");

      for (let j = 0; j < 4; j++) {
        let celda = document.createElement("td");
        if (j < 2) {
          celda.innerText = Math.floor(Math.random() * 50 + 20);
        } else {
          let input = document.createElement("input");
          input.type = "number";
          celda.appendChild(input);
        }
        fila.appendChild(celda);
      }

      let celdaCheck = document.createElement("td");
      let check = document.createElement("button");
      check.innerHTML = "✔";
      check.addEventListener("click", () => {
        fila.classList.add("fila-completada");
        startTimerRow(fila);
      });
      celdaCheck.appendChild(check);
      fila.appendChild(celdaCheck);

      tbody.appendChild(fila);
    }

    tabla.appendChild(tbody);
    tablaContainer.appendChild(tabla);
  }

  function startTimerRow(fila) {
    let bar = document.createElement("div");
    bar.className = "timer-bar";
    bar.style.width = "100%";
    fila.parentNode.insertBefore(bar, fila.nextSibling);

    let duracion = datos.usuario.descanso || 60;
    let restante = duracion;

    let interval = setInterval(() => {
      restante--;
      let porcentaje = (restante / duracion) * 100;
      bar.style.width = `${porcentaje}%`;
      if (restante <= 0) {
        clearInterval(interval);
        bar.remove();
      }
    }, 1000);
  }

  document.getElementById("cancelarSesion").addEventListener("click", () => {
    sesionActiva = false;
    tablaContainer.innerHTML = "";
    document.getElementById("finalizarSesion").style.display = "none";
    document.getElementById("cancelarSesion").style.display = "none";
  });

  document.getElementById("finalizarSesion").addEventListener("click", () => {
    sesionActiva = false;
    document.getElementById("finalizarSesion").style.display = "none";
    document.getElementById("cancelarSesion").style.display = "none";
    alert("Sesión guardada");
  });

  // IA
  document.getElementById("formIA").addEventListener("submit", (e) => {
    e.preventDefault();
    const altura = e.target.altura.value;
    const peso = e.target.peso.value;
    const objetivo = e.target.objetivo.value;

    document.getElementById("resultadoIA").innerText =
      `Plan para ${objetivo} con altura de ${altura} cm y peso de ${peso} kg: 
- Lunes: Tren superior
- Miércoles: Piernas
- Viernes: Cardio y Core`;
  });

  // Calendario
  const calendario = document.getElementById("calendario-usuario");
  for (let i = 1; i <= 31; i++) {
    let dia = document.createElement("div");
    dia.className = "cal-dia";
    dia.innerText = i;
    if (Math.random() < 0.3) dia.classList.add("completado");
    calendario.appendChild(dia);
  }
});
