var NCAAFteams = []
var NFLteams = []

///////////////////////////////////////////////////////////////////////////////////////////////////
/////////// NCAAF DATA
///////////////////////////////////////////////////////////////////////////////////////////////////
var getNCAAFdata = function() {
    //getSportsioNcaafTeams()
    getEspnNcaafTeams(80)
}

    ///////////////////////////////////////
    //// ESPN NCAAF API
    ///////////////////////////////////////
var getEspnNcaafTeams = function(group) {
    $.getJSON( "https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams?groups=" + group + "&limit=900", function( teamData ) {
        var currentWeekDetails = null
        teamData = teamData.sports[0].leagues[0].teams
        $.getJSON("https://site.api.espn.com/apis/site/v2/sports/football/college-football/rankings", function(rankingData) {
            var rankedTeams = teamData.filter(team => rankingData.rankings[0].ranks.find(function(rank){
                if(rank.team.id===team.team.id) {
                    team.team.rank = rank.current
                    return true
                } else {
                    return false
                }
            }))
            rankedTeams.sort(function (x, y) {
                return x.team.rank - y.team.rank
            })
            
            var unRankedTeams =[]
            teamData.forEach(function(team) {
                if(!rankedTeams.find(rank => rank.team.id === team.team.id)) {
                    unRankedTeams.push(team)
                }
            })
            unRankedTeams.sort(function (x, y) {
                return (y.team.record.items[0].stats.find(stat => stat.name==="winPercent").value) - (x.team.record.items[0].stats.find(stat => stat.name==="winPercent").value);
            });
            rankedTeams.forEach(team => NCAAFteams.push(team))
            unRankedTeams.forEach(team => NCAAFteams.push(team))
            $.getJSON( "https://api.sportsdata.io/v3/cfb/scores/json/CurrentSeasonDetails?key=d43bba91fb3e469cbd7ad2e109656d69", function( seasonData ) {
                currentWeekDetails = seasonData
                getEspnNcaafScores(currentWeekDetails, NCAAFteams, 80, 900)
            });            
        });
    });
}

var getEspnNcaafScores = function(currentWeekDetails, NCAAFteams, group, limit) {
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
        loadScores(allScores, NCAAFteams, "ESPN")
        loadTeams(NCAAFteams, "ESPN")
        console.log("loaded NCAAF teams: ", moment().format("h:mm"))        
    })
}
    ///////////////////////////////////////
    //// SportsIO NCAAF API
    ///////////////////////////////////////
var getSportsioNcaafTeams = function() {
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
            getSportsioNcaafScores(currentWeekDetails, NCAAFteams, teamData)
        });
    });
}

var getSportsioNcaafScores = function(currentWeekDetails, NCAAFteams, teamData) {
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
        loadTeams(NCAAFteams, "SportsIO")
        console.log("loaded NCAAF teams: ", moment().format("h:mm"))
    })
}

///////////////////////////////////////////////////////////////////////////////////////////////////
/////////// NFL DATA
///////////////////////////////////////////////////////////////////////////////////////////////////
var getNFLdata = function() {
    //getSportsioNflTeams()
    getEspnNflTeams()
}

    ///////////////////////////////////////
    //// ESPN NFL API
    ///////////////////////////////////////
var getEspnNflTeams = function(){
    $.getJSON( "https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams?limit=900", function( teamData ) {
        $.getJSON("https://api.sportsdata.io/v3/nfl/scores/json/Timeframes/current?key=1f5045ebe0954d7a9038e019a0dd7266", function(currentWeek) {
            $.getJSON("https://site.api.espn.com/apis/v2/sports/football/nfl/standings", function( standings ) {
                teamData = teamData.sports[0].leagues[0].teams
                var totalStandings = standings.children.find(league => league.abbreviation==="AFC").standings.entries
                var NFCstandings =  standings.children.find(league => league.abbreviation==="NFC").standings.entries
                totalStandings.sort((a, b) => (a.stats.find(stat => stat.name==="playoffSeed").value - b.stats.find(stat => stat.name==="playoffSeed").value))
                NFCstandings.sort((a, b) => (a.stats.find(stat => stat.name==="playoffSeed").value - b.stats.find(stat => stat.name==="playoffSeed").value))
                NFCstandings.forEach(team => totalStandings.push(team))
                loadTeams(totalStandings, "ESPN", teamData)
                getEspnNflScores(currentWeek, teamData)
            });
        });
    });
}

var getEspnNflScores = function(currentWeek, teamData) {
    $.getJSON( "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?year=" + currentWeek[0].Season + "&week=" + currentWeek[0].Week, function( scoreData ) {
        var allScores = []
        var scoreDataInProgress = scoreData.events.filter(game => game.status.type.id==="2")
        var scoreDataFinal = scoreData.events.filter(game => game.status.type.id==="3")
        var scoreDataScheduled = scoreData.events.filter(game => game.status.type.id==="1")
        scoreDataInProgress.sort((a, b) => (moment.utc(a.date, "YYYY-MM-DDTH:mmZ") - moment.utc(b.date, "YYYY-MM-DDTH:mmZ")))
        scoreDataFinal.sort((a, b) => (moment.utc(a.DateTime, "YYYY-MM-DDTH:mmZ") - moment.utc(b.date, "YYYY-MM-DDTH:mmZ")))
        scoreDataScheduled.sort((a, b) => (moment.utc(a.DateTime, "YYYY-MM-DDTH:mmZ") - moment.utc(b.date, "YYYY-MM-DDTH:mmZ")))
        scoreDataInProgress.forEach(game => {allScores.push(game)});
        scoreDataScheduled.forEach(game => {allScores.push(game)});
        scoreDataFinal.forEach(game => {allScores.push(game)});
        loadScores(allScores, teamData, "ESPN")
        console.log("loaded NFL teams: ", moment().format("h:mm"))
    });
}
    ///////////////////////////////////////
    //// SportsIO NFL API
    ///////////////////////////////////////
var getSportsioNflTeams = function(){
    $.getJSON( "https://api.sportsdata.io/v3/nfl/scores/json/Teams?key=1f5045ebe0954d7a9038e019a0dd7266", function( teamData ) {
        $.getJSON("https://api.sportsdata.io/v3/nfl/scores/json/Timeframes/current?key=1f5045ebe0954d7a9038e019a0dd7266", function(currentWeek) {
            $.getJSON("https://api.sportsdata.io/v3/nfl/scores/json/Standings/" + currentWeek[0].ApiSeason + "?key=1f5045ebe0954d7a9038e019a0dd7266", function(currentStandings) {
                var totalStandings = currentStandings.filter(team => team.Conference==="AFC")
                var NFCstandings = currentStandings.filter(team => team.Conference==="NFC")
                totalStandings.sort((a, b) => (a.ConferenceRank - b.ConferenceRank))
                NFCstandings.sort((a, b) => (a.ConferenceRank - b.ConferenceRank))
                NFCstandings.forEach(team => totalStandings.push(team))
                loadTeams(totalStandings, "SportsIO", teamData)
            })
            getSportsioNflScores(currentWeek, teamData)
        })
    });
}

var getSportsioNflScores = function(currentWeek, teamData) {
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
        loadScores(allScores, teamData, "SportsIO")
        console.log("loaded NFL teams: ", moment().format("h:mm"))
    });
}