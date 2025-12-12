let canvas = document.getElementById("canvas");
let premioGiro = localStorage.getItem('premioGiro') || "1";
let premios = [];
let colaboradoresTotales = [];
let colaboradores = [];
let theWheel = null;

document.addEventListener("readystatechange", async () => {
    colaboradoresTotales = await cargarInformacion('colaboradores_20251211.json');
    premios = await cargarInformacion('premios.json');
    console.log(colaboradoresTotales.length + ' colaboradores cargados.');
    const datosNoAsistencia = localStorage.getItem('noAsistencia');
    const noAsistencia = datosNoAsistencia ? JSON.parse(datosNoAsistencia) : [];
    const noAsistenciaSet = new Set(noAsistencia);

    const datosGanadores = localStorage.getItem('ganadoresRuleta');
    const ganadoresPrevios = datosGanadores ? JSON.parse(datosGanadores) : [];
    const ganadoresSet = new Set(ganadoresPrevios.map(g => g.identificacion));

    const colaboradoresFiltrados = mezclarArray(
        colaboradoresTotales.filter(colaborador => {
            const id = colaborador.colaboradorIDENTIFICACION;
            return noAsistenciaSet.has(id) && !ganadoresSet.has(id);
        })
    );

    const colorInicio = '#6FF525'; // azul claro
    const colorFin = '#F5D025';    // azul fuerte (bootstrap primary)

    colaboradores = colaboradoresFiltrados.map((colaborador, index) => {

        const factor = colaboradoresFiltrados.length > 1
            ? index / (colaboradoresFiltrados.length - 1)
            : 0;

        return {
            fillStyle: colorDegradado(colorInicio, colorFin, factor),
            text: colaborador.colaboradorNOMBRECOMPLETO.substring(0, 15),
            key: colaborador.colaboradorIDENTIFICACION,
            foto: colaborador.colaboradorFOTO
        };
    });


    // Crear la ruleta centrada
    theWheel = new Winwheel({
        numSegments: colaboradores.length,
        outerRadius: canvas.height / 2,
        centerX: canvas.width / 2,
        centerY: canvas.height / 2,
        textFontSize: 12,
        textAlignment: 'outer',
        segments: colaboradores,
        animation: {
            type: 'spinToStop',
            duration: 5,
            spins: 8,
            callbackFinished: alertPrize,
            'callbackSound': playSound,
        }
    });

    // Evento del botón
    document.getElementById("btnGirar").onclick = async function () {
        if (premioGiro > premios.length) {
            Swal.fire({
                icon: 'info',
                title: 'No hay más premios disponibles',
                text: 'Todos los premios han sido asignados.',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        await mostrarCuentaRegresiva();

        theWheel.animation.duration = 5 + (Math.random() * (4));
        theWheel.stopAnimation(false);
        theWheel.rotationAngle = 0;
        theWheel.draw();
        theWheel.startAnimation();
    };
});

function alertPrize(indicatedSegment) {
    // 🔹 Buscar el premio según el número de giro actual
    const premio = premios.find(p => p.premioGiro == premioGiro) || null;
    let nombreCompleto = colaboradoresTotales.find(c => c.colaboradorIDENTIFICACION === indicatedSegment.key)?.colaboradorNOMBRECOMPLETO;

    const ganador = {
        nombre: nombreCompleto,
        identificacion: indicatedSegment.key,
        foto: indicatedSegment.foto,
        premioNombre: premio.premioNombre,
        premioGiro: premio.premioGiro,
        giroNumero: premioGiro,
        fecha: new Date().toISOString()
    };

    // 🔹 Leer ganadores previos desde localStorage
    const ganadoresPrevios = JSON.parse(localStorage.getItem('ganadoresRuleta') || '[]');

    // 🔹 Agregar nuevo ganador
    ganadoresPrevios.push(ganador);

    // 🔹 Guardar de nuevo la lista
    localStorage.setItem('ganadoresRuleta', JSON.stringify(ganadoresPrevios));

    // 🔹 Incrementar el número de premio para el siguiente giro
    premioGiro++;
    localStorage.setItem('premioGiro', String(premioGiro));

    // 🔹 Construir HTML del modal del ganador
    let html = `
    <div style="text-align:center;">
        <h2 style="margin-bottom:8px;">${nombreCompleto}</h2>

        <div style="font-size:1.1rem; margin-bottom:6px; color:#6c757d;">
            🎁 Premio ganado
        </div>

        <div style="
            font-size:1.3rem;
            font-weight:700;
            color:#198754;
            margin-bottom:8px;
        ">
            ${premio ? premio.premioNombre : 'Premio sorpresa'}
        </div>

        <div style="font-size:0.9rem; color:#6c757d;">
            Giro #${premioGiro - 1}
        </div>
    </div>
`;

    playWin();
    
    Swal.fire({
        title: '🎉 ¡Tenemos ganador!',
        html: html,
        imageUrl: indicatedSegment.foto || undefined,
        imageWidth: 180,
        imageHeight: 180,
        imageAlt: 'Foto del ganador',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false
    }).then((result) => {

        if (!result.isConfirmed) return;

        // 🔹 Quitar al ganador del array de colaboradores
        colaboradores = mezclarArray(
            colaboradores.filter(c => c.key !== indicatedSegment.key)
        );


        // 🔹 Recrear la ruleta sin el ganador
        theWheel = new Winwheel({
            numSegments: colaboradores.length,
            outerRadius: canvas.height / 2,
            centerX: canvas.width / 2,
            centerY: canvas.height / 2,
            textFontSize: 12,
            textAlignment: 'outer',
            segments: colaboradores,
            animation: {
                type: 'spinToStop',
                duration: 5,
                spins: 8,
                callbackFinished: alertPrize,
                'callbackSound': playSound,
            }
        });

    });


}

async function cargarInformacion(file) {
    const response = await fetch(file);
    return response.json();
}
// Función para mostrar el conteo regresivo 3,2,1
function mostrarCuentaRegresiva() {
    return new Promise((resolve) => {

        const premio = premios.find(p => p.premioGiro === premioGiro);
        let s = 5;

        Swal.fire({
            width: 420,
            padding: "1.5rem",
            showConfirmButton: false,
            allowOutsideClick: false,
            title: "", // <-- sin título arriba

            iconHtml: '<i class="bi bi-gift-fill" style="font-size:3.2rem; color:#0d6efd;"></i>',
            customClass: { icon: 'no-border' },

            html: `
                <div style="font-size:1.4rem; font-weight:600; margin-bottom:6px;">
                    🎉 Jugaremos por:
                </div>

                <div style="font-size:1.3rem; font-weight:bold; color:#0d6efd; margin-bottom:12px;">
                    ${premio ? premio.premioNombre : 'Premio sorpresa'}
                </div>

                <div id="contadorPremio" style="font-size:4rem; font-weight:700;">
                    ${s}
                </div>
            `
        });

        const t = setInterval(() => {
            s--;

            const contadorEl = document.getElementById('contadorPremio');
            if (contadorEl) {
                contadorEl.textContent = s;
            }

            if (s === 0) {
                clearInterval(t);
                Swal.close();
                resolve();
            }
        }, 1000);
    });
}


// 🎨 Genera un color degradado entre dos colores hex
function colorDegradado(hexInicio, hexFin, factor) {
    const h2r = hex => hex.match(/\w\w/g).map(x => parseInt(x, 16));
    const r2h = rgb => '#' + rgb.map(x => x.toString(16).padStart(2, '0')).join('');

    const c1 = h2r(hexInicio);
    const c2 = h2r(hexFin);

    const rgb = c1.map((v, i) =>
        Math.round(v + factor * (c2[i] - v))
    );

    return r2h(rgb);
}


// 🔀 Mezcla aleatoria (Fisher-Yates)
function mezclarArray(array) {
    const arr = [...array]; // copia para no mutar el original
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}


let audioWin = new Audio('win.mp3');  // Create audio object and load tick.mp3 file.
function playWin() {
    audioWin.pause();
    audioWin.currentTime = 0;
    audioWin.play();
}

let audio = new Audio('tick.mp3');  // Create audio object and load tick.mp3 file.
function playSound() {
    // Stop and rewind the sound if it already happens to be playing.
    audio.pause();
    audio.currentTime = 0;

    // Play the sound.
    audio.play();
}
