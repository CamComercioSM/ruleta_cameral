<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Ganadores del sorteo</title>

    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- SweetAlert -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>

<body class="bg-light">

    <div class="container my-5">

        <div class="text-center mb-4">
            <h1 class="mb-1">Ganadores del sorteo</h1>
            <p class="text-muted">Listado de la información almacenada en el navegador.</p>
        </div>

        <div class="mb-3 text-start">
            <a href="index.php" class="btn btn-success">
                🔄 Regresar a ruleta
            </a>
        </div>
        <div class="row mb-4">
            <div class="col-12" id="contenedorGanadores"></div>
        </div>

        <!-- Fila 2: Asistencias / Premios -->
        <div class="row g-4">
            <div class="col-md-6" id="contenedorColaboradores"></div>
            <div class="col-md-6" id="contenedorPremios"></div>
        </div>
    </div>

    <div class="container my-5">
        <div class="text-center mb-4">
            <div class="mt-3">
                <button id="btnBorrarTodo" class="btn btn-danger btn-sm">
                    🗑️ Borrar todos los datos
                </button>
            </div>
        </div>
    </div>


    <script src="ganadores.js"></script>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

</body>

</html>