
var sectors = [];

function calculateSectors(data, size, fieldSize) {

    var l = size / 2;
    var a = 0; // Angle
    var aRad = 0; // Angle in Rad
    var z = 0; // Size z
    var x = 0; // Side x
    var y = 0; // Side y
    var X = 0; // SVG X coordinate
    var Y = 0; // SVG Y coordinate
    var R = 0; // Rotation


    data.sectors.map(function(item, key) {
        a = 360 * fieldSize;
        aCalc = (a > 180) ? 360 - a : a;
        aRad = aCalc * Math.PI / 180;
        z = Math.sqrt(2 * l * l - (2 * l * l * Math.cos(aRad)));
        if (aCalc <= 90) {
            x = l * Math.sin(aRad);
        } else {
            x = l * Math.sin((180 - aCalc) * Math.PI / 180);
        }

        y = Math.sqrt(z * z - x * x);
        Y = y;

        if (a <= 180) {
            X = l + x;
            arcSweep = 0;
        } else {
            X = l - x;
            arcSweep = 1;
        }

        sectors.push({
            percentage: fieldSize,
            label: item.label,
            active: item.active,
            arcSweep: arcSweep,
            L: l,
            X: X,
            Y: Y,
            R: R
        });

        R = R + a;
    });


    return sectors;
}

function drawWeatherDiagram(optimalWindDirectionList) {
    var size = 250;
    var fields = 16;
    var fieldSize = (100 / fields) / 100;
    var data = {
        sectors: [
            {
                label: 'N',
                active: true
            },
            {
                label: 'NNE',
                active: false
            },
            {
                label: 'NE',
                active: false
            },
            {
                label: 'ENE',
                active: false
            },
            {
                label: 'E',
                active: false
            },
            {
                label: 'ESE',
                active: false
            },
            {
                label: 'SE'
            },
            {
                label: 'SSE',
                active: false
            },
            {
                label: 'S',
                active: false
            },
            {
                label: 'SSW',
                active: false
            },
            {
                label: 'SW',
                active: false
            },
            {
                label: 'WSE',
                active: false
            },
            {
                label: 'W',
                active: false
            },
            {
                label: 'WNW',
                active: false
            },
            {
                label: 'NW',
                active: false
            },
            {
                label: 'NNW',
                active: false
            }
        ]
    }

    sectors = calculateSectors(data, size, fieldSize);
    var newSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    var rotateDeg = fieldSize * 2 * 100;
    newSVG.setAttributeNS(null, 'style', "transform: rotate(-" + rotateDeg + "deg); width: " + size + "px; height: " + size + "px");
    document.getElementById("weather-diagram").appendChild(newSVG);

    //All the fields
    sectors.map(function (sector) {
        var label = sector.label;
        var stroke = "#ddd";
        var stdColor = "#ccc";
        var activeColor = "#546E7A";
        var matchesDirections = $.inArray(label, optimalWindDirectionList.split(","));
        var color = matchesDirections > -1 ? activeColor : stdColor;

        var newSector = document.createElementNS("http://www.w3.org/2000/svg", "path");
        newSector.setAttributeNS(null, 'label', label);
        newSector.setAttributeNS(null, 'fill', color);
        newSector.setAttributeNS(null, 'stroke', stroke);
        newSector.setAttributeNS(null, 'd', 'M' + sector.L + ',' + sector.L + ' L' + sector.L + ',0 A' + sector.L + ',' + sector.L + ' 0 ' + sector.arcSweep + ',1 ' + sector.X + ', ' + sector.Y + ' z');
        newSector.setAttributeNS(null, 'transform', 'rotate(' + sector.R + ', ' + sector.L + ', ' + sector.L + ')');

        newSVG.appendChild(newSector);
    });

    //Center circle
    var circleColor = "#eee";
    var midCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    midCircle.setAttributeNS(null, 'cx', size * 0.5);
    midCircle.setAttributeNS(null, 'cy', size * 0.5);
    midCircle.setAttributeNS(null, 'r', size * 0.28);
    midCircle.setAttributeNS(null, 'fill', circleColor);

    newSVG.appendChild(midCircle);
}

