

var loadingContainer = $(".message__container");
var loadingContent = $(loadingContainer).find(".message__spinner");
var loadingElementClone = "";
var loadingActiveClass = "message__container--active";

function showLoading(scope) {
    scope.isLoading = true;
    //loadingContainer.addClass(loadingActiveClass);

    //$(loadingContent).append(loadingElementClone);
}

function hideLoading(scope) {

    setTimeout(function () {
        scope.isLoading = false;

        //loadingContainer.removeClass(loadingActiveClass);

        //loadingElementClone = $(loadingContent).find("img").clone();

        //remove the loading image from the DOM, to reduce CPU usage because of the animation
        //setTimeout(function () {
        //    $(loadingContent).find("img").remove();
        //}, 1500);
    }, 800);
}

