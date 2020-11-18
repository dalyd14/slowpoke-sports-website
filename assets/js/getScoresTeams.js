var NCAAFteams = []
var NFLteams = []

var getNCAAFdata = function() {
    $.getJSON( "https://api.sportsdata.io/v3/cfb/scores/json/Teams?key=d43bba91fb3e469cbd7ad2e109656d69", function( teamData ) {
        var currentWeekDetails = null
        var rankedTeams = teamData.filter(team => team.ApRank!=null)
        rankedTeams.sort(function (x, y) {
            return x.ApRank - y.ApRank
        })
        var unRankedTeams = teamData.filter(team => team.ConferenceID!=null && team.ApRank===null)
        unRankedTeams.sort(function (x, y) {
            return (y.Wins) - (x.Wins);
        });
        rankedTeams.forEach(team => NCAAFteams.push(team))
        unRankedTeams.forEach(team => NCAAFteams.push(team))
        $.getJSON( "https://api.sportsdata.io/v3/cfb/scores/json/CurrentSeasonDetails?key=d43bba91fb3e469cbd7ad2e109656d69", function( seasonData ) {
            currentWeekDetails = seasonData
            getEspnNcaafData(currentWeekDetails, NCAAFteams, 80, 900)
        });
    });
}

var getEspnNcaafData = function(currentWeekDetails, NCAAFteams, group, limit) {
    $.getJSON("https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?year=" + currentWeekDetails.Season + "&week=" + currentWeekDetails.ApiWeek + "&groups=" + group + "&limit=" + limit, function (scoreData) {
        var allScores = []
        scoreData = scoreData.events
        scoreData = scoreData.filter(game => (game.status.type.id!="5" && game.status.type.id!="6"))
        var scoreDataInProgress = scoreData.filter(game => game.status.type.id==="2")
        var scoreDataFinal = scoreData.filter(game => game.status.type.id==="3")
        var scoreDataScheduled = scoreData.filter(game => game.status.type.id==="1")
        scoreDataInProgress.sort((a, b) => (moment.utc(a.date, "YYYY-MM-DDTH:mmZ") - moment.utc(b.date, "YYYY-MM-DDTH:mmZ")))
        scoreDataFinal.sort((a, b) => (moment.utc(a.date, "YYYY-MM-DDTH:mmZ") - moment.utc(b.date, "YYYY-MM-DDTH:mmZ")))
        scoreDataScheduled.sort((a, b) => (moment.utc(a.date, "YYYY-MM-DDTH:mmZ") - moment.utc(b.date, "YYYY-MM-DDTH:mmZ")))
        scoreDataInProgress.forEach(game => {allScores.push(game)});
        scoreDataScheduled.forEach(game => {allScores.push(game)});
        scoreDataFinal.forEach(game => {allScores.push(game)});
        console.log(allScores)
        loadScores(allScores, NCAAFteams, "ESPN")
        loadTeams(NCAAFteams)
        console.log("loaded NCAAF teams: ", moment().format("h:mm"))        
    })
    

}

var getSportsioNcaafData = function(currentWeekDetails, NCAAFteams) {
    $.getJSON( "https://api.sportsdata.io/v3/cfb/scores/json/GamesByWeek/" + currentWeekDetails.Season + "/" + currentWeekDetails.ApiWeek + "?key=d43bba91fb3e469cbd7ad2e109656d69", function( scoreData ) {
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
        loadScores(allScores, teamData, "SportsIO")
        loadTeams(NCAAFteams)
        console.log("loaded NCAAF teams: ", moment().format("h:mm"))
    })
}

var getNFLdata = function() {
    $.getJSON( "https://api.sportsdata.io/v3/nfl/scores/json/Teams?key=1f5045ebe0954d7a9038e019a0dd7266", function( teamData ) {
        $.getJSON("https://api.sportsdata.io/v3/nfl/scores/json/Timeframes/current?key=1f5045ebe0954d7a9038e019a0dd7266", function(currentWeek) {
            $.getJSON("https://api.sportsdata.io/v3/nfl/scores/json/Standings/" + currentWeek[0].ApiSeason + "?key=1f5045ebe0954d7a9038e019a0dd7266", function(currentStandings) {
                var totalStandings = currentStandings.filter(team => team.Conference==="AFC")
                var NFCstandings = currentStandings.filter(team => team.Conference==="NFC")
                totalStandings.sort((a, b) => (a.ConferenceRank - b.ConferenceRank))
                NFCstandings.sort((a, b) => (a.ConferenceRank - b.ConferenceRank))
                NFCstandings.forEach(team => totalStandings.push(team))
                loadTeams(totalStandings, teamData)
            })
            $.getJSON( "https://api.sportsdata.io/v3/nfl/scores/json/ScoresByWeek/" + currentWeek[0].ApiSeason + "/" + currentWeek[0].Week + "?key=1f5045ebe0954d7a9038e019a0dd7266", function( scoreData ) {
                var allScores = []
                var scoreDataInProgress = scoreData.filter(game => game.Status==="InProgress")
                var scoreDataFinal = scoreData.filter(game => game.Status==="Final")
                var scoreDataScheduled = scoreData.filter(game => game.Status==="Scheduled")
                scoreDataInProgress.sort((a, b) => (moment(a.DateTime, "YYYY-MM-DDTH:mm:ss") - moment(b.DateTime, "YYYY-MM-DDTH:mm:ss")))
                scoreDataFinal.sort((a, b) => (moment(a.DateTime, "YYYY-MM-DDTH:mm:ss") - moment(b.DateTime, "YYYY-MM-DDTH:mm:ss")))
                scoreDataScheduled.sort((a, b) => (moment(a.DateTime, "YYYY-MM-DDTH:mm:ss") - moment(b.DateTime, "YYYY-MM-DDTH:mm:ss")))
                scoreDataInProgress.forEach(game => {allScores.push(game)});
                scoreDataScheduled.forEach(game => {allScores.push(game)});
                scoreDataFinal.forEach(game => {allScores.push(game)});
                loadScores(allScores, teamData)
                console.log("loaded NFL teams: ", moment().format("h:mm"))
            });
        })

        // var currentWeekDetails = null        
        // $.getJSON( "https://api.sportsdata.io/v3/cfb/scores/json/CurrentSeasonDetails?key=d43bba91fb3e469cbd7ad2e109656d69", function( seasonData ) {
        //     currentWeekDetails = seasonData
        //     $.getJSON( "https://api.sportsdata.io/v3/cfb/scores/json/GamesByWeek/" + currentWeekDetails.Season + "/" + currentWeekDetails.ApiWeek + "?key=d43bba91fb3e469cbd7ad2e109656d69", function( scoreData ) {
        //         NCAAFteams = teamData.filter(team => team.ConferenceID!=null)
        //         var allScores = []
        //         scoreData = scoreData.filter(game => (NCAAFteams.some(team => team.TeamID === game.HomeTeamID) || NCAAFteams.some(team => team.TeamID === game.AwayTeamID)))
        //         scoreData = scoreData.filter(game => (game.Status!="Canceled" && game.Status!="Postponed"))
        //         var scoreDataInProgress = scoreData.filter(game => game.Status==="InProgress")
        //         var scoreDataFinal = scoreData.filter(game => game.Status==="Final")
        //         var scoreDataScheduled = scoreData.filter(game => game.Status==="Scheduled")
        //         scoreDataInProgress.sort((a, b) => (moment(a.DateTime, "YYYY-MM-DDTH:mm:ss") - moment(b.DateTime, "YYYY-MM-DDTH:mm:ss")))
        //         scoreDataFinal.sort((a, b) => (moment(a.DateTime, "YYYY-MM-DDTH:mm:ss") - moment(b.DateTime, "YYYY-MM-DDTH:mm:ss")))
        //         scoreDataScheduled.sort((a, b) => (moment(a.DateTime, "YYYY-MM-DDTH:mm:ss") - moment(b.DateTime, "YYYY-MM-DDTH:mm:ss")))
        //         scoreDataInProgress.forEach(game => {allScores.push(game)});
        //         scoreDataScheduled.forEach(game => {allScores.push(game)});
        //         scoreDataFinal.forEach(game => {allScores.push(game)});
        //         console.log(allScores)
        //         loadScores(allScores, teamData)
        //         loadTeams(NCAAFteams)
        //     })
        // });
    });
}