console.log(nflNews)

var loadNews = function(arr) {
    var newsDivContainer = $("<div>").addClass("container")
    var newsDivRow = $("<div>").addClass("row")
    arr.forEach(element => {
        var newsDivCol = $("<div>").addClass("col-12 news-col")
            .html(loadNewsCard(element))
        newsDivRow.append(newsDivCol)
    });
    newsDivContainer.append(newsDivRow);
    $("#nfl-news").append(newsDivContainer)
}

var loadNewsCard = function(news) {
    var newsCard = $("<div>").addClass("card")
    var newsImg = $("<img>").addClass("card-img-top")
    newsImg.attr("src", news.image)

    var newsCardBody = $("<div>").addClass("card-body")
    var newsTitle = $("<h5>").addClass("card-title").text(news.title)
    var newsDescription = $("<p>").addClass("card-text").text(news.description)

    newsCardBody.append(newsTitle, newsDescription)
    newsCard.append(newsImg, newsCardBody)

    return newsCard
}

var toggleTabs = function(id) {
    $("#" + id).removeClass("active show")
    $("#" + id).addClass("active show")
}

loadNews(nflNews)
toggleTabs("nfl-news")
