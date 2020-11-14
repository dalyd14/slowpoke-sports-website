var NCAAFteams = []
var NFLteams = []

var getNCAAFdata = function() {
    $.getJSON( "https://api.sportsdata.io/v3/cfb/scores/json/Teams?key=d43bba91fb3e469cbd7ad2e109656d69", function( teamData ) {
        var currentWeekDetails = null        
        $.getJSON( "https://api.sportsdata.io/v3/cfb/scores/json/CurrentSeasonDetails?key=d43bba91fb3e469cbd7ad2e109656d69", function( seasonData ) {
            currentWeekDetails = seasonData
            $.getJSON( "https://api.sportsdata.io/v3/cfb/scores/json/GamesByWeek/" + currentWeekDetails.Season + "/" + currentWeekDetails.ApiWeek + "?key=d43bba91fb3e469cbd7ad2e109656d69", function( scoreData ) {
                NCAAFteams = teamData.filter(team => team.ConferenceID!=null)
                var allScores = []
                scoreData = scoreData.filter(game => (NCAAFteams.some(team => team.TeamID === game.HomeTeamID) || NCAAFteams.some(team => team.TeamID === game.AwayTeamID)))
                scoreData = scoreData.filter(game => (game.Status!="Canceled" && game.Status!="Postponed"))
                var scoreDataInProgress = scoreData.filter(game => game.Status==="InProgress")
                var scoreDataFinal = scoreData.filter(game => game.Status==="Final")
                var scoreDataScheduled = scoreData.filter(game => game.Status==="Scheduled")
                scoreDataInProgress.sort((a, b) => (moment(a.DateTime, "YYYY-MM-DDTH:mm:ss") - moment(b.DateTime, "YYYY-MM-DDTH:mm:ss")))
                scoreDataFinal.sort((a, b) => (moment(a.DateTime, "YYYY-MM-DDTH:mm:ss") - moment(b.DateTime, "YYYY-MM-DDTH:mm:ss")))
                scoreDataScheduled.sort((a, b) => (moment(a.DateTime, "YYYY-MM-DDTH:mm:ss") - moment(b.DateTime, "YYYY-MM-DDTH:mm:ss")))
                scoreDataInProgress.forEach(game => {allScores.push(game)});
                scoreDataScheduled.forEach(game => {allScores.push(game)});
                scoreDataFinal.forEach(game => {allScores.push(game)});
                console.log(allScores)
                loadScores(allScores, teamData)
                loadTeams(NCAAFteams)
            })
        });
    });
}


// $.getJSON( "https://api.sportsdata.io/v3/nfl/scores/json/Teams/2020REG?key=1f5045ebe0954d7a9038e019a0dd7266", function( data ) {
//         NFLteams = data
//         console.log(NFLteams)
//     });


