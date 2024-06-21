let paso =1;
const pasoInicial=1;
const pasoFinal=3;

const cita = {
    id: '',
    nombre:'',
    fecha:'',
    hora:'',
    servicios: []
}

document.addEventListener('DOMContentLoaded',function(){
    iniciarApp();
});

function iniciarApp() {
    mostrarSeccion(); // muestra y oculta las secciones
    tabs(); //cambia la seccion cuando se presionen los tabs
    botonesPaginador(); //Agrega o quita los botones del paginador
    paginaSiguiente();
    paginaAnterior();

    consultarAPI();//consulta la API en el backend php

    idCliente();
    nombreCliente();//añade el nombre del cliente al objeto de cita
    seleccionarFecha();//Añade  la fecha de la cita en el objeto
    seleccionarHora(); //Añade la hora de la cita en el objeto 

    mostrarResumen();// Muestra el resumen de la cita

}

function mostrarSeccion(){

    //oculta la seccion que tenga la clase de mostrar
    const seccionAnterior = document.querySelector('.mostrar');
    if(seccionAnterior){
        seccionAnterior.classList.remove('mostrar');
    }

    //Seleccionar la seccion con el paso...
    const pasoSelector = `#paso-${paso}`;// armo selector de tipo "paso-1/2/3"
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add('mostrar'); //agrego clase mostrar css

    //quitar la clase de actual al tab anterior
    const tabAnterior = document.querySelector('.actual');
    if (tabAnterior) {
        tabAnterior.classList.remove('actual');
    }

    //Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');

}

function tabs(){

    const botones = document.querySelectorAll('.tabs button');
    botones.forEach(boton =>{
        boton.addEventListener('click', function(e){
            paso = parseInt(e.target.dataset.paso);
            mostrarSeccion();
            botonesPaginador();

        })
    })

}

function botonesPaginador(){
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if (paso === 1){
       paginaAnterior.classList.add('ocultar'); 
       paginaSiguiente.classList.remove('ocultar');
    }else if (paso === 3) {
        paginaAnterior.classList.remove('ocultar'); 
        paginaSiguiente.classList.add('ocultar');
        mostrarResumen();
    }else{
        paginaAnterior.classList.remove('ocultar'); 
        paginaSiguiente.classList.remove('ocultar');
    }
    mostrarSeccion();
}

function paginaAnterior(){
   const paginaAnterior = document.querySelector('#anterior');
   paginaAnterior.addEventListener('click', function(){
        if (paso <= pasoInicial) return;    
        paso--;
        botonesPaginador();

   }) 
}

function paginaSiguiente(){
    const paginaSiguiente= document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', function(){
        if (paso >= pasoFinal) return;    
        paso++;
        botonesPaginador();
    })
}

async function consultarAPI(){

    try {
        //const url =  'http://localhost:3000/api/servicios'; asi estaba cuando desarrollamos
        //const url = `${location.origin}/api/servicios`; si lo llevamos a otro dominio
        const url =  '/api/servicios'; //esto funciona si el backend y estos archivos js en el mismo dominio
        const resultado = await fetch(url);
        const servicios = await resultado.json();
        
        mostrarServicios(servicios);

    } catch (error){
        console.log(error);
    }
}

function mostrarServicios(servicios){
    
     servicios.forEach( servicio => {
        const {id, nombre, precio} = servicio;
      
        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = precio;//`$${precio}`;

        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;
        servicioDiv.onclick = function(){
            seleccionarServicio(servicio);
        }

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        document.querySelector('#servicios').appendChild(servicioDiv);
    }); 
}

function seleccionarServicio(servicio){
    const{id} = servicio;
    const {servicios} = cita;
    //identificar al elemento al que se le da click 
    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);
    //Comprobar si un servicio ya fue agregado
    // .some itera sobre el arreglo y es util para realizar la comparacion de servicios agragedos
    if(servicios.some(agregado=>agregado.id === servicio.id)){
        //Eliminarlo
        cita.servicios = servicios.filter(agregado => agregado.id !== id);
        divServicio.classList.remove('seleccionado');
    }else {
        //Agregarlo
         cita.servicios = [...servicios, servicio];
         divServicio.classList.add('seleccionado');
    }
   
}

function idCliente(){
    const id = document.querySelector('#id').value;
    cita.id = id;
}

function nombreCliente(){
    const nombre = document.querySelector('#nombre').value;
    cita.nombre = nombre;
}

function seleccionarFecha(){
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function(e){
        const dia = new Date(e.target.value).getUTCDay();
        
        if([6, 0].includes(dia)){
            e.target.value= '';
            mostrarAlerta('Fines de semana no permitidos','error', '.formulario');
        }else{
            cita.fecha = e.target.value;
        }
        
    });
}

function seleccionarHora(){
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function(e){
        
        const horaCita = e.target.value;
        const hora = horaCita.split(":")[0]; //accedo a la hora como un arreglo despues de habre sido separada con split
        if (hora <10 || hora >18){
            e.target.value= '';
            mostrarAlerta('Hora no válida','error', '.formulario')
        } else {
            cita.hora = e.target.value;
        } 

    })
}

function mostrarAlerta(mensaje, tipo,elemento, desaparece = true){
    //previene que se genere mas de una alerta
    const alertaPrevia = document.querySelector('.alerta');
    if (alertaPrevia){
        alertaPrevia.remove();
    } 
    
    //scrpting de alerta
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);
    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);
    if (desaparece) {
        //Eliminar alerta despues de un determinado tiempo
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
    

}

function mostrarResumen(){
    const resumen = document.querySelector('.contenido-resumen');
    
    //Limpiar el contenido de Resumen
    while(resumen.firstChild){
        resumen.removeChild(resumen.firstChild);
    }

    if(Object.values(cita).includes('') || cita.servicios.length === 0){
        mostrarAlerta('Hacen falta datos o no se seleccionaron Servicios','error','.contenido-resumen',false);
        return;
    } 

    //formatear el div de resumen
    const {nombre, fecha, hora, servicios} = cita;
    
    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML= `<span>Nombre:</span> ${nombre}`; 

    //Formatear la fecha en español
    const fechaObj =new Date(fecha);
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() + 2;
    const year = fechaObj.getFullYear();
    const fechaUTC =  new Date(Date.UTC(year, mes, dia));
    const opciones = { weekday:'long', year: 'numeric', day: 'numeric'};
    const fechaFormateada = fechaUTC.toLocaleDateString('es-AR', opciones);

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML= `<span>Fecha:</span> ${fechaFormateada}`; 

    const horaCita = document.createElement('P');
    horaCita.innerHTML= `<span>Hora:</span> ${hora} Horas`; 

   
    //Heading para servicios en Resumen
    const headingServicios = document.createElement('H3');
    headingServicios.textContent= 'Resumen de Servicios';
    resumen.appendChild(headingServicios);

    //iterando mostrando servicios
    servicios.forEach(servicio => {

        const {id, precio, nombre} = servicio;

        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');
        
        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.innerHTML =`<span>Precio:</span> $${precio}`;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio);

    })

       //Heading para Cita en Resumen
       const headingCita = document.createElement('H3');
       headingCita.textContent= 'Resumen de Cita';
       resumen.appendChild(headingCita);
    
       const botonReservar = document.createElement('BUTTON');
       botonReservar.classList.add('boton');
       botonReservar.textContent = 'Reservar Cita';
       botonReservar.onclick = reservarCita;

       resumen.appendChild(nombreCliente);
       resumen.appendChild(fechaCita);
       resumen.appendChild(horaCita);

       resumen.appendChild(botonReservar);


}   

async function reservarCita(){

    const {nombre, fecha, hora, servicios, id} = cita;

    const idServicios = servicios.map(servicio => servicio.id);

    const datos = new FormData();
    datos.append('fecha', fecha);
    datos.append('hora', hora);
    datos.append('usuarioId', id);
    datos.append('servicios', idServicios);
    try {
        //peticion a la api
        const url = '/api/citas';

        const respuesta = await fetch(url, {
            method: 'POST',
            body: datos
        });
        
        const resultado = await respuesta.json();
        console.log(resultado.resultado);
        if (resultado.resultado) {
            Swal.fire({
                icon: 'success',
                title: 'Cita Creada',
                text: 'Tu cita fue creada correctamente!',
                button: "OK"
            }).then(()=> {
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
                
            })
        } 
        //console.log([...datos]); //para controlar lo que cargamos en FormData y verlo por consola
 
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error...",
            text: "Hubo un error al guardar la cita!"
            
          });
    }
    
}


