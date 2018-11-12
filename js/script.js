$( document ).ready(function() {	
	//variabelen
		//screen2
	var track_currentTime = 0;
	var track_finishTime = null; 
	var antwoord_timer = 0;
	var track_is_gestart = false;
	var opt1_clicked = false;
	var opt2_clicked = false;
	var opt3_clicked = false;
	var opt4_clicked = false;
	var huidige_vraag = 1;
		//screen1
	var phone_desktop_keuze=null;
	var headset_speaker_keuze=null;
	var timestamp_sessie = new Date();
	
	//js_database
	var pictogrammen_lijst = {
		1 : { 1: 	'jacht' , 2: 'honger',3:'tijger' ,4: 'vrouw'  },
		2 : { 1: 	'beesten' , 2: 'jacht',3:'koe' ,4: 'eten'  },
		3 : { 1: 	'koe' , 2: 'maan',3:'zon' ,4: 'opkomt'  },
		4 : { 1: 	'konijn' , 2: 'kijken',3:'zorgen' ,4: 'helpen'  },
		5 : { 1: 	'koe' , 2: 'konijn',3:'skelet',4: 'stier'  },
		6 : { 1: 	'konijn' , 2: 'kop',3:'skelet',4: 'stier'  },
		7 : { 1: 	'wereld' , 2: 'riep',3:'tijger' ,4: 'halt'  },
		8 : { 1: 	'koe'   , 2: 'eten',3:'vrouw' ,4: 'dood'  },
		9 : { 1: 	'tijger' , 2: 'bang' ,3:'konijn' ,4: 'vroeg'  },
		10 : { 1: 	'jacht' , 2: 'tijger',3:'konijn' ,4: 'eten'  },
		11 : { 1: 	'heuvel' , 2: 'dikke',3:'koe' ,4: 'wacht'  },
		12 : { 1: 	'konijn' , 2: 'heuvel',3:'rots' ,4: 'tijger'  },
		13 : { 1: 	'dood' , 2: 'tijd',3:'koe' ,4: 'konijn'  },		
	}
	var js_database = {
		schermkeuze : null,
		speakerkeuze :null,
		feedback : null,
		huidige_vraag : {}
	}
	
	//objects
	var screen1 = $('.screen1')
	var screen2 =$('.screen2')
	var screen3 = $('.screen3')
		//screen3	
	var feedback_formulier = $("#feedback");
	var feedback_send_button = $("#upload_feedback");
		//screen2
	var tracktime_element = $('#tracktime')[0];
	var audio_element = $("#playable_sound");
	var play_icon = $(".play_button .play");
	var pause_icon = $(".play_button .pause");
	var official_timer = $("#official_timer");
	//var geluid = $("geluid");
	var audio_div = $("#playable_sound")
	var optie1 = $("#opt1");
	var optie2 = $("#opt2");
	var optie3 = $("#opt3");
	var optie4 = $("#opt4");	
		//screen1
	var desktop_icon =  $(".desktop_icon");
	var phone_icon =  $(".phone_icon");
	var headset_icon =  $(".headset_icon");
	var speaker_icon =  $(".speaker_icon");
	var next_button =  $(".next_button");
	
	
    // events 
		//screen3
	feedback_send_button.on('click',verstuurDataNaarApi);
		//screen2
	audio_element.bind('timeupdate', timeUpdate );
	$(".play_button").on( "click", playPauseSound);
	startupFunction();		
	optie1.on('click',clickOptie1);
	optie2.on('click',clickOptie2);
	optie3.on('click',clickOptie3);
	optie4.on('click',clickOptie4);	
	window.addEventListener("keypress", keyPressFunction, false);
	function keyPressFunction(e){
		switch(e.keyCode){
			case 113: clickOptie1('key'); break;	
			case 119: clickOptie2('key');  break;	
			case 101: clickOptie3('key');  break;	
			case 114: clickOptie4('key');  break;	
		}
	};
	
		//screen1
	desktop_icon.on('click',desktop_keuze);
	phone_icon.on('click',phone_keuze);
	headset_icon.on('click',headset_keuze);
	speaker_icon.on('click',speaker_keuze);
	next_button.on('click',goToNextScreen)
	
	//functions
		//screen 3
		function verstuurDataNaarApi(){
			js_database.feedback = feedback_formulier[0].value;			
			console.log(js_database);
			//var database = firebase.database();
			//console.log(firebase_js_database);
			//var fb = firebase;
			
			firebase.auth().signInWithEmailAndPassword('testuser123@123.com', '123456').catch(function(error) {
			  // Handle Errors here.
			  var errorCode = error.code;
			  var errorMessage = error.message;
			  console.log(errorCode,errorMessage);
			  // ...
			});			
			var database  = firebase.database();
			firebase.database().ref('/'+timestamp_sessie).set(
			js_database);		
			screen3.css('display','none');
		}
		//schrijf naar firebasedatab
		
	
		//screen1
	function phone_keuze()  {phone_icon.css('color','red'); desktop_icon.css('color','black');phone_desktop_keuze = 'phone'}
	function desktop_keuze(){desktop_icon.css('color','red');phone_icon.css('color','black'); phone_desktop_keuze = 'desktop'}
	function headset_keuze(){headset_icon.css('color','red');speaker_icon.css('color','black'); headset_speaker_keuze = 'headset'}
	function speaker_keuze(){speaker_icon.css('color','red');headset_icon.css('color','black'); headset_speaker_keuze = 'speaker'}
	function goToNextScreen(){
		if(phone_desktop_keuze != null || headset_speaker_keuze != null){
			js_database.schermkeuze = phone_desktop_keuze;
			js_database.speakerkeuze = headset_speaker_keuze;			
			screen1.css('display','none');
			screen2.css('display','inline');
			if(phone_desktop_keuze == 'phone'){
				//console.log(optie1)//.children[1]);
				//console.log(optie1[0].parentElement.children[1])//.children[1]);
				optie1[0].parentElement.children[1].innerHTML = 'Touch*'
				optie2[0].parentElement.children[1].innerHTML = 'Touch*'
				optie3[0].parentElement.children[1].innerHTML = 'Touch*'
				optie4[0].parentElement.children[1].innerHTML = 'Touch*'
			}
			
		}		
	}		
	
		//screen2
	function gaNaarVolgendeVraag(){
		//reset all variabelen
		track_currentTime = 0;
		track_finishTime = null; 
		antwoord_timer = 0;
		track_is_gestart = false;
		opt1_clicked = false;
		opt2_clicked = false;
		opt3_clicked = false;
		opt4_clicked = false;
		huidige_vraag+=1;
		js_database[huidige_vraag]={}	
		//insert new sounds      
		$("#geluid").attr("src", 'sounds/'+huidige_vraag+'.mp3');
		audio_div[0].pause();
		audio_div[0].load();//suspends and restores all audio element
		audio_element[0].playbackRate=0.85;
		
		//reset alle html
		optie1.css('opacity',1);
		optie2.css('opacity',1);
		optie3.css('opacity',1);
		optie4.css('opacity',1);
		tracktime_element.innerText = Math.floor(audio_element[0].currentTime) + " / "+  Math.floor(audio_element[0].duration);
		plaatsPictogrammen();
		
	}	
		
		
	function clickOptie1(soort){		
		
		if(	soort == 'key' && phone_desktop_keuze == 'desktop' ||
			soort != 'key' && phone_desktop_keuze == 'phone' 		
		){ // controle of de knoppen zijn ingedruk of dat er aangeraakt wordt.	
		
			if(opt1_clicked == false && track_is_gestart){ // controle of er gestart is
				optie1.css('opacity',0);			
				gekozen_volgorde_nummer = optie1.attr("class").split(" ")[0].split("_")[1];			
				opt1_clicked = true;			
				if(js_database[huidige_vraag] == null){				
					js_database[huidige_vraag] = {};
				}
				js_database[huidige_vraag][gekozen_volgorde_nummer]=antwoord_timer;
			}
			controleerOfLaatsteMogelijkheid();		
		}
	}
	function clickOptie2(soort){
		if(	soort == 'key' && phone_desktop_keuze == 'desktop' ||
			soort != 'key' && phone_desktop_keuze == 'phone' 		
		){ // controle of de knoppen zijn ingedruk of dat er aangeraakt wordt.	
			
			if(opt2_clicked == false && track_is_gestart){
				optie2.css('opacity',0);
				//console.log('2 click');
				gekozen_volgorde_nummer = optie2.attr("class").split(" ")[0].split("_")[1];
				opt2_clicked = true;
				if(js_database[huidige_vraag] == null){				
					js_database[huidige_vraag] = {};
				}
				js_database[huidige_vraag][gekozen_volgorde_nummer]=antwoord_timer;
			}
			controleerOfLaatsteMogelijkheid();	
		}		
	}
	function clickOptie3(soort){
		if(	soort == 'key' && phone_desktop_keuze == 'desktop' ||
			soort != 'key' && phone_desktop_keuze == 'phone' 		
		){ // controle of de knoppen zijn ingedruk of dat er aangeraakt wordt.	
			
			if(opt3_clicked == false && track_is_gestart){
				optie3.css('opacity',0);
				//console.log('3 click');
				gekozen_volgorde_nummer = optie3.attr("class").split(" ")[0].split("_")[1];
				opt3_clicked = true;
				if(js_database[huidige_vraag] == null){				
					js_database[huidige_vraag] = {};
				}
				js_database[huidige_vraag][gekozen_volgorde_nummer]=antwoord_timer;
			}
			controleerOfLaatsteMogelijkheid();	
		}		
	}
	function clickOptie4(soort){
		if(	soort == 'key' && phone_desktop_keuze == 'desktop' ||
			soort != 'key' && phone_desktop_keuze == 'phone' 		
		){ // controle of de knoppen zijn ingedruk of dat er aangeraakt wordt.	
		
			if(opt4_clicked == false && track_is_gestart){
				optie4.css('opacity',0);
				//console.log('4 click')			
				opt4_clicked = true;
				gekozen_volgorde_nummer = optie4.attr("class").split(" ")[0].split("_")[1];
				if(js_database[huidige_vraag] == null){				
					js_database[huidige_vraag] = {};
				}
				js_database[huidige_vraag][gekozen_volgorde_nummer] =antwoord_timer;
			}		
			controleerOfLaatsteMogelijkheid();
			}		
	}
	
	function controleerOfLaatsteMogelijkheid(){
		if(opt4_clicked == true && opt3_clicked == true && opt2_clicked == true && opt1_clicked == true ){
			console.log(js_database);
			//check voor fouten			
			if( !(js_database[huidige_vraag][1] < js_database[huidige_vraag][2] &&
				js_database[huidige_vraag][2] < js_database[huidige_vraag][3] &&
				js_database[huidige_vraag][3] < js_database[huidige_vraag][4]) 
			) {	js_database[huidige_vraag]['fout'] = true; } //voeg fout toe
			
			//als alles is ingedrukt en klaar is voor volgende vraag
			if(track_currentTime > track_finishTime-0.1){ //als timer = voorbij
				if(huidige_vraag < 13){ //als het niet afgelopen is
					gaNaarVolgendeVraag();	
					console.log(huidige_vraag);
				} else {
					//ga naar eindscherm.
					screen2.css('display','none');
					screen3.css('display','inline');
				}
												
			}
		}
	}
	
	
	function timeUpdate(){
		tracktime_element.innerText = Math.floor(audio_element[0].currentTime) + " / "+  Math.floor(audio_element[0].duration);		
		track_currentTime = audio_element[0].currentTime;
		track_finishTime = audio_element[0].duration;
		if(track_currentTime > track_finishTime-0.5){
			play_icon.css('display','none');
			pause_icon.css('display','inline');
			controleerOfLaatsteMogelijkheid();	
		}		
	}
	
	function playPauseSound(){
		//console.log(audio_element);
		if (track_is_gestart == false){ // start echte timer
			track_is_gestart = true;			
		}
		if(track_currentTime != track_finishTime){ //als hij klaar is dan stopt hij
			if(audio_element[0].paused){
				audio_element.trigger("play");	
				play_icon.css('display','inline');
				pause_icon.css('display','none');				
			}			
		}
		//console.log(track_currentTime+" / " +track_finishTime);
	}
	
	function startupFunction(){
		tracktime_element.innerText = "0 / "+  Math.floor(audio_element[0].duration); //setup tracktime
		track_finishTime = audio_element[0].duration; //setup finishtime
		audio_element[0].playbackRate=0.85; //slowdown
		plaatsPictogrammen()
	}	
	
	function plaatsPictogrammen(){ //het plaatsen van pictogrammen op willekeurige volgorde per vraag
		random_list = [1,2,3,4];		
		random_list.sort(function() {
		  return .5 - Math.random();
		});
		//console.log(random_list);
		for(i=1;i<5;i++){
			$("#opt"+i).attr('class','pt_'+random_list[i-1]+' img_'+pictogrammen_lijst[huidige_vraag][random_list[i-1]]);
		}
	}
	//edit field data
	setInterval(function () {
		if(track_is_gestart){ //countdown timer
			antwoord_timer += 0.01;			
		}
		official_timer[0].innerHTML = Math.floor(antwoord_timer);		
	}, 10);
	


});