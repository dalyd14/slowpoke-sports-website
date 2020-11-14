var loadTeams = function(arr) {
    $("#teams").empty()
    var teamDivContainer = $("<div>").addClass("container")
    arr.forEach(element => {
        var teamDivRow = loadTeamRow(element)
        teamDivContainer.append(teamDivRow)
    });
    $("#teams").append(teamDivContainer)
}

var loadTeamRow = function(team) {

    teamDivRow = $("<div>").addClass("row no-gutters team-row")

    var teamImgDiv = $("<div>").addClass("col-3 img-container")
    var teamImg = $("<img>")
        .addClass("team-img")
    teamImg.attr("src", team.TeamLogoUrl)

    var teamRankDiv = $("<div>").addClass("col-1 team-rank-container")
    if (team.ApRank) {
        var teamRank = $("<p>").addClass("team-rank").text(team.ApRank)
    } else {
        var teamRank = $("<p>").addClass("team-rank").text("")
    }
    
    var teamNameDiv = $("<div>").addClass("col-6 team-name-container")
    var teamName = $("<h5>").addClass("team-name").text(team.School + " " + team.Name)

    var teamRecordDiv = $("<div>").addClass("col-2 team-record-container")
    var teamRecord = $("<p>").addClass("team-record").text(team.Wins + " - " + team.Losses)

    teamImgDiv.append(teamImg)
    teamNameDiv.append(teamName)
    teamRankDiv.append(teamRank)
    teamRecordDiv.append(teamRecord)

    teamDivRow.append(teamImgDiv, teamRankDiv, teamNameDiv, teamRecordDiv)

    return teamDivRow
}