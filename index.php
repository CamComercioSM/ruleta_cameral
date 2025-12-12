<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Ruleta Cameral</title>

    <!-- Estilos base -->
    <link rel="stylesheet"
        href="javascript-winwheel-2.8.0/javascript-winwheel-2.8.0/examples/basic_code_wheel/main.css"
        type="text/css" />
    <link rel="stylesheet" href="/lucesnavidad.css">
    <!-- Librerías -->
    <script src="javascript-winwheel-2.8.0/javascript-winwheel-2.8.0/Winwheel.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.20.3/TweenMax.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <!-- Brandeo / UI -->
    <style>
        body {
            margin: 0;
            font-family: 'Segoe UI', Arial, sans-serif;
            background: linear-gradient(135deg, #003366, #0055a5);
            color: #ffffff;
        }

        .layout {
            display: flex;
            min-height: 100vh;
        }

        /* Contenido principal */
        .main-content {
            flex: 1;
            padding-right: 35%;
            /* espacio para el sidebar */
        }

        /* Sidebar */
        .sidebar-navidad {
            width: 35%;
            position: fixed;
            top: 0;
            right: 0;
            height: 100vh;
            background: transparent;
            border: none;
            z-index: -1;
        }



        .sidebar-navidad iframe {
            width: 100%;
            height: 100%;
            border: none;
        }

        /* Responsive */
        @media (max-width: 1200px) {
            .sidebar-navidad {
                display: none;
            }

            .main-content {
                padding-right: 0;
            }
        }


        .app-container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        .brand-header {
            text-align: center;
            margin-bottom: 20px;
        }

        .brand-header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: 700;
            letter-spacing: 1px;
        }

        .brand-header p {
            margin: 6px 0 0;
            font-size: 16px;
            opacity: 0.9;
        }


        .the_wheel {
            background: #ffffff;
            border-radius: 20px;
            padding: 15px;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.35);
        }

        .controls {
            margin-top: 25px;
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
            justify-content: center;
        }

        button {
            border: none;
            padding: 14px 28px;
            font-size: 16px;
            font-weight: 600;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
        }

        #btnGirar {
            background: #ffcc00;
            color: #003366;
        }

        #btnGirar:hover {
            background: #ffdb4d;
            transform: scale(1.05);
        }

        .btn-ganadores {
            background: #ffffff;
            color: #003366;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 50px;
        }

        .btn-ganadores:hover {
            background: #e6e6e6;
            transform: scale(1.05);
        }

        .footer-note {
            margin-top: 25px;
            font-size: 13px;
            opacity: 0.75;
            text-align: center;
        }

        .wheel-wrapper {
            position: relative;
            display: inline-block;
        }

        .wheel-pointer {
            position: absolute;
            top: -50px;
            left: 50%;
            transform: translateX(-50%);
            width: 150px;
            /* Ajusta al tamaño de tu PNG */
            pointer-events: none;
            /* Para que no bloquee clics en el canvas */
        }
    </style>
</head>

<body>
    <ul class="lightrope">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
    </ul>

    <div class="layout">

        <!-- CONTENIDO PRINCIPAL -->
        <div class="main-content">

            <div class="app-container">

                <!-- Branding -->
                <div class="brand-header">
                    <h1>🎡 Ruleta Cameral</h1>
                    <p>Participa, gira y gana premios especiales</p>
                </div>

                <!-- Ruleta -->
                <div class="the_wheel">
                    <div class="wheel-wrapper">
                        <img src="image.png" alt="Puntero ruleta" class="wheel-pointer">
                        <canvas id="canvas" width="1200" height="850">
                            Tu navegador no soporta canvas.
                        </canvas>
                    </div>
                </div>

                <!-- Controles -->
                <div class="controls">
                    <button id="btnGirar">🎯 Girar ruleta</button>

                    <a href="ganadores.php" class="btn-ganadores">
                        🏆 Ver ganadores
                    </a>
                </div>

                <!-- Nota -->
                <div class="footer-note">
                    Cámara de Comercio · Evento Especial
                </div>

            </div>

        </div>

        <!-- SIDEBAR NAVIDAD -->
        <aside class="sidebar-navidad">
            <iframe
                src="arbolito.ani.html"
                title="Animación Navidad"
                loading="lazy"
                allowtransparency="true">
            </iframe>
        </aside>

    </div>

    <!-- Lógica -->
    <script src="ruleta.js"></script>

</body>


</html>