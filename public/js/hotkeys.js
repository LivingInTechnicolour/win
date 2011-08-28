// for some reason events in the input and in the document are
// separate... don't know why, but I want to keep that behavior :)
// [{name:'home', label:'Home'}, {name:'alternative', label:'Alternative'}, {name:'outside', label:'The Outside'}];
function chooseroom(name, cb){
    $('#chooseroom').dialog({
	title: 'Enter ' + name + '?',
	modal:true,
	buttons:{
	    Yes:function() {
		console.log("CLICK");
		cb();
		$(this).dialog('close');
	    },
	    No:function() {
		$(this).dialog('close');
	    }
	}
    });
    $('.name').text("Do you want to enter " + name + "?");
}

var keys = {
    input: {
	tab: function(){
	    $('#input').blur();
	    return false;
	}
    },
    'document' : [{
	keys: ['tab'],
	events: ['keydown'],
	fun: function(){
            $('#input').focus();
            return false;
	},
    }, {
	keys: ['j'],
	events: ['keydown'],
	fun: function(){
            chooseroom();
	}
    }, {
	keys: ['n'],
	events: ['keydown'],
	fun: function(){
            login_dialog(false);
            return false;
	}
    }
		 ]
};

var key, n, e, k, this_key;
for (key in keys.input){
    $('#input').bind('keydown', key, keys.input[key]);
}
for (n=0; n < keys['document'].length; n++){
    this_key = keys['document'][n];
    for (e=0; e < this_key.events.length; e++){
	for (k=0; k < this_key.keys.length; k++){
	    //TODO: a better check
	    if(this_key.events[e] && this_key.keys[k] && this_key.fun){
		$(document).bind(this_key.events[e], this_key.keys[k], this_key.fun);
	    }
	}
    }
}
