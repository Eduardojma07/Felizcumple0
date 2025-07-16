// Secciones principales
const introSection = document.getElementById('intro-section');
const puzzleSection = document.getElementById('puzzle-section');
const skippedSection = document.getElementById('skipped-section');
const cakeSection = document.getElementById('cake-section');
const secretSection = document.getElementById('secret-section');
const finalSection = document.getElementById('final-section');
const tocadiscosSection = document.getElementById('tocadiscos-section');

// Botones y inputs
const skipBtn = document.getElementById('skip-puzzle-btn');
const secretBtn = document.getElementById('secret-btn');
const secretInput = document.getElementById('secret-input');
const spamBtn = document.getElementById('spam-btn');
const confirmModal = document.getElementById('confirm-modal');
const confirmYes = document.getElementById('confirm-yes');
const confirmNo = document.getElementById('confirm-no');











// --- Funciones comunes ---

// Mostrar notificación bonita en vez de alert()
function showMessage(text, duration = 2500) {
  const alertBox = document.getElementById('custom-alert');
  alertBox.textContent = text;
  alertBox.classList.add('show');
  alertBox.classList.remove('hidden');

  setTimeout(() => {
    alertBox.classList.remove('show');
    setTimeout(() => {
      alertBox.classList.add('hidden');
    }, 500);
  }, duration);
}

// Cambiar de sección visible
function showSection(section) {
  document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
  section.classList.remove('hidden');
}

// --- Código secreto para pasar a sección intro---

secretBtn.addEventListener('click', () => {
  const code = secretInput.value.trim().toLowerCase();
  if (code === '1402' || code === '14-02' || code === '14/02') {
    showMessage('¡Código correcto! 🥰');
    setTimeout(() => showSection(introSection), 1000);
  } else {
    showMessage('Ups... intenta otra vez 💬');
  }
});


// Velitas pastel
const candles = document.querySelectorAll('.candle');
let candlesOut = 0;

candles.forEach(candle => {
  candle.addEventListener('click', () => {
    if (!candle.classList.contains('explode')) {
      candle.classList.add('explode');
      candlesOut++;
      setTimeout(() => {
        candle.style.display = 'none';
        if (candlesOut === 3) {
          showMessage("¡Todas las velitas apagadas! 🎉");
          
          // Lanzar confeti por toda la pantalla
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
          });

          setTimeout(() => {
              showSection(puzzleSection);
              initPuzzle(); 
            }, 1500);
        }
      }, 400);
    }
  });
});


// --- Puzzle ---
const size = 3;
const emptyIndex = size * size - 1;
let pieces = [];

function shuffle(array) {
  let arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function initPuzzle() {
  pieces = [];
  for (let i = 0; i < size * size; i++) pieces.push(i);
  pieces = shuffle(pieces);
  renderPuzzle();
}

function renderPuzzle() {
  const puzzle = document.getElementById('puzzle');
  puzzle.innerHTML = '';
  for (let i = 0; i < pieces.length; i++) {
    const pieceNum = pieces[i];
    const div = document.createElement('div');
    div.classList.add('piece');
    if (pieceNum === emptyIndex) {
      div.style.background = 'none';
      div.style.cursor = 'default';
    } else {
      const x = (pieceNum % size) * 100;
      const y = Math.floor(pieceNum / size) * 100;
      div.style.backgroundPosition = `-${x}px -${y}px`;
    }
    div.addEventListener('click', () => tryMove(i));
    puzzle.appendChild(div);
  }
}

function tryMove(index) {
  const emptyPos = pieces.indexOf(emptyIndex);
  const canMove = (
    (index === emptyPos - 1 && emptyPos % size !== 0) ||
    (index === emptyPos + 1 && index % size !== 0) ||
    index === emptyPos - size ||
    index === emptyPos + size
  );
  if (canMove) {
    [pieces[index], pieces[emptyPos]] = [pieces[emptyPos], pieces[index]];
    renderPuzzle();
    if (isCompleted()) {
      showMessage('¡Lo lograste! 💕');

      setTimeout(() => showSection(skippedSection), 1000);
    }

  }
}

function isCompleted() {
  for (let i = 0; i < pieces.length; i++) {
    if (pieces[i] !== i) return false;
  }
  return true;
}

// Botón "Saltar puzzle" y modal confirmación

skipBtn.addEventListener('click', () => {
  confirmModal.classList.remove('hidden');
});

confirmYes.addEventListener('click', () => {
  confirmModal.classList.add('hidden');
  showSection(skippedSection);
  showMessage("Está bien, no siempre hay que resolverlo todo 😊");
});

confirmNo.addEventListener('click', () => {
  confirmModal.classList.add('hidden');
  showMessage("¡Vamos que tú puedes! 💪");
});


const btnContinuarSkipped = document.getElementById('btn-continuar-skipped');
btnContinuarSkipped.addEventListener('click', () => {
  const msgSound = document.getElementById('message-sound');
  msgSound.currentTime = 0;
  msgSound.play();

  showSection(finalSection);
});


// Botón spam amor

spamBtn.addEventListener('click', () => {
  const bubble = document.createElement('span');
  bubble.className = 'bubble';
  bubble.textContent = spamPhrases[Math.floor(Math.random() * spamPhrases.length)];
  bubble.style.left = `${Math.random() * 90}%`;
  bubble.style.top = `${Math.random() * 80}%`;
  bubble.style.fontSize = `${Math.random() * 10 + 14}px`;
  document.body.appendChild(bubble);
  setTimeout(() => bubble.remove(), 3000);
});
// Frases spam amor
const spamPhrases = [
  "Feliz cumpleaños", "Te quiero🥰", "Me gustas",
  "Eres único 💫", "Te valoro 🌟", "Gracias por existir 💖","Me encantas","Te quiero Mimor","Mimor picioso","Te pienso mucho"
];


// Variables globales para posición del gatito y puerta
let x, y, xfinal, yfinal;

// Mapa principal (laberinto)
const mapa = [
  "******************",
  "*_______***______*",
  "*_*****_____******",
  "*_____****__*__*_*",
  "***_*_****____**_*",
  "*___*____**_**___*",
  "*_*********_**_*_*",
  "*____**_____*__*_*",
  "*_**_**_*****_**_*",
  "*o**__*________*W*",
  "******************"
];



// Copias para manipular
let mapita = [];
let mapit = [];

function copiarMapa(origen, destino) {
  for (let i = 0; i < origen.length; i++) {
    destino[i] = [];
    for (let j = 0; j < origen[0].length; j++) {
      destino[i][j] = origen[i][j];
    }
  }
}

// Inicializa mapa
copiarMapa(mapa, mapita);


function generarMapa(mapita) {
  const laberinto = document.getElementById('laberinto');
  laberinto.innerHTML = '';
  const tabla = document.createElement('table');
  tabla.className = 'celdita';

  for (let i = 0; i < mapita.length; i++) {
    const fila = document.createElement('tr');
    for (let j = 0; j < mapita[i].length; j++) {
      const celda = document.createElement('td');

      switch (mapita[i][j]) {
        case '*':
          celda.className = 'pared';
          break;
        case 'o':
          x = j;
          y = i;
          celda.className = 'gatito';
          break;
        case 'W':
          xfinal = j;
          yfinal = i;
          celda.className = 'puerta';
          break;
        default:
          celda.textContent = ''; // espacio vacío
      }

      fila.appendChild(celda);
    }
    tabla.appendChild(fila);
  }
  laberinto.appendChild(tabla);

  // Si llegó a la puerta, muestra fondo y mensaje
  if (x === xfinal && y === yfinal) {
  const tabla2 = document.createElement('table');
  tabla2.className = 'celdita fondo';

  for (let i = 0; i < mapit.length; i++) {
    const fila = document.createElement('tr');
    for (let j = 0; j < mapit[i].length; j++) {
      const celda = document.createElement('td');
      if (mapit[i][j] === '*') {
        celda.className = 'pared';
      }
      fila.appendChild(celda);
    }
    tabla2.appendChild(fila);
  }

  const laberinto = document.getElementById('laberinto');
  laberinto.replaceChild(tabla2, laberinto.firstChild);

  const mensaje = document.createElement('h3');
  mensaje.textContent = '¡Lo lograste!';
  laberinto.appendChild(mensaje);

  // Desactivar controles tras ganar
  document.removeEventListener('keydown', teclaHandler);
  document.getElementById('arriba').onclick = null;
  document.getElementById('abajo').onclick = null;
  document.getElementById('izquierda').onclick = null;
  document.getElementById('derecha').onclick = null;

   showSection(cakeSection);
  startCakeRain(); // lluvia de pasteles
  // Cambiar a sección pastel
  showSection(cakeSection);
}

}

function moverArriba() {
  if (mapita[y - 1][x] !== '*') {
    mapita[y][x] = '_';
    y--;
    mapita[y][x] = 'o';
    generarMapa(mapita);
  }
}

function moverAbajo() {
  if (mapita[y + 1][x] !== '*') {
    mapita[y][x] = '_';
    y++;
    mapita[y][x] = 'o';
    generarMapa(mapita);
  }
}

function moverIzquierda() {
  if (mapita[y][x - 1] !== '*') {
    mapita[y][x] = '_';
    x--;
    mapita[y][x] = 'o';
    generarMapa(mapita);
  }
}

function moverDerecha() {
  if (mapita[y][x + 1] !== '*') {
    mapita[y][x] = '_';
    x++;
    mapita[y][x] = 'o';
    generarMapa(mapita);
  }
}

// Asignar eventos a botones
document.getElementById('arriba').onclick = moverArriba;
document.getElementById('abajo').onclick = moverAbajo;
document.getElementById('izquierda').onclick = moverIzquierda;
document.getElementById('derecha').onclick = moverDerecha;

// Mover con teclado
function teclaHandler(e) {
  switch (e.key) {
    case 'ArrowUp': moverArriba(); break;
    case 'ArrowDown': moverAbajo(); break;
    case 'ArrowLeft': moverIzquierda(); break;
    case 'ArrowRight': moverDerecha(); break;
  }
}
document.addEventListener('keydown', teclaHandler);

// Generar mapa inicial
generarMapa(mapita);

const btnComenzar = document.getElementById('btn-comenzar');
const laberintoSection = document.getElementById('laberinto-section');

function mostrarLaberinto() {
  introSection.classList.add('hidden');      // ocultar la sección inicial
  laberintoSection.classList.remove('hidden'); // mostrar el laberinto
  generarMapa(mapita); // dibujar mapa
}


// Evento click para botón comenzar
btnComenzar.addEventListener('click', mostrarLaberinto);


function startCakeRain(duration = 5000, frequency = 300) {
  const container = document.getElementById('cake-rain-container');
  const emojis = ['🎂', '🍰', '🧁'];

  const interval = setInterval(() => {
    const cake = document.createElement('div');
    cake.classList.add('cake-drop');
    cake.style.left = Math.random() * 100 + 'vw';
    cake.style.animationDuration = (3 + Math.random() * 2) + 's';
    cake.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    container.appendChild(cake);

    // Quitar el pastel tras la animación para limpiar DOM
    cake.addEventListener('animationend', () => {
      cake.remove();
    });
  }, frequency);

  // Parar lluvia tras duración
  setTimeout(() => clearInterval(interval), duration);
}


// Tocadiscos
class Turntable {
    constructor() {
        this.isPlaying = false;

        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.vinyl = document.getElementById('vinyl');
        this.tonearm = document.getElementById('tonearm');
        this.playBtn = document.getElementById('playBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.audio = document.getElementById('audio');  // Nuevo: audio
    }

    bindEvents() {
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.stopBtn.addEventListener('click', () => this.stop());

        // Cuando la canción termina
        this.audio.addEventListener('ended', () => this.stop());
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

   play() {
  if (!discoInsertado) {
    showMessage('Por favor, inserta el disco en el tocadiscos antes de reproducir.');
    return;
  }

  if (!this.mensajeMostrado) {
  showMessage('Fin del recorrido Mimor, espero te haya gustado. ¡Feliz cumpleaños!', 10000); // 10 segundos
  this.mensajeMostrado = true;
}


  this.isPlaying = true;
  this.vinyl.classList.add('spinning');
  this.tonearm.classList.add('playing');
  this.playBtn.classList.add('playing');
  this.audio.play();

  const icon = document.getElementById('playPauseIcon');
  if (icon) icon.textContent = '⏸';

  const cd = document.getElementById('cd');
  if (cd) {
    cd.classList.remove('paused');
    cd.classList.add('spinning');
  }
}





   pause() {
      this.isPlaying = false;
      this.vinyl.classList.remove('spinning');
      this.tonearm.classList.remove('playing');
      this.playBtn.classList.remove('playing');
      this.audio.pause();

      // Cambiar ícono a play
      const icon = document.getElementById('playPauseIcon');
      if (icon) icon.textContent = '▶';

      const cd = document.getElementById('cd');
      if (cd) {
        cd.classList.add('paused');

      }
    }



    stop() {
    this.pause();
    this.audio.currentTime = 0; // Reiniciar audio
    const cd = document.getElementById('cd');
    if (cd) {
      cd.classList.remove('spinning');
      cd.classList.remove('paused');
      cd.style.transform = 'none';  // quitar rotación
    }
   
}

}


// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const tocadiscosSection = document.getElementById('tocadiscos-section');
    const finalSection = document.getElementById('final-section');
    
    function showTocadiscos() {
        tocadiscosSection.classList.remove('hidden'); // muestra tocadiscos
        finalSection.classList.add('hidden');          // oculta la carta final
        
        new Turntable(); // inicia el tocadiscos
    }

    const btnGoTocadiscos = document.getElementById('btn-go-tocadiscos');
    btnGoTocadiscos?.addEventListener('click', showTocadiscos);
});


let discoInsertado = false;
const cd = document.getElementById('cd');
const turntable = document.querySelector('.turntable-base');

let isDragging = false;
let offsetX, offsetY;

// Disco
cd.addEventListener('mousedown', (e) => {
  // No permitir arrastrar si está girando o pausado (tiene la animación)
  if (cd.classList.contains('spinning') || cd.classList.contains('paused')) {
    return; // Ignorar agarrar disco
  }

  isDragging = true;

  // Quitar temporalmente la rotación para obtener el offset real
  const prevTransform = cd.style.transform;
  cd.style.transform = 'none';

  const rect = cd.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;

  // Restaurar la rotación
  cd.style.transform = prevTransform;
  cd.style.cursor = 'grabbing';
});


window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  cd.style.left = (e.clientX - offsetX) + 'px';
  cd.style.top = (e.clientY - offsetY) + 'px';
});


window.addEventListener('mouseup', (e) => {
  if (!isDragging) return;
  isDragging = false;
  cd.style.cursor = 'grab';

  const tocaRect = turntable.getBoundingClientRect();

  if (
    e.clientX >= tocaRect.left &&
    e.clientX <= tocaRect.right &&
    e.clientY >= tocaRect.top &&
    e.clientY <= tocaRect.bottom
  ) {
    // Obtener tamaño y posición del disco
    const cdRect = cd.getBoundingClientRect();

    // Calcular nueva posición centrada
    const left = tocaRect.left + (tocaRect.width / 2) - (cdRect.width / 2);
    const top = tocaRect.top + (tocaRect.height / 2) - (cdRect.height / 2);

    cd.style.left = left + 'px';
    cd.style.top = top + 'px';
  
    discoInsertado = true;  // Aquí marcas que está insertado
  } else {
    discoInsertado = false; // Si no quedó sobre el tocadiscos, está fuera
  }
});


function mostrarMensaje(mensaje, duracion = 3000) {
  const contenedor = document.getElementById('mensaje-aviso');
  contenedor.textContent = mensaje;
  contenedor.classList.remove('hidden');

  setTimeout(() => {
    contenedor.classList.add('hidden');
  }, duracion);
}

const icon = document.getElementById('playPauseIcon');
icon.textContent = isPlaying ? '⏸' : '▶';



