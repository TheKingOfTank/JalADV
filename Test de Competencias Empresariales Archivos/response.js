/******************************************************************************
 * Funciones genericas de utilidad
 *****************************************************************************/
$.fn.countGroupingBy = function(predicate) {
  var $array = $(this),
      grouped = {},count = 0;

  $.each($array, function (idx, obj) {
    var $obj = $(obj);
        groupKey = predicate($obj);
    if (typeof(grouped[groupKey]) === "undefined") {
      grouped[groupKey] = $();
      count++;
    }
    grouped[groupKey] = grouped[groupKey].add($obj);
  });

  return count;
}

var canIUse = function(type) {
	var input = document.createElement("input");
	input.setAttribute("type", type);
	return input.type == type;
}


function questionById(questionId){
	return $('[data-ee-question='+questionId+']');
}

function optionInputById(optionId){
	return $('[data-ee-option='+optionId+']');
}

var endsWith = function(string, suffix) {
    return string.indexOf(suffix, string.length - suffix.length) !== -1;
};

function disableOptions($options, disabled){
	$options.prop('disabled',disabled);
	$options.closest('.answer').toggleClass('disabled',disabled);
}

function disableSubmitButtons() {
	$('[type="submit"]').click(function(){return false;});
}

function submitForm(){
	// Aplicamos un retardo para que cualquier evento pendiente (nuestro o de una plantilla creada por el cliente) haga efecto.
	setTimeout(function(){$('[data-ee-button-continue], [data-ee-button-end]').click()},50);
	
}

/*
 * Intenta cargar un script, pero ejecuta el callback aunque la petición no se complete satisfactoriamente
 */
function tryGetScript(url, callback){
	 $.ajax({
		cache: true,
	  	url: url,
	  	dataType: "script",
	  	timeout: 100,
	  	complete: callback
	});
}

var loadJQueryUIAndCallback = function(callback){
	if(typeof($.ui) == "undefined"){
		$("head").append($('<link rel="stylesheet" href="'+jqueryuiCssUrl+'" type="text/css" media="screen" />'));
		$.getScript(jqueryuiJSUrl,function(){
			$.ajax({ url: jqueryuiDatePickeri18nJSUrl,async: false, dataType: 'script',cache: 'true'});
			callback();
		});	
	}else 
		callback();
}

var loadJQueryTimePickerAndCallback = function(callback){
	
	if(typeof($.datetimepicker) == "undefined"){
		$("head").append($('<link rel="stylesheet" href="'+jqueryuiTimePickerCssUrl+'" type="text/css" media="screen" />'));
		$.getScript(jqueryuiTimePickerJSUrl,function(){
			tryGetScript(jqueryuiTimePickeri18nJSUrl,callback);
		});
	} else 
		callback();
}
/******************************************************************************/

// EFECTOS DE ICONOS
function iconOnSelect($inputs, milliSeconds){
	if(!milliSeconds || milliSeconds == 0){
		iconOnSelect_instantatenous($inputs);
	}else{
		iconOnSelect_progressive($inputs, milliSeconds);
	}
}

function iconOnSelect_instantatenous($inputs){
	$inputs.on("change populate",function(){
		$inputs.filter(':checked').closest('td').prevAll().find('[class^="selector-icon"]').addClass('selector-icon-marked');
		$inputs.filter(':checked').closest('td').nextAll().find('[class^="selector-icon"]').removeClass('selector-icon-marked');
	});
	$inputs.filter(':checked').populate('populate');
}

function iconOnSelect_progressive($inputs, milliSeconds){
	$inputs.on("change populate",function(){
		if($(this).is(':checked')){
			var $selectors = $inputs.next();
			var numMarked = $selectors.filter(".selector-icon-marked").length;
			var indexChecked = $inputs.index($(this));
			if(numMarked < indexChecked ){
				var first = numMarked;
				var last = indexChecked-1;
			} else {
				var first = numMarked-1;
				var last = indexChecked;
			}
			toggleMarked(first, last, $selectors);
		}
	});
	
	function toggleMarked(index, last, $selectors){
		$($selectors.get(index)).toggleClass('selector-icon-marked');
		if(index != last){
			index < last ? ++index:--index;
			setTimeout(function(){toggleMarked(index,last,$selectors);},milliSeconds);
		}
	}
	$inputs.filter(':checked').trigger('populate');
}

function multipleOptionChecked(e){
	var $option = $(e.target);
	
	// Máximo número de opciones seleccionadas
	var $parentWithMaxNumOptionsSelected = $option.closest('[data-ee-maxNumOptionsSelected]');
	if($parentWithMaxNumOptionsSelected.length){
		checkMaxNumOptionsSelected($parentWithMaxNumOptionsSelected);
	}
	
	// Opción excluyente (N/A)
	if($option.attr('data-ee-exclusiveOption')){
		checkExclusiveOptionSelected($option);
	}
}

/*
 * Numero maximo de opciones
 */
function checkMaxNumOptionsSelected($limited){
	var limit = $limited.attr('data-ee-maxNumOptionsSelected');
	var bol = $limited.find('[data-ee-option],[data-ee-others-enabler]').filter(':checked').length >= limit;
	$limited.find('[data-ee-option],[data-ee-others-enabler]').not(':checked').each(function(){
		var $this = $(this);
		$this.attr("disabled",bol);
		// Hay que deshabilitar el campo others tb:
		if($this.has('data-ee-others-enabler')){
			$('input[name="'+$this.attr('name').replace('questions','others')+'"]').attr("disabled",bol); 	 
		}
	});
}

/*
 * Opcion Excluyente (N/A)
 */
function checkExclusiveOptionSelected($option){
	var $options = $option.closest('[data-ee-question]').find('[data-ee-option],[data-ee-others-enabler]').not($option);
	// Las que estuvieran marcadas son desmarcadas mediante click por si hay que disparar algun trigger
	$options.filter(':checked').click();
	// Habilitamos y deshablitamos el resto de opciones en funcion de si estamos marcando o marcando la excluyente
	disableOptions($options,$option.is(':checked'));
}

/*******************************************************
 * Filtros ocultar/mostrar (TRIGGERS)
 */
function enableTriggers(){
	// Creamos un evento para todos los inputs de las preguntas que son origen de filtro.
	// Presuponemos que tenemos dos objetos json declarados:
	// triggerTargetIds: contiene, para cada pregunta, aquellas a las que puede llegar a mostrar.
	// triggerShowerIds: contiene, para cada pregunta, las opciones de respuestas que la muestran.
	if(!$.isEmptyObject(triggerTargetIds)){
		var allTargetIds = [];
		$.each(triggerTargetIds,function(questionId,targetIds){
			var $q = questionById(questionId);
			$q.find('input').on('click',function(){
				for(t in targetIds){checkTargetVisibility(targetIds[t]);}
			});
			$q.find('select').on('change populate',function(){
				for(t in targetIds){checkTargetVisibility(targetIds[t]);}
			});
			
			allTargetIds = allTargetIds.concat(targetIds);
		});
		
		// Eliminamos repetidos
		allTargetIds = allTargetIds.filter(function(item, pos, self) {return self.indexOf(item) == pos;});
		// Ejecutamos los filtros, por si viniera informado algún valor, y eso supusiera tener que mostrar otro.
		$.each(allTargetIds,function(index,element){
			checkTargetVisibility(element);
		});
	}
}

function checkTargetVisibility(questionId){
	var visible = questionById(questionId).is(':visible');
	var showerIds = triggerShowerIds[questionId];
	var show = false;
	for(s in showerIds){
		var $shower = optionInputById(showerIds[s]);
		if( !$shower.prop('disabled') && ( $shower.is(':checked') || $shower.is(':selected') ) ){
			show = true;
			break;
		}
	}
	
	// Mostramos si estaba oculta
	if(show && !visible){
		questionById(questionId).show().find(':input,option').prop('disabled',false).filter('[type="checkbox"]').trigger('populate');
	}
	// Ocultamos si estaba visible
	if(!show && visible){
		questionById(questionId).hide().find(':input,option').prop('disabled',true);
	}
	// Comprobamos si hay que ocultar o mostrar alguna pregunta en cascada
	if(show != visible){
		for(t in triggerTargetIds[questionId]){
			checkTargetVisibility(triggerTargetIds[questionId][t]);
		}
	}
}
/*******************************************************/

/*******************************************************
 * Modos de visualizacion
 */
$.fn.canAutoAdvance = function(){
	var $question = $(this);
	if($question.find('input:checkbox, textarea').size() > 0) return false;
	if(!$question.has('[data-ee-option],[data-ee-others-enabler]')) return false;
	if($question.find('input:text,input[type="range"],input[type="email"],input[type="number"],select').size() > 1) return false;
	if($question.find('input:radio').countGroupingBy(function(val){return val.attr('name');}) > 1)return false;
	return true;
}

$.fn.onAdvance = function(callback){
	$(this).find('[data-ee-option],[data-ee-others]').change(callback);
	$(this).find('option[data-ee-option]').closest('select').change(callback);
	$(this).find('input:text[data-ee-option],input:text[data-ee-others]').keypress(function(e) {if(e.which == 13) callback()});
} 


$.fn.flowTo = function(){
	var $elem = $(this);
	$('html,body').animate({scrollTop: $elem.offset().top  + ($elem.height()/2) - $(window).height() / 2}, 150);
	$('.focused').not($elem).removeClass('focused');
	$elem.addClass('focused');
}

flowToNextQuestion = function(e){
	$(e.target).closest('[data-ee-question]').next('[data-ee-question]').flowTo();
}

enableKiosk = function(){
	var $answerableQuestions = $('[data-ee-question]').has('[data-ee-option],[data-ee-others]');
	if($answerableQuestions.size() != 1) return false; // Si hay más de una pregunta respondibles, no lo habilitamos
	var $uniqueAnswerableQuestion = $answerableQuestions.first();
	if(triggerShowerIds[$uniqueAnswerableQuestion.data('ee-question')]) return false; // Si la pregunta muestra algún contenido, no lo hablitamos.
	if(!$uniqueAnswerableQuestion.canAutoAdvance()) return null; // Si la pregunta no soporta autoAdvance, no lo habilitamos
	// Habilitamos el envío de formulario si pula una opcion de respuesta o pulsa enter en la entrada de texto
	$uniqueAnswerableQuestion.onAdvance(submitForm);
}


enableFlow = function(){
	var $questions = $('[data-ee-question]'); 
	$questions.filter(function(i,e){return $(e).canAutoAdvance()}).onAdvance(flowToNextQuestion);
	$questions.filter(':not([data-ee-answerable])').click(flowToNextQuestion);
	$questions.on('focusin',function(e){
		$(this).flowTo();
	});
	$questions.filter('[data-ee-answerable]').on('click',function(e) {
		if($(this).is(':not(.focused)')){e.preventDefault();}
		$(this).trigger('focusin');
	});
	$questions.first().flowTo();

	$(window).scroll(function(e) {
	    clearTimeout($.data(this, 'scrollTimer'));
	    $.data(this, 'scrollTimer', setTimeout(function() {
	    	if(!$('html, body').is(':animated') && e.originalEvent){ // Solo ajustamos el foco si el scroll es disparado por el usuario, no por nosotros
				var scrollTop = $(document).scrollTop() + ($(window).height() / 2);
				$questions.filter(function(i,e){return $(e).offset().top < scrollTop }).last().flowTo();
			}
	    }, 100));
	});
} 


/*******************************************************/

/*******************************************************
 * Preguntas tipo ordenacion (sorting)
 */
function checkTouchAndEnableSorting(){
	// Adaptación de sortable a dispositivos con pantalla tactil (la versión actual de jQuery UI no soporta eventos táctiles) 
	if('ontouchstart' in window){
		$.getScript(jqueryuiTouchPunchJSUrl,enableSorting);
	}else{
		enableSorting();
	}
}

function enableSorting(){
	$('[data-ee-sortable]').each(function(){
		var $list = $(this);
		$list.sortable({placeholder: "q_sortable_placeholder",  update: rearrange, start: function(e, ui){ui.placeholder.height(ui.item.height());}}).disableSelection();
		// Por si tienen que venir ordenadas de alguna forma (pulsamos "atrás", valores por defecto...
		var $listItems = $list.find('li').sort(function(a, b) {
			var comp = $(a).find('input').val()-$(b).find('input').val();
			return comp<0?-1:(comp==0?0:1); 
		});
		$list.find('li').remove();
		$list.append($listItems);
	});
}

function rearrange(event){
	$(event.target).children().each(function(index){$(this).find('input').val(index+1)});
}
/*******************************************************/


/*******************************************************
 * Preguntas tipo rango
 */
function enableRangeInput($input,rangeOnInputSupported){
	if(canIUse("range")){
		$input.on("change populate",populateChangeToOutput);
		if(!$('[name="' + $input.attr('name') + '_output"]').html()){
			// Cambia el nombre al slider hasta que se haya pulsado sobre él,
			// para evitar guardar valores que el encuestado no haya seleccionado.
			$input.attr('name',"unused_" + $input.attr('name'));
			if(rangeOnInputSupported){
				$input.on('input',function(){
					$input.attr('name',$input.attr('name').replace("unused_",""));
					$input.trigger('populate');
				});
			}else{
				$input.on('change populate',function(){
					$input.attr('name',$input.attr('name').replace("unused_",""));
				});
			}
		}
		// Modificación de estilos para mostrado como tabla:
		$input.parent('li').addClass('answer-range');
		
		
	}else{
		// Degradacion elegante para navegadores que no soporten input tipo range
		value.type="number";
	}
}

// Control del display del valor de los rangos
function populateChangeToOutput(event){
	$('output[name="'+event.target.name+'_output"]').val(event.target.value);
}
/*******************************************************/

/*******************************************************
 * OTHERS
 * Para cada input con un open asociado, vincula dos eventos:
 * - Cuando el unput cambie, lleva el valor a un atributo backup o lo trae de vuelta.
 * - En el focus del open, marca como seleccionado el input
 */
function enableOthersEvents($open){
	var $inputOthers = $('input[name="'+$open.attr('name').replace('others','questions')+'"][value="0"]');
	var $inputs = $('input[name="'+$open.attr('name').replace('others','questions')+'"][value!="others"]');
	
	// Recuperar backup y habilitar/deshabilitar obligatoriedad del input text
	$inputOthers.on('change populate',function(){
		$open.attr('required',$inputOthers.prop('checked') && $inputOthers.attr('required'));
		if(!$open.val()){
			$open.val($open.attr('data-backup'));
		}
	});
	// Crear backup
	$inputs.on("change populate",function(){
		$open.attr('required',$inputOthers.prop('checked') && $inputOthers.attr('required'));
		if(!$inputOthers.prop('checked')){
			$open.attr('data-backup',$open.val()).val('');
		}
	});

	
	
	// Seleccionar opción others al pulsar sobre el input	
	$open.focus(function(){
		if(!$inputOthers.prop('checked'))
			$inputOthers.prop('checked',true).trigger('populate');
	});
}

/*******************************************************/
$(document).ready(function() {

	enableTriggers();
	
	$(".surveyForm.KIOSK").each(enableKiosk);
	
	$(".surveyForm.FLOW").each(enableFlow);
	
	var $allInputs = $('#surveyForm :input');
	
	// Al cargar la página, deshabilitamos todas las preguntas ocultas (para que no obligue a responderlas).
	$('[data-ee-question][hidden="hidden"]').find(':input').prop('disabled',true);
	
	// Preguntas tipo ordenacion
	if($('[data-ee-sortable]').length){loadJQueryUIAndCallback(checkTouchAndEnableSorting);}
		
	// Opción otros (Others)
	$allInputs.filter('[data-ee-others]').each(function(index,option){enableOthersEvents($(option));});

	// Una opción por columna
	$('[data-ee-oncepercolumn] [data-ee-option]').on("change populate",function(event){
		var $cell = $(event.target).closest('td');
		$cell.closest('tbody').find('tr').children('td:nth-child('+($cell.index()+1)+')').not($cell).find('input').prop('checked',null);
	});
	
	// Deshabilitar opciones por número máximo de opciones seleccionadas
	$('[data-ee-maxNumOptionsSelected]').each(function(index,el){checkMaxNumOptionsSelected($(el));});
	
	// Deshabilitar opciones por selección de opción excluyente (N/A)
	$('input[type="checkbox"][data-ee-exclusiveOption]').filter(':checked').each(function(index,el){checkExclusiveOptionSelected($(el));});
	
	// Habilitar habilitación/deshabilitacion de opciones al interactuar con preguntas de opcion múltiple (maxNumOpcionSelected y exclusiveOption)
	$('input[type="checkbox"][data-ee-exclusiveOption], [data-ee-maxNumOptionsSelected] input[data-ee-option][type="checkbox"]').on("change populate",multipleOptionChecked);
	
	// Preguntas tipo rango numérico
	var rangeOnInputSupported = !!navigator.userAgent.match(/Trident/) ? false : true;
	$allInputs.filter('[type="range"]').each(function(index,input){enableRangeInput($(input),rangeOnInputSupported);});

	/*
	 * Carga dinámica de módulos (con jquery.getScript y  ("head").append($("<link rel='stylesheet' href='style.css' type='text/css' media='screen' />"));)
	 */
	// AUDIO
	var a = document.createElement('audio');
	var canIUseAudio =  !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
	if(!canIUseAudio && $('audio').length > 0) {
		$("head").append($('<link rel="stylesheet" href="'+staticDomain+'/jquery/audioplayer/audioplayer.min.css" type="text/css" media="screen" />'));
		$.getScript(staticDomain+'/jquery/audioplayer/audioplayer.min.js',function(){$('audio').audioPlayer()});
	}

	// DATE,DATETIME & TIME PICKER
	var $dateInputs = $allInputs.filter('[type="date"]');
	var $datetimeInputs = $allInputs.filter('[type="datetime-local"]');
	var $timeInputs = $allInputs.filter('[type="time"]');
	if( ($dateInputs.length && !canIUse('date')) || ($datetimeInputs.length && !canIUse('datetime-local')) ||($timeInputs.length && !canIUse('time'))  ){
		// Load date jQueryUI component
		loadJQueryUIAndCallback(function(){
			// Enable date jQueryUI component
			if(($dateInputs.length && !canIUse('date')) ){
				$dateInputs.datepicker({dateFormat : 'yy-mm-dd'});
			}
			// Load and enable date jQueryUI compoennt
			if(($datetimeInputs.length && !canIUse('datetime-local')) ||($timeInputs.length && !canIUse('time'))){
				loadJQueryTimePickerAndCallback(function(){
					$datetimeInputs.datetimepicker({dateFormat : 'yy-mm-dd',timeFormat : 'HH:mm'});
					$timeInputs.timepicker({timeFormat : 'HH:mm'});
				});
			}
		});
	}


});
