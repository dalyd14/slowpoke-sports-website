var loadSchedules = function(arr) {
    $("#schedule").empty()
    var scheduleDivContainer = $("<div>").addClass("container")
    arr.forEach(element => {
        var scheduleDivRow = $("<div>").addClass("row schedule-row")
        var scheduleDivCol = $("<div>").addClass("col-12 col-sm-6 col-md-4 col-lg-3 schedule-col")
            .html(loadScheduleRow(element))
        scheduleDivRow.append(scheduleDivCol)
        scheduleDivContainer.append(scheduleDivRow)
    });
    $("#schedule").append(scheduleDivContainer)
}

var loadScheduleRow = function(team) {
    var scheduleRow = $("<div>").addClass("d-flex justify-content-start align-items-center")
    var teamImgDiv = $("<div>").addClass("img-container")
    var teamImg = $("<img>")
        .addClass("team-img")
    if(Array.isArray(team.imgURL)){
        teamImg.attr("src", team.imgURL[0])
    } else {
        teamImg.attr("src", team.imgURL)
    }
    var teamTextDiv = $("<div>").addClass("team-text-container")
    var teamName = $("<h5>").addClass("team-text").text(team.location + " " + team.name)

    teamImgDiv.append(teamImg)
    teamTextDiv.append(teamName)

    scheduleRow.append(teamImgDiv, teamTextDiv)

    return scheduleRow
}

if (currentPage === "NFL") {
    loadSchedules(NFLteams)
} else if (currentPage === "NCAAF") {
    loadSchedules(NCAAFteams)
}

$.getJSON( "https://api.sportsdata.io/v3/nfl/scores/json/News?key=1f5045ebe0954d7a9038e019a0dd7266", function( data ) {
    console.log(data)
  });