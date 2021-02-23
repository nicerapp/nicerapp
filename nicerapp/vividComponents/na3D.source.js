import {
  AmbientLight,
  AnimationMixer,
  AxesHelper,
  Box3,
  Cache,
  CubeTextureLoader,
  DirectionalLight,
  GridHelper,
  HemisphereLight,
  LinearEncoding,
  LoaderUtils,
  LoadingManager,
  PMREMGenerator,
  PerspectiveCamera,
  RGBFormat,
  Scene,
  SkeletonHelper,
  UnsignedByteType,
  Vector3,
  WebGLRenderer,
  sRGBEncoding,
} from '/nicerapp/3rd-party/3D/libs/three.js/build/three.module.js';
import Stats from '/nicerapp/3rd-party/3D/libs/three.js/examples/jsm/libs/stats.module.js';
import { GLTFLoader } from '/nicerapp/3rd-party/3D/libs/three.js/examples/jsm/loaders/GLTFLoader.js';
import { KTX2Loader } from '/nicerapp/3rd-party/3D/libs/three.js/examples/jsm/loaders/KTX2Loader.js';
import { DRACOLoader } from '/nicerapp/3rd-party/3D/libs/three.js/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from '/nicerapp/3rd-party/3D/libs/three.js/examples/jsm/controls/OrbitControls-noPreventDefault.js';
import { RGBELoader } from '/nicerapp/3rd-party/3D/libs/three.js/examples/jsm/loaders/RGBELoader.js';
import { DragControls } from '/nicerapp/3rd-party/3D/libs/three.js/examples/jsm/controls/DragControls.js';
//import { GLTFLoader } from '/nicerapp/3rd-party/3D/libs/three.js/examples/jsm/loaders/GLTFLoader.js';

export class na3D_fileBrowser {
    constructor(el, parent, data) {
        var t = this;
        
        this.autoRotate = true;
        this.showLines = true;
        
        this.p = parent;
        this.el = el;
        this.t = $(this.el).attr('theme');
        this.data = data;
        this.loading = false;
        this.resizing = false;
        this.lights = [];
        this.folders = [];
        this.ld1 = {}; //levelDataOne
        this.ld2 = {}; //levelDataTwo
        
        this.items = [{
            name : 'backgrounds',
            offsetY : 0,
            offsetX : 0,
            offsetZ : 0,
            column : 0,
            row : 0,
            columnCount : 1,
            rowCount : 1,
            path : ''
        }];
        this.lines = []; // onhover lines only in here
        this.permaLines = []; // permanent lines, the lines that show all of the parent-child connections.
        
        var 
        c = $.cookie('3DFDM_lineColors');
        if (typeof c=='string' && c!=='') {
            this.lineColors = JSON.parse(c);
        }
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, $(el).width() / $(el).height(), 0.1, 10 * 1000 );
        

        this.renderer = new THREE.WebGLRenderer({alpha:true, antialias : true});
        this.renderer.physicallyCorrectLights = true;
        this.renderer.outputEncoding = sRGBEncoding;
        this.renderer.setPixelRatio (window.devicePixelRatio);
        this.renderer.setSize( $(el).width()-20, $(el).height()-20 );
        this.renderer.toneMappingExposure = 1.0;
        
        el.appendChild( this.renderer.domElement );
        
        $(el).bind('mousemove', function() {
            event.preventDefault(); 
            t.onMouseMove (event, t)
        });
        $(el).click (function(event) {  
            event.preventDefault(); 
            if (event.detail === 2) { // double click
                t.controls.autoRotate = !t.controls.autoRotate 
                if (t.controls.autoRotate) $('#autoRotate').removeClass('vividButton').addClass('vividButtonSelected'); 
                else $('#autoRotate').removeClass('vividButtonSelected').addClass('vividButton');
                    
            } else if (event.detail === 3) { // triple click
                if (t.controls.autoRotateSpeed<0) t.controls.autoRotateSpeed = 1; else t.controls.autoRotateSpeed = -1;
            }
            
        });
        $(document).on('keyup', function(event) {
            event.preventDefault();
            if (event.keyCode===32) t.controls.autoRotate = !t.controls.autoRotate;
        });
        
        this.loader = new GLTFLoader();
        this.initializeItems (this, this.items, this.data, 0, 0, 0, '');

        const light1  = new AmbientLight(0xFFFFFF, 0.3);
        light1.name = 'ambient_light';
        light1.intensity = 0.3;
        light1.color = 0xFFFFFF;
        this.camera.add( light1 );

        const light2  = new DirectionalLight(0xFFFFFF, 0.8 * Math.PI);
        light2.position.set(0.5, 0, 0.866); // ~60º
        light2.name = 'main_light';
        light2.intensity = 0.8 * Math.PI;
        light2.color = 0xFFFFFF;
        this.camera.add( light2 );

        this.lights.push(light1, light2);        
        
        this.pmremGenerator = new PMREMGenerator( this.renderer );
        this.pmremGenerator.compileEquirectangularShader();
        
        this.updateEnvironment(this);
        
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.mouse.x = 0;
        this.mouse.y = 0;

        this.camera.position.z = 700;
        this.camera.position.y = 200;
        this.camera.position.x = 400;
        
        this.animate(this);
    }
    
    animate(t) {
        requestAnimationFrame( function() { t.animate (t) } );
        
        if (t.mouse.x!==0 || t.mouse.y!==0) {        
            t.raycaster.setFromCamera (t.mouse, t.camera);
            
            const intersects = t.raycaster.intersectObjects (t.scene.children, true);
            //if (intersects[0]) {
            if (intersects[0] && intersects[0].object.type!=='Line') 
            for (var i=0; i<1/*intersects.length <-- this just gets an endless series of hits from camera into the furthest reaches of what's visible behind the mouse pointer */; i++) {
                var hoveredItem = intersects[i].object, done = false;
                
                while (hoveredItem && !done) {
                    hoveredItem = hoveredItem.parent;
                
                    for (var j=0; j<t.lines.length; j++) {
                        if (t.lines[j]) {
                            if (t.lines[j].it === it) {
                                haveLine = true;
                            } else {
                                t.scene.remove(t.lines[j].line);
                                t.lines[j].geometry.dispose();
                                delete t.lines[j];
                            }
                        }
                    }

                    // build a line towards parent
                    if (hoveredItem && hoveredItem.it && !done) {
                        let p = hoveredItem.it.model.position;
                        t.hoverOverName = '('+p.x+', '+p.y+', '+p.z + ') : ' + hoveredItem.it.name;
                        //t.hoverOverName = hoveredItem.it.name;
                        
                        var 
                        it = hoveredItem.it,
                        parent = t.items[it.parent],
                        haveLine = false;
                        
                        // draw line to parent(s)
                        while (it.parent && it.parent!==0 && typeof it.parent !== 'undefined') {
                            var 
                            parent = t.items[it.parent],
                            haveLine = false;
                            
                            if (parent && parent.model) {
                                if (!haveLine) {
                                    var 
                                    geometry = new THREE.Geometry(), 
                                    p1 = it.model.position, 
                                    p2 = parent.model.position;
                                    
                                    geometry.dynamic = true;
                                    geometry.vertices.push(p1);
                                    geometry.vertices.push(p2);
                                    geometry.verticesNeedUpdate = true;

                                    var material = new THREE.LineBasicMaterial({ color: 0xCCCCFF, linewidth:4 });
                                    var line = new THREE.Line( geometry, material );
                                    t.scene.add(line);

                                    t.lines[t.lines.length] = {
                                        it : it,
                                        line : line,
                                        geometry : geometry,
                                        material : material
                                    };
                                } else {
                                    for (var j=0; j<t.lines.length; j++) {
                                        if (t.lines[j]) t.lines[j].geometry.verticesNeedUpdate = true;
                                    }
                                }
                            }
                            it = t.items[it.parent];
                        }
                                                
                        // draw lines to children
                        for (var j=0; j<t.items.length; j++) {
                            var child = t.items[j];
                            if (
                                hoveredItem && hoveredItem.it && hoveredItem.it.model && child.model
                                && hoveredItem.it.idx === child.parent
                            ) {
                                var
                                geometry = new THREE.Geometry(), 
                                p1 = child.model.position, 
                                p2 = hoveredItem.it.model.position,
                                x = child.name;
                                
                                geometry.dynamic = true;
                                geometry.vertices.push(p1);
                                geometry.vertices.push(p2);
                                geometry.verticesNeedUpdate = true;

                                var material = new THREE.LineBasicMaterial({ color: 0x000050, linewidth : 4 });
                                var line = new THREE.Line( geometry, material );
                                t.scene.add(line);

                                t.lines[t.lines.length] = {
                                    it : it,
                                    line : line,
                                    geometry : geometry,
                                    material : material
                                };
                            }
                        }
                        done = true;
                    }
                    
                }
                
                // show folder name for item under mouse and closest to the country
                $('#site3D_label').html(t.hoverOverName).css({display:'flex'});
            }
            if (!intersects[0]) {
                $('#site3D_label').fadeOut();
            } else {
                if (intersects[0] && intersects[0].object && intersects[0].object.parent && intersects[0].object.parent.parent) {
                    var model = intersects[0].object.parent.parent.parent.parent.parent.parent;
                    model.rotation.z += 0.02; //TODO : auto revert back to model.rotation.z = 0;
                   // if (hoveredItem && hoveredItem.it) console.log (hoveredItem.it.name + ' '+hoveredItem.it.offsetY+' - '+hoveredItem.it.offsetX+' - '+hoveredItem.it.level+' - '+hoveredItem.it.zIndexOffset);
                    
                    
                }
            }
        }
        
        if (t.controls) t.controls.update();

        for (var i=0; i<t.lines.length; i++) {
            var it = t.lines[i];
            if (it && it.geometry) it.geometry.verticesNeedUpdate = true;
        };
        for (var i=0; i<t.permaLines.length; i++) {
            var it = t.permaLines[i];
            if (it && it.geometry) it.geometry.verticesNeedUpdate = true;
        };

        
        t.renderer.render( t.scene, t.camera );
    }
    
    onMouseMove( event, t ) {
        var rect = t.renderer.domElement.getBoundingClientRect();
        t.mouse.x = ( ( event.clientX - rect.left ) / ( rect.width - rect.left ) ) * 2 - 1;
        t.mouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;        
        t.mouse.layerX =  event.layerX;
        t.mouse.layerY =  event.layerY;

        $('#site3D_label').html(t.hoverOverName).css({ position:'absolute', padding : 10, zIndex : 5000, top : event.layerY + 10, left : event.layerX + 30 });
    }
    
    initializeItems (t, items, data, parent, level, levelDepth, path) {
        if (!t) t = this;
        //debugger;
        na.m.waitForCondition ('waiting for other initializeItems_do() commands to finish',
            function () {
                //debugger;
                return t.loading === false;
            },
            function () {
                //debugger;
                t.initializeItems_do (t, items, data, parent, level, levelDepth, path);
            }, 100
        );
    }

    initializeItems_do (t, items, data, parent, level, levelDepth, path) {
        if (!t.ld2[level]) t.ld2[level] = { parent : parent, initItemsDoingIdx : 0, path : path };
        if (!t.ld2[level].keys) t.ld2[level].keys = Object.keys(data);
        if (t.ld2[level].initItemsDoingIdx >= t.ld2[level].keys.length) return false;
        
        if (!t.ld2[level].levelIdx) t.ld2[level].levelIdx = 0;
        
        if (!t.ld1[level]) t.ld1[level] = { levelIdx : 0 };
        
        if (!t.initCounter) t.initCounter=0;
         
        while (t.ld2[level].initItemsDoingIdx < t.ld2[level].keys.length) {
            var itd = data[ t.ld2[level].keys[ t.ld2[level].initItemsDoingIdx ] ];
            if (typeof itd == 'object') {
                let 
                path2 = !t.items[parent]||t.items[parent].path===''?''+parent:t.items[parent].path+','+parent,
                it = {
                    level : levelDepth,
                    name : t.ld2[level].keys[t.ld2[level].initItemsDoingIdx],
                    idx : items.length,
                    path : path2,
                    levelIdx : t.ld2[level].levelIdx,
                    parent : parent,
                    offsetY : 0,
                    offsetX : 0,
                    offsetZ : 0
                };
                
                items[items.length] = it;
                t.ld2[level].levelIdx++;
                
                let 
                cd = { //call data
                    t : t,
                    it : it,
                    items : items,
                    itd : itd,
                    parent : parent,
                    path : path2,
                    levelDepth : levelDepth + 1
                };
                //debugger;
                //if (it.name==='landscape' || it.name==='portrait') debugger;
                
                clearTimeout (t.onresizeInitTimeout);
                clearTimeout (t.linedrawTimeout);
                
                t.loading = true;
                //setTimeout (function () {
                    t.loader.load( '/nicerapp/3rd-party/3D/models/folder icon/scene.gltf', function ( gltf, cd) {
                //var gltf = $.extend({},t.items[0].model);
                        gltf.scene.scale.setScalar (10);
                        t.scene.add (gltf.scene);
                        cd.it.model = gltf.scene;
                        cd.it.model.it = cd.it;
                        cd.t.updateTextureEncoding(t, gltf.scene);
                        t.initCounter++;
                        
                        var
                        newLevel = (
                            Object.keys(t.ld2).length > 1
                            ? parseInt(Object.keys(t.ld2).reduce(function(a, b){ return t.ld2[a] > t.ld2[b] ? a : b }))+1
                            : 2
                        );
                        cd.level = newLevel;
                        
                        clearTimeout (t.onresizeInitTimeout);
                        
                        t.loading = false;
                    
                        cd.t.initializeItems (cd.t, cd.items, cd.itd, cd.it.idx, newLevel, cd.levelDepth, cd.path);
                    }, function ( xhr ) {
                        console.log( 'model "folder icon" : ' + ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
                    }, function ( error ) {
                        console.error( error );
                    },  cd );
                //}, 1000);
            } 
            t.ld2[level].initItemsDoingIdx++;
            
            
            clearTimeout (t.onresizeInitTimeout);
            t.onresizeInitTimeout = setTimeout(function() {
                var objs = [];
                for (var i=0; i<t.items.length; i++) if (t.items[i].model) objs[objs.length] = t.items[i].model.children[0];
                                               
                t.controls = new OrbitControls( t.camera, t.renderer.domElement );
                //this.controls.autoRotate = true;
                $('#autoRotate').removeClass('vividButtonSelected').addClass('vividButton');
                //t.controls.listenToKeyEvents( window ); // optional
                t.controls.enabled = false;
                setTimeout (function(){
                     t.controls.enabled = true;
                }, 1000);
                                               
                t.dragndrop = new DragControls( objs, t.camera, t.renderer.domElement );
                
                t.dragndrop.addEventListener( 'dragstart', function ( event ) {
                    if (t.controls) t.controls.dispose();
                    t.dragndrop.mouseX = t.mouse.layerX;
                    t.dragndrop.mouseY = t.mouse.layerY;
                } );
                
                t.dragndrop.addEventListener( 'drag', function (event) {
                    let p = event.object.parent;
                    while (!p.position || p.position.x===0) {
                        p = p.parent;
                        if (!p) return false;
                    }
                                             
                    for (let i=0; i<t.items.length; i++) {
                        let it = t.items[i];
                        if (it.parent === p.it.parent) {
                            it.model.position.x -= ((t.dragndrop.mouseX - t.mouse.layerX));
                            it.model.position.y += ((t.dragndrop.mouseY - t.mouse.layerY));
                        }
                    }
                    t.dragndrop.mouseX = t.mouse.layerX;
                    t.dragndrop.mouseY = t.mouse.layerY;
                    
                    if (t.showLines) {
                        for (var i=0; i<t.permaLines.length; i++) {
                            var l = t.permaLines[i];
                            t.scene.remove (l.line);
                            l.geometry.dispose();
                            l.material.dispose();
                        }
                        t.permaLines = [];
                        t.drawLines(t);
                    }
    
                });

                t.dragndrop.addEventListener( 'dragend', function ( event ) {
                    //event.object.material.emissive.set( 0x000000 );
                    t.controls = new OrbitControls( t.camera, t.renderer.domElement );
                    //this.controls.autoRotate = true;
                    $('#autoRotate').removeClass('vividButtonSelected').addClass('vividButton');
                    //t.controls.listenToKeyEvents( window ); // optional
                    t.controls.enabled = true;
                    
                    if (t.showLines) t.drawLines(t);
                } );
                
                t.onresize (t);
            }, 4000);
        }
    }
    
    toggleShowLines () {
        var t = this;
        t.showLines = !t.showLines;
        if (t.showLines) {
            t.drawLines(t);
            $('#showLines').removeClass('vividButton').addClass('vividButtonSelected');
        } else {
            for (var i=0; i<t.permaLines.length; i++) {
                var l = t.permaLines[i];
                t.scene.remove (l.line);
                l.geometry.dispose();
                l.material.dispose();
            }
            t.permaLines = [];
            $('#showLines').removeClass('vividButtonSelected').addClass('vividButton');
        }
    }
    
    drawLines (t) {
        //debugger;
        for (var i=0; i<t.permaLines.length; i++) {
            var l = t.permaLines[i];
            t.scene.remove(l.line);
            l.geometry.dispose();
            l.material.dispose();
        };
        
        for (var i=1; i<t.items.length; i++) {
            var 
            it = t.items[i],
            parent = t.items[it.parent],
            haveThisLineAlready = false;
            
            if (!this.showLines) return false;
            if (!it.model) return false;
            
            if (it.parent===0 || typeof it.parent === 'undefined') continue;
            
            for (var j=0; j<t.permaLines.length; j++) {
                if (t.permaLines[j].it === it) {
                    haveThisLineAlready = true;
                    break;
                }
            };
            
            if ( parent && parent.model) {
                var 
                geometry = new THREE.Geometry(), 
                p1 = it.model.position, 
                p2 = parent.model.position;
                if (p1.x===0 && p1.y===0 && p1.z===0) continue;
                if (p2.x===0 && p2.y===0 && p2.z===0) continue;
                
                geometry.dynamic = true;
                geometry.vertices.push(p1);
                geometry.vertices.push(p2);
                geometry.verticesNeedUpdate = true;
                
                if (!t.lineColors) t.lineColors = {};
                if (!t.lineColors[it.parent]) {
                    var x=Math.round(0xffffff * Math.random()).toString(16);
                    var y=(6-x.length);
                    var z="000000";
                    var z1 = z.substring(0,y);
                    var color= z1 + x;                    
                    t.lineColors[it.parent] = color;
                }
                var color = t.lineColors[it.parent];
                
                var
                material = new THREE.LineBasicMaterial({ color: '#'+color }),
                line = new THREE.Line( geometry, material );
                t.scene.add(line);

                t.permaLines[t.permaLines.length] = {
                    line : line,
                    geometry : geometry,
                    material : material,
                    it : it
                };
            }
        }
        $.cookie('3DFDM_lineColors', JSON.stringify(t.lineColors), na.m.cookieOptions());
    }
    
    useNewColors () {
        var t = this;
        debugger;
        for (var i=0; i<t.permaLines.length; i++) {
            t.scene.remove (t.permaLines[i].line);
            t.permaLines[i].geometry.dispose();
            t.permaLines[i].material.dispose();
        }
        t.permaLines = [];
        delete t.lineColors;
        setTimeout (function () {
            t.drawLines (t);
        }, 500);
    }
    
    toggleAutoRotate () {
        var t = this;
        t.controls.autoRotate = !t.controls.autoRotate;
        if (t.controls.autoRotate) $('#autoRotate').removeClass('vividButton').addClass('vividButtonSelected'); 
        else $('#autoRotate').removeClass('vividButtonSelected').addClass('vividButton');
    }
    
    onresize (t, levels) {
        if (!t) t = this;
        //debugger;
        na.m.waitForCondition ('waiting for other onresize commands to finish',
            function () {
                //debugger;
                return t.resizing === false;
            },
            function () {
                t.onresize_do (t, levels);
            }, 1500
        );
    }

    
    onresize_do(t, levels) {
        var
        bw = $(window).width(),
        pl = null;
        
        if (!t) t = this;
        
        t.resizing = true;
        
        if (!levels) {
            levels = {};
            t.resizeDoingIdx=1;
            t.resizeDoneCount=1;
        }
        
        if (!t.firstLevelCount) {
            t.firstLevelCount = 0;
            for (var i=0; i<t.items.length; i++) {
                if (t.items[i].level===1) t.firstLevelCount++;
            }
        }
        
        if (!t.resizeDoingIdx) t.resizeDoingIdx=0;
        if (!t.resizeDoneCount) t.resizeDoneCount=0;
        t.resizeDoneCount++;
        /*if (t.resizeDoneCount>25) {
            //clearTimeout (t.linedrawTimeout); // <!-- uncomment to show all the parent-child lines in one go.
            setTimeout(function() {
                t.resizeDoneCount = 0;
                t.resizing = false;
                t.onresize(t, levels);
            }, 500);
        } else {*/
        while (t.resizeDoingIdx < t.items.length) {
            //debugger;
            if (t.resizeDoingIdx >= t.items.length) {
                t.resizeDoingIdx = 0;
                t.resizeDoneCount = 0;
                t.resizing = false;
                debugger;
            } else {
                var it = t.items[t.resizeDoingIdx];
                
                var 
                parent = t.items[it.parent],
                l = levels['path '+it.path],
                height = $(t.el).height(), 
                placingX = 'right',//Math.random()>0.5?'right':'left',
                placingY = 'top',
                //columnCount = Math.floor((width-(250/2)) / 250), // <-- results in jubmled view               
                rowCount = 5,//Math.floor(((height/2)-100)/50),
                itemsOnLevelCount = 0;
                
                /*
                var levelItemCount = 0;
                for (var j=0; j<t.items.length; j++) {
                    var it2 = t.items[j];
                    if (it2.parent === it.parent && it2.level===it.level) levelItemCount++;
                };
                if (it.level>=1) {
                    if (it.level===1) {
                        if (it.levelIdx < levelItemCount/2) placingX='left';
                    } else {
                        var parent1 = it.parent;
                        while (typeof parent1=='number' && parent1!==0 && t.items[parent1].level!==1) parent1 = t.items[parent1].parent;
                        placingX = t.items[parent1].placingX;
                    }
                }*/
                    
                for (var j=0; j<t.items.length; j++) {
                    var it2 = t.items[j];
                    if (it2.parent === it.parent && it2.level === it.level) itemsOnLevelCount++;
                };
                it.itemsOnLevelCount = itemsOnLevelCount;
                
                var
                columnCount = Math.ceil(itemsOnLevelCount / rowCount);
                
                var
                column = 0,
                row = 1;

                
                for (var j=0; j<t.items.length; j++) {
                    var it2 = t.items[j];
                    if (it2.parent === it.parent && it2.levelIdx <= it.levelIdx) {
                        if (column >= columnCount) {
                            row++;
                            column = 1;
                        } else column++;
                    } 
                    
                };
                //column += columnCount - ( (it.levelIdx+1) - (columnCount * row) );
                
                if (column < columnCount/2) {
                    placingX = 'left'
                };
                if (row < rowCount/2) {
                    placingY = 'bottom'
                };
                
                var           
                l = levels['path '+it.path];
                it.placingX = placingX;
                it.placingY = placingY;
                it.columnCount = columnCount;
                it.rowCount = rowCount;
                it.row = row;
                it.column = column;
                it.offsetX = 0;
                it.offsetY = 0;
                it.offsetZ = 0;

                
            }
            t.resizeDoingIdx++;
        }
        t.resizeDoingIdx = 1;
        while (t.resizeDoingIdx < t.items.length) {
//             debugger;
            if (t.resizeDoingIdx >= t.items.length) {
                t.resizeDoingIdx = 0;
                t.resizeDoneCount = 0;
                t.resizing = false;
                debugger;
                return true;
            } else {
                var it = t.items[t.resizeDoingIdx];
                
                var 
                parent = t.items[it.parent],
                l = levels['path '+it.path];
                
                var 
                spacingBetweenSubfoldersOnSameLevel = 75,
                extraOffset = spacingBetweenSubfoldersOnSameLevel;//it.parent!==0?-1*spacingBetweenSubfoldersOnSameLevel*t.items[it.parent].columnCount/2:0; // <-- drop the '-1*' here to draw the tree as a root system instead
                // ((levelItemCount-it.levelIdx)*50)*

                if (!l) {
                    
                    var pl = levels['path '+parent.path];
                    if (!pl) {
                        pl = {
                            offsetY : 0,
                            offsetX : 0,
                            offsetZ : 0,
                            zIndexOffset : 0,
                            rowCount : rowCount,
                            columnCount : columnCount
                        }
                    }
                    
                    pl.columnCount = columnCount; 
                    pl.rowCount = rowCount;
                    
                    var zof = pl.zIndexOffset + 1;
                    levels['path '+it.path] = jQuery.extend({}, pl);
                    levels['path '+it.path].level = it.level;
                    levels['path '+it.path].zIndexOffset = zof;
                    levels['path '+it.path].offsetX = pl.offsetX;// + 10;
                    levels['path '+it.path].offsetY = pl.offsetY;// + 10;
                    levels['path '+it.path].offsetZ = pl.offsetZ;// + 10;
                    
                    l = levels['path '+it.path];
                };
                
                if (!pl) pl = levels['path '+parent.path];
                
                var moreToCheck = true, checkCounter = 1/*change to 1 to spread items out more*/, foundOverlappingItem = false, overlapParents = [];
                while (moreToCheck) {
                    if (checkCounter > 4) break;
                    var 
                    extraOffsetX = parent.column*50*checkCounter,
                    extraOffsetY = parent.row*50*checkCounter,//50 * checkCounter,
                    extraOffsetZ = 100 * checkCounter,
                    placingX2 = 'right',//placingX,//t.items[it.parent].placingX,
                    placingY2 = 'top';//placingY;//t.items[it.parent].placingY;
                    //debugger;
                    for (var k=0; k<t.items.length; k++) {
                        var it2 = t.items[k];
                        
                        if (it.parent === it2.parent) {
                        
                            it2.offsetX = (
                                parent.placingX=='right'
                                ? parent.offsetX + ( 50 * (it2.column)) + extraOffsetX
                                : parent.offsetX - ( 50 * (it2.column)) - extraOffsetX
                            );
                            it2.offsetY = (
                                parent.placingY == 'top'
                                ? parent.offsetY + (50*(it2.row)) + extraOffsetY
                                : parent.offsetY - (50*(it2.row)) - extraOffsetY
                            );
                            it2.offsetZ = parent.offsetZ + (-1 * ((it2.level*100)+extraOffsetZ));
                        }
                    }
                    //console.log (it.name+'('+it.idx+') - ('+it.offsetX+', '+it.offsetY+', '+it.offsetZ+')');
                            
                    foundOverlappingItem = false;
                    for (var k=0; k<t.items.length; k++) {
                        var itc = t.items[k];
                        if (itc.idx === it.idx) continue;
                        if (!foundOverlappingItem) {
                            foundOverlappingItem = (
                                it.offsetY === itc.offsetY
                                && it.offsetX === itc.offsetX
                                && it.level === itc.level
                                && it.offsetZ === itc.offsetZ
                            );
                            if (foundOverlappingItem) {
                               // debugger;
                                break;
                            }
                        } else break;
                    };
                    if (foundOverlappingItem) moreToCheck = true; else moreToCheck = false;
                    if (moreToCheck && Object.keys(levels).length===1) {
                        moreToCheck = false;
                    }

                    
                    checkCounter++;
                }
                
                for (var k=0; k<t.items.length; k++) {
                    var it2 = t.items[k];
                    
                    if (it.parent === it2.parent && it2.model && it2.model.position.x===0) {
                        it2.model.position.x = it2.offsetX;
                        it2.model.position.y = it2.offsetY;
                        it2.model.position.z = it2.offsetZ;
                        it2.model.position.needsUpdate = true;
                    }
                }
                
                t.resizeDoingIdx++;
                
                clearTimeout (t.linedrawTimeout);
                t.linedrawTimeout = setTimeout(function() {
                    t.drawLines (t);
                }, 500);
                
            }
        }
    }
 
    updateTextureEncoding (t, content) {
        /*const encoding = this.state.textureEncoding === 'sRGB'
        ? sRGBEncoding
        : LinearEncoding;*/
        const encoding = LinearEncoding;
        t.traverseMaterials(content, (material) => {
            if (material.map) material.map.encoding = encoding;
            if (material.emissiveMap) material.emissiveMap.encoding = encoding;
            if (material.map || material.emissiveMap) material.needsUpdate = true;
        });
    }
    
    traverseMaterials (object, callback) {
        object.traverse((node) => {
            if (!node.isMesh) return;
            const materials = Array.isArray(node.material)
                ? node.material
                : [node.material];
            materials.forEach(callback);
        });
    }
    
    updateEnvironment (t) {
        /*
        const environment = {
            id: 'venice-sunset',
            name: 'Venice Sunset',
            path: '/nicerapp/3rd-party/3D/assets/environment/venice_sunset_1k.hdr',
            format: '.hdr'
        };*/
        const environment = {
            id: 'footprint-court',
            name: 'Footprint Court (HDR Labs)',
            path: '/nicerapp/3rd-party/3D/assets/environment/footprint_court_2k.hdr',
            format: '.hdr'
        }

        t.getCubeMapTexture( environment ).then(( { envMap } ) => {

            /*if ((!envMap || !this.state.background) && this.activeCamera === this.defaultCamera) {
                t.scene.add(this.vignette);
            } else {
                t.scene.remove(this.vignette);
            }*/

            t.scene.environment = envMap;
            //this.scene.background = this.state.background ? envMap : null;

        });

    }    
    
    getCubeMapTexture ( environment ) {
        const { path } = environment;

        // no envmap
        if ( ! path ) return Promise.resolve( { envMap: null } );

        return new Promise( ( resolve, reject ) => {
            new RGBELoader()
                .setDataType( UnsignedByteType )
                .load( path, ( texture ) => {

                    const envMap = this.pmremGenerator.fromEquirectangular( texture ).texture;
                    this.pmremGenerator.dispose();

                    resolve( { envMap } );

                }, undefined, reject );
        });
    }
}


export class na3D_demo_models {
    constructor(el, parent, data) {
        var t = this;
        this.p = parent;
        this.el = el;
        this.t = $(this.el).attr('theme');
        
        this.data = data;
        
        this.lights = [];
        this.folders = [];
   
        this.items = [];
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, $(el).width() / $(el).height(), 0.1, 1000 );
        

        this.renderer = new THREE.WebGLRenderer({alpha:true, antialias : true});
        this.renderer.physicallyCorrectLights = true;
        this.renderer.outputEncoding = sRGBEncoding;
        this.renderer.setPixelRatio (window.devicePixelRatio);
        this.renderer.setSize( $(el).width()-20, $(el).height()-20 );
        
        this.renderer.toneMappingExposure = 1.0;
        
        el.appendChild( this.renderer.domElement );
        
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        //this.controls.listenToKeyEvents( window ); // optional
        
        this.loader = new GLTFLoader();
        
        this.loader.load( '/nicerapp/3rd-party/3D/models/human armor/scene.gltf', function ( gltf ) {
            gltf.scene.position.x = -150;
            gltf.scene.scale.setScalar (10);
            t.cube = gltf.scene;
            t.scene.add (t.cube);
            
            t.updateTextureEncoding(t, t.cube);
        }, function ( xhr ) {
            console.log( 'model "human armor" : ' + ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        }, function ( error ) {
            console.error( error );
        } );
        this.loader.load( '/nicerapp/3rd-party/3D/models/photoCamera/scene.gltf', function ( gltf ) {
            gltf.scene.position.x = 200;
            t.cube2 = gltf.scene;
            t.scene.add (t.cube2);
            
            t.updateTextureEncoding(t, t.cube2);
            
        }, function ( xhr ) {
            console.log( 'model "photoCamera" : ' + ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        }, function ( error ) {
            console.error( error );
        } );
        
        const light1  = new AmbientLight(0xFFFFFF, 0.3);
        light1.name = 'ambient_light';
        light1.intensity = 0.3;
        light1.color = 0xFFFFFF;
        this.camera.add( light1 );

        const light2  = new DirectionalLight(0xFFFFFF, 0.8 * Math.PI);
        light2.position.set(0.5, 0, 0.866); // ~60º
        light2.name = 'main_light';
        light2.intensity = 0.8 * Math.PI;
        light2.color = 0xFFFFFF;
        this.camera.add( light2 );

        this.lights.push(light1, light2);        
        
        this.pmremGenerator = new PMREMGenerator( this.renderer );
        this.pmremGenerator.compileEquirectangularShader();
        
        //this.updateEnvironment(this);
        
        $(el).bind('mousemove', function() { t.onMouseMove (event, t) });
        
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.mouse.x = 0;
        this.mouse.y = 0;

        this.camera.position.z = 700;
        
        this.animate(this);
    }
    
    animate(t) {
        requestAnimationFrame( function() { t.animate (t) } );
        
        t.raycaster.setFromCamera (t.mouse, t.camera);
        
        const intersects = t.raycaster.intersectObjects (t.scene.children, true);
        if (intersects[0] && t.cube && t.cube2) {
            t.cube.rotation.x += 0.015;
            t.cube.rotation.y += 0.02;
            t.cube2.rotation.x += 0.015;
            t.cube2.rotation.y += 0.02;
            //t.cube2.rotation.y += 0.02;
        }
        
        t.renderer.render( t.scene, t.camera );
    }
    
    
    updateTextureEncoding (t, content) {
        /*const encoding = this.state.textureEncoding === 'sRGB'
        ? sRGBEncoding
        : LinearEncoding;*/
        const encoding = LinearEncoding;
        t.traverseMaterials(content, (material) => {
            if (material.map) material.map.encoding = encoding;
            if (material.emissiveMap) material.emissiveMap.encoding = encoding;
            if (material.map || material.emissiveMap) material.needsUpdate = true;
        });
    }
    
    traverseMaterials (object, callback) {
        object.traverse((node) => {
            if (!node.isMesh) return;
            const materials = Array.isArray(node.material)
                ? node.material
                : [node.material];
            materials.forEach(callback);
        });
    }
    
    updateEnvironment (t) {
        /*
        const environment = {
            id: 'venice-sunset',
            name: 'Venice Sunset',
            path: '/nicerapp/3rd-party/3D/assets/environment/venice_sunset_1k.hdr',
            format: '.hdr'
        };*/
        const environment = {
            id: 'footprint-court',
            name: 'Footprint Court (HDR Labs)',
            path: '/nicerapp/3rd-party/3D/assets/environment/footprint_court_2k.hdr',
            format: '.hdr'
        }

        t.getCubeMapTexture( environment ).then(( { envMap } ) => {

            /*if ((!envMap || !this.state.background) && this.activeCamera === this.defaultCamera) {
                t.scene.add(this.vignette);
            } else {
                t.scene.remove(this.vignette);
            }*/

            t.scene.environment = envMap;
            //this.scene.background = this.state.background ? envMap : null;

        });

    }    
    
    getCubeMapTexture ( environment ) {
        const { path } = environment;

        // no envmap
        if ( ! path ) return Promise.resolve( { envMap: null } );

        return new Promise( ( resolve, reject ) => {
            new RGBELoader()
                .setDataType( UnsignedByteType )
                .load( path, ( texture ) => {

                    const envMap = this.pmremGenerator.fromEquirectangular( texture ).texture;
                    this.pmremGenerator.dispose();

                    resolve( { envMap } );

                }, undefined, reject );
        });
    }

    
    onMouseMove( event, t ) {
        var rect = t.renderer.domElement.getBoundingClientRect();
        t.mouse.x = ( ( event.clientX - rect.left ) / ( rect.width - rect.left ) ) * 2 - 1;
        t.mouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;        
    }
}

export class na3D_demo_cube {
    constructor(el,parent) {
        this.p = parent;
        this.el = el;
        this.t = $(this.el).attr('theme');
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, $(el).width() / $(el).height(), 0.1, 1000 );

        this.renderer = new THREE.WebGLRenderer({ alpha : true });
        this.renderer.setSize( $(el).width()-20, $(el).height()-20 );
        el.appendChild( this.renderer.domElement );
        
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        var materials = [
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load('/nicerapp/siteMedia/backgrounds/tiled/active/blue/4a065201509c0fc50e7341ce04cf7902--twitter-backgrounds-blue-backgrounds.jpg')
            }),
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load('/nicerapp/siteMedia/backgrounds/tiled/active/blue/6250247-Blue-stone-seamless-texture-Stock-Photo.jpg')
            }),
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load('/nicerapp/siteMedia/backgrounds/tiled/active/blue/abstract-seamless-crumpled-tissue-textures-2.png')
            }),
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load('/nicerapp/siteMedia/backgrounds/tiled/active/green/363806708_7d577861f7.jpg')
            }),
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load('/nicerapp/siteMedia/backgrounds/tiled/active/green/dgren051.jpg')
            }),
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load('/nicerapp/siteMedia/backgrounds/tiled/active/green/leaves007.jpg')
            })
        ];
        this.cube = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 1 ), materials );
        this.scene.add( this.cube );
        var t = this;
        $(el).bind('mousemove', function() { t.onMouseMove (event, t) });
        
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.camera.position.z = 5;
        this.cube.rotation.x = 0.3;
        this.cube.rotation.y = 0.4;
        this.animate(this);
    }
    
    onMouseMove( event, t ) {
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        //t.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        //t.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        var rect = t.renderer.domElement.getBoundingClientRect();
        t.mouse.x = ( ( event.clientX - rect.left ) / ( rect.width - rect.left ) ) * 2 - 1;
        t.mouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;        
    }
    
    
    animate(t) {
        requestAnimationFrame( function() { t.animate (t) } );
        //t.cube.rotation.x += 0.02;
        //t.cube.rotation.y += 0.02;
        t.raycaster.setFromCamera (t.mouse, t.camera);
        const intersects = t.raycaster.intersectObjects (t.scene.children, true);
        for (var i=0; i<intersects.length; i++) {
            intersects[i].object.rotation.x += 0.02;
            intersects[i].object.rotation.y += 0.02;
        }
        t.renderer.render( t.scene, t.camera );
    }
    
}
