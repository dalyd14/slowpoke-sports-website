var loadTeams = function(arr, teams) {
    $("#teams").empty()
    var teamDivContainer = $("<div>").addClass("container")
    var currentNFLconf = "AFC"
    var firstEl = true
    arr.forEach(element => {
        if(currentPage==="NCAAF"){
            var teamDivRow = loadNCAAFTeamRow(element)
        } else if (currentPage==="NFL"){
            if(element.Conference != currentNFLconf || firstEl ) {
                firstEl = false
                currentNFLconf = element.Conference
                var confDivRow = $("<div>").addClass("row no-gutters conf-header").html("<h3>" + currentNFLconf + "</h3>")
                teamDivContainer.append(confDivRow)
            }
            var teamDivRow = loadNFLTeamRow(element, teams)
        }
        teamDivContainer.append(teamDivRow)
    });
    $("#teams").append(teamDivContainer)
}

var loadNCAAFTeamRow = function(team) {

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

var loadNFLTeamRow = function(team, teams) {

    teamDivRow = $("<div>").addClass("row no-gutters team-row")

    var confRankDiv = $("<div>").addClass("col-1 rank-container d-flex justify-content-center")
    var confRank = $("<h5>").addClass("conf-rank").text(team.ConferenceRank)

    var teamImgDiv = $("<div>").addClass("col-3 img-container d-flex justify-content-center")
    var teamImg = $("<img>")
        .addClass("team-img")
    teamImg.attr("src", teams.find(indTeam => indTeam.TeamID===team.TeamID).WikipediaLogoUrl)
    
    var teamNameDiv = $("<div>").addClass("col-6 team-name-container")
    var teamName = $("<h5>").addClass("team-name").text(team.Name)

    var teamRecordDiv = $("<div>").addClass("col-2 team-record-container d-flex justify-content-center")
    var teamRecord = $("<p>").addClass("team-record")
    if (team.Ties===0){
        teamRecord.text(team.Wins + " - " + team.Losses)
    } else {
        teamRecord.text(team.Wins + " - " + team.Losses + " - " + team.Ties)
    }
    
    confRankDiv.append(confRank)
    teamImgDiv.append(teamImg)
    teamNameDiv.append(teamName)
    teamRecordDiv.append(teamRecord)

    teamDivRow.append(confRankDiv, teamImgDiv, teamNameDiv, teamRecordDiv)

    return teamDivRow
}