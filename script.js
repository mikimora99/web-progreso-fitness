document.addEventListener("DOMContentLoaded", function () {
  const secciones = document.querySelectorAll(".seccion");
  const botonesMenu = document.querySelectorAll("nav button");
  const nombreUsuario = document.getElementById("nombre-usuario");
  const inputNombre = document.getElementById("input-nombre");
  const inputFoto = document.getElementById("input-foto");
  const perfilImagen = document.getElementById("foto-perfil");
  const iniciarBtn = document.getElementById("iniciarBtn");
  const finalizarBtn = document.getElementById("finalizarBtn");
  const cancelarBtn = document.getElementById("cancelarBtn");
  const grupoMuscularSelect = document.getElementById("grupo-muscular");
  const ejerciciosSelect = document.getElementById("ejercicios");
  const tablaEjercicios = document.getElementById("tabla-ejercicios");
  const intensidadInput = document.getElementById("intensidad");
  const momentoDiaInput = document.getElementById("momento-dia");
  const comentarioInput = document.getElementById("comentario");
  const medidasBtn = document.getElementById("btn-medidas");
  const calendarioBtn = document.getElementById("btn-calendario");
  const medidas = document.getElementById("medidas");
  const calendario = document.getElementById("calendario");
  const planesSection = document.getElementById("planes");
  const planesContainer = document.getElementById("lista-planes");
  const puntosSpan = document.getElementById("puntos");
  const nivelSpan = document.getElementById("nivel");

  let puntos = 0;
  let nivel = 1;
  let sesionActiva = false;

  function mostrarSeccion(id) {
    secciones.forEach(seccion => seccion.style.display = "none");
    document.getElementById(id).style.display = "block";
    botonesMenu.forEach(btn => btn.classList.remove("activo"));
    const botonActivo = document.querySelector(`nav button[onclick="mostrarSeccion('${id}')"]`);
    if (botonActivo) {
      botonActivo.classList.add("activo");
    }
  }

  window.mostrarSeccion = mostrarSeccion;

  inputNombre.addEventListener("input", () => {
    nombreUsuario.textContent = inputNombre.value.toUpperCase();
  });

  nombreUsuario.addEventListener("click", () => mostrarSeccion('inicio'));

  inputFoto.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => perfilImagen.src = e.target.result;
      reader.readAsDataURL(file);
    }
  });

  medidasBtn.addEventListener("click", () => {
    medidas.style.display = "block";
    calendario.style.display = "none";
  });

  calendarioBtn.addEventListener("click", () => {
    medidas.style.display = "none";
    calendario.style.display = "block";
  });

  iniciarBtn.addEventListener("click", function () {
    sesionActiva = true;
    ejerciciosSelect.innerHTML = "<option value=''>Elige ejercicio</option>";
    ejerciciosSelect.disabled = false;
    finalizarBtn.style.display = "inline-block";
    cancelarBtn.style.display = "inline-block";
    iniciarBtn.style.display = "none";
  });

  cancelarBtn.addEventListener("click", function () {
    sesionActiva = false;
    tablaEjercicios.innerHTML = "";
    ejerciciosSelect.innerHTML = "";
    ejerciciosSelect.disabled = true;
    iniciarBtn.style.display = "inline-block";
    finalizarBtn.style.display = "none";
    cancelarBtn.style.display = "none";
  });

  finalizarBtn.addEventListener("click", function () {
    sesionActiva = false;
    iniciarBtn.style.display = "inline-block";
    finalizarBtn.style.display = "none";
    cancelarBtn.style.display = "none";
    puntos += 10;
    if (puntos >= nivel * 100) {
      puntos = 0;
      nivel++;
      alert("¡Has subido de nivel!");
    }
    puntosSpan.textContent = puntos;
    nivelSpan.textContent = nivel;
    mostrarPopupFinal();
    tablaEjercicios.innerHTML = "";
    ejerciciosSelect.innerHTML = "";
    ejerciciosSelect.disabled = true;
  });

  function mostrarPopupFinal() {
    const popup = document.createElement("div");
    popup.className = "popup";
    popup.innerHTML = `
      <h3>¿Cómo fue tu sesión?</h3>
      <label>Intensidad (0-10): <input type="number" min="0" max="10" /></label><br>
      <label>Momento del día: 
        <select>
          <option>Mañana</option>
          <option>Tarde</option>
          <option>Noche</option>
        </select>
      </label><br>
      <label>Comentario: <textarea></textarea></label><br>
      <button onclick="this.parentElement.remove()">Guardar</button>
    `;
    document.body.appendChild(popup);
  }

  const ejerciciosPorGrupo = {
    pecho: ["Press banca", "Press inclinado", "Aperturas"],
    espalda: ["Remo con barra", "Jalón al pecho", "Peso muerto"],
    piernas: ["Sentadillas", "Prensa", "Zancadas"],
    brazos: ["Curl bíceps", "Extensión tríceps", "Curl martillo"],
    hombros: ["Press militar", "Elevaciones laterales", "Pájaros"]
  };

  grupoMuscularSelect.addEventListener("change", function () {
    const grupo = this.value;
    ejerciciosSelect.innerHTML = "<option value=''>Elige ejercicio</option>";
    if (grupo && ejerciciosPorGrupo[grupo]) {
      ejerciciosPorGrupo[grupo].forEach(ej => {
        const option = document.createElement("option");
        option.value = ej;
        option.textContent = ej;
        ejerciciosSelect.appendChild(option);
      });
    }
  });

  ejerciciosSelect.addEventListener("change", function () {
    const ejercicio = this.value;
    if (!ejercicio) return;
    tablaEjercicios.innerHTML = "";

    const tabla = document.createElement("table");
    tabla.innerHTML = `
      <thead><tr><th>Serie</th><th>Peso (kg)</th><th>Reps</th><th>Descanso</th><th></th></tr></thead>
      <tbody id="cuerpo-tabla"></tbody>
    `;
    tablaEjercicios.appendChild(tabla);
    añadirSerie(); // Primera serie

    const btnAñadir = document.createElement("button");
    btnAñadir.textContent = "Añadir serie";
    btnAñadir.onclick = añadirSerie;
    tablaEjercicios.appendChild(btnAñadir);
  });

  function añadirSerie() {
    const cuerpo = document.getElementById("cuerpo-tabla");
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${cuerpo.children.length + 1}</td>
      <td><input type="number" placeholder="kg" /></td>
      <td><input type="number" placeholder="reps" /></td>
      <td class="barra-descanso"></td>
      <td><button onclick="completarSerie(this)">✔</button></td>
    `;
    cuerpo.appendChild(fila);
  }

  window.completarSerie = function (boton) {
    const fila = boton.closest("tr");
    fila.style.opacity = "0.4";
    iniciarTimerDescanso(fila.querySelector(".barra-descanso"));
  };

  function iniciarTimerDescanso(barra) {
    barra.classList.add("barra-activa");
    barra.style.background = "#deff77";
    barra.style.height = "5px";
    barra.style.transition = "width 5s linear";
    barra.style.width = "100%";
    setTimeout(() => {
      barra.style.width = "0%";
      barra.classList.remove("barra-activa");
    }, 5000);
  }

  // PLANES
  const planes = [
    { nombre: "Fuerza Básica", nivel: "Principiante", objetivo: "Aumentar fuerza general" },
    { nombre: "Definición", nivel: "Intermedio", objetivo: "Bajar grasa y mantener músculo" },
    { nombre: "Volumen", nivel: "Avanzado", objetivo: "Ganar masa muscular" }
  ];

  planes.forEach(plan => {
    const div = document.createElement("div");
    div.className = "plan";
    div.innerHTML = `
      <h3>${plan.nombre}</h3>
      <p>Nivel: ${plan.nivel}</p>
      <p>Objetivo: ${plan.objetivo}</p>
      <button>Seleccionar</button>
    `;
    planesContainer.appendChild(div);
  });
});
