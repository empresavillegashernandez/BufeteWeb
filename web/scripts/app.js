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
  const serviceType = document.getElementById('serviceType');
  const dynamicFields = document.getElementById('dynamicFields');

  // Detectar cambios en el tipo de servicio para mostrar campos específicos
  serviceType.addEventListener('change', (e) => {
    const type = e.target.value;
    if (type === 'bienes_raices' || type.includes('Inmueble') || type.includes('Raíces')) {
      console.log('Seleccionado Bienes Raíces');
      dynamicFields.innerHTML = `
        <div class="form-group">
          <label>Tipo de Propiedad</label>
          <input type="text" name="tipo_propiedad" class="form-control" placeholder="Casa, Terreno, Departamento">
        </div>
      `;
    } else if (type === 'legal' || type.includes('Legal')) {
      console.log('Seleccionado Servicios Legales');
      dynamicFields.innerHTML = `
        <div class="form-group">
          <label>Tipo de Asunto Legal</label>
          <input type="text" name="asunto_legal" class="form-control" placeholder="Ej. Civil, Penal, Familiar">
        </div>
      `;
    } else {
      dynamicFields.innerHTML = '';
    }
  });

  // Manejo del Envío del Formulario
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // TU URL DE GOOGLE YA CONECTADA
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxxmnFBNiob9_GJHFK4uqDjkajri69iRUnRysk-4HdNWigdr8o9yggvIc3BO1DM2XT5/exec';

    const submitBtn = document.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = 'Enviando...';
    submitBtn.disabled = true;

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    console.log('Enviando datos a Google Sheets...', data);

    // 1. Enviar a Google Sheets
    fetch(scriptURL, { method: 'POST', body: formData })
      .then(response => {
        console.log('Éxito en Google Sheets', response);
        alert('¡Gracias! Tu información ha sido guardada correctamente en nuestra base de datos.');
        
        // 2. Proceso opcional de WhatsApp
        enviarWhatsApp(data);
        
        contactForm.reset();
        dynamicFields.innerHTML = '';
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
      })
      .catch(error => {
        console.error('Error enviando a Google Sheets!', error);
        alert('Hubo un detalle con la base de datos, pero te conectamos a WhatsApp.');
        enviarWhatsApp(data);
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
      });
  });

  function enviarWhatsApp(data) {
    // Genera mensaje para WhatsApp
    const phoneNumber = '52667 421 5999'; // TU NÚMERO - cámbialo si es otro
    let message = `Nuevo Contacto Web:\nNombre: ${data.name}\nTelefono: ${data.phone}\nServicio: ${data.serviceType}\nMensaje: ${data.message}`;
    
    // Limpiar número para link de WhatsApp
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }
});
