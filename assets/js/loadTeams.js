//////////////////////////////////////////////////////////////////////////////////
////////////// LOADING TEAM DATA FOR NCAAF AND NFL
//////////////////////////////////////////////////////////////////////////////////
var loadTeams = function(arr, website, teams) {
    $("#teams").empty()

    var teamDivContainer = $("<div>").addClass("container")
    var currentNFLconf = "AFC"
    var firstEl = true
    var NFLi = 1
    arr.forEach(element => {
        if(currentNav.currentLeague==="NCAAF"){
            if(website === "ESPN") {
                var teamDivRow = loadEspnNCAAFTeamRow(element)
            } else if (website === "SportsIO") {
                var teamDivRow = loadSportsioNCAAFTeamRow(element)
            }
        } else if (currentNav.currentLeague==="NFL"){
            if(website === "ESPN") {
                if (NFLi === 1) {
                    var confDivRow = $("<div>").addClass("row no-gutters conf-header").html("<h3>AFC</h3>")
                    teamDivContainer.append(confDivRow)
                } else if (NFLi === 17) {
                    var confDivRow = $("<div>").addClass("row no-gutters conf-header").html("<h3>NFC</h3>")
                    teamDivContainer.append(confDivRow)
                }
                var teamDivRow = loadEspnNFLTeamRow(element, teams, NFLi)
                NFLi++
            } else if (website === "SportsIO") {
                if(element.Conference != currentNFLconf || firstEl ) {
                    firstEl = false
                    currentNFLconf = element.Conference
                    var confDivRow = $("<div>").addClass("row no-gutters conf-header").html("<h3>" + currentNFLconf + "</h3>")
                    teamDivContainer.append(confDivRow)
                }
                var teamDivRow = loadSportsioNFLTeamRow(element, teams)
            }
        }
        teamDivContainer.append(teamDivRow)
    });
    $("#teams").append(teamDivContainer)
}

//////////////////////////////////////////////////////////////////////////////////
////////////// LOADING INDIVIDUAL TEAM ROW FOR NCAAF
//////////////////////////////////////////////////////////////////////////////////

        /////////////////////////////////////////////////////////////
        ////// ESPN API FOR NCAAF TEAMS
        /////////////////////////////////////////////////////////////
var loadEspnNCAAFTeamRow = function(team) {

    teamDivRow = $("<div>").addClass("row no-gutters team-row")

    var teamImgDiv = $("<div>").addClass("col-3 img-container")
    var teamImg = $("<img>")
        .addClass("team-img")
    teamImg.attr("src", team.team.logos[0].href)

    var teamRankDiv = $("<div>").addClass("col-1 team-rank-container")
    if ("rank" in team.team) {
        var teamRank = $("<p>").addClass("team-rank").text(team.team.rank)
    } else {
        var teamRank = $("<p>").addClass("team-rank").text("")
    }
    
    var teamNameDiv = $("<div>").addClass("col-6 team-name-container")
    var teamName = $("<h5>").addClass("team-name").text(team.team.displayName)

    var teamRecordDiv = $("<div>").addClass("col-2 team-record-container justify-content-center")
    if ("items" in team.team.record) {
        var thisTeamRecord = team.team.record.items[0].summary
    } else {
        var thisTeamRecord = ''
    }
    var teamRecord = $("<p>").addClass("team-record").text(thisTeamRecord)

    teamImgDiv.append(teamImg)
    teamNameDiv.append(teamName)
    teamRankDiv.append(teamRank)
    teamRecordDiv.append(teamRecord)

    teamDivRow.append(teamImgDiv, teamRankDiv, teamNameDiv, teamRecordDiv)

    return teamDivRow
}
        /////////////////////////////////////////////////////////////
        ////// SPORTSIO API FOR NCAAF TEAMS
        /////////////////////////////////////////////////////////////
var loadSportsioNCAAFTeamRow = function(team) {
    console.log(team)

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

    var teamRecordDiv = $("<div>").addClass("col-2 team-record-container justify-content-center")
    var teamRecord = $("<p>").addClass("team-record").text(team.Wins + " - " + team.Losses)

    teamImgDiv.append(teamImg)
    teamNameDiv.append(teamName)
    teamRankDiv.append(teamRank)
    teamRecordDiv.append(teamRecord)

    teamDivRow.append(teamImgDiv, teamRankDiv, teamNameDiv, teamRecordDiv)

    return teamDivRow
}

//////////////////////////////////////////////////////////////////////////////////
////////////// LOADING INDIVIDUAL TEAM ROW FOR NFL
//////////////////////////////////////////////////////////////////////////////////

        /////////////////////////////////////////////////////////////
        ////// ESPN API FOR NFL TEAMS
        /////////////////////////////////////////////////////////////
var loadEspnNFLTeamRow = function(rankTeam, teams, rank) {

    var usedTeam = teams.find(team => team.team.id===rankTeam.team.id).team

    teamDivRow = $("<div>").addClass("row no-gutters team-row")

    var confRankDiv = $("<div>").addClass("col-1 rank-container d-flex justify-content-center")
    var confRank = $("<h5>").addClass("conf-rank")
    if (rank > 16) {
        confRank.text(rank-16)
    } else {
        confRank.text(rank)
    }

    var teamImgDiv = $("<div>").addClass("col-3 img-container d-flex justify-content-center")
    var teamImg = $("<img>")
        .addClass("team-img")
    teamImg.attr("src", usedTeam.logos[0].href)
    
    var teamNameDiv = $("<div>").addClass("col-6 team-name-container")
    var teamName = $("<h5>").addClass("team-name").text(usedTeam.displayName)

    var teamRecordDiv = $("<div>").addClass("col-2 team-record-container d-flex justify-content-center")
    var teamRecord = $("<p>").addClass("team-record")
    teamRecord.text(usedTeam.record.items[0].summary)
    
    confRankDiv.append(confRank)
    teamImgDiv.append(teamImg)
    teamNameDiv.append(teamName)
    teamRecordDiv.append(teamRecord)

    teamDivRow.append(confRankDiv, teamImgDiv, teamNameDiv, teamRecordDiv)

    return teamDivRow
}
        /////////////////////////////////////////////////////////////
        ////// SPORTSIO API FOR NFL TEAMS
        /////////////////////////////////////////////////////////////
var loadSportsioNFLTeamRow = function(team, teams) {

    teamDivRow = $("<div>").addClass("row no-gutters team-row")

    var confRankDiv = $("<div>").addClass("col-1 rank-container d-flex justify-content-center")
    var confRank = $("<h5>").addClass("conf-rank")
    if (team.ConferenceRank!=0) {
        confRank.text(team.ConferenceRank)
    } else {
        confRank.text("")
    }

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