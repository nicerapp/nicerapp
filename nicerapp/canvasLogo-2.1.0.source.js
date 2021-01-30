na.canvasLogo = na.logo = {
	about : {
		whatsThis : 'na.canvasLogo === na.logo; drawing of the logo and any interactivity/animations specific for the logo',
		copyright : '(c) and (r) 2017-2020 by Rene AJM Veerman, Amsterdam, Netherlands, rene.veerman.netherlands@gmail.com',
		license : 'May only be used by Rene AJM Veerman, Amsterdam, Netherlands, rene.veerman.netherlands@gmail.com',
		version : 'x.y.z',
		dateOfBirth : '2017-07',
		lastUpdated : '2020-08-18(Tuesday) 19:30CEST'
	},
	globals : {
		
	},
	settings : {
        margin : 0, //pixels
		shadowX : 1,
		shadowY : 1,
		shadowDepth : 1,
		shadowDeeper : true,
        logoHTMLids : {}
	},
	
	init_do_createLogo : function (logoHTMLid, logoColors) {
        // logoColors should be any of the following : 'blackAndWhite', 'RGB', 'countryOfOriginColors', 'celebratingLifeItselfColors'
        
		var eventData = {
			eventType : 'resize',
			element : logoHTMLid
		};
		jQuery(window).resize (eventData, na.logo.resize);
        
        na.logo.settings.logoHTMLids[logoHTMLid] = {};
		
		var 
		w = na.logo.settings.width = na.logo.logoWidth(logoHTMLid),
		h = na.logo.settings.height = na.logo.logoHeight(logoHTMLid),
		logoColors = 'countryOfOriginColors', 
		circlesColorStroke = (logoColors == 'RGB' ? 'navy' : 'black'),
        circlesColorFill = (logoColors == 'RGB' ? 'navy' : 'white'),
        strokeStyle = { width : 1, style : 'round' };
        na.logo.settings.logoColors = logoColors;
		
		var context = na.logo.settings.context = jQuery('#'+logoHTMLid)[0].getContext('2d');
		
		var stage = na.logo.settings.stage = new createjs.Stage(logoHTMLid);
		//stage.shadow = new createjs.Shadow("black", 0, 0, 7);
		//setInterval (na.logo.shadowLoop, 50);
		//stage.setBounds (0,0,w,h);
        
		var circle_html = new createjs.Shape();
        circle_html.radius = w*0.25;
        if (logoColors == 'RGB') {
            circle_html.graphics
                .setStrokeStyle(strokeStyle.width, strokeStyle.style)
                .beginStroke('#0F0')
                .beginFill('#0F0')
                .drawCircle(0, 0, circle_html.radius);
            circle_html.shadow = new createjs.Shadow('#000',4,4,5);                
        } else {
            circle_html.graphics
                .setStrokeStyle(strokeStyle.width, strokeStyle.style)
                .beginStroke('black')
                .beginFill('white')
                .drawCircle(0, 0, circle_html.radius);
            circle_html.shadow = new createjs.Shadow('#000',4,4,5);                
        }
        //circle_html.graphics.setStrokeStyle(strokeStyle.width, strokeStyle.style).beginStroke('blue').beginFill('blue').drawCircle(0, 0, circle_html.radius);
        na.logo.settings.circle_html = circle_html;
		
		
		var circle_css = new createjs.Shape();
        circle_css.radius = w*0.2;
        if (logoColors == 'RGB') {
            circle_css.graphics
                .setStrokeStyle(strokeStyle.width, strokeStyle.style)
                .beginStroke('#0A0')
                .beginFill('#0A0')
                .drawCircle(0, 0, circle_css.radius);
        } else {
            circle_css.graphics
                .setStrokeStyle(strokeStyle.width, strokeStyle.style)
                .beginStroke('black')
                .beginFill('white')
                .drawCircle(0, 0, circle_css.radius);
            circle_css.shadow = new createjs.Shadow('#000',4,4,5);                
        }
        //circle_css.graphics.setStrokeStyle(strokeStyle.width, strokeStyle.style).beginStroke('navy').beginFill('navy').drawCircle(0, 0, circle_css.radius);
		na.logo.settings.circle_css = circle_css;
		
		var circle_javascript = new createjs.Shape();
        circle_javascript.radius = w*0.15;
        if (logoColors == 'RGB') {
            circle_javascript.graphics
                .setStrokeStyle(strokeStyle.width, strokeStyle.style)
                .beginStroke('#A00')
                .beginFill('#A00')
                .drawCircle(0, 0, circle_javascript.radius);
        } else {
            circle_javascript.graphics
                .setStrokeStyle(strokeStyle.width, strokeStyle.style)
                .beginStroke('black')
                .beginFill('white')
                .drawCircle(0, 0, circle_javascript.radius);
            circle_javascript.shadow = new createjs.Shadow('#000',4,4,5);                
        }
        //circle_javascript.graphics.setStrokeStyle(strokeStyle.width, strokeStyle.style).beginStroke('#A00').beginFill('#A00').drawCircle(0, 0, circle_javascript.radius);
		na.logo.settings.circle_javascript = circle_javascript;

        /*var circle_canvas = new createjs.Shape();
        circle_canvas.radius = w*0.1;
        circle_canvas.graphics.beginStroke('lime').beginFill('lime').drawCircle((w/2), (h/2), circle_canvas.radius);
		na.logo.settings.circle_canvas = circle_canvas;
        */
        stage.addChild(circle_html);
        stage.addChild(circle_css);
        stage.addChild(circle_javascript);
        //stage.addChild(circle_canvas);
		na.logo.resize (eventData, true);		
	},
	
	shadowLoop : function (logoHTMLid) {
		var 
		w = na.logo.settings.width = na.logo.logoWidth(logoHTMLid),
		h = na.logo.settings.height = na.logo.logoHeight(logoHTMLid),
		stage = na.logo.settings.stage,
		shadow = stage.shadow;
		
		// todo : perhaps animate shadow by creating shadow that moves around the logo.. tomorrow maybe.
		
	},

	resize : function (resizeEventData, actuallyDo) {
		
		if (actuallyDo) {
			
			if (resizeEventData.data) resizeEventData = resizeEventData.data;
			var 
			logoHTMLid = resizeEventData.element,
			w = na.logo.settings.width = na.logo.logoWidth(logoHTMLid),
			h = na.logo.settings.height = na.logo.logoHeight(logoHTMLid),
			stage = na.logo.settings.stage,
			circle_html = na.logo.settings.circle_html,
			circle_css = na.logo.settings.circle_css,
			circle_javascript = na.logo.settings.circle_javascript;

			na.logo.settings.context.clearRect(0, 0, na.logo.settings.context.width, na.logo.settings.context.height);		
			// overrides
			//w = 200;
			//h = 200;

			//jQuery('#'+logoHTMLid)[0].top = 5;
			//jQuery('#'+logoHTMLid)[0].left = 5;
			/*
            jQuery('#'+logoHTMLid)[0].parentNode.style.width = w-10 + 'px';
			jQuery('#'+logoHTMLid)[0].parentNode.style.height = h-10 + 'px';
            */
			jQuery('#'+logoHTMLid)[0].width = w;
			jQuery('#'+logoHTMLid)[0].height = h;
			
			var x = (w / 2);
			var y = (h / 2);
			
            circle_html.x = x;
			circle_html.y = y;

			circle_css.x = x;
			circle_css.y = y;

			circle_javascript.x = x;
			circle_javascript.y = y;
            
			
			
            na.logo.drawEggs (logoHTMLid);
            na.logo.drawSquaresAndTriangles (logoHTMLid);
			
			stage.update();
		}
	},
	
	drawSquaresAndTriangles : function (logoHTMLid) {
		var 
		w = na.logo.settings.width = na.logo.logoWidth(logoHTMLid),
		h = na.logo.settings.height = na.logo.logoHeight(logoHTMLid),
		stage = na.logo.settings.stage,
        squareWidth = (w*0.1),
        squareStrokeStyle = { width : 2, style : 'round' },
        triangleWidth = (w*0.2),
        triangleStrokeStyle = { width : 2, style : 'round' },
        cOuterRadius = w*0.3,
        cHTMLradius = na.logo.settings.circle_html.radius,
        cCSSradius = na.logo.settings.circle_css.radius,
        cJavascriptRadius = na.logo.settings.circle_javascript.radius,
        logoColors = na.logo.settings.logoColors,
        //cCanvasRadius = na.logo.settings.circle_canvas.radius,
        sqShadow = {
            colorFill : '#000',
            colorStroke : '#000',
            x : 2,
            y : 2,
            width : 2,
            height : 2,
            blur : 5
        },
        trShadow = {
            colorFill : '#000',
            colorStroke : '#000',
            x : 2, 
            y : 2,
            width : 2,
            height : 2,
            blur : 5
        },
        canvasContext = na.logo.settings.context;
		
        switch (logoColors) {
            case 'RGB':
                colorSquaresStroke = '#007500';
                colorSquaresFill = '#090';
                colorTrianglesStroke = '#000075';
                colorTrianglesFill = '#00F'; // SHORT-HAND HEXADECIMAL VALUE (RGB, full/pure blue)
                break;
            case 'countryOfOriginColors':
                colorSquaresStroke = '#007500'; // RGB (Red, Green, Blue) as HEX-adecimal value. READ. THE. MANUAL, if you want to know more.
                colorSquaresFill = 'blue';
                colorTrianglesStroke = '#750000';
                colorTrianglesFill = 'red'; 
                colorSchemeSquaresStroke = na.cg.themes.saColorgradientSchemeGreen_leaf;
                colorSchemeSquaresFill = na.cg.themes.saColorgradientScheme_BlueToNavy;
                colorSchemeTrianglesStroke = na.cg.themes.saColorgradientSchemeDarkRedVividText;
                colorSchemeTrianglesFill = na.cg.themes.saColorgradientSchemeDarkRed;
                break;
            case 'celebratingLifeItselfColors':
                colorSquaresStroke = '#007500'; // RGB (Red, Green, Blue) as HEX-adecimal value. READ. THE. MANUAL, if you want to know more.
                colorSquaresFill = 'green';
                colorTrianglesStroke = '#750000';
                colorTrianglesFill = 'red'; 
                break;
                
            default:
                colorSquaresStroke = '#000';
                colorSquaresFill = '#FFF';
                colorTrianglesStroke = '#000';
                colorTrianglesFill = '#FFF';
                break;
        };
        if (colorSchemeSquaresStroke) {
            var
            colorAnim_stepsCount = 10,
            colorAnimSquaresStroke = na.colorGradients.generateList_basic (colorSchemeSquaresStroke, colorAnim_stepsCount),
            colorAnimSquaresFill = na.colorGradients.generateList_basic (colorSchemeSquaresFill, colorAnim_stepsCount),
            colorAnimTrianglesStroke = na.colorGradients.generateList_basic (colorSchemeTrianglesStroke, colorAnim_stepsCount),
            colorAnimTrianglesFill = na.colorGradients.generateList_basic (colorSchemeTrianglesFill, colorAnim_stepsCount);
        };
        
		var 
		square_n = new createjs.Shape();
		square_n.colorStroke = colorSquaresStroke;
		square_n.colorFill = colorSquaresFill;
		square_n.graphics.setStrokeStyle (squareStrokeStyle.width, squareStrokeStyle.style).beginStroke(square_n.colorStroke).beginFill(square_n.colorFill);
        var 
		x1 = (w/2) - (squareWidth/2),
		y1 = (h/2) - cOuterRadius,
		x2 = (w/2) + (squareWidth/2),
		y2 = (h/2) - cOuterRadius - squareWidth;
        var dbg1 = {
            point1 : { x : x1, y : y1 },
            point2 : { x : x2, y : y1 },
            point3 : { x : x2, y : y2 },
            point4 : { x : x1, y : y2 }
        };
        square_n.graphics
            .moveTo (dbg1.point1.x,dbg1.point1.y)
            .lineTo (dbg1.point2.x,dbg1.point2.y)
            .lineTo (dbg1.point3.x,dbg1.point3.y)
            .lineTo (dbg1.point4.x,dbg1.point4.y)
            .lineTo (dbg1.point1.x,dbg1.point1.y);
		//stage.addChild (square_n);
        //stage.update();
            
		var 
		triangle_nw = new createjs.Shape();
		triangle_nw.colorStroke = colorTrianglesStroke;
		triangle_nw.colorFill = colorTrianglesFill;
		triangle_nw.graphics.setStrokeStyle (triangleStrokeStyle.width, triangleStrokeStyle.style).beginStroke(triangle_nw.colorStroke).beginFill(triangle_nw.colorFill);
        var
		cOutRadius = (w*0.2),
		dbg2 = {
            point1 : {
                x : (w/2) + cOutRadius - (triangleWidth/5),
                y : (h/2) - cOutRadius - (triangleWidth/5) 
            },
            point2 : {
                x : (w/2) + cOutRadius + (triangleWidth/2.5),
                y : (h/2) - cOutRadius - (triangleWidth/2.5)
            },
            point3 : {
                x : (w/2) + cOutRadius + (triangleWidth/4),
                y : (h/2) - cOutRadius + (triangleWidth/4)
            }
        };
        triangle_nw.graphics
            .moveTo (w/2, h/2)
            //.lineTo ((w/2)+cOuterRadius, (h/2)-cOuterRadius)
            //.moveTo( dbg2.point1.x, dbg2.point1.y )
            //.lineTo( dbg2.point1.x + 10, dbg2.point1.y + 10 )
            .moveTo( dbg2.point1.x, dbg2.point1.y )
            .lineTo( dbg2.point2.x, dbg2.point2.y )
            .lineTo( dbg2.point3.x, dbg2.point3.y )
            .lineTo( dbg2.point1.x, dbg2.point1.y );            
		//stage.addChild (triangle_nw);
        //stage.update();

		var 
		square_e = new createjs.Shape();
		square_e.colorStroke = colorSquaresStroke;
		square_e.colorFill = colorSquaresFill;
		square_e.graphics.setStrokeStyle (squareStrokeStyle.width, squareStrokeStyle.style).beginStroke(square_e.colorStroke).beginFill(square_e.colorFill);
        var 
		x1 = (w/2) + cOuterRadius + (squareWidth),
		y1 = (h/2) - (squareWidth/2),
		x2 = (w/2) + cOuterRadius,
		y2 = (h/2) + (squareWidth/2);
		square_e.graphics
			.moveTo( x1, y1 )
			.lineTo( x1, y2 )
			.lineTo( x2, y2 )
			.lineTo( x2, y1 )
			.lineTo( x1, y1 );
        if (logoColors == 'RGB') {
            square_e.shadow = createjs.Shadow (sqShadow.color, sqShadow.x, sqShadow.y, sqShadow.blur);
        }
		//stage.addChild (square_e);
        //stage.update();
        
        
        var 
        xyc = jsem.math.xy.circles,
        dbg = {
            point0 : {x:w/2, y:h/2}, // center of logo
            //square coordinates
            point1 : dbg1.point1,//{x:dbg1.point1.x, y:dbg1.point1.y},
            point2 : dbg1.point2,//{x:dbg1.point2.x, y:dbg1.point2.y},
            point3 : dbg1.point3,//{x:dbg1.point3.x, y:dbg1.point3.y},
            point4 : dbg1.point4,//{x:dbg1.point4.x, y:dbg1.point4.y},
            // triangle coordinates
            point5 : dbg2.point1,//{x:dbg2.point1.x, y:dbg2.point1.y},
            point6 : dbg2.point2,//{x:dbg2.point2.x, y:dbg2.point2.y},
            point7 : dbg2.point3,//{x:dbg2.point3.x, y:dbg2.point3.y}
        };
        dbg.angleBetweenPoint1and2 = xyc.angleDegreesBetweenTwoPoints (dbg.point0,dbg.point1, dbg.point2);
        while (dbg.angleBetweenPoint1and2<0) dbg.angleBetweenPoint1and2+=360;
        while (dbg.angleBetweenPoint1and2>360) dbg.angleBetweenPoint1and2-=360;
        dbg.angleBetweenPoint3and4 = xyc.angleDegreesBetweenTwoPoints (dbg.point0,dbg.point4, dbg.point3);
        while (dbg.angleBetweenPoint3and4<0) dbg.angleBetweenPoint3and4+=360;
        while (dbg.angleBetweenPoint3and4>360) dbg.angleBetweenPoint3and4-=360;
        dbg.angleToPoint7 = xyc.angleDegrees (dbg.point0,dbg.point7);
        while (dbg.angleToPoint7<0) dbg.angleToPoint7+=360;
        while (dbg.angleToPoint7>360) dbg.angleToPoint7-=360;
        dbg.dtp7 = jsem.math.xy.distanceBetweenTwoPoints (dbg.point0.x,dbg.point0.y,dbg.point7.x,dbg.point7.y);
        dbg.angleToPoint5 = xyc.angleDegrees (dbg.point0,dbg.point5);
        while (dbg.angleToPoint5<0) dbg.angleToPoint5+=360;
        while (dbg.angleToPoint5>360) dbg.angleToPoint5+=360;
        dbg.dtp5 = jsem.math.xy.distanceBetweenTwoPoints (dbg.point0.x,dbg.point0.y,dbg.point5.x,dbg.point5.y);
        dbg.angleToPoint6 = xyc.angleDegrees (dbg.point0,dbg.point6);
        while (dbg.angleToPoint6<0) dbg.angleToPoint6+=360;
        while (dbg.angleToPoint6>360) dbg.angleToPoint6-=360;
        dbg.dtp6 = jsem.math.xy.distanceBetweenTwoPoints (dbg.point0.x,dbg.point0.y,dbg.point6.x,dbg.point6.y);
        /*
        dbg.angleBetweenPoint5and6 = xyc.angleDegreesBetweenTwoPoints (dbg.point0,dbg.point5, dbg.point6);
        while (dbg.angleBetweenPoint5and6<0) dbg.angleBetweenPoint5and6+=360;
        while (dbg.angleBetweenPoint5and6>360) dbg.angleBetweenPoint5and6-=360;
        */
        //console.log('CIRCLE CALCULATION 2');
        //console.log (dbg);
        
        var x = na.colorGradients.generateList_basic (na.cg.themes.saColorgradientSchemeOrangeYellow, 10);
        //console.log ('COLOR ANIMATION 1');
        //console.log (x);
        
        
        var
        // all angles are in degrees.
        animDegreesCount = 360,
        outlyingShapesCount = 4,
        squareASDangle = 0,
        animCalculationData = [];
        for (var i=0; i<animDegreesCount; i++) {
            var 
            animStep = [];
            for (var j=0; j<outlyingShapesCount; j++) {
                var 
                squareASDangle = -90 + ((360/animDegreesCount)*i)+((360/outlyingShapesCount)*j),
                asd = { // asd = animStepData
                    sas : squareASDangle, //sas = stepAngleSquare
                    sas1 : squareASDangle - (dbg.angleBetweenPoint1and2/2),
                    sas2 : squareASDangle + (dbg.angleBetweenPoint1and2/2),
                    sas3 : squareASDangle - (dbg.angleBetweenPoint3and4/2),
                    sas4 : squareASDangle + (dbg.angleBetweenPoint3and4/2),
                    sat5 : squareASDangle + dbg.angleToPoint5,// sat = stepAngleTriangle
                    sat6 : squareASDangle + dbg.angleToPoint6,
                    sat7 : squareASDangle + dbg.angleToPoint7,
                    dtp5 : dbg.dtp5, // dtp = distanceToPoint
                    dtp6 : dbg.dtp6,
                    dtp7 : dbg.dtp7,
                    shapeSquare : new createjs.Shape(),
                    shapeSquareShadow : new createjs.Shape(),
                    shapeTriangle : new createjs.Shape(),
                    shapeTriangleShadow : new createjs.Shape()
                };
                while (asd.sas1 < 0) asd.sas1 += 360;
                while (asd.sas1 > 360) asd.sas1 -= 360;
                while (asd.sas2 < 0) asd.sas2 += 360;
                while (asd.sas2 > 360) asd.sas2 -= 360;
                while (asd.sas3 < 0) asd.sas3 += 360;
                while (asd.sas3 > 360) asd.sas3 -= 360;
                while (asd.sas4 < 0) asd.sas4 += 360;
                while (asd.sas4 > 360) asd.sas4 -= 360;
                while (asd.sat5 < 0) asd.sat5 += 360;
                while (asd.sat5 > 360) asd.sat5 -= 360;
                while (asd.sat6 < 0) asd.sat6 += 360;
                while (asd.sat6 > 360) asd.sat6 -= 360;
                while (asd.sat7 < 0) asd.sat7 += 360;
                while (asd.sat7 > 360) asd.sat7 -= 360;
 
                asd.point0 = {x:w/2, y:h/2};
                //square
                asd.point1 = xyc.pointOnCircumference(w/2,h/2,asd.sas1,cOuterRadius);
                asd.point2 = xyc.pointOnCircumference(w/2,h/2,asd.sas2,cOuterRadius);
                asd.point3 = xyc.pointOnCircumference(w/2,h/2,asd.sas3,cOuterRadius+(squareWidth));
                asd.point4 = xyc.pointOnCircumference(w/2,h/2,asd.sas4,cOuterRadius+(squareWidth));
                //triangle or arrow-head
                asd.point5 = xyc.pointOnCircumference(w/2,h/2,asd.sat5, asd.dtp5);
                asd.point6 = xyc.pointOnCircumference(w/2,h/2,asd.sat6, asd.dtp6);
                asd.point7 = xyc.pointOnCircumference(w/2,h/2,asd.sat7, asd.dtp7);
                //if (i===0 && j===0) debugger;
                
                asd.shapeSquare.colorStroke = colorSquaresStroke;
                asd.shapeSquare.colorFill = colorSquaresFill;
                asd.shapeSquare.graphics
                    .setStrokeStyle (squareStrokeStyle.width, squareStrokeStyle.style)
                    .beginStroke(colorSquaresStroke)
                    .beginFill(colorSquaresFill);
                asd.shapeSquareShadow.colorStroke = sqShadow.colorStroke;
                asd.shapeSquareShadow.colorFill = sqShadow.colorFdbg0ill;
                asd.shapeSquareShadow.graphics
                    .setStrokeStyle (sqShadow.width, squareStrokeStyle.style)
                    .beginStroke(sqShadow.colorStroke)
                    .beginFill(sqShadow.colorFill);
                    
                asd.shapeTriangle.colorStroke = colorTrianglesStroke;
                asd.shapeTriangle.colorFill = colorTrianglesFill;
                asd.shapeTriangle.graphics
                    .setStrokeStyle (triangleStrokeStyle.width, triangleStrokeStyle.style)
                    .beginStroke(colorTrianglesStroke)
                    .beginFill(colorTrianglesFill);
                asd.shapeTriangleShadow.colorStroke = trShadow.colorStroke;
                asd.shapeTriangleShadow.colorFill = trShadow.colorFill;
                asd.shapeTriangleShadow.graphics
                    .setStrokeStyle (trShadow.width, triangleStrokeStyle.style)
                    .beginStroke(trShadow.colorStroke)
                    .beginFill(trShadow.colorFill);
                    
                //squareASDangle += (360/animDegreesCount);
                animStep.push (asd);
            };
            animCalculationData.push(animStep);
        };
        //console.log ('CIRCLE ANIMATION CALCULATION DATA');
        //console.log (animCalculationData);
        var
        doAnim_rotation = true;
        doAnim_colors = true;
        
        if (doAnim_colors && doAnim_rotation) {
            if (colorSchemeSquaresStroke) {
                var
                colorAnim_stepsCount = 77,
                colorAnim_step = 0,
                rotationAnim_stepsCount = 5;
                colorAnimSquaresStroke = na.colorGradients.generateList_basic (colorSchemeSquaresStroke, colorAnim_stepsCount),
                colorAnimSquaresFill = na.colorGradients.generateList_basic (colorSchemeSquaresFill, colorAnim_stepsCount),
                colorAnimTrianglesStroke = na.colorGradients.generateList_basic (colorSchemeTrianglesStroke, colorAnim_stepsCount),
                colorAnimTrianglesFill = na.colorGradients.generateList_basic (colorSchemeTrianglesFill, colorAnim_stepsCount);
                if (na.logo.settings.timeouts) {
                    for (var m=0; m<na.logo.settings.timeouts.length; m++) {
                        clearTimeout (na.logo.settings.timeouts[m]);
                    }
                } else {
                    na.logo.settings.timeouts = [];
                };
                for (var rotationAnim_step=0; rotationAnim_step<rotationAnim_stepsCount; rotationAnim_step++) {
                    na.logo.settings.timeouts.push(setTimeout (function (rotationAnim_step) {
                        for (var i=0; i<animDegreesCount; i++) {
                            na.logo.settings.timeouts.push(setTimeout (function(rotationAnim_step, i) {
                                var 
                                animStep = animCalculationData[i];
                                
                                colorAnim_step++;
                                if (colorAnim_step>=colorAnim_stepsCount) colorAnim_step=0;
                                //console.log ('CIRCLE ANIMATION STEP CALCULATION DATA');
                                //console.log (animStep);
                                for (var j=0; j<outlyingShapesCount; j++) {
                                    asd = animStep[j];

                                    for (var l=0; l<animDegreesCount; l++) {
                                        stage.removeChild(animCalculationData[l][j].childSquare);
                                        stage.removeChild(animCalculationData[l][j].childSquareShadow);
                                        stage.removeChild(animCalculationData[l][j].childTriangle);
                                        stage.removeChild(animCalculationData[l][j].childTriangleShadow);
                                    }
                
                                    var dc = { // dc = drawCommand
                                        stage : stage,
                                        canvasContext : canvasContext,
                                        asd : asd, // asd = animationStepData
                                        i : i, // animCalculationData[i]
                                        j : j, // animCalculationData[i][j]
                                        sqShadow : sqShadow,
                                        trShadow : trShadow,
                                        animDegreesCount : animDegreesCount,
                                        rotationAnim_step : rotationAnim_step,
                                        colorAnim_stepsCount : colorAnim_stepsCount,
                                        colorAnim_step : colorAnim_step,
                                        colorSquaresFill : colorAnimSquaresFill,
                                        colorSquaresStroke : colorAnimSquaresStroke,
                                        squareStrokeStyle : squareStrokeStyle,
                                        colorTrianglesFill : colorAnimTrianglesFill,
                                        colorTrianglesStroke : colorAnimTrianglesStroke,
                                        triangleStrokeStyle : triangleStrokeStyle
                                    };
                                    na.canvasLogo.drawSquaresAndTriangles_do(dc);
                                }
                                stage.update();
                            }, 50+(10*i), rotationAnim_step, i));
                        }
                    }, rotationAnim_step*(50+(10*animDegreesCount)+(390*rotationAnim_stepsCount)+(5*colorAnim_stepsCount)), rotationAnim_step));
                };
                
            } else {
                console.log ('na.canvasLogo : FATAL ERROR - CAN NOT DETERMINE LIST OF COLORS FOR COLOR ANIMATION');
                debugger;
            };
            
        } else if (doAnim_rotation) {
            for (var rotationAnim_step=0; rotationAnim_step<5; rotationAnim_step++) {
                setTimeout (function() {
                    for (var i=0; i<animDegreesCount; i++) {        
                        setTimeout (function(i) {
                            var animStep = animCalculationData[i];
                            //console.log ('CIRCLE ANIMATION STEP CALCULATION DATA');
                            //console.log (animStep);
                            for (var j=0; j<outlyingShapesCount; j++) {
                                asd = animStep[j];

                                if (i>1) {
                                    var k = i-1;
                                } else if (i===1) {
                                    var k = 0;
                                } else if (i===0) {
                                    var k = 359;
                                };
                                stage.removeChild(animCalculationData[k][j].childSquare);
                                stage.removeChild(animCalculationData[k][j].childSquareShadow);
                                stage.removeChild(animCalculationData[k][j].childTriangle);
                                stage.removeChild(animCalculationData[k][j].childTriangleShadow);
             
                                var dc = { // dc = drawCommand
                                    stage : stage,
                                    canvasContext : canvasContext,
                                    asd : asd, // asd = animationStepData
                                    i : i, // animCalculationData[i]
                                    j : j, // animCalculationData[i][j]
                                    sqShadow : sqShadow,
                                    trShadow : trShadow,
                                    animDegreesCount : animDegreesCount,
                                    rotationAnim_step : rotationAnim_step,
                                    colorAnim_stepsCount : 0,
                                    colorSquaresFill : colorSquaresFill,
                                    colorSquaresStroke : colorSquaresStroke,
                                    colorTrianglesFill : colorTrianglesFill,
                                    colorTrianglesStroke : colorTrianglesStroke
                                };
                                na.canvasLogo.drawSquaresAndTriangles_do(dc);
                            }
                            stage.update();
                        }, 50+(25*i), i);
                    };
                }, (360*30*rotationAnim_step));
            };
            
        } else if (doAnim_colors) {
            if (colorSchemeSquaresStroke) {
                var
                colorAnim_stepsCount = 100,
                colorAnimSquaresStroke = na.colorGradients.generateList_basic (colorSchemeSquaresStroke, colorAnim_stepsCount),
                colorAnimSquaresFill = na.colorGradients.generateList_basic (colorSchemeSquaresFill, colorAnim_stepsCount),
                colorAnimTrianglesStroke = na.colorGradients.generateList_basic (colorSchemeTrianglesStroke, colorAnim_stepsCount),
                colorAnimTrianglesFill = na.colorGradients.generateList_basic (colorSchemeTrianglesFill, colorAnim_stepsCount),
                i = 0,
                animStep = animCalculationData[i];
                //console.log ('dc CALCULATION DATA');
                //console.log (animStep);
                for (var colorAnim_step=0; colorAnim_step<colorAnim_stepsCount; colorAnim_step++) {
                    setTimeout (function(colorAnim_step) {
                        for (var j=0; j<outlyingShapesCount; j++) {
                            asd = animStep[j];
                            var dc = { // dc = drawCommand
                                stage : stage,
                                canvasContext : canvasContext,
                                asd : asd, // asd = animationStepData
                                i : i, // animCalculationData[i]
                                j : j, // animCalculationData[i][j]
                                sqShadow : sqShadow,
                                trShadow : trShadow,
                                animDegreesCount : 0,
                                rotationAnim_step : 0,
                                colorAnim_stepsCount : colorAnim_stepsCount,
                                colorAnim_step : colorAnim_step,
                                colorSquaresFill : colorAnimSquaresFill,
                                colorSquaresStroke : colorAnimSquaresStroke,
                                squareStrokeStyle : squareStrokeStyle,
                                colorTrianglesFill : colorAnimTrianglesFill,
                                colorTrianglesStroke : colorAnimTrianglesStroke,
                                triangleStrokeStyle : triangleStrokeStyle
                            };
                            na.canvasLogo.drawSquaresAndTriangles_do(dc);
                            stage.update();
                        }
                    }, 100 + (25*colorAnim_step), colorAnim_step);
                stage.update();
                }
            } else {
                console.log ('na.canvasLogo : FATAL ERROR - CAN NOT DETERMINE LIST OF COLORS FOR COLOR ANIMATION');
                debugger;
            };
            
        } else {
            var 
            i = 0,
            animStep = animCalculationData[i];
            //console.log ('dc CALCULATION DATA');
            //console.log (animStep);
            for (var j=0; j<outlyingShapesCount; j++) {
                asd = animStep[j];
                var dc = { // dc = drawCommand
                    stage : stage,
                    canvasContext : canvasContext,
                    asd : asd, // asd = animationStepData
                    i : i, // animCalculationData[i]
                    j : j, // animCalculationData[i][j]
                    sqShadow : sqShadow,
                    trShadow : trShadow,
                    animDegreesCount : 0,
                    rotationAnim_step : 0,
                    colorAnim_stepsCount : 0,
                    colorAnim_step : 0,
                    colorSquaresFill : colorSquaresFill,
                    colorSquaresStroke : colorSquaresStroke,
                    squareStrokeStyle : squareStrokeStyle,
                    colorTrianglesFill : colorTrianglesFill,
                    colorTrianglesStroke : colorTrianglesStroke,
                    triangleStrokeStyle : triangleStrokeStyle
                };
                na.canvasLogo.drawSquaresAndTriangles_do(dc);
            }
            stage.update();
        };
        
		stage.update();
	},
    
    drawSquaresAndTriangles_do : function (dc) {
        //dc.colorAnim_stepsCount;
        //dc.animDegreesCount;
        if (dc.colorAnim_stepsCount===0) {
            var
            css = dc.colorSquaresStroke,
            csf = dc.colorSquaresFill,
            cts = dc.colorTrianglesStroke,
            ctf = dc.colorTrianglesFill,
            sss = dc.squareStrokeStyle,
            tss = dc.triangleStrokeStyle,
            ss = dc.sqShadow,
            ts = dc.trShadow;
        } else {
            var
            css = dc.colorSquaresStroke[dc.colorAnim_step].color,
            csf = dc.colorSquaresFill[dc.colorAnim_step].color,
            cts = dc.colorTrianglesStroke[dc.colorAnim_step].color,
            ctf = dc.colorTrianglesFill[dc.colorAnim_step].color,
            sss = dc.squareStrokeStyle,
            tss = dc.triangleStrokeStyle,
            ss = dc.sqShadow,
            ts = dc.trShadow;
        };
        
        dc.asd.shapeSquare.colorStroke = css;
        dc.asd.shapeSquare.colorFill = csf;
        dc.asd.shapeSquare.graphics
            .setStrokeStyle (sss.width, sss.style)
            .beginStroke(css)
            .beginFill(csf);
        dc.asd.shapeSquareShadow.colorStroke = ss.colorStroke;
        dc.asd.shapeSquareShadow.colorFill = ss.colorFill;
        dc.asd.shapeSquareShadow.graphics
            .setStrokeStyle (ss.width, sss.style)
            .beginStroke(ss.colorStroke)
            .beginFill(ss.colorFill);
            
        dc.asd.shapeTriangle.colorStroke = cts;
        dc.asd.shapeTriangle.colorFill = ctf;
        dc.asd.shapeTriangle.graphics
            .setStrokeStyle (tss.width, tss.style)
            .beginStroke(cts)
            .beginFill(ctf);
        dc.asd.shapeTriangleShadow.colorStroke = ts.colorStroke;
        dc.asd.shapeTriangleShadow.colorFill = ts.colorFill;
        dc.asd.shapeTriangleShadow.graphics
            .setStrokeStyle (ts.width, tss.style)
            .beginStroke(ts.colorStroke)
            .beginFill(ts.colorFill);
        
        
        dc.asd.shapeSquare.graphics
            .moveTo (dc.asd.point1.x, dc.asd.point1.y)
            .lineTo (dc.asd.point2.x, dc.asd.point2.y)
            .lineTo (dc.asd.point4.x, dc.asd.point4.y)
            .lineTo (dc.asd.point3.x, dc.asd.point3.y)
            .lineTo (dc.asd.point1.x, dc.asd.point1.y);
        dc.asd.childSquare = dc.stage.addChild (dc.asd.shapeSquare);
        dc.stage.update();
            
        dc.canvasContext.fillStyle = 'black';
        dc.asd.shapeSquareShadow.graphics
            .moveTo (dc.asd.point1.x + dc.sqShadow.x, dc.asd.point1.y + dc.sqShadow.y)
            .lineTo (dc.asd.point2.x + dc.sqShadow.x, dc.asd.point2.y + dc.sqShadow.y)
            .lineTo (dc.asd.point4.x + dc.sqShadow.x, dc.asd.point4.y + dc.sqShadow.y)
            .lineTo (dc.asd.point3.x + dc.sqShadow.x, dc.asd.point3.y + dc.sqShadow.y)
            .lineTo (dc.asd.point1.x + dc.sqShadow.x, dc.asd.point1.y + dc.sqShadow.y);
        //canvasContext.globalCompositeOperation='destination-over'; // won't work in createjs's current version
        dc.asd.shapeSquareShadow.compositeOperation='destination-over';
        dc.asd.childSquareShadow = dc.stage.addChild (dc.asd.shapeSquareShadow);
        
        dc.asd.shapeTriangle.graphics
            .moveTo (dc.asd.point5.x, dc.asd.point5.y)
            .lineTo (dc.asd.point6.x, dc.asd.point6.y)
            .lineTo (dc.asd.point7.x, dc.asd.point7.y)
            .lineTo (dc.asd.point5.x, dc.asd.point5.y);
        dc.asd.childTriangle = dc.stage.addChild (dc.asd.shapeTriangle);

        dc.canvasContext.fillStyle = 'black';
        dc.asd.shapeTriangleShadow.graphics
            .moveTo (dc.asd.point5.x + dc.trShadow.x, dc.asd.point5.y + dc.trShadow.y)
            .lineTo (dc.asd.point6.x + dc.trShadow.x, dc.asd.point6.y + dc.trShadow.y)
            .lineTo (dc.asd.point7.x + dc.trShadow.x, dc.asd.point7.y + dc.trShadow.y)
            .lineTo (dc.asd.point5.x + dc.trShadow.x, dc.asd.point5.y + dc.trShadow.y);
        dc.asd.shapeTriangleShadow.compositeOperation='destination-over';
        dc.asd.childTriangleShadow = dc.stage.addChild (dc.asd.shapeTriangleShadow);
        
    },
	
	drawEggs : function (logoHTMLid) {
		var 
		w = na.logo.settings.width = na.logo.logoWidth(logoHTMLid),
		h = na.logo.settings.height = na.logo.logoHeight(logoHTMLid),
		stage = na.logo.settings.stage,
        eggsWidth = (w*0.05),
		eggsHeight = (h*0.05),
		
		distanceBetweenEggs = eggsWidth * 2.33;
		
		eggLeftCenterX = (w/2) - (distanceBetweenEggs*0.5),// - (eggsWidth * 1.5),
        eggLeftCenterY = (h/2),// + (eggsHeight * 1.5),
        
		eggRightCenterX = (w/2) + (distanceBetweenEggs*0.5),// + (eggsWidth * 1.5),
		eggRightCenterY = (h/2),// + (eggsHeight * 1.5),
		
        logoColors = na.logo.settings.logoColors,
        sqShadow = {
            color : '#000',
            x : 4,
            y : 4,
            blur : 5
        },
        trShadow = {
            color : '#000',
            x : 3, 
            y : 3,
            blur : 5
        },
        eggsColors = {};

        switch (logoColors) {
            case 'RGB':
                eggsColors.colorStroke = '#F00';
                eggsColors.colorFill = '#F00';
                break;
            case 'celebratingLifeItselfColors':
                eggsColors.colorStroke = 'navy';
                eggsColors.colorFill = 'blue';
                break;
            case 'countryOfOriginColors':
                eggsColors.colorStroke = 'navy';
                eggsColors.colorFill = 'blue';
                eggsColors.colorStroke2 = 'white';
                eggsColors.colorFill2 = 'white';
                break;
            default:
                eggsColors.colorStroke = 'black';
                eggsColors.colorFill = 'white';
                break;
        };
        
        
		var elipse_left = new createjs.Shape();
        elipse_left.graphics
            .beginStroke(eggsColors.colorStroke)
            .beginFill(eggsColors.colorFill)
            //.drawCircle ( (w/2) - (eggsWidth*1.2), (h/2)-(eggsHeight/2), eggsWidth, eggsHeight);
            .drawCircle ( eggLeftCenterX, eggLeftCenterY, eggsWidth, eggsHeight);
        na.logo.settings.elipse_left = elipse_left;
        stage.addChild(elipse_left);
		stage.update();
        
        
		var elipse_right = new createjs.Shape();//#FF2222;
        elipse_right.graphics
            .beginStroke(eggsColors.colorStroke)
            .beginFill(eggsColors.colorFill)
            //.drawCircle ( (w/2) + (eggsWidth*0.2), (h/2)-(eggsHeight/2), eggsWidth, eggsHeight);
            .drawCircle ( eggRightCenterX, eggRightCenterY, eggsWidth, eggsHeight);
		na.logo.settings.elipse_right = elipse_right;
        stage.addChild(elipse_right);   
		stage.update();
        
        if (logoColors == 'countryOfOriginColors') {
            var
            eggsInnerBorderDistanceFactor = 0.55;
            eggsWidth2 = eggsWidth * eggsInnerBorderDistanceFactor,
            eggsHeight2 = eggsHeight * eggsInnerBorderDistanceFactor;
            
            //debugger;
            var 
            elipse_left2 = new createjs.Shape(),
            eggsHeight_2a = (h/2) - (eggsHeight2/2),//((eggsHeight2-eggsHeight)/2),
            eggsWidth_2a = (w/2) - (eggsWidth2/2);// + ((eggsWidth2-eggsWidth)/2); // (w/2) - (eggsWidth2*1.2) + ((eggsWidth2-eggsWidth)/2)
            
            elipse_left2.graphics
                .beginStroke(eggsColors.colorStroke2)
                .beginFill(eggsColors.colorFill2)
                //.drawCircle ( eggsWidth_2a, eggsHeight_2a, eggsWidth2, eggsHeight2);
                .drawCircle ( eggLeftCenterX, eggLeftCenterY, eggsWidth2, eggsHeight2);
            //elipse_left2.compositeOperation = 'destination-over';
            stage.addChild(elipse_left2);
            stage.update();
            
            
            var elipse_right2 = new createjs.Shape();//#FF2222;
            elipse_right2.graphics
                .beginStroke(eggsColors.colorStroke2)
                .beginFill(eggsColors.colorFill2)
                //.drawCircle ( (w/2) + (eggsWidth2*0.2) - ((eggsWidth2-eggsWidth)/2), (h/2)-(eggsHeight2/2), eggsWidth2, eggsHeight2);
                .drawCircle ( eggRightCenterX, eggRightCenterY, eggsWidth2, eggsHeight2);
            //na.logo.settings.elipse_right2 = elipse_right;
            //elipse_right2.compositeOperation = 'destination-over';
            stage.addChild(elipse_right2);   
            stage.update();
            
        }
		
	},

	resize_entireWindow : function (resizeEventData) {
		if (resizeEventData.data) resizeEventData = resizeEventData.data;
		var 
		w = na.logo.settings.width = na.logo.logoWidth(resizeEventData.logoHTMLid),
		h = na.logo.settings.height = na.logo.logoHeight(resizeEventData.logoHTMLid),
		logoHTMLid = resizeEventData.element,
		stage = na.logo.settings.stage,
		circle = na.logo.settings.circle;

		//jQuery('#'+logoHTMLid)[0].top = 5;
		//jQuery('#'+logoHTMLid)[0].left = 5;
		jQuery('#'+logoHTMLid)[0].parentNode.style.width = w-10 + 'px';
		jQuery('#'+logoHTMLid)[0].parentNode.style.height = h-10 + 'px';
		jQuery('#'+logoHTMLid)[0].width = w-10;
		jQuery('#'+logoHTMLid)[0].height = h-10;
		
		var x = parseInt((w / 2) - 20);
        var y = parseInt((h / 2) - 20);
		circle.x = x;
		circle.y = y;
		
		stage.update();
	},
	
	
	logoWidth : function (logoHTMLid) {
		return jQuery('#'+logoHTMLid)[0].width - na.logo.settings.margin;
	},
	logoHeight : function (logoHTMLid) {
		return jQuery('#'+logoHTMLid)[0].height - na.logo.settings.margin;
	}
}; // na.logo

function startLogo (logoHTMLid, logoColors) {
	na.logo.init_do_createLogo (logoHTMLid, logoColors);
}

