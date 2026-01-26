document.addEventListener('DOMContentLoaded', () => {
    console.log('Bufete Jurídico Web App Iniciada');

    // Smooth Scrolling para navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Lógica del Formulario
    const contactForm = document.getElementById('contactForm');
    const serviceTypeInput = document.getElementById('serviceType');
    const dynamicFields = document.getElementById('dynamicFields');

    // Detectar cambios en el tipo de servicio para mostrar campos relevantes (Futura expansión)
    serviceTypeInput.addEventListener('change', (e) => {
        const type = e.target.value;
        if (type === 'bienes_raices') {
            // Podríamos inyectar campos específicos de inmuebles aquí
            console.log('Seleccionado Bienes Raíces');
        } else if (type === 'legal') {
            // Podríamos inyectar campos legales aquí
            console.log('Seleccionado Servicios Legales');
        }
    });

    // Manejo del Envío del Formulario
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // ---------------------------------------------------------
        // URL DE TU SCRIPT DE GOOGLE (PÉGALA AQUÍ CUANDO LA TENGAS)
        // ---------------------------------------------------------
        const scriptURL = 'https://script.google.com/macros/s/AKfycbzEzEDye-1x9cYmt0jILry4hm0xHqROMbTQoZLZa2HWEEICKXNpSs000lNyEmDckcdz/exec';
        // Ejemplo: 'https://script.google.com/macros/s/AKfycbx.../exec'

        const loadingText = document.querySelector('button[type="submit"]');
        const originalText = loadingText.innerText;
        loadingText.innerText = 'Enviando...';
        loadingText.disabled = true;

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        console.log('Enviando datos a Google Sheets...', data);

        // 1. Enviar a Google Sheets
        fetch(scriptURL, { method: 'POST', body: formData })
            .then(response => {
                console.log('¡Éxito en Google Sheets!', response);
                alert("¡Gracias! Tu información ha sido guardada correctamente en nuestra base de datos.");

                // 2. Proceso Original de WhatsApp (Opcional, se mantiene si gustas)
                enviarAWhatsApp(data);

                contactForm.reset();
                loadingText.innerText = originalText;
                loadingText.disabled = false;
            })
            .catch(error => {
                console.error('Error enviando a Google Sheets!', error);

                // Si falla Google (o no hay URL), al menos abrimos WhatsApp
                alert("Hubo un detalle conectando con la base de datos, pero te redirigiremos a WhatsApp.");
                enviarAWhatsApp(data);

                loadingText.innerText = originalText;
                loadingText.disabled = false;
            });
    });

    function enviarAWhatsApp(data) {
        // Generar mensaje para WhatsApp
        const phoneNumber = "526676042460";
        let message = `*Nuevo Contacto Web*\n\n`;
        message += `*Nombre:* ${data.name}\n`;
        message += `*Teléfono:* ${data.phone}\n`;
        message += `*Interés:* ${data.serviceType === 'legal' ? 'Servicios Legales' : 'Bienes Raíces'}\n`;
        message += `*Mensaje:* ${data.message}\n`;

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }
});
