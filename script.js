/* ==========================================================================
   HERO: vídeo de fondo
   ========================================================================== */
(function iniciarVideoFondoHero() {
    const video = document.querySelector('.hero-full__video-wrap video');
    if (!video) return;

    // En móviles, el navegador pausa el vídeo al pasar la pestaña a segundo plano
    // (cambio de app, bloqueo de pantalla); lo reanudamos al volver.
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && video.paused) {
            video.play();
        }
    });
})();

/* ==========================================================================
   NAVBAR: cambia de estilo al hacer scroll
   ========================================================================== */
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    if (window.scrollY > 60) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

/* ==========================================================================
   HUD DEL HERO: altímetro y velocímetro decorativos en bucle
   ========================================================================== */
(function iniciarHUD() {
    const elAltitud = document.getElementById('hud-altitud');
    const elVelocidad = document.getElementById('hud-velocidad');
    if (!elAltitud || !elVelocidad) return;

    const ALTURA_INICIAL = 4000;
    let altitud = ALTURA_INICIAL;

    setInterval(() => {
        altitud -= 40;
        if (altitud <= 0) altitud = ALTURA_INICIAL;

        // velocidad simulada de caída libre: crece hasta terminal (~200 km/h) y luego se frena con el paracaídas
        const progreso = 1 - (altitud / ALTURA_INICIAL);
        let velocidad;
        if (progreso < 0.75) {
            velocidad = Math.round(200 * (progreso / 0.75));
        } else {
            velocidad = Math.round(200 - (150 * ((progreso - 0.75) / 0.25)));
        }

        elAltitud.textContent = altitud + ' m';
        elVelocidad.textContent = velocidad + ' km/h';
    }, 90);
})();
/* ==========================================================================
   ANIMACIÓN DE APARICIÓN AL HACER SCROLL (.reveal)
   ========================================================================== */
(function iniciarReveal() {
    const elementos = document.querySelectorAll('.reveal');
    if (!elementos.length) return;

    const observer = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('is-visible');
                observer.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.15 });

    elementos.forEach((el) => observer.observe(el));
})();
/* ==========================================================================
   CONTADOR ANIMADO DE ESTADÍSTICAS
   ========================================================================== */
(function iniciarContadores() {
    const numeros = document.querySelectorAll('.stat-item__numero');
    if (!numeros.length) return;

    const animarNumero = (el) => {
        const destino = parseFloat(el.dataset.target);
        const decimales = parseInt(el.dataset.decimales || '0');
        const sufijo = el.dataset.sufijo || '';
        const duracion = 1600;
        const inicio = performance.now();

        function paso(ahora) {
            const progreso = Math.min((ahora - inicio) / duracion, 1);
            const facilitado = 1 - Math.pow(1 - progreso, 3);
            const valorActual = destino * facilitado;
            el.textContent = valorActual.toFixed(decimales).replace('.', decimales ? ',' : '.') + sufijo;
            if (progreso < 1) requestAnimationFrame(paso);
        }
        requestAnimationFrame(paso);
    };

    const observer = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                animarNumero(entrada.target);
                observer.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.4 });

    numeros.forEach((el) => observer.observe(el));
})();
/* ==========================================================================
   FUNCIÓN PARA GENERAR Y DESCARGAR EL PDF DEL CV (heredada)
   ========================================================================== */
function generarPDF() {
    const element = document.getElementById('cv-content');
    const opciones = {
        margin: 10,
        filename: 'CV_Antonio_GRANADA.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opciones).from(element).save();
}

/* ==========================================================================
   MINIJUEGO: paracaídas cayendo
   ========================================================================== */
/* ==========================================================================
   MINIJUEGO: paracaídas cayendo (confinados a una franja lateral fija)
   ========================================================================== */
let puntos = 0;

function obtenerZonaJuego() {
    let zona = document.getElementById('zona-juego');
    if (!zona) {
        zona = document.createElement('div');
        zona.id = 'zona-juego';
        zona.className = 'zona-juego';
        document.body.appendChild(zona);
    }
    return zona;
}

function crearParacaidas() {
    const zona = obtenerZonaJuego();

    const h = document.createElement('div');
   h.innerHTML = '<img src="imagenes/paracaidas-sticker.svg" alt="Paracaídas">';
    h.className = 'paracaidas-juego';
  h.style.left = Math.random() * 92 + '%';

    h.onclick = (e) => {
        e.stopPropagation();
        puntos++;

        if (puntos % 5 === 0) {
            mostrarRecompensa();
        }

        const scoreEl = document.getElementById('score');
        if (scoreEl) scoreEl.innerText = puntos;

        const plusOne = document.createElement('div');
        plusOne.innerText = '+1';
        plusOne.style.position = 'absolute';
        plusOne.style.left = h.style.left;
        plusOne.style.top = h.style.top;
        plusOne.style.color = '#ffeb3b';
        plusOne.style.fontSize = '26px';
        plusOne.style.zIndex = '99999';
        plusOne.style.pointerEvents = 'none';
        zona.appendChild(plusOne);
        setTimeout(() => plusOne.remove(), 500);

        h.remove();
    };

    zona.appendChild(h);
    setTimeout(() => h.style.top = '110%', 50);
    setTimeout(() => h.remove(), 12000);
}

setInterval(crearParacaidas, 2800);

/* ==========================================================================
   LOGIN: verificación de acceso al vídeo privado
   ========================================================================== */
function verificarAcceso() {
    const contenedor = document.createElement('div');
    contenedor.style.textAlign = 'left';
    contenedor.style.width = '85%';
    contenedor.style.margin = '0 auto';
    contenedor.style.fontFamily = 'sans-serif';

    const aviso = document.createElement('p');
    aviso.textContent = 'Introduce tu DNI y la contraseña que te proporcionamos por SMS o correo electrónico para desbloquear tu vídeo.';
    aviso.style.fontSize = '13px';
    aviso.style.color = '#555';
    aviso.style.margin = '0 0 12px';
    aviso.style.lineHeight = '1.4';
    contenedor.appendChild(aviso);

    const inputDni = document.createElement('input');
    inputDni.id = 'swal-login-dni';
    inputDni.placeholder = 'Introduce tu DNI';
    inputDni.className = 'swal2-input';
    inputDni.style.margin = '8px 0';
    inputDni.style.width = '100%';
    inputDni.style.height = '36px';
    inputDni.style.fontSize = '14px';

    const inputPass = document.createElement('input');
    inputPass.id = 'swal-login-pass';
    inputPass.type = 'password';
    inputPass.placeholder = 'Contraseña';
    inputPass.className = 'swal2-input';
    inputPass.style.margin = '8px 0';
    inputPass.style.width = '100%';
    inputPass.style.height = '36px';
    inputPass.style.fontSize = '14px';

    contenedor.appendChild(inputDni);
    contenedor.appendChild(inputPass);

    Swal.fire({
        title: 'Acceso Privado',
        width: '340px',
        position: 'top-end',
        html: contenedor,
        focusConfirm: false,
        confirmButtonText: 'Validar',
        confirmButtonColor: '#1b5e20',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        didOpen: () => {
            const fileInput = document.querySelector('.swal2-file');
            if (fileInput) fileInput.setAttribute('style', 'display: none !important;');
        },
        preConfirm: () => {
            const dni = inputDni.value.trim();
            const pass = inputPass.value.trim();
            if (!dni || !pass) {
                Swal.showValidationMessage('Por favor, rellena ambos campos.');
                return false;
            }
            return { dni, pass };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const { dni, pass } = result.value;
            const loginForm = document.getElementById('login-form');
            const videoDiv = document.getElementById('video-container');
            const btn = document.getElementById('btn-login');

            if (dni === "75932249A" && pass === "123") {
                if (btn) btn.style.backgroundColor = "#4caf50";
                loginForm.style.display = "none";
                videoDiv.style.display = "block";

                Swal.fire({
                    title: '¡Acceso Autorizado!',
                    text: 'Tu video se ha desbloqueado.',
                    icon: 'success',
                    position: 'top-end',
                    width: '340px',
                    timer: 2000,
                    showConfirmButton: false,
                    didOpen: () => {
                        const fileInput = document.querySelector('.swal2-file');
                        if (fileInput) fileInput.setAttribute('style', 'display: none !important;');
                    }
                });
            } else {
                if (btn) btn.style.backgroundColor = "#f44336";
                Swal.fire({
                    title: 'Acceso Denegado',
                    text: 'DNI o contraseña incorrectos.',
                    icon: 'error',
                    position: 'top-end',
                    width: '340px',
                    confirmButtonColor: '#d33',
                    didOpen: () => {
                        const fileInput = document.querySelector('.swal2-file');
                        if (fileInput) fileInput.setAttribute('style', 'display: none !important;');
                    }
                });
            }
        }
    });
}

/* ==========================================================================
   RESERVAS: formulario de datos -> pago -> emisión de PDF
   ========================================================================== */
function abrirFormularioReserva(nombrePack, precioPack) {
    Swal.fire({
        title: '<img src="imagenes/paracaidas-sticker.svg" alt="" style="width:32px; height:auto; vertical-align:middle; margin-right:8px;"> Datos del pasajero',
        html:
            `<div style="text-align:left; width:100%; margin:0 auto; font-family:'Poppins',sans-serif;">
                <div style="background:linear-gradient(100deg,#1CA7EC,#FF6A2B); color:#fff; border-radius:12px; padding:10px 16px; margin-bottom:18px; font-size:13px; font-weight:600;">
                    ${nombrePack} · ${precioPack}
                </div>

                <label style="font-size:12px; font-weight:700; color:#0B4F73; text-transform:uppercase; letter-spacing:0.4px;">Nombre</label>
                <input id="swal-nombre" placeholder="Ej. Juan" style="margin:4px 0 14px; width:100%; height:42px; font-size:14px; border-radius:10px; border:2px solid #E4E9F0; padding:0 12px; box-sizing:border-box;">

                <label style="font-size:12px; font-weight:700; color:#0B4F73; text-transform:uppercase; letter-spacing:0.4px;">Apellidos</label>
                <input id="swal-apellidos" placeholder="Ej. Pérez Gómez" style="margin:4px 0 14px; width:100%; height:42px; font-size:14px; border-radius:10px; border:2px solid #E4E9F0; padding:0 12px; box-sizing:border-box;">

                <label style="font-size:12px; font-weight:700; color:#0B4F73; text-transform:uppercase; letter-spacing:0.4px;">Edad</label>
                <input id="swal-edad" type="number" placeholder="Ej. 25" style="margin:4px 0 14px; width:100%; height:42px; font-size:14px; border-radius:10px; border:2px solid #E4E9F0; padding:0 12px; box-sizing:border-box;">

                <label style="font-size:12px; font-weight:700; color:#0B4F73; text-transform:uppercase; letter-spacing:0.4px;">DNI / Pasaporte</label>
                <input id="swal-dni" placeholder="Ej. 12345678X" style="margin:4px 0 14px; width:100%; height:42px; font-size:14px; border-radius:10px; border:2px solid #E4E9F0; padding:0 12px; box-sizing:border-box;">

                <label style="font-size:12px; font-weight:700; color:#0B4F73; text-transform:uppercase; letter-spacing:0.4px;">Teléfono móvil</label>
                <input id="swal-telefono" type="tel" placeholder="Ej. 612 345 678" style="margin:4px 0 14px; width:100%; height:42px; font-size:14px; border-radius:10px; border:2px solid #E4E9F0; padding:0 12px; box-sizing:border-box;">

                <label style="font-size:12px; font-weight:700; color:#0B4F73; text-transform:uppercase; letter-spacing:0.4px;">Correo electrónico</label>
                <input id="swal-email" type="email" placeholder="Ej. juan@ejemplo.com" style="margin:4px 0 14px; width:100%; height:42px; font-size:14px; border-radius:10px; border:2px solid #E4E9F0; padding:0 12px; box-sizing:border-box;">

                <div style="background:#FFF4EC; border:1.5px dashed #FF6A2B; border-radius:12px; padding:14px; margin-top:6px;">
                    <p style="margin:0 0 8px; font-size:12.5px; color:#A34B1E; font-weight:600;">📎 Adjunta una foto o escaneo de tu DNI/pasaporte (obligatorio para validar tu identidad el día del salto)</p>
                    <input id="swal-dni-archivo" type="file" accept="image/*,.pdf" style="width:100%; font-size:13px;">
                </div>
            </div>`,
        focusConfirm: false,
        confirmButtonText: 'Continuar al pago',
        confirmButtonColor: '#1CA7EC',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#888',
        customClass: { popup: 'swal-moderno' },
        preConfirm: () => {
            const nombre = document.getElementById('swal-nombre').value.trim();
            const apellidos = document.getElementById('swal-apellidos').value.trim();
            const edad = document.getElementById('swal-edad').value.trim();
            const dni = document.getElementById('swal-dni').value.trim();
            const telefono = document.getElementById('swal-telefono').value.trim();
            const email = document.getElementById('swal-email').value.trim();
            const archivo = document.getElementById('swal-dni-archivo').files.length;

            if (!nombre || !apellidos || !edad || !dni || !telefono || !email) {
                Swal.showValidationMessage('Rellena todos los campos obligatorios.');
                return false;
            }
            if (isNaN(edad) || parseInt(edad) <= 0) {
                Swal.showValidationMessage('Introduce una edad válida.');
                return false;
            }
            const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            if (!emailValido) {
                Swal.showValidationMessage('Introduce un correo electrónico válido.');
                return false;
            }
            if (!archivo) {
                Swal.showValidationMessage('Adjunta una foto o escaneo de tu DNI/pasaporte.');
                return false;
            }
            return { nombre, apellidos, edad, dni, telefono, email };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            abrirPasarelaPago(nombrePack, precioPack, result.value);
        }
    });
}

function abrirPasarelaPago(nombrePack, precioPack, datosPersonales) {
    Swal.fire({
        title: 'Pasarela de Pago Seguro',
        text: `Total a pagar: ${precioPack}`,
        html:
            '<div style="text-align: left; width: 85%; margin: 0 auto; font-family: sans-serif;">' +
                '<div style="text-align: center; margin-bottom: 12px;"><span style="background: #e8f5e9; color: #2e7d32; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold;">🔒 Transacción Encriptada SSL</span></div>' +

                '<label style="font-size: 13px; font-weight: bold; color: #333;">Titular de la Tarjeta:</label>' +
                '<input id="pay-titular" class="swal2-input" placeholder="Ej. Juan Pérez Gómez" style="margin: 4px 0 12px 0; width: 100%; height: 38px; font-size: 14px;">' +

                '<label style="font-size: 13px; font-weight: bold; color: #333;">Número de Tarjeta:</label>' +
                '<input id="pay-tarjeta" type="text" maxlength="16" class="swal2-input" placeholder="4500 0000 0000 0000" style="margin: 4px 0 12px 0; width: 100%; height: 38px; font-size: 14px;">' +

                '<div style="display: flex; gap: 10px;">' +
                    '<div style="flex: 1;">' +
                        '<label style="font-size: 13px; font-weight: bold; color: #333;">Caducidad:</label>' +
                        '<input id="pay-caducidad" type="text" maxlength="5" class="swal2-input" placeholder="MM/AA" style="margin: 4px 0 0 0; width: 100%; height: 38px; font-size: 14px;">' +
                    '</div>' +
                    '<div style="flex: 1;">' +
                        '<label style="font-size: 13px; font-weight: bold; color: #333;">CVV:</label>' +
                        '<input id="pay-cvv" type="text" maxlength="3" class="swal2-input" placeholder="123" style="margin: 4px 0 0 0; width: 100%; height: 38px; font-size: 14px;">' +
                    '</div>' +
                '</div>' +
            '</div>',
        focusConfirm: false,
        confirmButtonText: 'Validar y Pagar',
        confirmButtonColor: '#1b5e20',
        showCancelButton: true,
        cancelButtonText: 'Atrás',
        cancelButtonColor: '#757575',
        didOpen: () => {
            const fileInput = document.querySelector('.swal2-file');
            if (fileInput) fileInput.setAttribute('style', 'display: none !important;');
        },
        preConfirm: () => {
            const titular = document.getElementById('pay-titular').value.trim();
            const tarjeta = document.getElementById('pay-tarjeta').value.trim();
            const caducidad = document.getElementById('pay-caducidad').value.trim();
            const cvv = document.getElementById('pay-cvv').value.trim();

            if (!titular || !tarjeta || !caducidad || !cvv) {
                Swal.showValidationMessage('Todos los campos financieros son obligatorios.');
                return false;
            }
            if (tarjeta.length < 16 || isNaN(tarjeta)) {
                Swal.showValidationMessage('La tarjeta requiere 16 caracteres numéricos.');
                return false;
            }
            if (!caducidad.includes('/') || caducidad.length < 5) {
                Swal.showValidationMessage('Formato incorrecto (Utiliza MM/AA).');
                return false;
            }
            if (cvv.length < 3 || isNaN(cvv)) {
                Swal.showValidationMessage('El CVV consta de 3 números traseros.');
                return false;
            }
            return true;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            ejecutarEmisionPDF(nombrePack, precioPack, datosPersonales);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            abrirFormularioReserva(nombrePack, precioPack);
        }
    });
}

async function ejecutarEmisionPDF(nombrePack, precioPack, datos) {
    const localizador = 'GRANADA-' + Math.floor(10000 + Math.random() * 90000);
    const fecha = new Date();
    const fechaTexto = fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
    const horaTexto = fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    /* Marca de agua: el logo del paracaídas, muy tenue, detrás de todo el contenido */
    const imgMarcaAgua = await new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = 'imagenes/paracaidas-marca-agua.png';
    });
    if (imgMarcaAgua) {
        const anchoMarca = 90;
        const altoMarca = anchoMarca * (imgMarcaAgua.height / imgMarcaAgua.width);
        try {
            doc.saveGraphicsState();
            doc.setGState(new doc.GState({ opacity: 0.35 }));
            doc.addImage(imgMarcaAgua, 'PNG', (210 - anchoMarca) / 2, (297 - altoMarca) / 2, anchoMarca, altoMarca);
            doc.restoreGraphicsState();
        } catch (e) {
            // Si el navegador no soporta opacidad en PDF, se añade igualmente sin transparencia
            doc.addImage(imgMarcaAgua, 'PNG', (210 - anchoMarca) / 2, (297 - altoMarca) / 2, anchoMarca, altoMarca);
        }
    }

    const bandas = 80;
    for (let i = 0; i < bandas; i++) {
        const t = i / bandas;
        const r = Math.round(11 + t * (255 - 11));
        const g = Math.round(79 + t * (106 - 79));
        const b = Math.round(115 + t * (43 - 115));
        doc.setFillColor(r, g, b);
        doc.rect((210 / bandas) * i, 0, 210 / bandas + 0.6, 46, 'F');
    }

    doc.setTextColor(255, 255, 255);
    doc.setFont("times", "bold");
    doc.setFontSize(19);
    doc.text("ANTONIO GRANADA SKYDIVING", 40, 20);
    doc.setFont("times", "italic");
    doc.setFontSize(10);
    doc.text("Salto en paracaídas tándem · Granada, España", 40, 28);

    doc.setFillColor(255, 255, 255);
    doc.roundedRect(138, 30, 56, 13, 3, 3, 'F');
    doc.setTextColor(11, 79, 115);
    doc.setFont("times", "bold");
    doc.setFontSize(9.5);
    doc.text("PAGO CONFIRMADO", 166, 38, { align: 'center' });

    /* AQUÍ IRÁ EL ICONO REAL DEL PARACAÍDAS, EN CUANTO SUBAS EL ARCHIVO SVG */

    doc.setTextColor(10, 13, 18);
    doc.setFont("times", "bolditalic");
    doc.setFontSize(17);
    doc.text("Confirmacion de reserva", 18, 62);
    doc.setDrawColor(255, 106, 43);
    doc.setLineWidth(0.6);
    doc.line(18, 67, 192, 67);

    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.4);
    doc.roundedRect(18, 75, 174, 50, 4, 4, 'S');
    doc.setFillColor(11, 79, 115);
    doc.roundedRect(18, 75, 6, 50, 4, 4, 'F');
    doc.setTextColor(11, 79, 115);
    doc.setFont("times", "bold");
    doc.setFontSize(11.5);
    doc.text("DATOS DEL PASAJERO", 30, 85);
    doc.setTextColor(55, 60, 65);
    doc.setFont("times", "normal");
    doc.setFontSize(10.5);
    doc.text(`Nombre completo:   ${datos.nombre} ${datos.apellidos}`, 30, 95);
    doc.text(`DNI / Pasaporte:   ${datos.dni}`, 30, 103);
    doc.text(`Edad:   ${datos.edad} anos`, 30, 111);
    doc.setTextColor(20, 120, 65);
    doc.text(`Documento de identidad verificado correctamente`, 30, 119);

    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.4);
    doc.roundedRect(18, 132, 174, 54, 4, 4, 'S');
    doc.setFillColor(255, 106, 43);
    doc.roundedRect(18, 132, 6, 54, 4, 4, 'F');
    doc.setTextColor(11, 79, 115);
    doc.setFont("times", "bold");
    doc.setFontSize(11.5);
    doc.text("DETALLES DEL SALTO", 30, 142);
    doc.setTextColor(55, 60, 65);
    doc.setFont("times", "normal");
    doc.setFontSize(10.5);
    doc.text(`Localizador unico:   ${localizador}`, 30, 152);
    doc.text(`Experiencia contratada:   ${nombrePack}`, 30, 160);
    doc.text(`Fecha de emision:   ${fechaTexto}, ${horaTexto}`, 30, 168);
    doc.text(`Ubicacion:   Aerodromo de Granada, Espana`, 30, 176);
    doc.text(`Instructor asignado:   Se confirmara 48h antes del salto`, 30, 184);

    doc.setFillColor(11, 79, 115);
    doc.roundedRect(18, 195, 174, 20, 4, 4, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.text(`TOTAL ABONADO`, 30, 207);
    doc.setFontSize(16);
    doc.text(`${precioPack}`, 168, 207, { align: 'right' });

    doc.setDrawColor(220, 220, 220);
    for (let i = 0; i < 30; i++) {
        const grosor = Math.random() > 0.5 ? 0.6 : 1.3;
        doc.setLineWidth(grosor);
        doc.line(18 + i * 5.8, 225, 18 + i * 5.8, 240);
    }
    doc.setFont("times", "normal");
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.text(localizador, 18, 246);

    doc.setDrawColor(230, 230, 230);
    doc.line(18, 258, 192, 258);
    doc.setFont("times", "italic");
    doc.setFontSize(9);
    doc.setTextColor(140, 140, 140);
    doc.text("Presente este recibo junto con el DNI original el dia del salto.", 18, 266);
    doc.text("Antonio Granada Skydiving - Aerodromo de Granada - info@antonioparacaidismo.com", 18, 272);

    doc.save(`Confirmacion_${localizador}.pdf`);

    setTimeout(() => {
        document.activeElement && document.activeElement.blur();
        Swal.fire({
            title: '¡Reserva Completada!',
            text: 'Pago realizado correctamente. Su reserva ha sido confirmada.',
            icon: 'success',
            confirmButtonColor: '#1CA7EC',
            allowOutsideClick: false,
            allowEscapeKey: false,
            timer: 20000,
            timerProgressBar: true,
            stopKeydownPropagation: true
        });
    }, 700);
}

/* ==========================================================================
   RECOMPENSA del minijuego
   ========================================================================== */
let ultimaRecompensa = -1;

function mostrarRecompensa() {
    const recompensas = [
        "🎖️ ¡Enhorabuena! Has obtenido la Licencia Internacional de Paracaidista de Sofá™.",
        "🎉 ¡Has ganado un salto en paracaídas! Valor del premio: 0 €.",
        "👑 Nuevo rango: Maestro Cazaparacaídas.",
        "📜 Certificado oficial: 'Esta persona debería volver a trabajar.'",
        "🎁 Has desbloqueado un premio secreto que no existe.",
        "⭐ Has desbloqueado el Paracaídas Legendario dorado.",
        "✈️ La torre de control informa: 'Impresionante habilidad'.",
        "🏆 ¡10 puntos! Eres Paracaidista Honorario. Beneficios: Ninguno.",
        "🧦 Premio sorpresa: un calcetín desparejado. De nada.",
        "🛰️ La NASA quiere hablar contigo sobre tus reflejos.",
        "🍕 Has ganado una porción de pizza imaginaria. Buen provecho.",
        "🐦 Un pájaro te ha visto jugar y ha quedado muy impresionado.",
        "🎯 Puntería de instructor veterano. Casi.",
        "☁️ Las nubes de Granada aplauden tu talento cazando paracaídas.",
        "🥇 Medalla de oro en 'Hacer clic en cosas que caen'.",
        "🧭 Tu instinto de saltador es innegable. O tienes mucho tiempo libre.",
        "🌪️ Nivel de reflejos: huracán categoría 3.",
        "🎬 Esto merece salir en el vídeo de tu salto real.",
        "🛬 Aterrizaje perfecto en la puntuación más alta de hoy.",
        "🧑‍✈️ El equipo de Antonio Granada te ficha honoríficamente."
    ];

    let indice;
    do {
        indice = Math.floor(Math.random() * recompensas.length);
    } while (indice === ultimaRecompensa && recompensas.length > 1);
    ultimaRecompensa = indice;
    const premioElegido = recompensas[indice];

    const modal = document.createElement('div');
    modal.className = 'modal-recompensa';
    modal.innerHTML = `
        <div class="modal-contenido">
            <span class="cerrar-modal">&times;</span>
            <div style="font-size: 2.6rem; margin-bottom: 6px;">🏅✨</div>
            <p>${premioElegido}</p>
        </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.cerrar-modal').onclick = () => modal.remove();
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove(); // cerrar al hacer clic fuera de la tarjeta
    };
}
/* Acordeón de preguntas frecuentes */
function toggleFaq(boton) {
    const item = boton.closest('.faq-item');
    const yaAbierta = item.classList.contains('abierta');

    document.querySelectorAll('.faq-item.abierta').forEach(el => el.classList.remove('abierta'));

    if (!yaAbierta) {
        item.classList.add('abierta');
    }
}
/* Formulario de contacto: envío real a través de Netlify Forms */
function enviarContacto(event) {
    event.preventDefault();
    const formulario = event.target;
    const datos = new FormData(formulario);

    fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(datos).toString()
    })
    .then(() => {
        Swal.fire({
            icon: 'success',
            title: '¡Mensaje enviado!',
            text: 'Te responderemos lo antes posible.',
            confirmButtonColor: '#1CA7EC'
        });
        formulario.reset();
    })
    .catch(() => {
        Swal.fire({
            icon: 'error',
            title: 'Ha ocurrido un error',
            text: 'No se ha podido enviar el mensaje. Inténtalo de nuevo.',
            confirmButtonColor: '#1CA7EC'
        });
    });

    return false;
}
/* Simulador de salto */
function actualizarSimulador() {
    const altitud = parseInt(document.getElementById('simulador-altitud').value);
    document.getElementById('simulador-altitud-valor').textContent = altitud;

    const alturaApertura = 1200;
    const distanciaCaida = altitud - alturaApertura;
    const tiempoCaida = Math.round(distanciaCaida / 55); // aprox. 55 m/s de velocidad media
    const velocidadMax = Math.min(200 + Math.round((altitud - 4000) / 30), 220);

    document.getElementById('simulador-tiempo').textContent = tiempoCaida > 0 ? tiempoCaida : 0;
    document.getElementById('simulador-velocidad').textContent = velocidadMax;
    document.getElementById('simulador-apertura').textContent = alturaApertura;
}

/* Meteorología en tiempo real (Granada) — API gratuita Open-Meteo, sin clave */
async function cargarMeteo() {
    const contenedor = document.getElementById('meteo-caja');
    try {
        const lat = 37.1773, lon = -3.5986; // Granada
        const respuesta = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,weather_code&wind_speed_unit=kmh`);
        const datos = await respuesta.json();
        const actual = datos.current;

        const viento = actual.wind_speed_10m;
        let estadoTexto, estadoClase;

        if (viento < 15) {
            estadoTexto = '✅ Condiciones óptimas para saltar';
            estadoClase = 'meteo__estado--apto';
        } else if (viento < 25) {
            estadoTexto = '⚠️ No recomendado, consulta antes de venir';
            estadoClase = 'meteo__estado--regular';
        } else {
            estadoTexto = '⛔ No apto para saltar hoy';
            estadoClase = 'meteo__estado--no-apto';
        }

        const ahora = new Date();
        const fechaTexto = ahora.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
        const horaTexto = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

        contenedor.innerHTML = `
            <p class="meteo__fecha">${fechaTexto} · ${horaTexto}</p>
            <div class="meteo__temp">${Math.round(actual.temperature_2m)}°C</div>
            <div class="meteo__detalle">
                <span>💨 Viento: ${Math.round(viento)} km/h</span>
                <span>📍 Aeródromo de Granada</span>
            </div>
            <div class="meteo__estado ${estadoClase}">${estadoTexto}</div>
        `;
    } catch (error) {
        contenedor.innerHTML = '<p class="meteo__cargando">No se ha podido cargar el tiempo ahora mismo.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    actualizarSimulador();
    cargarMeteo();
});
/* Menú móvil (hamburguesa) */
(function iniciarMenuMovil() {
    const boton = document.querySelector('.navbar__toggle');
    const links = document.querySelector('.navbar__links');
    if (!boton || !links) return;

    boton.addEventListener('click', () => {
        links.classList.toggle('abierto');
        boton.classList.toggle('activo');
    });

    links.querySelectorAll('a').forEach((enlace) => {
        enlace.addEventListener('click', () => {
            links.classList.remove('abierto');
            boton.classList.remove('activo');
        });
    });
})();
/* Paginación de Curiosidades */
let paginaBlogActual = 1;
const totalPaginasBlog = 2;

function cambiarPaginaBlog(direccion) {
    paginaBlogActual += direccion;
    if (paginaBlogActual < 1) paginaBlogActual = 1;
    if (paginaBlogActual > totalPaginasBlog) paginaBlogActual = totalPaginasBlog;

    document.querySelectorAll('.blog-pagina').forEach((tarjeta) => {
        const pagina = tarjeta.getAttribute('data-pagina');
        tarjeta.style.display = (pagina == paginaBlogActual) ? 'flex' : 'none';
    });

    document.getElementById('indicador-blog-pagina').textContent = `Página ${paginaBlogActual} de ${totalPaginasBlog}`;
    document.getElementById('btn-blog-anterior').disabled = (paginaBlogActual === 1);
    document.getElementById('btn-blog-siguiente').disabled = (paginaBlogActual === totalPaginasBlog);
}
const curiosidades = [
    {
        img: "https://images.unsplash.com/photo-1659901981145-dbc056431a8b?w=800&q=80&auto=format&fit=crop",
        titulo: "5 cosas que debes saber antes de tu primer salto",
        resumen: "Desde qué ropa llevar hasta cómo controlar los nervios en la avioneta: la guía definitiva para quienes van a saltar por primera vez.",
        texto: `
            <p>Antes de tu primer salto tándem hay unas cuantas cosas que conviene tener claras para disfrutar al máximo:</p>
            <p><strong>1. La ropa importa más de lo que crees.</strong> Nada de prendas sueltas, con capucha, bufandas o accesorios colgantes. Ropa cómoda y ajustada, y calzado cerrado y bien atado.</p>
            <p><strong>2. Los nervios son normales, e incluso buenos.</strong> Un punto de adrenalina antes de saltar es parte de la experiencia. El briefing de seguridad con tu instructor está pensado precisamente para calmarte y dejarte con la mente clara.</p>
            <p><strong>3. No hace falta estar en forma física excepcional.</strong> El instructor lleva todo el peso del control del salto; tú solo necesitas seguir las indicaciones básicas.</p>
            <p><strong>4. El momento más intenso dura muy poco.</strong> El vértigo de asomarte a la puerta desaparece en cuanto saltas: la caída libre se siente más como flotar que como caer.</p>
            <p><strong>5. Llega con tiempo.</strong> El proceso de formación, equipamiento y espera del vuelo lleva su tiempo antes del salto en sí — disfruta también de esa parte.</p>
        `
    },
    {
        img: "https://images.unsplash.com/photo-1591007232007-b26dfbbc9a9a?w=800&q=80&auto=format&fit=crop",
        titulo: "¿Qué se siente realmente en caída libre?",
        resumen: "No es como una montaña rusa. Te contamos qué pasa en tu cuerpo durante esos 45 segundos.",
        texto: `
            <p>Mucha gente espera sentir la clásica "bajada" de estómago de una montaña rusa, pero la caída libre es completamente distinta.</p>
            <p>En cuanto sales del avión, tu cuerpo alcanza rápidamente una velocidad constante (la llamada velocidad terminal, unos 200 km/h). A partir de ahí, ya no sientes que estás "cayendo", sino que el aire te sostiene como un colchón invisible: la sensación predominante es de flotar, no de caer.</p>
            <p>El viento es intenso y el ruido también, pero muchos saltadores describen esos 45 segundos como una calma extraña en medio de la velocidad.</p>
            <p>Cuando se abre el paracaídas, el cambio es brusco: de repente todo se vuelve silencioso y tranquilo, y empieza la segunda parte del salto, mucho más suave, flotando bajo la vela hasta tomar tierra.</p>
        `
    },
    {
        img: "https://images.unsplash.com/photo-1664494130837-14e0473ed284?w=800&q=80&auto=format&fit=crop",
        titulo: "Del salto tándem a tu propia licencia",
        resumen: "Muchos de nuestros alumnos empezaron con un tándem. Así es el camino hasta saltar en solitario.",
        texto: `
            <p>Es habitual que la primera toma de contacto con el paracaidismo sea un simple salto tándem por curiosidad o como regalo. Para bastantes personas, ese primer salto termina siendo el punto de partida de algo mucho más grande.</p>
            <p>El camino hacia la licencia de paracaidismo deportivo pasa por el curso AFF (Accelerated Freefall), formado por varios niveles progresivos: primero se salta acompañado por dos instructores a la vez, luego por uno solo, y finalmente en completa autonomía.</p>
            <p>Cada nivel incluye teoría en tierra, prácticas de posición y apertura, y saltos reales evaluados por los instructores antes de poder avanzar al siguiente. El proceso completo suele llevar varios meses.</p>
            <p>Al terminar, el saltador obtiene su licencia oficial y puede saltar de forma independiente en cualquier centro homologado.</p>
        `
    },
    {
        img: "https://images.unsplash.com/photo-1601024445121-e5b82f020549?w=800&q=80&auto=format&fit=crop",
        titulo: "Los récords más increíbles del paracaidismo",
        resumen: "Desde saltos estratosféricos hasta formaciones de cientos de personas en el aire a la vez.",
        texto: `
            <p>El paracaidismo ha dado lugar a algunas de las hazañas más extremas jamás intentadas por el ser humano.</p>
            <p>Uno de los hitos más conocidos es el salto estratosférico de Felix Baumgartner en 2012, saltando desde más de 39.000 metros de altura y llegando a superar la velocidad del sonido en caída libre, sin motor ni ayuda mecánica alguna.</p>
            <p>En el terreno de los récords colectivos, se han logrado formaciones en caída libre de más de 200 personas saltando a la vez y uniéndose en el aire formando figuras geométricas.</p>
            <p>También existen récords de mayor tiempo en caída libre continuada, y de saltos en tándem realizados por personas de edad muy avanzada, demostrando que este deporte no tiene por qué tener límite de edad.</p>
        `
    },
    {
        img: "https://images.unsplash.com/photo-1629141334092-9f57a94b6686?w=800&q=80&auto=format&fit=crop",
        titulo: "5 mitos sobre el paracaidismo que no son ciertos",
        resumen: "Desmontamos, con datos reales, los mitos más extendidos sobre este deporte.",
        texto: `
            <p><strong>Mito 1: "El paracaídas puede no abrirse nunca".</strong> Todo equipo homologado lleva un paracaídas de reserva independiente, además de un dispositivo automático que lo abre solo si detecta que a cierta altura no se ha abierto el principal.</p>
            <p><strong>Mito 2: "Hace falta estar en muy buena forma física".</strong> El salto tándem no requiere ninguna condición física especial más allá de estar dentro de los límites de peso indicados.</p>
            <p><strong>Mito 3: "Es un deporte solo para gente joven".</strong> No existe un límite máximo de edad fijo; lo relevante es el estado de salud general, no los años.</p>
            <p><strong>Mito 4: "Si el motor del avión falla, no hay forma de bajar".</strong> Los aviones usados para paracaidismo pueden planear y aterrizar igualmente sin motor, y en cualquier caso siempre queda la opción de saltar.</p>
            <p><strong>Mito 5: "No puedes hacer nada si algo va mal".</strong> Los saltadores reciben formación específica sobre procedimientos de emergencia, y en los saltos tándem es el instructor quien gestiona cualquier imprevisto.</p>
        `
    }
];

let indiceCuriosidadActual = 0;

function renderizarCuriosidad() {
    const visor = document.getElementById('blog-visor');
    if (!visor) return;
    const c = curiosidades[indiceCuriosidadActual];
    visor.innerHTML = `
        <article class="post reveal is-visible">
            <div class="post__media">
                <img src="${c.img}" alt="${c.titulo}">
            </div>
            <div class="post__body">
                <h3>${c.titulo}</h3>
                <p>${c.resumen}</p>
                <a href="javascript:void(0)" class="post__link" onclick="abrirCuriosidad(${indiceCuriosidadActual})">Leer más →</a>
            </div>
        </article>
    `;
}

function siguienteCuriosidad() {
    indiceCuriosidadActual = (indiceCuriosidadActual + 1) % curiosidades.length;
    renderizarCuriosidad();
}

function abrirCuriosidad(indice) {
    const c = curiosidades[indice];
    document.getElementById('modal-curiosidad-img').src = c.img;
    document.getElementById('modal-curiosidad-titulo').textContent = c.titulo;
    document.getElementById('modal-curiosidad-texto').innerHTML = c.texto;
    document.getElementById('modal-curiosidad').classList.add('activo');
}

document.addEventListener('DOMContentLoaded', () => {
    renderizarCuriosidad();
    const modalCuriosidad = document.getElementById('modal-curiosidad');
    const cerrarBtn = document.getElementById('cerrar-modal-curiosidad');
    if (cerrarBtn) cerrarBtn.onclick = () => modalCuriosidad.classList.remove('activo');
    if (modalCuriosidad) {
        modalCuriosidad.onclick = (e) => {
            if (e.target === modalCuriosidad) modalCuriosidad.classList.remove('activo');
        };
    }
});
/* Galería: fotos y vídeos, uno a la vez */
const galeriaFotos = [
    { img: "https://images.unsplash.com/photo-1659221876406-31a3746f41b9?w=1000&q=80&auto=format&fit=crop", alt: "Salto tándem en paracaídas" },
    { img: "https://images.unsplash.com/photo-1630879937467-4afa290b1a6b?w=1000&q=80&auto=format&fit=crop", alt: "Avioneta de salto" },
    { img: "https://images.unsplash.com/photo-1601024445121-e5b82f020549?w=1000&q=80&auto=format&fit=crop", alt: "Paracaídas en el aire" },
    { img: "https://images.unsplash.com/photo-1483301563007-8d0161daa1d0?w=1000&q=80&auto=format&fit=crop", alt: "Salto sobre el paisaje" },
    { img: "https://images.unsplash.com/photo-1620654458602-b27e08e8afb3?w=1000&q=80&auto=format&fit=crop", alt: "Salto en pleno vuelo" },
    { img: "https://images.unsplash.com/photo-1629141334092-9f57a94b6686?w=1000&q=80&auto=format&fit=crop", alt: "Dos saltadores en el aire" },
    { img: "https://images.unsplash.com/photo-1654786154777-02c4d0668373?w=1000&q=80&auto=format&fit=crop", alt: "Vuelo en paracaídas" },
    { img: "https://images.unsplash.com/photo-1521673252667-e05da380b252?w=1000&q=80&auto=format&fit=crop", alt: "Saltador en el cielo" }
];

const galeriaVideos = [
    { id: "TwpXYAECM5I", titulo: "Vídeo promocional de salto tándem" },
    { id: "OuwWH0IfeX4", titulo: "Salto tándem en primera persona" },
    { id: "SEq2RoS3V4A", titulo: "Recopilación de disciplinas de paracaidismo" },
    { id: "PvBtWSoEcOc", titulo: "Salto tándem visto desde cámara exterior" }
];

let galeriaTabActual = 'fotos';
let indiceGaleriaFoto = 0;
let indiceGaleriaVideo = 0;

function renderizarGaleria() {
    const visor = document.getElementById('galeria-visor');
    if (!visor) return;

    if (galeriaTabActual === 'fotos') {
        const f = galeriaFotos[indiceGaleriaFoto];
        visor.innerHTML = `
            <div class="galeria-visor__foto reveal is-visible">
                <img src="${f.img}" alt="${f.alt}">
            </div>
        `;
    } else {
        const v = galeriaVideos[indiceGaleriaVideo];
        visor.innerHTML = `
            <div class="galeria-visor__video reveal is-visible">
                <iframe src="https://www.youtube.com/embed/${v.id}" title="${v.titulo}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
        `;
    }
}

function cambiarTabGaleria(tab) {
    galeriaTabActual = tab;
    document.getElementById('tab-fotos').classList.toggle('activa', tab === 'fotos');
    document.getElementById('tab-videos').classList.toggle('activa', tab === 'videos');
    renderizarGaleria();
}

function siguienteGaleria() {
    if (galeriaTabActual === 'fotos') {
        indiceGaleriaFoto = (indiceGaleriaFoto + 1) % galeriaFotos.length;
    } else {
        indiceGaleriaVideo = (indiceGaleriaVideo + 1) % galeriaVideos.length;
    }
    renderizarGaleria();
}

document.addEventListener('DOMContentLoaded', () => {
    renderizarGaleria();
});
/* Opiniones: una a la vez, con botón estilo celosía */
const opiniones = [
    { estrellas: 5, texto: "El mejor regalo que me han hecho nunca. El equipo te transmite tranquilidad desde el minuto uno y la caída libre es una sensación que no se olvida.", nombre: "Laura M.", tipo: "Salto Tándem" },
    { estrellas: 5, texto: "Hice el curso AFF completo y la formación es muy seria. Los instructores explican todo con calma y te hacen sentir seguro en cada fase.", nombre: "Daniel R.", tipo: "Curso AFF" },
    { estrellas: 5, texto: "Reservé el pack VIP con vídeo para mi cumpleaños y ha sido una pasada. El vídeo quedó buenísimo y el trato del equipo en tierra, excelente.", nombre: "Carla S.", tipo: "Salto VIP" },
    { estrellas: 4, texto: "Muy buena experiencia en general. El único pero es que tuvimos que esperar más de lo previsto por el viento, pero entiendo que la seguridad va primero.", nombre: "Marcos T.", tipo: "Salto Tándem" },
    { estrellas: 5, texto: "Le regalé el bono a mi padre por su 60 cumpleaños y todavía habla del día que saltó. El equipo lo trató de maravilla de principio a fin.", nombre: "Elena V.", tipo: "Bono Regalo" },
    { estrellas: 5, texto: "Segunda vez que salto con ellos, esta vez el Salto Deportivo. Se nota la diferencia de altitud y la caída libre se hace mucho más larga.", nombre: "Rubén P.", tipo: "Salto Deportivo" },
    { estrellas: 4, texto: "Todo perfecto salvo que el aparcamiento estaba más lleno de lo que esperaba un sábado por la mañana. Por lo demás, salto y trato excelentes.", nombre: "Patricia G.", tipo: "Salto Tándem" },
    { estrellas: 5, texto: "Como fotógrafo aficionado valoro mucho el pack con foto: la calidad de las imágenes que me entregaron superó lo que esperaba.", nombre: "Iván C.", tipo: "Pack Con Foto" },
    { estrellas: 5, texto: "Estaba muerta de miedo antes de saltar y el instructor consiguió que me riera durante todo el briefing. En el aire se me olvidó completamente el miedo.", nombre: "Sofía N.", tipo: "Salto Tándem" },
    { estrellas: 5, texto: "Llevaba años queriendo sacarme la licencia y por fin me animé con el curso AFF. Cada instructor que tuve fue exigente pero cercano a la vez.", nombre: "Álvaro D.", tipo: "Curso AFF" }
];

let indiceOpinionActual = 0;

function renderizarOpinion() {
    const visor = document.getElementById('opiniones-visor');
    if (!visor) return;
    const o = opiniones[indiceOpinionActual];
    const estrellasLlenas = '★'.repeat(o.estrellas);
    const estrellasVacias = '☆'.repeat(5 - o.estrellas);

    visor.innerHTML = `
        <article class="opinion reveal is-visible opinion--sola">
            <div class="opinion__estrellas">${estrellasLlenas}${estrellasVacias}</div>
            <p class="opinion__texto">"${o.texto}"</p>
            <div class="opinion__autor">
                <div class="opinion__avatar">${o.nombre.charAt(0)}</div>
                <div>
                    <strong>${o.nombre}</strong>
                    <span>${o.tipo}</span>
                </div>
            </div>
        </article>
    `;
}

function siguienteOpinion() {
    indiceOpinionActual = (indiceOpinionActual + 1) % opiniones.length;
    renderizarOpinion();
}

document.addEventListener('DOMContentLoaded', () => {
    renderizarOpinion();
});
/* Parallax sutil de las celosías decorativas de fondo */
(function iniciarParallaxCelosia() {
    const secciones = document.querySelectorAll('.proceso, .equipo, .seguridad, .opiniones, .blog, .meteo, .contacto');
    if (!secciones.length) return;

    window.addEventListener('scroll', () => {
        secciones.forEach((sec) => {
            const rect = sec.getBoundingClientRect();
            const desplazamiento = rect.top * 0.08;
            sec.style.setProperty('--parallax-y', `${desplazamiento}px`);
        });
    }, { passive: true });
})();