

function setDebugCurrentPosition(coords) {

    //IOS Debugging get's position in California - we change it to Horsens where Thylle lives (2017)
    if (coords.latitude === 37.785834 && coords.longitude === -122.406417) {
        coords.latitude = "55.86057576512128";
        coords.longitude = "9.856608436528028";
    }

    return coords;
}


function calculateWindDegressFromDirection(direction) {
    var degResult = -45;
    var degOffset = 22.5;

    switch (direction.toUpperCase()) {
        case "NNE":
            degResult = degResult + (degOffset * 1);
            break;
        case "NE":
            degResult = degResult + (degOffset * 2);
            break;
        case "ENE":
            degResult = degResult + (degOffset * 3);
            break;
        case "E":
            degResult = degResult + (degOffset * 4);
            break;
        case "ESE":
            degResult = degResult + (degOffset * 5);
            break;
        case "SE":
            degResult = degResult + (degOffset * 6);
            break;
        case "SSE":
            degResult = degResult + (degOffset * 7);
            break;
        case "S":
            degResult = degResult + (degOffset * 8);
            break;
        case "SSW":
            degResult = degResult + (degOffset * 9);
            break;
        case "SW":
            degResult = degResult + (degOffset * 10);
            break;
        case "WSW":
            degResult = degResult + (degOffset * 11);
            break;
        case "W":
            degResult = degResult + (degOffset * 12);
            break;
        case "WNW":
            degResult = degResult + (degOffset * 13);
            break;
        case "NW":
            degResult = degResult + (degOffset * 14);
            break;
        case "NNW":
            degResult = degResult + (degOffset * 15);
            break;
    }

    return degResult + 180;
}