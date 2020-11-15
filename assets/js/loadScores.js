var loadScores = function(scoresArr, teamsArr) {
    $("#scores").empty()
    var scoresDivContainer = $("<div>").addClass("container-fluid")
    scoresArr.forEach(element => {
        if(currentNav.currentLeague==="NCAAF") {
            var scoreDivRow = loadNCAAFscoreRow(element, teamsArr)
        } else if(currentNav.currentLeague==="NFL") {
            var scoreDivRow = loadNFLscoreRow(element, teamsArr)
        }
        scoresDivContainer.append(scoreDivRow)
    });
    $("#scores").append(scoresDivContainer)
}

var loadNCAAFscoreRow = function(score, teams) {
    // make the div that will hold the individual row
    var scoreDivRow = $("<div>").addClass("row score-row")

    // Within the outside row there will be two column divs
    var teamsInfoDiv = $("<div>").addClass("col-10") // will hold team name, score and record
    var gameInfoDiv = $("<div>").addClass("col-2 d-flex justify-content-center game-info-row") // will hold quarter and time left
    var gameInfoRowDiv = $("<div>").addClass("row no-gutters")

    // now create two rows that will go inside the first div
    var awayRowDiv = $("<div>").addClass("row no-gutters team-info-row")
    var homeRowDiv = $("<div>").addClass("row no-gutters team-info-row")
    // teamsInfoDiv.append(awayRowDiv, homeRowDiv)

    // load the logos for both teams (if possible)
    // first away team
    var awayTeamImgDiv = $("<div>").addClass("col-2 img-container")
    var awayTeamImg = $("<img>")
        .addClass("score-team-img")
    awayTeamImg.attr("src", teams.find(team => team.TeamID===score.AwayTeamID).TeamLogoUrl || "")
    awayTeamImgDiv.append(awayTeamImg)
    // next home team
    var homeTeamImgDiv = $("<div>").addClass("col-2 img-container")
    var homeTeamImg = $("<img>")
        .addClass("score-team-img")
    homeTeamImg.attr("src", teams.find(team => team.TeamID===score.HomeTeamID).TeamLogoUrl || "")
    homeTeamImgDiv.append(homeTeamImg)

    // enter the rank for each team
    // first away team
    var awayTeamRankDiv = $("<div>").addClass("col-1 team-rank-container")
    var awayTeamRank = $("<h6>").addClass("team-rank").text(teams.find(team => team.TeamID===score.AwayTeamID).ApRank || "")
    
    // next home team
    var homeTeamRankDiv = $("<div>").addClass("col-1 team-rank-container")
    var homeTeamRank = $("<h6>").addClass("team-rank").text(teams.find(team => team.TeamID===score.HomeTeamID).ApRank || "")

    // load in the team names for both teams
    // first away team
    var awayTeamNameDiv = $("<div>").addClass("col-7 team-name-container")
    var awayTeamName = $("<h5>").addClass("team-name").text(teams.find(team => team.TeamID===score.AwayTeamID).School)
    
    // first away team
    var homeTeamNameDiv = $("<div>").addClass("col-7 team-name-container")
    var homeTeamName = $("<h5>").addClass("team-name").text(teams.find(team => team.TeamID===score.HomeTeamID).School)
    
    // // load records
    // // first away team
    // var awayTeamRecordDiv = $("<div>").addClass("col-2 team-record-container")
    // var awayRecord = teams.find(team => team.TeamID===score.AwayTeamID).Wins + " - " + teams.find(team => team.TeamID===score.AwayTeamID).Losses
    // var awayTeamRecord = $("<p>").addClass("team-record").text(awayRecord)
    // awayTeamRecordDiv.append(awayTeamRecord)
    // // next home team
    // var homeTeamRecordDiv = $("<div>").addClass("col-2 team-record-container")
    // var homeRecord = teams.find(team => team.TeamID===score.HomeTeamID).Wins + " - " + teams.find(team => team.TeamID===score.HomeTeamID).Losses
    // var homeTeamRecord = $("<p>").addClass("team-record").text(homeRecord)
    // homeTeamRecordDiv.append(homeTeamRecord)

    // get the scores
    // first away team
    var awayTeamScoreDiv = $("<div>").addClass("col-2 team-score-container")
    var awayTeamScore = $("<h5>").addClass("score").text(score.AwayTeamScore)
    var homeWin = score.HomeTeamScore > score.AwayTeamScore
    
    // first away team
    var homeTeamScoreDiv = $("<div>").addClass("col-2 team-score-container")
    var homeTeamScore = $("<h5>").addClass("score").text(score.HomeTeamScore)

    // get the quarter and time
    // first the quarter
    var quaterDiv = $("<div>").addClass("col-12 quarter-container")
    // then the timeleft
    var timeLeftDiv = $("<div>").addClass("col-12 time-container")
    if (score.TimeRemainingMinutes && score.TimeRemainingSeconds) {
        var timeLeft = $("<h5>").addClass("time").text(score.TimeRemainingMinutes + ":" + ("0" + score.TimeRemainingSeconds).slice(-2))
    } else {
        var timeLeft = $("<h5>").addClass("time").text("")
    }
    if (score.Status === "Final") {
        var quarter = $("<h5>").addClass("quarter").text("Final")
        if (homeWin) {
            awayTeamRank.addClass("lost")
            awayTeamScore.addClass("lost")
            awayTeamName.addClass("lost")

        } else {
            homeTeamRank.addClass("lost")
            homeTeamScore.addClass("lost")
            homeTeamName.addClass("lost")
        }
    } else if (score.Status === "InProgress") {
        var status = ""
        switch (score.Period) {
            case "1":
                status = "1st Qtr";
                break;
            case "2":
                status = "2nd Qtr";
                break;
            case "3":
                status = "3rd Qtr";
                break;
            case "4":
                status = "4th Qtr";
                break;
            default:
                status = score.Period
        }
        var quarter = $("<h5>").addClass("quarter").text(status)
    } else if (score.Status === "Scheduled") {
        var dateTime = moment(score.DateTime, "YYYY-MM-DDTH:mm:ss")
        var quarter = $("<h5>").addClass("quarter").text(dateTime.format("M/DD"))
        timeLeft = $("<h5>").addClass("time").text(dateTime.format("h:mm a"))
    }

    awayTeamRankDiv.append(awayTeamRank)
    homeTeamRankDiv.append(homeTeamRank)

    awayTeamNameDiv.append(awayTeamName)
    homeTeamNameDiv.append(homeTeamName)

    awayTeamScoreDiv.append(awayTeamScore)
    homeTeamScoreDiv.append(homeTeamScore)

    quaterDiv.append(quarter)
    timeLeftDiv.append(timeLeft)
    
    // get the tvNetwork
    var networkDiv = $("<div>").addClass("col-12 network-container")
    var network = $("<h6>").addClass("network").text(score.Channel)
    networkDiv.append(network)

    // append everything to the team infos
    awayRowDiv.append(awayTeamImgDiv, awayTeamRankDiv, awayTeamNameDiv, awayTeamScoreDiv)
    homeRowDiv.append(homeTeamImgDiv, homeTeamRankDiv, homeTeamNameDiv, homeTeamScoreDiv)
    teamsInfoDiv.append(awayRowDiv, homeRowDiv)

    // now append the game info
    gameInfoRowDiv.append(quaterDiv, timeLeftDiv, networkDiv)
    gameInfoDiv.append(gameInfoRowDiv)

    // finally append the two elements to the score row
    scoreDivRow.append(teamsInfoDiv, gameInfoDiv)

    return scoreDivRow
}

var loadNFLscoreRow = function(score, teams) {
    // make the div that will hold the individual row
    var scoreDivRow = $("<div>").addClass("row score-row")

    // Within the outside row there will be two column divs
    var teamsInfoDiv = $("<div>").addClass("col-10") // will hold team name, score and record
    var gameInfoDiv = $("<div>").addClass("col-2 d-flex justify-content-center game-info-row") // will hold quarter and time left
    var gameInfoRowDiv = $("<div>").addClass("row no-gutters")

    // now create two rows that will go inside the first div
    var awayRowDiv = $("<div>").addClass("row no-gutters team-info-row")
    var homeRowDiv = $("<div>").addClass("row no-gutters team-info-row")
    // teamsInfoDiv.append(awayRowDiv, homeRowDiv)

    // load the logos for both teams (if possible)
    // first away team
    var awayTeamImgDiv = $("<div>").addClass("col-2 img-container")
    var awayTeamImg = $("<img>")
        .addClass("score-team-img")
    awayTeamImg.attr("src", teams.find(team => team.TeamID===score.AwayTeamID).WikipediaLogoUrl || "")
    awayTeamImgDiv.append(awayTeamImg)
    // next home team
    var homeTeamImgDiv = $("<div>").addClass("col-2 img-container")
    var homeTeamImg = $("<img>")
        .addClass("score-team-img")
    homeTeamImg.attr("src", teams.find(team => team.TeamID===score.HomeTeamID).WikipediaLogoUrl || "")
    homeTeamImgDiv.append(homeTeamImg)

    // load in the team names for both teams
    // first away team
    var awayTeamNameDiv = $("<div>").addClass("col-8 team-name-container")
    var awayTeamName = $("<h5>").addClass("team-name").text(teams.find(team => team.TeamID===score.AwayTeamID).FullName)
    
    // first away team
    var homeTeamNameDiv = $("<div>").addClass("col-8 team-name-container")
    var homeTeamName = $("<h5>").addClass("team-name").text(teams.find(team => team.TeamID===score.HomeTeamID).FullName)
    
    // // load records
    // // first away team
    // var awayTeamRecordDiv = $("<div>").addClass("col-2 team-record-container")
    // var awayRecord = teams.find(team => team.TeamID===score.AwayTeamID).Wins + " - " + teams.find(team => team.TeamID===score.AwayTeamID).Losses
    // var awayTeamRecord = $("<p>").addClass("team-record").text(awayRecord)
    // awayTeamRecordDiv.append(awayTeamRecord)
    // // next home team
    // var homeTeamRecordDiv = $("<div>").addClass("col-2 team-record-container")
    // var homeRecord = teams.find(team => team.TeamID===score.HomeTeamID).Wins + " - " + teams.find(team => team.TeamID===score.HomeTeamID).Losses
    // var homeTeamRecord = $("<p>").addClass("team-record").text(homeRecord)
    // homeTeamRecordDiv.append(homeTeamRecord)

    // get the scores
    // first away team
    var awayTeamScoreDiv = $("<div>").addClass("col-2 team-score-container")
    var awayTeamScore = $("<h5>").addClass("score").text(score.AwayScore)
    var homeWin = score.HomeTeamScore > score.AwayTeamScore
    
    // first away team
    var homeTeamScoreDiv = $("<div>").addClass("col-2 team-score-container")
    var homeTeamScore = $("<h5>").addClass("score").text(score.HomeScore)

    // get the quarter and time
    // first the quarter
    var quaterDiv = $("<div>").addClass("col-12 quarter-container")
    // then the timeleft
    var timeLeftDiv = $("<div>").addClass("col-12 time-container")
    if (score.TimeRemaining) {
        var timeLeft = $("<h5>").addClass("time").text(score.TimeRemaining)
    } else {
        var timeLeft = $("<h5>").addClass("time").text("")
    }
    if (score.Status === "Final") {
        var quarter = $("<h5>").addClass("quarter").text("Final")
        if (homeWin) {
            awayTeamScore.addClass("lost")
            awayTeamName.addClass("lost")
        } else {
            homeTeamScore.addClass("lost")
            homeTeamName.addClass("lost")
        }
    } else if (score.Status === "InProgress") {
        var status = ""
        switch (score.Period) {
            case "1":
                status = "1st Qtr";
                break;
            case "2":
                status = "2nd Qtr";
                break;
            case "3":
                status = "3rd Qtr";
                break;
            case "4":
                status = "4th Qtr";
                break;
            default:
                status = score.Period
        }
        var quarter = $("<h5>").addClass("quarter").text(status)
    } else if (score.Status === "Scheduled") {
        var dateTime = moment(score.DateTime, "YYYY-MM-DDTH:mm:ss")
        var quarter = $("<h5>").addClass("quarter").text(dateTime.format("M/DD"))
        timeLeft = $("<h5>").addClass("time").text(dateTime.format("h:mm a"))
    }

    awayTeamNameDiv.append(awayTeamName)
    homeTeamNameDiv.append(homeTeamName)

    awayTeamScoreDiv.append(awayTeamScore)
    homeTeamScoreDiv.append(homeTeamScore)

    quaterDiv.append(quarter)
    timeLeftDiv.append(timeLeft)
    
    // get the tvNetwork
    var networkDiv = $("<div>").addClass("col-12 network-container")
    var network = $("<h6>").addClass("network").text(score.Channel)
    networkDiv.append(network)

    // append everything to the team infos
    awayRowDiv.append(awayTeamImgDiv, awayTeamNameDiv, awayTeamScoreDiv)
    homeRowDiv.append(homeTeamImgDiv, homeTeamNameDiv, homeTeamScoreDiv)
    teamsInfoDiv.append(awayRowDiv, homeRowDiv)

    // now append the game info
    gameInfoRowDiv.append(quaterDiv, timeLeftDiv, networkDiv)
    gameInfoDiv.append(gameInfoRowDiv)

    // finally append the two elements to the score row
    scoreDivRow.append(teamsInfoDiv, gameInfoDiv)

    return scoreDivRow
}