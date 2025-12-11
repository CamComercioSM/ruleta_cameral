let canvas = document.getElementById("canvas");
let premioGiro = localStorage.getItem('premioGiro') || "1";
let premios = [];
let colaboradores = [];
let theWheel = null;

document.addEventListener("readystatechange", async () => {
    const res = await cargarInformacion('colaboradores_20251211.json');
    premios = await cargarInformacion('premios.json');

    const datosNoAsistencia = localStorage.getItem('noAsistencia');
    const noAsistencia = datosNoAsistencia ? JSON.parse(datosNoAsistencia) : [];
    const noAsistenciaSet = new Set(noAsistencia);  

    const datosGanadores = localStorage.getItem('ganadoresRuleta');
    const ganadoresPrevios = datosGanadores ? JSON.parse(datosGanadores) : [];
    const ganadoresSet = new Set(ganadoresPrevios.map(g => g.identificacion));

    const colaboradoresFiltrados = res.filter(colaborador => {
        const id = colaborador.colaboradorIDENTIFICACION;
        return !noAsistenciaSet.has(id) && !ganadoresSet.has(id);
    });

    colaboradores = colaboradoresFiltrados.map(colaborador => ({
        fillStyle: '#7de6ef',
        text: colaborador.colaboradorNOMBRECOMPLETO,
        key: colaborador.colaboradorIDENTIFICACION,
        foto: colaborador.colaboradorFOTO
    }));


    // Crear la ruleta centrada
    theWheel = new Winwheel({
        numSegments: colaboradores.length,
        outerRadius: canvas.height / 2,
        centerX: canvas.width / 2,
        centerY: canvas.height / 2,
        textFontSize: 9,
        segments: colaboradores,
        animation: {
            type: 'spinToStop',
            duration: 5,
            spins: 8,
            callbackFinished: alertPrize
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

        theWheel.animation.duration = Math.floor(Math.random() * (7 - 5 + 1)) + 5;
        theWheel.stopAnimation(false);
        theWheel.rotationAngle = 0;
        theWheel.draw();
        theWheel.startAnimation();
    };
});

function alertPrize(indicatedSegment) {
    // 🔹 Buscar el premio según el número de giro actual
    const premio = premios.find(p => p.premioGiro == premioGiro) || null;
    const ganador = {
        nombre: indicatedSegment.text,
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

    // 🔹 Quitar al ganador del array de colaboradores
    colaboradores = colaboradores.filter(c => c.key !== indicatedSegment.key);

    theWheel = new Winwheel({
        numSegments: colaboradores.length,
        outerRadius: canvas.height / 2,
        centerX: canvas.width / 2,
        centerY: canvas.height / 2,
        textFontSize: 9,
        segments: colaboradores,
        animation: {
            type: 'spinToStop',
            duration: 5,
            spins: 8,
            callbackFinished: alertPrize
        }
    });
    let html = `<h2 style="margin-bottom:10px;">${indicatedSegment.text}</h2>`;

    Swal.fire({
        title: '🎉 Ganador',
        html: html,
        imageUrl: indicatedSegment.foto,
        imageWidth: 180,
        imageHeight: 180,
        imageAlt: 'Foto del ganador',
        confirmButtonText: 'Aceptar'
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
        let s = 3;

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


