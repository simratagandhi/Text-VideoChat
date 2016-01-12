
var searchOption;
var statusSearch=false;
var availableTags = {
      "OK":1,
      "HELP":2,
      "EMERGENCY":3,
      "NOT AVAILABLE":0
    };
$( "#searchTxt" ).autocomplete({
      source: Object.keys(availableTags),
      minLength: 0,
      select: function(event, ui) {
        statusSearch=true;
         $(this).val(ui.item.value);
        $('#searchForm').submit();
    }
}).keyup(function() {
    var $parentContext = $(this);
    var matches = $.grep(Object.keys(availableTags), function(n, i) {
        return $parentContext.val().toLowerCase() == n.toLowerCase();
    });
    statusSearch= !matches.length;
});

$("#searchMenu ul li a").click(function() {
	if ($("#topNav ul li.active").attr('data-path')){
  		$("#topNav ul li").removeClass("active");
  	}
   var target = $(this).html();
	console.log("Data seach of searchMenu: " + $(this).parent().attr('data-search'));
   //Adds active class to selected item
   $(this).parents('#selectMenu').find('li').removeClass('active');
   $(this).parent('li').addClass('active');
   searchOption = $("#searchMenu ul li.active").attr('data-search');
   if(searchOption=="cStatus"){
   	 $( "#searchTxt" ).autocomplete( "enable" );
   	 statusSearch = false;
    
   }else{
   	 $( "#searchTxt" ).autocomplete( "disable" );
   	 statusSearch = true;
   }
   console.log('searchOption '+searchOption);
   //Displays selected text on dropdown-toggle button
   $(this).parents('#searchMenu').find('.dropdown-toggle').html(target + ' <span class="caret"></span>');
   $('#searchTxt').val('');

});


$('input').keyup(function(e){
	if(e.which == 13){
		if ($("#topNav ul li.active").attr('data-path')){
  			$("#topNav ul li").removeClass("active");
  		}
	}
});

$('#searchForm').submit(function(e){
	console.log('searchOption '+searchOption);
	e.preventDefault();	

	if ( searchOption && $('#searchTxt').val().length > 0 && $('#searchTxt').val().trim().length > 0){
			//	var searchOption = $("#searchMenu ul li.active").attr('data-search');
		if (searchOption != "cStatus" || statusSearch) {
			var searchTxt = $('#searchTxt').val().trim();
			if(searchOption=="cStatus"){
				searchTxt = availableTags[searchTxt];
			}
			$.get("/search/" + searchOption + "?searchTxt=" + searchTxt, function(data) {
				console.log("got data" + data);
				$("#layoutChange div").remove();
				$("#layoutChange").html(data);
			});

		}

	 	
	 	
	}
	
		
    });

