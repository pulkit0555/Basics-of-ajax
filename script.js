
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");
	// load streetview
	var street=$('#street').val();
	var city=$('#city').val();
	//change text of label with id greeting
	$greeting.text('So, you want to live at '+street+' , '+city);
    
    
	//append a new imag tag in html by using jquery
	$body.append('<img class="bgimg" src="http://maps.googleapis.com/maps/api/streetview?size=600x300&location='+street+', '+city+'">');
	
	//using NYT(NewYorkTimes API) to fetch data
	var nyTimesBaseUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch';
	//API KEY:required because the api developer wants to know who is making the api request and also for the reason that the no . of GET requests is limited.
    var nyTimesApiKey = 'insert nyt api key here';
    var nyTimesUrl = nyTimesBaseUrl + '.json?api-key=' + nyTimesApiKey + '&q=' + city;
	//ajax request with callback
	$.getJSON(nyTimesUrl,function(data)
	{	   
	   $nytHeaderElem.text('New York Times Articles About '+city);
	   var articles=data.response.docs;
	   for(var i=0;i<articles.length;i++)
	   {
		   article=articles[i];
		   $nytElem.append('<li classs="article">'+'<a href="'+article.web_url+'">'+article.headline.main+'</a>'+'<p>'+article.snippet+'</p>'+'</li>');
	   }
	}).error(function(e)
	{
		$nytHeaderElem.text("New York Times Articles Could Not Be Loaded");
	});
	//wiki
	var wikiBaseUrl = 'http://en.wikipedia.org/w/api.php?format=json&action=opensearch&search=';
    var wikiUrl = wikiBaseUrl + city;

    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text('Could not load wikipedia links');
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        success: function(data){
            for (var i = 0; i <= data[1].length - 1; i++) {
                var pageLink = '<li><a href="' + data[3][i] + '">' + data[1][i] + '</a></li>';
                $wikiElem.append(pageLink);
            };

            clearTimeout(wikiRequestTimeout);
        }
    });
	
	return false;
};

$('#form-container').submit(loadData);
