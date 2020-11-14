var loadScores = function(scoresArr, teamsArr) {
    $("#scores").empty()
    var scoresDivContainer = $("<div>").addClass("container")
    scoresArr.forEach(element => {
        var scoreDivRow = loadScoreRow(element, teamsArr)
        scoresDivContainer.append(scoreDivRow)
    });
    $("#scores").append(scoresDivContainer)
}

var loadScoreRow = function(score, teams) {
    // make the div that will hold the individual row
    scoreDivRow = $("<div>").addClass("row no-gutters score-row")

    // load the logos for both teams (if possible)
    // first away team
    var awayTeamImgDiv = $("<div>").addClass("col-3 img-container")
    var awayTeamImg = $("<img>")
        .addClass("score-team-img")
    awayTeamImg.attr("src", teams.find(team => team.TeamID===score.AwayTeamID).TeamLogoUrl || "")
    // next home team
    var homeTeamImgDiv = $("<div>").addClass("col-3 img-container")
    var homeTeamImg = $("<img>")
        .addClass("score-team-img")
    homeTeamImg.attr("src", teams.find(team => team.TeamID===score.HomeTeamID).TeamLogoUrl || "")

    // enter the rank for each team
    // first away team
    var awayTeamRankDiv = $("<div>").addClass("col-1 team-rank-container")
    var awayTeamRank = $("<p>").addClass("team-rank").text(teams.find(team => team.TeamID===score.AwayTeamID).ApRank || "")
    // next home team
    var homeTeamRankDiv = $("<div>").addClass("col-1 team-rank-container")
    var homeTeamRank = $("<p>").addClass("team-rank").text(teams.find(team => team.TeamID===score.HomeTeamID).ApRank || "")
    
    // load in the team names for both teams
    // first away team
    var awayTeamNameDiv = $("<div>").addClass("col-6 team-name-container")
    var awayTeamName = $("<h5>").addClass("team-name").text(score.AwayTeamName)

    // get the scores

    // get the quarter and time

    teamImgDiv.append(teamImg)
    teamNameDiv.append(teamName)
    teamRankDiv.append(teamRank)
    teamRecordDiv.append(teamRecord)

    teamDivRow.append(teamImgDiv, teamRankDiv, teamNameDiv, teamRecordDiv)

    return teamDivRow
}