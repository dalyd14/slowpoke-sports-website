var navigationLinks = [
    'NFL',
    'NCAAF'
]

var currentPage = navigationLinks[0]

$("#navbar-list").on( "click","a", function(){
    changePage($(this).attr("id"))
})


var changePage = function(id) {
    currentPage = id.replace("-link", "")
    $("#navbar-list li a").removeClass("active");
    if (currentPage === "NFL") {
        loadNews(nflNews)
        //loadSchedules(NFLteams)
        $("#" + id).addClass("active");
    } else if (currentPage === "NCAAF") {
        loadNews(ncaafNews)
        getNCAAFteams()
        $("#" + id).addClass("active");
    }
}

for (var i = 0; i < navigationLinks.length; i++) {
    var listItem = $("<li>").addClass('nav-item')
    var listItemLink = $("<a>")
        .addClass("nav-link")
        .attr("id", navigationLinks[i] + "-link")
        .text(navigationLinks[i])    
    if (i === 0){
        listItemLink.addClass("active")    
    }
    listItem.append(listItemLink)
    $("#navbar-list").append(listItem)
}