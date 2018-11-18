$( document ).ready(function() {	

	var main = $('.main');

	firebase.auth().signInWithEmailAndPassword('testuser123@123.com', '123456').catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  console.log(errorCode,errorMessage);
	  // ...
	});	
	
	// db object
	const dbRefObject = firebase.database().ref();
	
	// sync
	dbRefObject.on('value', function(snap){
		var rijenteller =0;
		var live_database = snap.val();
		var fouten_mobiel = 0;
		var fouten_desktop = 0;
		var schermkeuze = '';
		var speakerkeuze = '';
		
		console.log(live_database);
		
		for(live_database_item in live_database ){ // voor elke rij in database
			rijenteller++;
			main.append('<li class = "'+rijenteller+'"></li>');			
			
			var aantalfout = 0;
			var totaal_tijd = 0
			var goed_tijd = 0
			
			
			
			for(onderdeel_live_database_item in live_database[live_database_item]){ // voor elk veld in het onderdeel
				huidig_onderdeel = live_database[live_database_item][onderdeel_live_database_item];	
				//console.log(onderdeel_live_database_item + huidig_onderdeel );		
				
				
				
				
				if(typeof huidig_onderdeel == 'object'){	
					onderdeeltijd = 0;
					var heeftfout = false;
					
					
					for (tijd in huidig_onderdeel){//loep door de tijden
						console.log(huidig_onderdeel[tijd]);
						
						if(typeof huidig_onderdeel[tijd] == 'number'){
							//totaal_tijd = totaal_tijd + huidig_onderdeel[tijd];
							onderdeeltijd = onderdeeltijd + huidig_onderdeel[tijd];
							console.log(totaal_tijd);
							
						} 
						if(typeof huidig_onderdeel[tijd] == 'boolean'){
							aantalfout++;
							heeftfout = true;
						}						
						
					}
					
					$('.'+rijenteller).append(' | '+(onderdeeltijd/4)+'  ');	
					totaal_tijd = totaal_tijd + onderdeeltijd/4;
					if (heeftfout){
						$('.'+rijenteller).append(' F ');						
					}
					if (!heeftfout){						
						goed_tijd = goed_tijd + onderdeeltijd/4;
					}
				}
				
				
				
				//huidigeonderdeel = speakerkeuze
				if(onderdeel_live_database_item=='speakerkeuze'){
					$('.'+rijenteller).append('<br> Speaker: '+huidig_onderdeel);
					speakerkeuze = huidig_onderdeel;
				}
				//huidigeonderdeel = schermkeuze
				if(onderdeel_live_database_item=='schermkeuze'){
					$('.'+rijenteller).append('<br> Type: '+huidig_onderdeel);
					schermkeuze = huidig_onderdeel;
				}	
				if(onderdeel_live_database_item=='feedback'){
					$('.'+rijenteller).append('<br> commentaar: '+huidig_onderdeel);
				}	
				
				if(onderdeel_live_database_item=='schermkeuze'){ // als hij laatste is !!!				
					$('.'+rijenteller).append('<br> persoon heeft : '+aantalfout+' fout');	
					$('.'+rijenteller).append('<br> totaal tijd: '+totaal_tijd);		
					$('.'+rijenteller).append('<br> goed tijd: '+goed_tijd);	


										
				}				
			}
				
		}				
		
		
	});

});