var NCAAFteams = []
var NFLteams = []

var getNCAAFdata = function() {
    $.getJSON( "https://api.sportsdata.io/v3/cfb/scores/json/Teams?key=d43bba91fb3e469cbd7ad2e109656d69", function( teamData ) {
        var currentWeekDetails = null        
        $.getJSON( "https://api.sportsdata.io/v3/cfb/scores/json/CurrentSeasonDetails?key=d43bba91fb3e469cbd7ad2e109656d69", function( seasonData ) {
            currentWeekDetails = seasonData
            console.log(currentWeekDetails)
            $.getJSON( "https://api.sportsdata.io/v3/cfb/scores/json/GamesByWeek/" + currentWeekDetails.Season + "/" + currentWeekDetails.ApiWeek + "?key=d43bba91fb3e469cbd7ad2e109656d69", function( scoreData ) {
                NCAAFteams = teamData.filter(team => team.ConferenceID!=null)
                scoreData = scoreData.filter(game => (NCAAFteams.some(team => team.TeamID === game.HomeTeamID) || NCAAFteams.some(team => team.TeamID === game.AwayTeamID)))
                console.log(scoreData)
                console.log(NCAAFteams)
                loadTeams(NCAAFteams, false)
            })
        });
    });
}


// $.getJSON( "https://api.sportsdata.io/v3/nfl/scores/json/Teams/2020REG?key=1f5045ebe0954d7a9038e019a0dd7266", function( data ) {
//         NFLteams = data
//         console.log(NFLteams)
//     });


