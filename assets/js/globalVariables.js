var navigationLinks = [
    'NFL',
    'NCAAF'
]

var navigationTabs = [
    'news',
    'scores',
    'teams'
]

var currentNav = JSON.parse(localStorage.getItem('slowpokeNav')) || {}

if(Object.keys(currentNav).length===0) {
    currentNav.currentLeague = navigationLinks[0];
    currentNav.currentTab = navigationTabs[0]
} else {
    if (!("currentLeague" in currentNav)) {
        currentNav.currentLeague = navigationLinks[0]
    } else if (!("currentTab" in currentNav)) {
        currentNav.currentTab = navigationLinks[0]
    }
}