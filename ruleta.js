const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinSound = document.getElementById("spinSound");
const winSound = document.getElementById("winSound");
const selectedNameElement = document.getElementById("selectedName");

let noms = [];
let angles = [];
let startAngle = 0;
let spinning = false;

// Carregar noms des de noms.txt
document.getElementById("loadNames").addEventListener("click", () => {
    fetch("noms.txt")
        .then(response => response.text())
        .then(data => {
            noms = data.split("\n").map(name => name.trim()).filter(name => name);
            inicialitzaRuleta();
            alert("Noms carregats correctament!");
        });
});

// Inicialitza els angles de cada segment
function inicialitzaRuleta() {
    angles = [];
    const anglePerSegment = (2 * Math.PI) / noms.length;
    for (let i = 0; i < noms.length; i++) {
        angles.push({ start: i * anglePerSegment, end: (i + 1) * anglePerSegment });
    }
    dibuixaRuleta();
}

// Dibuixa la ruleta
function dibuixaRuleta() {
    const centreX = canvas.width / 2;
    const centreY = canvas.height / 2;
    const radi = centreX - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    noms.forEach((nom, index) => {
        const start = angles[index].start + startAngle;
        const end = angles[index].end + startAngle;

        // Alterna entre blau i vermell
        ctx.fillStyle = index % 2 === 0 ? "#1E90FF" : "#FF4500";

        ctx.beginPath();
        ctx.moveTo(centreX, centreY);
        ctx.arc(centreX, centreY, radi, start, end);
        ctx.closePath();
        ctx.fill();

        // Dibuixa el text
        ctx.save();
        ctx.translate(centreX, centreY);
        ctx.rotate((start + end) / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#fff";
        ctx.font = "bold 16px Arial";
        ctx.fillText(nom, radi - 10, 0);
        ctx.restore();
    });

    // Dibuixa el cercle central
    ctx.beginPath();
    ctx.arc(centreX, centreY, 10, 0, 2 * Math.PI);
    ctx.fillStyle = "#000";
    ctx.fill();

    // Dibuixa la fletxa
    dibuixaFletxa(centreX, centreY, radi);
}

// Dibuixa la fletxa a sobre de la ruleta
function dibuixaFletxa(centreX, centreY, radi) {
    const midaFletxa = 50;  // Aumento el tamaño de la flecha (ancho)
    const alçadaFletxa = 30; // Aumento la altura de la flecha

    ctx.beginPath();
    // Coloca la punta de la flecha justo en la parte superior de la ruleta
    ctx.moveTo(centreX, centreY - radi - 5);  // Ajusto la posición para que esté alineada con la ruleta
    // Costat esquerre
    ctx.lineTo(centreX - midaFletxa / 2, centreY - radi - alçadaFletxa);
    // Costat dret
    ctx.lineTo(centreX + midaFletxa / 2, centreY - radi - alçadaFletxa);
    ctx.closePath();
    ctx.fillStyle = "#000000"; // Color negro per a la fletxa
    ctx.fill();
}

// Gira la ruleta
document.getElementById("spinButton").addEventListener("click", () => {
    if (spinning || noms.length === 0) return;

    spinning = true;
    spinSound.play();

    let spinTime = 5000; // Tiempo total del giro (en milisegundos)
    const spinStart = Date.now();

    // Velocidad inicial aleatoria entre 0.1 y 0.5
    let speed = Math.random() * 0.4 + 0.1;

    // Direcció aleatòria (horaire o antihoraire)
    const direction = Math.random() < 0.5 ? 1 : -1;

    // Función de desaceleración más suave
    function anima() {
        const elapsed = Date.now() - spinStart;

        // Aplicar desaceleración más gradual
        speed *= 0.98;  // Factor de desaceleración más suave

        // Incrementa el ángulo con la velocidad y dirección actuales
        startAngle += speed * direction;

        // Dibuja la ruleta
        dibuixaRuleta();

        // Continuar la animación si aún hay tiempo o si la velocidad es mayor que un umbral mínimo
        if (elapsed < spinTime && speed > 0.005) {  // Se detiene cuando la velocidad es muy pequeña
            requestAnimationFrame(anima);
        } else {
            spinning = false;
            spinSound.pause();
            winSound.play();
            seleccionaNom();
        }
    }

    anima();
});

// Selecciona el nom segons l'angle final
function seleccionaNom() {
    // Calcular el ángulo final ajustado
    const angleFinal = (Math.PI * 1.5 - startAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);

    // Encontrar el segmento correspondiente al ángulo
    const segment = noms.findIndex((_, index) => {
        const start = angles[index].start;
        const end = angles[index].end;
        return angleFinal >= start && angleFinal < end;
    });

    if (segment !== -1) {
        selectedNameElement.textContent = "Nom guanyador: " + noms[segment];
    } else {
        selectedNameElement.textContent = "Error al seleccionar el nom guanyador.";
    }
}
