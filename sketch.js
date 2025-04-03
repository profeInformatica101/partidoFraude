let jugadores = [];
let partida;
let balon;

const NOMBRES = [
  "Sema", "Cristiano", "Amigo Carlos", "Pedro", "Carlos", "Juan David", "Alex",
  "Santi", "Rafa", "Manolo", "Joselu Mato", "Antonio Tango", "Pablo", "Caste Porra Verde"
];

const CAMPO = {
  ancho: 800,      // Escalado desde 60 m reales
  alto: 500,       // Escalado desde 40 m reales
  porteriaAlto: 100, // Representa los 2 m reales
  porteriaAncho: 10  // Espacio virtual de gol
};

class Jugador {
  constructor(x, y, nombre, equipo) {
    this.x = x;
    this.y = y;
    this.nombre = nombre;
    this.equipo = equipo; // "blanco" o "negro"
    this.radio = 20;
    this.color = equipo === "blanco" ? 255 : 0;
    this.vx = random(-0.8, 0.8);
    this.vy = random(-0.8, 0.8);
  }

  mover() {
    this.x += this.vx;
    this.y += this.vy;

    // rebote con bordes del campo
    if (this.x < this.radio || this.x > CAMPO.ancho - this.radio) this.vx *= -1;
    if (this.y < this.radio || this.y > CAMPO.alto - this.radio) this.vy *= -1;
  }

  dibujar() {
    fill(this.color);
    stroke(0);
    ellipse(this.x, this.y, this.radio * 2);

    fill(255);
    textAlign(CENTER);
    textSize(10);
    text(this.nombre, this.x, this.y - this.radio - 4);
  }
}

class Balon {
  constructor() {
    this.radio = 10;
    this.reiniciar();
  }

  reiniciar() {
    this.x = CAMPO.ancho / 2;
    this.y = CAMPO.alto / 2;
    this.vx = random(-2, 2);
    this.vy = random(-2, 2);
  }

  mover() {
    this.x += this.vx;
    this.y += this.vy;

    // rebote superior e inferior
    if (this.y < this.radio || this.y > CAMPO.alto - this.radio) {
      this.vy *= -1;
    }

    // detección de gol
    if (this.x < CAMPO.porteriaAncho && this.y > CAMPO.alto / 2 - CAMPO.porteriaAlto / 2 && this.y < CAMPO.alto / 2 + CAMPO.porteriaAlto / 2) {
      partida.sumarGol("negro");
      this.reiniciar();
    }

    if (this.x > CAMPO.ancho - CAMPO.porteriaAncho && this.y > CAMPO.alto / 2 - CAMPO.porteriaAlto / 2 && this.y < CAMPO.alto / 2 + CAMPO.porteriaAlto / 2) {
      partida.sumarGol("blanco");
      this.reiniciar();
    }

    // rebote lateral si no es gol
    if (this.x < this.radio || this.x > CAMPO.ancho - this.radio) {
      this.vx *= -1;
    }
  }

  dibujar() {
    fill(255, 204, 0);
    noStroke();
    ellipse(this.x, this.y, this.radio * 2);
  }
}

class Partida {
  constructor() {
    this.golesBlanco = 0;
    this.golesNegro = 0;
    this.tiempo = 0;
    this.maxTiempo = 60 * 60 * 3; // 3 minutos en frames (60 FPS)
  }

  sumarGol(equipo) {
    if (equipo === "blanco") this.golesBlanco++;
    else if (equipo === "negro") this.golesNegro++;
  }

  mostrarMarcador() {
    fill(255);
    textSize(18);
    textAlign(CENTER, TOP);
    text(`⚪ Blanco ${this.golesBlanco} - ${this.golesNegro} Negro ⚫`, CAMPO.ancho / 2, 10);
  }

  actualizarTiempo() {
    this.tiempo++;
    if (this.tiempo >= this.maxTiempo) {
      noLoop();
      alert("⏰ Fin del partido");
    }
  }
}

function setup() {
  let canvas = createCanvas(CAMPO.ancho, CAMPO.alto);
  canvas.parent("canvas-container");

  partida = new Partida();
  balon = new Balon();
  crearJugadores();
}

function draw() {
  background(46, 125, 50);
  dibujarCampo();

  jugadores.forEach(j => {
    j.mover();
    j.dibujar();
  });

  balon.mover();
  balon.dibujar();

  partida.mostrarMarcador();
  partida.actualizarTiempo();
}

function crearJugadores() {
  for (let i = 0; i < NOMBRES.length; i++) {
    let equipo = i < 7 ? "blanco" : "negro";
    let x = equipo === "blanco" ? 150 : CAMPO.ancho - 150;
    let y = 70 + (i % 7) * 55;
    jugadores.push(new Jugador(x, y, NOMBRES[i], equipo));
  }
}

function dibujarCampo() {
  // línea de medio campo y círculo central
  stroke(255);
  line(CAMPO.ancho / 2, 0, CAMPO.ancho / 2, CAMPO.alto);
  noFill();
  ellipse(CAMPO.ancho / 2, CAMPO.alto / 2, 100);

  // porterías
  rect(0, CAMPO.alto / 2 - CAMPO.porteriaAlto / 2, CAMPO.porteriaAncho, CAMPO.porteriaAlto);
  rect(CAMPO.ancho - CAMPO.porteriaAncho, CAMPO.alto / 2 - CAMPO.porteriaAlto / 2, CAMPO.porteriaAncho, CAMPO.porteriaAlto);
}
