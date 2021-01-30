jsem.math.twoDimensional = jsem.math.xy = {}; 

jsem.math.xy.angleBetweenTwoPoints = function (p1, p2) {
    // found this code at : https://gist.github.com/conorbuck/2606166
    return {
        angleRadians : Math.atan2(p2.y - p1.y, p2.x - p1.x),
        angleDegrees : Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI
    }
};

jsem.math.xy.distanceBetweenTwoPoints = function (xA, yA, xB, yB) { 
	var 
	xDiff = xA - xB,
	yDiff = yA - yB;

	return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}

jsem.math.xy.circles = {
    pointOnCircumference : function (centerX, centerY, angleDegrees, radius) {
        if (!centerX) centerX=0;
        if (!centerY) centerY=0;
        return {
            x : centerX + (radius * Math.cos(jsem.math.xy.circles.toRadians(angleDegrees))),
            y : centerY + (radius * Math.sin(jsem.math.xy.circles.toRadians(angleDegrees)))
        };
    },
    
    angleDegrees : function (center, p1) {
        var p0 = {
            x: center.x, 
            y: center.y 
                - Math.sqrt(
                    Math.abs(p1.x - center.x) * Math.abs(p1.x - center.x) + Math.abs(p1.y - center.y) * Math.abs(p1.y - center.y)
                )
        };
        return (2 * Math.atan2(p1.y - p0.y, p1.x - p0.x)) * 180 / Math.PI;
    },
    
    angleDegreesBetweenTwoPoints : function (center, p1, p2) {
        var 
        angle1 = jsem.math.xy.circles.angleDegrees (center, p1),
        angle2 = jsem.math.xy.circles.angleDegrees (center, p2);
        return angle2 - angle1;
    },
    
    toRadians : function (angleDegrees) {
        return angleDegrees * Math.PI / 180;
    }
};


