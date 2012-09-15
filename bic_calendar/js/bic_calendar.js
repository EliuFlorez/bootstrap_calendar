/*
 *
 * BIC Calendar
 * Llicència Apache
 *
 */

$.fn.bic_calendar = function(options) {
    
    var opts = $.extend({}, $.fn.bic_calendar.defaults, options);
    
    this.each(function(){
        
        var calendario;
        var capaDiasMes;
        var capaTextoMesAnoActual = $('<div class="visualmesano"></div>');
        
        var dias = ["l", "m", "x", "j", "v", "s", "d"];
        var nombresMes = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
		
        //element llamado
        var elem = $(this);
                
        //mostrem el calendari
        mostrarCalendario();
        
        
        
        
        
        
        
        /*** functions ***/        
        
        //funció para mostrar el calendari
        function mostrarCalendario(){
            
            //dias de la semana
            var capaDiasSemana = $('<tr class="dias_semana" >');
            var codigoInsertar = '';
            $(dias).each(function(indice, valor){
                codigoInsertar += '<td';
                if (indice==0){
                    codigoInsertar += ' class="primero"';
                }
                if (indice==6){
                    codigoInsertar += ' class="domingo ultimo"';
                }
                codigoInsertar += ">" + valor + '</td>';
            });
            codigoInsertar += '</tr>';
            capaDiasSemana.append(codigoInsertar);
				
            //capa con los días del mes
            capaDiasMes = $('<table class="diasmes table table">');
				
            //un objeto de la clase date para calculo de fechas
            var objFecha = new Date();
            //miro si en el campo INPUT tengo alguna fecha escrita
            var textoFechaEscrita = elem.val();
            if (textoFechaEscrita!= ""){
                if (validarFechaEscrita(textoFechaEscrita)){
                    var arrayFechaEscrita = textoFechaEscrita.split("/");
                    //hago comprobación sobre si el año tiene dos cifras
                    if(arrayFechaEscrita[2].length == 2){
                        if (arrayFechaEscrita[2].charAt(0)=="0"){
                            arrayFechaEscrita[2] = arrayFechaEscrita[2].substring(1);
                        }
                        arrayFechaEscrita[2] = parseInt(arrayFechaEscrita[2]);
                        if (arrayFechaEscrita[2] < 50)
                            arrayFechaEscrita[2] += 2000;
                    }
                    objFecha = new Date(arrayFechaEscrita[2], arrayFechaEscrita[1]-1, arrayFechaEscrita[0])
                }
            }
				
            //mes y año actuales
            var mes = objFecha.getMonth();
            var ano = objFecha.getFullYear();
            //muestro los días del mes y año dados
            muestraDiasMes(mes, ano);
				
				
            //controles para ir al mes siguiente / anterior
            var botonMesSiguiente = $('<div class="span4" ><a href="#" class="botonmessiguiente span4"><i class="icon-arrow-right" ></i></a></div>');
            botonMesSiguiente.click(function(e){
                e.preventDefault();
                mes = (mes + 1) % 12;
                if (mes==0)
                    ano++;
                capaDiasMes.empty();
                muestraDiasMes(mes, ano);
                marcarEventos(mes, ano);
            })
            var botonMesAnterior = $('<div class="span4" ><a href="#" class="botonmesanterior span4"><i class="icon-arrow-left" ></i></a></div>');
            botonMesAnterior.click(function(e){
                e.preventDefault();
                mes = (mes - 1);
                if (mes==-1){
                    ano--;
                    mes = 11
                }	
                capaDiasMes.empty();
                muestraDiasMes(mes, ano);
                marcarEventos(mes, ano);
            })
				
            //capa para mostrar el texto del mes y ano actual
            var capaTextoMesAno = $('<div class="header row-fluid"></div>');
            var capaTextoMesAnoControl = $('<div colspan=5 class="mesyano span4"></div>');
            capaTextoMesAno.append(botonMesAnterior);
            capaTextoMesAno.append(capaTextoMesAnoControl);
            capaTextoMesAno.append(botonMesSiguiente);
            capaTextoMesAnoControl.append(capaTextoMesAnoActual);
				
            //calendario y el borde
            calendario = $('<div class="bic_calendar"></div>');
            calendario.prepend(capaTextoMesAno);
            //calendario.append(capaDiasSemana);
            //capaDiasMes.prepend(capaDiasSemana);
            calendario.append(capaDiasMes);
				
            //inserto el calendario en el documento
            elem.append(calendario);
            
            marcarEventos(mes, ano);
        }
		
                
                
        function muestraDiasMes(mes, ano){
            //console.log("muestro (mes, ano): ", mes, " ", ano)
            //muestro en la capaTextoMesAno el mes y ano que voy a dibujar
            capaTextoMesAnoActual.text(nombresMes[mes] + " " + ano);
			
            //muestro los días del mes
            var contadorDias = 1;
			
            //calculo la fecha del primer día de este mes
            var primerDia = calculaNumeroDiaSemana(1, mes, ano);
            //calculo el último día del mes
            var ultimoDiaMes = ultimoDia(mes,ano);
            
            var n_mes = mes + 1;
            
            var capaDiasMes_string = "";
			
            //escribo la primera fila de la semana
            for (var i=0; i<7; i++){
                if (i < primerDia){
                    var codigoDia = "";
                    if (i == 0)
                        codigoDia += "<tr>";
                    //si el dia de la semana i es menor que el numero del primer dia de la semana no pongo nada en la celda
                    codigoDia += '<td class="diainvalido';
                    if (i == 0)
                        codigoDia += " primero";
                    codigoDia += '"></td>';
                } else {
                    var codigoDia = "";
                    if (i == 0)
                        codigoDia += '<tr>';
                    codigoDia += '<td id="bic_cal_' + contadorDias + "_" +  n_mes  + "_" + ano + '" ';
                    if (i == 0)
                        codigoDia += ' class="primero"';
                    if (i == 6)
                        codigoDia += ' class="ultimo domingo"';
                    codigoDia += '><a>' + contadorDias + '</a></span>';
                    if (i == 6)
                        codigoDia += '</tr>';
                    contadorDias++;
                }
                capaDiasMes_string += codigoDia
            }
			
            //recorro todos los demás días hasta el final del mes
            var diaActualSemana = 1;
            while (contadorDias <= ultimoDiaMes){
                var codigoDia = "";
                if (diaActualSemana % 7 == 1)
                    codigoDia += "<tr>";
                codigoDia += '<td id="bic_cal_' + contadorDias + "_" + n_mes + "_" + ano + '" ';
                //si estamos a principio de la semana escribo la clase primero
                if (diaActualSemana % 7 == 1)
                    codigoDia += ' class="primero"';
                //si estamos al final de la semana es domingo y ultimo dia
                if (diaActualSemana % 7 == 0)
                    codigoDia += ' class="domingo ultimo"';
                codigoDia += '><a>' + contadorDias + '</a></td>';
                if (diaActualSemana % 7 == 0)
                    codigoDia += "</tr>";
                contadorDias++;
                diaActualSemana++;
                capaDiasMes_string += codigoDia
            }
			
            //compruebo que celdas me faltan por escribir vacias de la última semana del mes
            diaActualSemana--;
            if (diaActualSemana%7!=0){
                codigoDia = "";
                for (var i=(diaActualSemana%7)+1; i<=7; i++){
                    var codigoDia = "";
                    codigoDia += '<td class="diainvalido';
                    if (i==7)
                        codigoDia += ' ultimo'
                    codigoDia += '"></td>';
                    if (i==7)
                        codigoDia += '</tr>'
                    capaDiasMes_string += codigoDia
                }
            }
            
            capaDiasMes.append( capaDiasMes_string );
        }
        //función para calcular el número de un día de la semana
        function calculaNumeroDiaSemana(dia,mes,ano){
            var objFecha = new Date(ano, mes, dia);
            var numDia = objFecha.getDay();
            if (numDia == 0) 
                numDia = 6;
            else
                numDia--;
            return numDia;
        }
		
        //función para ver si una fecha es correcta
        function checkdate ( m, d, y ) {
            // función por http://kevin.vanzonneveld.net
            // extraida de las librerías phpjs.org manual en http://www.desarrolloweb.com/manuales/manual-librerias-phpjs.html
            return m > 0 && m < 13 && y > 0 && y < 32768 && d > 0 && d <= (new Date(y, m, 0)).getDate();
        }
		
        //funcion que devuelve el último día de un mes y año dados
        function ultimoDia(mes,ano){ 
            var ultimo_dia=28; 
            while (checkdate(mes+1,ultimo_dia + 1,ano)){ 
                ultimo_dia++; 
            } 
            return ultimo_dia; 
        } 
		
        function validarFechaEscrita(fecha){
            var arrayFecha = fecha.split("/");
            if (arrayFecha.length!=3)
                return false;
            return checkdate(arrayFecha[1], arrayFecha[0], arrayFecha[2]);
        }
        
        function marcarEventos(mes, ano){
            //[['10/03/2012', 'Jornada1', 'http://google.es'], []]
            var t_mes = mes + 1;
            var events = opts.events;
            
            for(var i=0; i< events.length; i++) {
                //alert(events[i][0]);
                
                if ( events[i][0].split('/')[1] == t_mes && events[i][0].split('/')[2] == ano ){
                    $('#bic_cal_' + events[i][0].replace(/\//g, "_") ).addClass('event');
                    
                    if ( events[i][2] == '' ){
                        $('#bic_cal_' + events[i][0].replace(/\//g, "_") + ' a' ).attr('href', 'javascript:false;');
                    } else {
                        $('#bic_cal_' + events[i][0].replace(/\//g, "_") + ' a' ).attr('href', events[i][2]);
                    }

                    $('#bic_cal_' + events[i][0].replace(/\//g, "_") + ' a' ).attr('rel', 'tooltip');
                    $('#bic_cal_' + events[i][0].replace(/\//g, "_") + ' a' ).attr('data-original-title', events[i][1]);
                    
                    if ( events[i][3] )
                        $('#bic_cal_' + events[i][0].replace(/\//g, "_") ).css('background', events[i][3]);
                }
            }
            /*
            events.each( function(event){
                if ( event[0].split('/')[1] == t_mes && event[0].split('/')[2] == ano ){
                    $('#bic_cal_' + event[0].replace(/\//g, "_") ).addClass('event');
                    $('#bic_cal_' + event[0].replace(/\//g, "_") + ' a' ).attr('href', event[2]);
                    $('#bic_cal_' + event[0].replace(/\//g, "_") + ' a' ).attr('rel', 'tooltip');
                    $('#bic_cal_' + event[0].replace(/\//g, "_") + ' a' ).attr('data-original-title', event[1]);
                }
            });*/
            
            $('.event a').tooltip();
        }
        
    /*** --functions-- ***/
        
        
        
    });
    return this;
};


//defaults values
/*$.fn.highlight.defaults = {  
    
    };*/