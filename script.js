// NAVEGACIÓN ENTRE SECCIONES
function mostrarSeccion(id) {
  document.querySelectorAll('.seccion').forEach(seccion => {
    seccion.classList.remove('visible');
  });
  document.getElementById(id).classList.add('visible');

  document.querySelectorAll('nav button').forEach(btn => {
    btn.classList.remove('active');
  });
  document.getElementById(`btn-${id}`).classList.add('active');
}

function irAInicio() {
  mostrarSeccion('inicio');
}

// ENTRENAMIENTO
let entrenamientoActivo = false;
let descansoEnCurso = false;
let tiempoDescanso = 30;
let intervaloDescanso;

const grupoMuscular = document.getElementById('grupo-muscular');
const ejerciciosSelect = document.getElementById('ejercicios');
const tablaEjercicios = document.getElementById('tabla-ejercicios');
const iniciarBtn = document.getElementById('iniciarBtn');
const finalizarBtn = document.getElementById('finalizarBtn');
const cancelarBtn = document.getElementById('cancelarBtn');

iniciarBtn.addEventListener('click', () => {
  entrenamientoActivo = true;
  iniciarBtn.classList.add('oculto');
  finalizarBtn.classList.remove('oculto');
  cancelarBtn.classList.remove('oculto');
  grupoMuscular.disabled = false;
});

cancelarBtn.addEventListener('click', () => {
  entrenamientoActivo = false;
  limpiarEntrenamiento();
  finalizarBtn.classList.add('oculto');
  cancelarBtn.classList.add('oculto');
  iniciarBtn.classList.remove('oculto');
  detenerDescanso();
});

finalizarBtn.addEventListener('click', () => {
  mostrarPopupFinal();
  guardarEntrenamientoEnCalendario();
  detenerDescanso();
});

grupoMuscular.addEventListener('change', () => {
  const grupo = grupoMuscular.value;
  ejerciciosSelect.innerHTML = `<option value="">Selecciona ejercicio</option>`;
  ejerciciosSelect.disabled = false;

  const ejercicios = {
    pecho: ["Press banca", "Aperturas", "Flexiones", "Press inclinado"],
    espalda: ["Dominadas", "Remo", "Jalones", "Peso muerto"],
    piernas: ["Sentadillas", "Zancadas", "Prensa", "Curl femoral"],
    brazos: ["Curl bíceps", "Extensión tríceps", "Martillo", "Fondos"],
    hombros: ["Press militar", "Elevaciones laterales", "Pájaros", "Arnold press"]
  };

  ejercicios[grupo].forEach(ej => {
    const option = document.createElement('option');
    option.textContent = ej;
    ejerciciosSelect.appendChild(option);
  });
});

ejerciciosSelect.addEventListener('change', () => {
  const ejercicio = ejerciciosSelect.value;
  if (!ejercicio) return;
  const tabla = document.createElement('table');
  tabla.className = 'tabla-ejercicio';
  const encabezado = `
    <tr>
      <th colspan="2">Serie Anterior</th>
      <th colspan="2">Serie Actual</th>
      <th>✔</th>
    </tr>
    <tr>
      <th>Kg</th><th>Reps</th>
      <th>Kg</th><th>Reps</th>
      <th>Completado</th>
    </tr>`;
  tabla.innerHTML = encabezado;

  for (let i = 0; i < 4; i++) {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${40 + i * 5}</td>
      <td>${10 - i}</td>
      <td><input type="number" /></td>
      <td><input type="number" /></td>
      <td><button onclick="completarSerie(this)">✔</button></td>`;
    tabla.appendChild(fila);
  }

  const separador = document.createElement('div');
  separador.className = 'timer-descanso';
  separador.innerHTML = `<div class="timer-barra" id="barra-descanso"></div>`;
  tablaEjercicios.innerHTML = '';
  tablaEjercicios.appendChild(tabla);
  tablaEjercicios.appendChild(separador);
});

function completarSerie(btn) {
  const fila = btn.closest('tr');
  fila.classList.add('completado');
  iniciarDescanso();
}

function iniciarDescanso() {
  const barra = document.getElementById('barra-descanso');
  let restante = tiempoDescanso;
  barra.style.width = '100%';
  clearInterval(intervaloDescanso);
  intervaloDescanso = setInterval(() => {
    restante--;
    barra.style.width = (restante / tiempoDescanso) * 100 + '%';
    if (restante <= 0) {
      clearInterval(intervaloDescanso);
    }
  }, 1000);
}

function detenerDescanso() {
  clearInterval(intervaloDescanso);
  const barra = document.getElementById('barra-descanso');
  if (barra) barra.style.width = '0%';
}

function limpiarEntrenamiento() {
  grupoMuscular.value = "";
  ejerciciosSelect.value = "";
  ejerciciosSelect.disabled = true;
  tablaEjercicios.innerHTML = "";
}

// FINALIZAR SESIÓN - POPUP
function mostrarPopupFinal() {
  const intensidad = prompt("¿Qué intensidad le das a esta sesión (0-10)?");
  const momento = prompt("¿Cuándo has entrenado? (mañana, tarde, noche)");
  const comentario = prompt("¿Comentarios sobre la sesión?");
  alert(`Gracias por tu feedback:\nIntensidad: ${intensidad}\nMomento: ${momento}\nComentario: ${comentario}`);
  limpiarEntrenamiento();
  entrenamientoActivo = false;
  iniciarBtn.classList.remove('oculto');
  finalizarBtn.classList.add('oculto');
  cancelarBtn.classList.add('oculto');
}

// CALENDARIO
const calendario = document.getElementById('calendario-usuario');
function generarCalendario(mes = new Date().getMonth(), year = new Date().getFullYear()) {
  calendario.innerHTML = `<div class="mes-titulo">${new Date(year, mes).toLocaleString('es', { month: 'long' }).toUpperCase()} ${year}</div>`;
  const primerDia = new Date(year, mes, 1).getDay();
  const diasMes = new Date(year, mes + 1, 0).getDate();

  for (let i = 0; i < primerDia; i++) {
    const vacio = document.createElement('div');
    calendario.appendChild(vacio);
  }

  for (let d = 1; d <= diasMes; d++) {
    const dia = document.createElement('div');
    dia.className = 'calendario-dia';
    dia.textContent = d;
    dia.addEventListener('click', () => {
      alert(`Sesión realizada el ${d}/${mes + 1}/${year}`);
    });
    if (localStorage.getItem(`sesion-${year}-${mes}-${d}`)) {
      dia.classList.add('completado');
    }
    calendario.appendChild(dia);
  }
}

function guardarEntrenamientoEnCalendario() {
  const hoy = new Date();
  const clave = `sesion-${hoy.getFullYear()}-${hoy.getMonth()}-${hoy.getDate()}`;
  localStorage.setItem(clave, true);
  generarCalendario();
}

// PERFIL
document.getElementById('siluetaPerfil').addEventListener('click', () => {
  document.getElementById('fotoPerfil').click();
});

document.getElementById('fotoPerfil').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      document.getElementById('siluetaPerfil').style.backgroundImage = `url(${reader.result})`;
    };
    reader.readAsDataURL(file);
  }
});

const nombreInput = document.getElementById('nombrePersonalizado');
nombreInput.addEventListener('input', () => {
  const nombre = nombreInput.value.toUpperCase();
  const nombreDisplay = document.getElementById('nombreUsuario');
  nombreDisplay.textContent = nombre || 'ATHLETICA';
});

// PLANES IA (DEMO)
document.getElementById('formIA').addEventListener('submit', e => {
  e.preventDefault();
  const altura = e.target[0].value;
  const peso = e.target[1].value;
  const tipo = e.target[2].value;
  const deporte = e.target[3].value || 'General';
  const resultado = document.getElementById('resultadoIA');
  resultado.innerHTML = `<p><strong>Plan generado:</strong> Rutina de ${tipo} para ${deporte}, adaptada a ${altura}cm y ${peso}kg.</p>`;
});

// INICIALIZAR CALENDARIO
generarCalendario();
