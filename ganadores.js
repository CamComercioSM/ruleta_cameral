document.addEventListener('DOMContentLoaded', function () {
    mostrarGanadores();
    mostrarColaboradores();
    mostrarPremios();
});

// 1) GANADORES
function mostrarGanadores() {
    const contenedor = document.getElementById('contenedorGanadores');

    const datos = localStorage.getItem('ganadoresRuleta');
    let ganadores = [];

    try {
        ganadores = datos ? JSON.parse(datos) : [];
    } catch (e) {
        console.error('Error al parsear ganadoresRuleta:', e);
        ganadores = [];
    }

    if (!ganadores.length) {
        contenedor.innerHTML = `
                    <div class="alert alert-info text-center" role="alert">
                        <strong>No hay ganadores registrados todavía.</strong>
                    </div>
                `;
        return;
    }

    let html = `
                <div class="card shadow-sm">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0">Ganadores del sorteo</h5>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-striped table-hover align-middle mb-0">
                                <thead class="table-light">
                                    <tr>
                                        <th scope="col" class="text-center">#</th>
                                        <th scope="col">Foto</th>
                                        <th scope="col">Nombre</th>
                                        <th scope="col">Identificación</th>
                                        <th scope="col">Premio</th>
                                        <th scope="col" class="text-center">Giro</th>
                                    </tr>
                                </thead>
                                <tbody>
            `;

    ganadores.forEach((g, index) => {
        html += `
                    <tr>
                        <td class="text-center">${index + 1}</td>
                        <td>
                            ${g.foto ? `<img src="${g.foto}" alt="Foto" class="img-thumbnail rounded" style="max-width:60px; height:auto;">` : ''}
                        </td>
                        <td>${g.nombre || ''}</td>
                        <td>${g.identificacion || ''}</td>
                        <td>${g.premioNombre || ''}</td>
                        <td class="text-center">${g.giroNumero || ''}</td>
                    </tr>
                `;
    });

    html += `
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;

    contenedor.innerHTML = html;
}
// 2) COLABORADORES / PARTICIPANTES
async function mostrarColaboradores() {
    const contenedor = document.getElementById('contenedorColaboradores');
    const datosGanadores = localStorage.getItem('ganadoresRuleta');
    const ganadores = datosGanadores ? JSON.parse(datosGanadores) : [];
    const ganadoresIDs = new Set(ganadores.map(g => g.identificacion));


    const datosNoAsistencia = localStorage.getItem('noAsistencia');
    const noAsistencia = datosNoAsistencia ? JSON.parse(datosNoAsistencia) : [];
    const noAsistenciaIDs = new Set(noAsistencia);

    // Cargar desde archivo JSON
    const colaboradores = await cargarInformacion('colaboradores_20251211.json');

    if (!colaboradores.length) {
        contenedor.innerHTML = `
            <div class="card shadow-sm h-100">
                <div class="card-header bg-secondary text-white">
                    <h5 class="mb-0">Participantes / Colaboradores</h5>
                </div>
                <div class="card-body d-flex align-items-center justify-content-center">
                    <p class="text-muted mb-0 text-center">
                        No hay participantes registrados todavía.
                    </p>
                </div>
            </div>
        `;
        return;
    }

    let html = `
        <div class="card shadow-sm h-100">
            <div class="card-header bg-secondary text-white">
                <h5 class="mb-0">Participantes / Colaboradores</h5>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-sm table-hover align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th class="text-center">#</th>
                                <th>Nombre</th>
                                <th>Identificación</th>
                                <th>Asistió</th>
                            </tr>
                        </thead>
                        <tbody>
    `;
    colaboradores.forEach((c, index) => {
        const id = c.colaboradorIDENTIFICACION;
        const esGanador = ganadoresIDs.has(id);
        const marcadoNoAsistio = noAsistenciaIDs.has(id);
        html += `
            <tr class="${esGanador ? 'table-success' : ''}">
                <td class="text-center">${index + 1}</td>
                <td>${c.colaboradorNOMBRECOMPLETO || '-'}</td>
                <td>${id || '-'}</td>
                <td class="text-center">
                    <input 
                        type="checkbox" 
                        class="chk-noasistencia"
                        data-id="${id}"
                        ${marcadoNoAsistio ? 'checked' : ''}
                    >
                </td>
            </tr>
        `;
    });

    html += `
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    contenedor.innerHTML = html;
    document.querySelectorAll('.chk-noasistencia').forEach(chk => {
        chk.addEventListener('change', function () {
            const id = this.dataset.id;
            let noAsistencia = localStorage.getItem('noAsistencia');
            noAsistencia = noAsistencia ? JSON.parse(noAsistencia) : [];

            if (this.checked) {
                // Agregar si no existe
                if (!noAsistencia.includes(id)) {
                    noAsistencia.push(id);
                }
            } else {
                // Eliminar
                noAsistencia = noAsistencia.filter(x => x !== id);
            }

            localStorage.setItem('noAsistencia', JSON.stringify(noAsistencia));
        });
    });
}
// 3) PREMIOS
async function mostrarPremios() {
    const contenedor = document.getElementById('contenedorPremios');
    const proximoGiro = parseInt(localStorage.getItem('premioGiro') || '1', 10);


    // Cargar el JSON de premios
    const res = await cargarInformacion('premios.json');

    // Aseguramos que sea un array
    const premios = Array.isArray(res) ? res : [];

    if (!premios.length) {
        contenedor.innerHTML = `
            <div class="card shadow-sm h-100">
                <div class="card-header bg-success text-white">
                    <h5 class="mb-0">Premios</h5>
                </div>
                <div class="card-body d-flex align-items-center justify-content-center">
                    <p class="text-muted mb-0 text-center">
                        No hay premios registrados todavía.
                    </p>
                </div>
            </div>
        `;
        return;
    }

    let html = `
        <div class="card shadow-sm h-100">
            <div class="card-header bg-success text-white">
                <h5 class="mb-0">Premios</h5>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-sm table-hover align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th class="text-center">#</th>
                                <th>Premio</th>
                                <th>Giro</th>
                            </tr>
                        </thead>
                        <tbody>
    `;

    premios.forEach((p, index) => {

        const giro = parseInt(p.premioGiro, 10);

        let rowClass = '';
        let badge = '';

        if (giro < proximoGiro) {
            rowClass = 'table-secondary';
            badge = '<span class="badge bg-secondary">Jugado</span>';
        }
        else if (giro === proximoGiro) {
            rowClass = 'table-warning fw-bold';
            badge = '<span class="badge bg-warning text-dark">🎯 Próximo</span>';
        }

        html += `
        <tr class="${rowClass}">
            <td class="text-center">${index + 1}</td>
            <td>
                ${p.premioNombre || ''}
                ${badge ? `<div class="mt-1">${badge}</div>` : ''}
            </td>
            <td class="text-center">${p.premioGiro || ''}</td>
        </tr>
    `;
    });

    html += `
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    contenedor.innerHTML = html;
}

async function cargarInformacion(file) {
    const response = await fetch(file);
    return response.json();
}

document.addEventListener('DOMContentLoaded', () => {

    const btnBorrar = document.getElementById('btnBorrarTodo');
    if (!btnBorrar) return;

    btnBorrar.addEventListener('click', async () => {

        const result = await Swal.fire({
            title: '⚠️ ¿Estás seguro?',
            html: `
                <p>Esta acción eliminará <strong>todos los datos guardados</strong>:</p>
                <ul style="text-align:left; margin-bottom:0;">
                    <li>🏆 Ganadores (ganadoresRuleta)</li>
                    <li>🎁 Premios jugados (premiosJugados / premiosJugadosRuleta)</li>
                    <li>👥 Asistencias (noAsistencia)</li>
                </ul>
                <p class="text-danger mt-3"><strong>Esta acción no se puede deshacer.</strong></p>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, borrar todo',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        // 🔥 BORRADO DE DATOS (según tus llaves reales)
        localStorage.removeItem('ganadoresRuleta');
        localStorage.removeItem('noAsistencia');

        // premios jugados (dejamos ambas por compatibilidad)
        localStorage.removeItem('premiosJugados');
        localStorage.removeItem('premioGiro');
        localStorage.removeItem('premiosJugadosRuleta');

        await Swal.fire({
            icon: 'success',
            title: 'Datos eliminados',
            text: 'La información fue borrada correctamente.',
            timer: 1600,
            showConfirmButton: false
        });

        location.reload();
    });

});
