

var loadingContainer = $(".loading");
var loadingContent = $(loadingContainer).find(".loading__content");
var loadingElementClone = "";
var loadingActiveClass = "loading--active";

function showLoading(scope) {
    scope.isLoading = true;

    loadingContainer.addClass(loadingActiveClass);

    $(loadingContent).append(loadingElementClone);
}

function hideLoading(scope) {
    scope.isLoading = false;

    loadingContainer.removeClass(loadingActiveClass);

    loadingElementClone = $(loadingContent).find("img").clone();


    //remove the loading image from the DOM, to reduce CPU usage because of the animation
    setTimeout(function() {
        $(loadingContent).find("img").remove();
    }, 1500);
}
