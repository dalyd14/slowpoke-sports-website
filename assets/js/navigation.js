$("#navbar-list").on( "click","a", function(){
    currentNav.currentLeague = $(this).attr("id").replace("-link", "")
    localStorage.setItem('slowpokeNav', JSON.stringify(currentNav))
    changePage(currentNav.currentLeague)
})
$("#myTab").on( "click","a", function(){
    currentNav.currentTab = $(this).attr("id").replace("-tab", "")
    localStorage.setItem('slowpokeNav', JSON.stringify(currentNav))
})
$(".navbar-collapse").on("click", "ul li a", function(){
    if($("div.navbar-collapse").hasClass("show")){
        $('.navbar-toggler').click();
    }
});

var changePage = function(id) {
    $("#navbar-list li a").removeClass("active");
    if (id === "NFL") {
        clearContent("news")
        clearContent("scores")
        clearContent("teams")
        getNFLnews()
        getNFLdata()
        $("#" + id + "-link").addClass("active");
    } else if (id === "NCAAF") {
        clearContent("news")
        clearContent("scores")
        clearContent("teams")
        getNCAAFdata()
        $("#" + id + "-link").addClass("active");
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

var toggleTabs = function(id) {
    $("#" + id).removeClass("active show")
    $("#" + id).addClass("active show")
    
    $("#myTab a").removeClass("active")
    $("#myTab #" + id + "-tab").addClass("active")
}

var clearContent = function(id) {
    $("#" + id).empty()
}

changePage(currentNav.currentLeague)
toggleTabs(currentNav.currentTab)