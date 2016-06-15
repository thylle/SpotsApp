

function stateChange(toState) {

    var toStateName = toState.name;

    var tabHideClass = "tab-nav--hide";
    var headerFilterHideClass = "header-filter--hide";

    //Add body class to fade elements on state change
    $("body").addClass("state--change");

    setTimeout(function () {
        $("body").removeClass("state--change");
    }, 200);

    
    //Choose state names which should show the bottom tabs bar
    //List only
    if (toStateName == "list") {
        $("body")
            .removeClass(headerFilterHideClass);
    } else {
        $("body")
            .addClass(headerFilterHideClass);
    }


    //List & Map
    if (toStateName == "list" || toStateName == "map") {
        $("body")
            .removeClass(tabHideClass);
    } else {
        $("body")
            .addClass(tabHideClass);
    }
}
            


