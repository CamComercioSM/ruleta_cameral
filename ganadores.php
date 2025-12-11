<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Ganadores del sorteo</title>

    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body class="bg-light">

    <div class="container my-5">
        <div class="text-center mb-4">
            <h1 class="mb-1">Ganadores del sorteo</h1>
            <p class="text-muted">Listado de la información almacenada en el navegador.</p>
        </div>

        <!-- Fila 1: Ganadores (full width) -->
        <div class="row mb-4">
            <div class="col-12" id="contenedorGanadores"></div>
        </div>

        <!-- Fila 2: Colaboradores / Participantes (izq) y Premios (der) -->
        <div class="row g-4">
            <div class="col-md-6" id="contenedorColaboradores"></div>
            <div class="col-md-6" id="contenedorPremios"></div>
        </div>
    </div>

    <script src="ganadores.js"></script>

    <!-- Bootstrap JS (opcional) -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

</body>

</html>