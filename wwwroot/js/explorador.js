const urlCitas = "https://dummyjson.com/quotes/random";
const urlPerros = "https://dog.ceo/api/breeds/image/random";
const urlGatos = "https://cataas.com/cat?json=true";
const urlDatosCuriosos = "https://uselessfacts.jsph.pl/api/v2/facts/random?language=en";

// Utilidades compartidas por las cuatro secciones

function iniciarCarga(boton, estado, contenido) {
    boton.disabled = true;
    estado.classList.remove("error");
    estado.textContent = "Cargando…";
    contenido.classList.add("d-none");
}

function mostrarError(estado, mensaje) {
    estado.classList.add("error");
    estado.textContent = mensaje + " Presiona el botón para reintentar.";
}

async function consultarJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("La API respondió con el estado " + response.status);
    }
    return await response.json();
}

function cargarImagen(imagen, url) {
    return new Promise((resolve, reject) => {
        imagen.onload = resolve;
        imagen.onerror = () => reject(new Error("No se pudo cargar la imagen"));
        imagen.removeAttribute("src");
        imagen.src = url;
    });
}

// Citas y autores (DummyJSON)

async function obtenerCita() {
    const boton = document.getElementById("botonCita");
    const estado = document.getElementById("estadoCita");
    const contenido = document.getElementById("contenidoCita");

    iniciarCarga(boton, estado, contenido);
    try {
        const datos = await consultarJson(urlCitas);
        document.getElementById("textoCita").textContent = datos.quote;
        document.getElementById("autorCita").textContent = datos.author;
        estado.textContent = "";
        contenido.classList.remove("d-none");
    } catch (error) {
        console.error(error);
        mostrarError(estado, "No se pudo obtener la cita.");
    } finally {
        boton.disabled = false;
    }
}

// Imágenes de perros (Dog CEO)

async function obtenerPerro() {
    const boton = document.getElementById("botonPerro");
    const estado = document.getElementById("estadoPerro");
    const imagen = document.getElementById("imagenPerro");

    iniciarCarga(boton, estado, imagen);
    try {
        const datos = await consultarJson(urlPerros);
        await cargarImagen(imagen, datos.message);
        estado.textContent = "";
        imagen.classList.remove("d-none");
    } catch (error) {
        console.error(error);
        mostrarError(estado, "No se pudo mostrar la imagen del perro.");
    } finally {
        boton.disabled = false;
    }
}

// Imágenes de gatos (CATAAS): el JSON trae el id y la imagen se pide a /cat/{id}

async function obtenerGato() {
    const boton = document.getElementById("botonGato");
    const estado = document.getElementById("estadoGato");
    const imagen = document.getElementById("imagenGato");

    iniciarCarga(boton, estado, imagen);
    try {
        const datos = await consultarJson(urlGatos);
        await cargarImagen(imagen, "https://cataas.com/cat/" + datos.id);
        estado.textContent = "";
        imagen.classList.remove("d-none");
    } catch (error) {
        console.error(error);
        mostrarError(estado, "No se pudo mostrar la imagen del gato.");
    } finally {
        boton.disabled = false;
    }
}

// Datos curiosos (Useless Facts)

async function obtenerDatoCurioso() {
    const boton = document.getElementById("botonDato");
    const estado = document.getElementById("estadoDato");
    const contenido = document.getElementById("textoDato");

    iniciarCarga(boton, estado, contenido);
    try {
        const datos = await consultarJson(urlDatosCuriosos);
        contenido.textContent = datos.text;
        estado.textContent = "";
        contenido.classList.remove("d-none");
    } catch (error) {
        console.error(error);
        mostrarError(estado, "No se pudo obtener el dato curioso.");
    } finally {
        boton.disabled = false;
    }
}

document.getElementById("botonCita").addEventListener("click", obtenerCita);
document.getElementById("botonPerro").addEventListener("click", obtenerPerro);
document.getElementById("botonGato").addEventListener("click", obtenerGato);
document.getElementById("botonDato").addEventListener("click", obtenerDatoCurioso);

obtenerCita();
obtenerPerro();
obtenerGato();
obtenerDatoCurioso();
