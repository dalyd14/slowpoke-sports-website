
var getNFLnews = function() {
    $.getJSON( "https://api.sportsdata.io/v3/nfl/scores/json/Teams?key=1f5045ebe0954d7a9038e019a0dd7266", function( teamData ) {
        NFLteams = teamData
        console.log(NFLteams)
        $.getJSON( "https://api.sportsdata.io/v3/nfl/scores/json/News?key=1f5045ebe0954d7a9038e019a0dd7266", function( newsData ) {
            NFLnews = newsData
            console.log(NFLnews)
            loadNews(NFLnews, NFLteams)
        });
    });
}

