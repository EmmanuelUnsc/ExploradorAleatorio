# Explorador de contenido aleatorio

Programación Web III. Página que consume cuatro APIs públicas (citas, perros, gatos y datos curiosos) con `fetch` y `async/await`, alojada en un proyecto ASP.NET Core MVC.

## Integrantes

- Diego Emmanuel Gorostiaga Gonzales

## Instrucciones de ejecución

Requisitos: .NET 8 SDK (o posterior con el runtime de .NET 8) y conexión a Internet.

```bash
git clone https://github.com/EmmanuelUnsc/ExploradorAleatorio.git
cd ExploradorAleatorio
dotnet run --launch-profile http
```

Abrir `http://localhost:5053` en el navegador. También se puede abrir `ExploradorAleatorio.csproj` en Visual Studio y ejecutar con F5.

## Archivos principales

- `Views/Home/Index.cshtml`: las cuatro tarjetas (HTML con Bootstrap).
- `wwwroot/css/explorador.css`: estilos propios (tamaño uniforme de imágenes, mensaje de error).
- `wwwroot/js/explorador.js`: una función por API (`obtenerCita`, `obtenerPerro`, `obtenerGato`, `obtenerDatoCurioso`) y utilidades compartidas.

## Preguntas de reflexión

**1. ¿Qué es un endpoint y cuál utilizaste para cada API?**

Un endpoint es una dirección URL concreta de una API a la que se envía una solicitud para obtener un recurso. Todos se consultaron con el método GET:

| API | Endpoint |
|---|---|
| Citas (DummyJSON) | `https://dummyjson.com/quotes/random` |
| Perros (Dog CEO) | `https://dog.ceo/api/breeds/image/random` |
| Gatos (CATAAS) | `https://cataas.com/cat?json=true` y luego la imagen en `https://cataas.com/cat/{id}` |
| Datos curiosos (Useless Facts) | `https://uselessfacts.jsph.pl/api/v2/facts/random?language=en` |

**2. ¿Qué diferencia existe entre recibir JSON y recibir directamente una imagen?**

JSON es texto con datos estructurados (por ejemplo `{"id": "B2n9...", "mimetype": "image/jpeg"}`) que se convierte en un objeto de JavaScript con `response.json()` para leer sus campos. Una imagen son bytes binarios: no se puede leer como JSON (fallaría), sino que se muestra poniendo su URL en el `src` de un `<img>`. Por eso con CATAAS primero se pide `cat?json=true` para obtener el `id`, y después se arma la URL `cat/{id}` para la etiqueta `<img>`.

**3. ¿Qué función cumplen `await` y `response.json()`?**

`fetch` devuelve una promesa: la respuesta no llega al instante. `await` pausa la función `async` hasta que la promesa se resuelve, sin bloquear el resto de la página. `response.json()` lee el cuerpo de la respuesta y lo convierte de texto JSON a un objeto de JavaScript; también devuelve una promesa, por eso se usa con `await`.

**4. ¿Por qué se debe verificar `response.ok` además de utilizar `try/catch`?**

`fetch` solo lanza un error (que captura el `catch`) cuando no hay respuesta, por ejemplo sin Internet. Si el servidor responde con un error HTTP como 404 o 500, `fetch` lo considera una respuesta válida y no entra al `catch`. `response.ok` es `true` solo con códigos 200 a 299; si es `false`, el código lanza un error a mano para que el `catch` muestre el mensaje.

**5. ¿Cómo lograste actualizar una sección sin recargar toda la página?**

Cada botón tiene un `addEventListener("click", ...)` que llama a la función de su sección. Esa función hace la consulta con `fetch` y modifica solo los elementos de su tarjeta (`textContent` del texto o `src` de la imagen) buscándolos por su `id`. No se envía ningún formulario ni se navega, así que el navegador no recarga la página y las otras secciones no cambian. Como cada función tiene su propio `try/catch/finally`, si una API falla las demás siguen funcionando.
