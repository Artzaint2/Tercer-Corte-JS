let inventario = [];
let registroModificando = null;

function confirmarRecarga() {
    const mensaje = "¿Seguro que desea recargar? Se borrarán todos los registros.";

    return mensaje;
}

window.addEventListener('beforeunload', function (e) {
    const mensaje = confirmarRecarga();

    if (inventario.length > 0) {
        e.returnValue = mensaje;
    }

    return mensaje;
});

function cargarInventario() {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            inventario = JSON.parse(xhr.responseText);
            actualizarListaRegistros();
        }
    };

    xhr.open('GET', 'inventario.json', true);
    xhr.send();
}

function guardarInventarioLocal() {
    localStorage.setItem('inventario', JSON.stringify(inventario));
}

function cargarInventarioLocal() {
    const inventarioLocal = localStorage.getItem('inventario');
    if (inventarioLocal) {
        inventario = JSON.parse(inventarioLocal);
        actualizarListaRegistros();
    }
}

function guardarInventarioRemoto() {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log('Inventario guardado en el servidor:', xhr.responseText);
        }
    };

    xhr.open('PUT', 'inventario.json', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(inventario));
}

function cargarImagen(event) {
    const imagenFile = event.target.files[0];

    if (imagenFile) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const imagenPreview = document.getElementById('imagenPreview');
            imagenPreview.src = e.target.result;
        };

        reader.readAsDataURL(imagenFile);
    }
}

function agregarRegistro() {
    const nombre = document.getElementById('nombre').value;
    const tipo = document.getElementById('tipo').value;
    const marca = document.getElementById('marca').value;
    const modelo = document.getElementById('modelo').value;
    const anio = document.getElementById('anio').value;
    const imagenPreview = document.getElementById('imagenPreview');

    if (!imagenPreview.src || imagenPreview.src === 'about:blank') {
        alert('Por favor, selecciona una imagen.');
        return;
    }

    const nuevoRegistro = {
        nombre: nombre,
        tipo: tipo,
        marca: marca,
        modelo: modelo,
        anio: anio,
        imagen: imagenPreview.src
    };

    inventario.push(nuevoRegistro);

    actualizarListaRegistros();
    limpiarFormulario();
    guardarInventarioLocal();
    guardarInventarioRemoto();
}

function eliminarRegistro(index) {
    inventario.splice(index, 1);
    actualizarListaRegistros();
    guardarInventarioLocal();
    guardarInventarioRemoto();
}

function modificarRegistro(index) {
    const registro = inventario[index];

    document.getElementById('nombre').value = registro.nombre;
    document.getElementById('tipo').value = registro.tipo;
    document.getElementById('marca').value = registro.marca;
    document.getElementById('modelo').value = registro.modelo;
    document.getElementById('anio').value = registro.anio;
    document.getElementById('imagenPreview').src = registro.imagen;

    registroModificando = registro;

    mostrarBotonGuardarModificaciones();
}

function mostrarBotonGuardarModificaciones() {
    const botonGuardarModificaciones = document.getElementById('botonGuardarModificaciones');
    botonGuardarModificaciones.style.display = 'block';
}

function ocultarBotonGuardarModificaciones() {
    const botonGuardarModificaciones = document.getElementById('botonGuardarModificaciones');
    botonGuardarModificaciones.style.display = 'none';
}

function limpiarCampos() {
    document.getElementById('nombre').value = '';
    document.getElementById('tipo').value = '';
    document.getElementById('marca').value = '';
    document.getElementById('modelo').value = '';
    document.getElementById('anio').value = '';
    document.getElementById('imagenPreview').src = 'about:blank';
}

function guardarModificaciones() {
    const nombre = document.getElementById('nombre').value;
    const tipo = document.getElementById('tipo').value;
    const marca = document.getElementById('marca').value;
    const modelo = document.getElementById('modelo').value;
    const anio = document.getElementById('anio').value;
    const imagenPreview = document.getElementById('imagenPreview');

    if (!imagenPreview.src || imagenPreview.src === 'about:blank') {
        alert('Por favor, selecciona una imagen.');
        return;
    }

    registroModificando.nombre = nombre;
    registroModificando.tipo = tipo;
    registroModificando.marca = marca;
    registroModificando.modelo = modelo;
    registroModificando.anio = anio;
    registroModificando.imagen = imagenPreview.src;

    registroModificando = null;

    limpiarCampos();

    actualizarListaRegistros();
    guardarInventarioLocal();
    guardarInventarioRemoto();

    ocultarBotonGuardarModificaciones();
}

function actualizarListaRegistros() {
    const listaRegistros = document.getElementById('listaRegistros');
    listaRegistros.innerHTML = '';

    inventario.forEach((registro, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';

        const contenido = `
            <p><strong>Nombre del Vehiculo:</strong> ${registro.nombre}</p>
            <p><strong>Tipo del Vehiculo:</strong> ${registro.tipo}</p>
            <p><strong>Marca del Vehiculo:</strong> ${registro.marca}</p>
            <p><strong>Modelo del Vehiculo:</strong> ${registro.modelo}</p>
            <p><strong>Año del Vehiculo:</strong> ${registro.anio}</p>
            <p><strong>Imagen del Vehiculo:</strong></p>
            <img src="${registro.imagen}" alt="${registro.nombre}" class="ml-3" style="max-width: 400px; max-height: 400px;">
            <div class="text-center">
                <button type="button" class="btn btn-danger btn-sm mt-3" onclick="eliminarRegistro(${index})">Eliminar</button>
                <button type="button" class="btn btn-primary btn-sm mt-3" onclick="modificarRegistro(${index})">Modificar</button>
            </div>
        `;

        listItem.innerHTML = contenido;
        listaRegistros.appendChild(listItem);
    });
}

function limpiarFormulario() {
    document.getElementById('formRegistro').reset();
}

cargarInventarioLocal();
