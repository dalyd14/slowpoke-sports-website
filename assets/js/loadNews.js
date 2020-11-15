var loadNews = function(arr, teams) {
    $("#news").empty()
    var newsDivContainer = $("<div>").addClass("container")
    arr.forEach(element => {
        var newsDivRow = loadNewsRow(element, teams)
        newsDivContainer.append(newsDivRow);
    });
    $("#news").append(newsDivContainer)
}

var loadNewsRow = function(news, teams) {
    var newsDivRow = $("<div>").addClass("row non-gutters news-row")

    var newsTeamImgContainer = $("<div>").addClass("col-3 d-flex align-items-center")

    var newsTitleContainer = $("<div>").addClass("col-9 news-title")
    var newsTitleRow = $("<div>").addClass("row no-gutters")
    var newsTimeRow = $("<div>").addClass("row no-gutters")

    newsTitleRow.html("<div class='row no-gutters'><h3>" + news.Title + "</h3></div>")
    newsTimeRow.html("<div class='row no-gutters'><h6>" + moment(news.Updated, "YYYY-MM-DDTH:mm:ss").format("MM/DD/YYYY h:mm a") + "</h6></div>")

    newsTitleContainer.append(newsTitleRow, newsTimeRow)

    if(news.TeamID) {
        newsTeamImgContainer.html("<img src='" + teams.filter(team => team.TeamID===news.TeamID)[0].WikipediaLogoUrl + "' class='news-team-img' alt='" + teams.filter(team => team.TeamID===news.TeamID)[0].FullName + " Logo'>")
    } else {
        newsTeamImgContainer.html("<img src='' class='' alt=''>")
    }

    newsDivRow.append(newsTeamImgContainer, newsTitleContainer)

    return newsDivRow
}