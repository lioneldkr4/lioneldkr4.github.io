// Espera a que el DOM este completamente cargado antes de ejecutar el codigo
document.addEventListener("DOMContentLoaded", () => {
    // Cargar la tabla de usuarios al iniciar la pagina
    cargarTabla();
    
    // Obtener referencias a elementos del DOM
    const myModal = document.getElementById('mdlUsuario'); // Modal para agregar usuarios
    const btnLimpiar = document.getElementById('btnLimpiar'); // Boton de limpiar formulario
    
    // Agregar evento al mostrar el modal
    myModal.addEventListener('shown.bs.modal', () => {
        document.getElementById('frmUsuario').reset(); // Resetear el formulario al abrir el modal
        document.getElementById('txtNombre').focus(); // Poner el foco en el campo de nombre
    });
    
    // Agregar evento al boton de limpiar formulario
    document.getElementById("btnLimpiar").addEventListener("click", () => {
        document.getElementById('frmUsuario').reset(); // Resetear el formulario al hacer click en Limpiar
    });
    
    // Agregar evento al boton de aceptar (submit) del formulario
    document.getElementById("btnAceptar").addEventListener("click", (e) => {
        e.preventDefault(); // Evitar que el formulario se envie automaticamente
        
        let form = e.target.form; // Obtener el formulario
        form.classList.add("was-validated"); // Agregar clase de validacion Bootstrap al formulario
        
        // Verificar que el formulario es valido
        if (form.checkValidity()) {
            // Validar que no haya otro usuario con el mismo correo
            if (!existeUsuarioConCorreo(form.txtEmail.value.trim())) {
                // Si no hay otro usuario con el mismo correo, agregar el nuevo registro
                agregarUsuario(form.txtNombre.value.trim(), form.txtEmail.value.trim(), form.txtPassword.value.trim(), form.txtTelefono.value.trim());
                cargarTabla(); // Actualizar la tabla
                myModal.hide(); // Ocultar el modal
            } else {
                // Si ya existe un usuario con el mismo correo, mostrar un mensaje de error
                alert("Ya existe un usuario con el mismo correo.");
            }
        }
    });
    
    // Agregar evento de validacion al campo de nombre
    document.getElementById("txtNombre").addEventListener("keyup", (e) => revisar(e.target.id, 2, 60));
    // Agregar evento de validacion al campo de contraseña
    document.getElementById("txtPassword").addEventListener("keyup", (e) => revisar(e.target.id, 6, 20));
    // Agregar evento de validacion al campo de confirmar contraseña
    document.getElementById("txtConfirmarPassword").addEventListener("keyup", (e) => revisar(e.target.id, 6, 20));
    // Agregar evento de validacion al campo de telefono
    document.getElementById("txtTelefono").addEventListener("keyup", (e) => revisar(e.target.id, 0, 10));
});

// Funcion para realizar la validacion de longitud de un campo
function revisar(id, min, max) {
    let txt = document.getElementById(id);
    txt.setCustomValidity(""); // Limpiar mensaje de validacion personalizado
    txt.classList.remove("is-valid");
    txt.classList.remove("is-invalid");

    // Verificar la longitud del valor y aplicar clases de Bootstrap segun corresponda
    if (txt.value.trim().length < min || txt.value.trim().length > max) {
        txt.setCustomValidity("Campo no valido"); // Establecer mensaje de validacion personalizado
        txt.classList.add("is-invalid"); // Marcar como invalido
    } else {
        txt.classList.add("is-valid"); // Marcar como valido
    }
}

// Funcion para inicializar los datos de usuarios si no existen en el almacenamiento local
function inicializarDatos() {
    let datos = localStorage.getItem("listaUsuarios");
    if (!datos) {
        // Crear un arreglo con datos iniciales si no existen
        let objUsuario = { contrasenia: "1234", telefono: "1234567890", nombre: "Arturo", correo: "Arturo@gmail.com" };
        let objUsuario1 = { contrasenia: "4321", telefono: "9876543219", nombre: "Jose", correo: "Jose@gmail.com" };
        let objUsuario2 = { contrasenia: "2314", telefono: "1342567189", nombre: "Alberto", correo: "Beto@gmail.com" };

        let usuarios = [objUsuario, objUsuario1, objUsuario2];
        localStorage.setItem("listaUsuarios", JSON.stringify(usuarios));
    }
}

// Funcion para cargar la tabla de usuarios
function cargarTabla() {
    inicializarDatos();
    let usuarios = JSON.parse(localStorage.getItem("listaUsuarios"));
    let tbody = document.querySelector("#tblUsuarios tbody");
    tbody.innerHTML = ""; // Limpiar contenido existente de la tabla

    // Iterar sobre los usuarios y agregar filas a la tabla
    usuarios.forEach((usuario, index) => {
        let fila = document.createElement("tr");
        
        let celdaNombre = document.createElement("td");
        celdaNombre.textContent = usuario.nombre;
        fila.appendChild(celdaNombre);

        let celdaCorreo = document.createElement("td");
        celdaCorreo.textContent = usuario.correo;
        fila.appendChild(celdaCorreo);

        let celdaTelefono = document.createElement("td");
        celdaTelefono.textContent = usuario.telefono;
        fila.appendChild(celdaTelefono);


        let celdaAccion = document.createElement("td");
        let botonEliminar = document.createElement("button");
        botonEliminar.classList.add("btn", "btn-danger");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.setAttribute("data-bs-toggle", "modal");
        botonEliminar.setAttribute("data-bs-target", "#modalEliminarUsuario");
        botonEliminar.onclick = function() {
            document.getElementById('nombreUsuarioEliminar').textContent = `"${usuario.nombre}"`;
            document.getElementById('btnEliminar').setAttribute('data-index', index);
        };
        celdaAccion.appendChild(botonEliminar);
        fila.appendChild(celdaAccion);

        tbody.appendChild(fila);
    });
}


// Funcion para eliminar un usuario
function eliminarUsuario(index) {
    let usuarios = JSON.parse(localStorage.getItem("listaUsuarios"));
    usuarios.splice(index, 1); // Eliminar el usuario del array
    localStorage.setItem("listaUsuarios", JSON.stringify(usuarios)); // Actualiza el almacenamiento local
    cargarTabla(); // Recarga la tabla para mostrar los datos actualizados
}

// Funcion para mostrar el modal de confirmacion de eliminacion
function mostrarConfirmacionEliminacion(nombre, index) {
    document.getElementById('nombreUsuarioEliminar').textContent = nombre; // Actualiza el texto en el modal
    document.getElementById('btnEliminar').dataset.index = index; // Guarda el índice en el botón de eliminar
    var modalEliminar = new bootstrap.Modal(document.getElementById('modalEliminarUsuario'));
    modalEliminar.show();
}

// Event listener para el boton de eliminar en el modal
document.getElementById('btnEliminar').addEventListener('click', function() {
    let index = this.getAttribute('data-index');
    eliminarUsuario(index);
    // Bootstrap 5
    var modalEliminar = bootstrap.Modal.getInstance(document.getElementById('modalEliminarUsuario'));
    modalEliminar.hide();
    // Bootstrap 4 y anteriores (en caso de que estes usando una version anterior)
    // $('#modalEliminarUsuario').modal('hide');
});

// Escuchar clic en el boton de confirmar eliminacion
document.getElementById('btnEliminar').addEventListener('click', function() {
    let index = this.dataset.index; // Obtiene el indice desde el botón de eliminar
    eliminarUsuario(index);
    var modalEliminar = bootstrap.Modal.getInstance(document.getElementById('modalEliminarUsuario'));
    modalEliminar.hide(); // Cierra el modal después de eliminar
});

// Funcion para cargar los datos en el formulario para editar
function cargarFormulario(index) {
    let usuarios = JSON.parse(localStorage.getItem("listaUsuarios"));
    let usuario = usuarios[index];
    document.getElementById('txtNombre').value = usuario.nombre;
    document.getElementById('txtEmail').value = usuario.correo; // Asumimos que el correo no es editable
    document.getElementById('txtTelefono').value = usuario.telefono;
    document.getElementById('usuarioIndex').value = index;

    // Configurar el modal para que sepa que estamos en modo edicion
    document.getElementById('mdlUsuarioLabel').textContent = 'Editar Usuario';
    var myModal = new bootstrap.Modal(document.getElementById('mdlUsuario'));
    myModal.show();
}


// Funcion para verificar si ya existe un usuario con el mismo correo
function existeUsuarioConCorreo(correo) {
    let usuarios = JSON.parse(localStorage.getItem("listaUsuarios"));
    return usuarios.some(usuario => usuario.correo === correo);
}

// Funcion para agregar un nuevo usuario a la lista
function agregarUsuario(nombre, correo, contrasenia, telefono) {
    let nuevoUsuario = { nombre: nombre, correo: correo, contrasenia: contrasenia, telefono: telefono };
    let usuarios = JSON.parse(localStorage.getItem("listaUsuarios"));
    usuarios.push(nuevoUsuario);
    localStorage.setItem("listaUsuarios", JSON.stringify(usuarios));
}


