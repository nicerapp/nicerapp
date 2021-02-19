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
import { OrbitControls } from '/nicerapp/3rd-party/3D/libs/three.js/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from '/nicerapp/3rd-party/3D/libs/three.js/examples/jsm/loaders/RGBELoader.js';
//import { GLTFLoader } from '/nicerapp/3rd-party/3D/libs/three.js/examples/jsm/loaders/GLTFLoader.js';

export class na3D_fileBrowser {
    constructor(el, parent, data) {
        var t = this;
        this.p = parent;
        this.el = el;
        this.t = $(this.el).attr('theme');
        
        this.data = data;
        
        this.lights = [];
        this.folders = [];
        this.ld1 = {}; //levelDataOne
        this.ld2 = {}; //levelDataTwo
        
        
        this.items = [{
            name : 'backgrounds',
            offsetY : 0,
            offsetX : 0,
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
        
        $(el).bind('mousemove', function() { event.preventDefault(); t.onMouseMove (event, t) });
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
        
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.controls.autoRotate = true;
        //this.controls.listenToKeyEvents( window ); // optional
        
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
        this.camera.position.x = 500;
        
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
                        t.hoverOverName = hoveredItem.it.name;
                        
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
                    //model.rotation.z += 0.02; //TODO : auto revert back to model.rotation.z = 0;
                   // if (hoveredItem && hoveredItem.it) console.log (hoveredItem.it.name + ' '+hoveredItem.it.offsetY+' - '+hoveredItem.it.offsetX+' - '+hoveredItem.it.level+' - '+hoveredItem.it.zIndexOffset);
                    
                    
                }
            }
        }
        
        t.controls.update();

        /*
        for (var i=0; i<t.lines.length; i++) {
            var it = t.lines[i];
            it.geometry.verticesNeedUpdate = true;
        };*/

        
        t.renderer.render( t.scene, t.camera );
    }
    
    onMouseMove( event, t ) {
        var rect = t.renderer.domElement.getBoundingClientRect();
        t.mouse.x = ( ( event.clientX - rect.left ) / ( rect.width - rect.left ) ) * 2 - 1;
        t.mouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;        
        $('#site3D_label').html(t.hoverOverName).css({ position:'absolute', padding : 10, zIndex : 5000, top : event.layerY + 10, left : event.layerX + 30 });
    }
    
    initializeItems (t, items, data, parent, level, levelDepth, path) {
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
                    offsetX : 0
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
                
                clearTimeout (t.onresizeTimeout);
                clearTimeout (t.linedrawTimeout);
                
                t.loader.load( '/nicerapp/3rd-party/3D/models/folder icon/scene.gltf', function ( gltf, cd) {
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
                    //debugger;
                    cd.t.initializeItems (cd.t, cd.items, cd.itd, cd.it.idx, newLevel, cd.levelDepth, cd.path);
                }, function ( xhr ) {
                    //console.log( 'model "folder icon" : ' + ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
                }, function ( error ) {
                    console.error( error );
                },  cd );
            } 
            t.ld2[level].initItemsDoingIdx++;
            
            clearTimeout (t.onresizeTimeout);
            t.onresizeTimeout = setTimeout(function() {
                t.onresize (t);
            }, 250);
        }
    }
    
    drawLines (t) {
        //debugger;
        for (var i=1; i<t.items.length; i++) {
            var 
            it = t.items[i],
            parent = t.items[it.parent],
            haveThisLineAlready = false;
            
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

    onresize(t, levels) {
        var
        bw = $(window).width(),
        pl = null;
    
        if (!t) t = this;
        if (!levels) {
            levels = {};
            t.resizeDoingIdx=0;
            t.resizeDoneCount=0;
        }
        
        if (!t.resizeDoingIdx) t.resizeDoingIdx=0;
        if (!t.resizeDoneCount) t.resizeDoneCount=0;
        t.resizeDoneCount++;
        if (t.resizeDoneCount>25) {
            //clearTimeout (t.linedrawTimeout); // <!-- uncomment to show all the parent-child lines in one go.
            setTimeout(function() {
                t.resizeDoneCount = 0;
                t.onresize(t, levels);
            }, 500);
        } else {
            if (t.resizeDoingIdx >= t.items.length) {
                t.resizeDoingIdx = 0;
                t.resizeDoneCount = 0;
            } else {
                var it = t.items[t.resizeDoingIdx];
                if (typeof it.parent==='undefined') {
                    t.resizeDoingIdx++;
                    setTimeout (function(){t.onresize(t, levels)}, 10);
                    return false;
                }
                
                var 
                parent = t.items[it.parent],
                l = levels['path '+it.path],
                width = $(t.el).width(), 
                placing = 'right',//Math.random()>0.5?'right':'left',
                columnCount = Math.floor((width-(150/3)) / 150),                
                itemsOnLevelCount = 0;
                
                for (var j=0; j<t.items.length; j++) {
                    var it2 = t.items[j];
                    if (it2.parent === it.parent && it2.level === it.level) itemsOnLevelCount++;
                };
                
                var
                rowCount = Math.ceil(itemsOnLevelCount / columnCount);
                
                if (it.level===0) {
                    columnCount = 1;
                    rowCount = 9999;
                } else /*if (columnCount > rowCount) */{
                    columnCount = Math.floor(Math.sqrt(itemsOnLevelCount));
                    rowCount = Math.ceil(itemsOnLevelCount / columnCount);
                };
                //rowCount++;
                //rowCount++;
                var
                column = 0,
                columnIdx = 1;
                
                for (var j=0; j<t.items.length; j++) {
                    var it2 = t.items[j];
                    if (it2.parent === it.parent && it2.level === it.level) {
                        if ((it.levelIdx+1) <= (column * rowCount) + columnIdx ) {
                            //columnIdx--;
                        } else if (columnIdx >= rowCount) {
                            column++;
                            columnIdx = 1;
                        } else columnIdx++;
                    } 
                    
                };
                
                var           
                l = levels['path '+it.path];
                it.childrenPlacement = placing;
                it.columnIdx = columnIdx;
                it.column = column;

                it.offsetY = (
                    l
                    ? placing==='right'
                            ? l.offsetY + parent.offsetY + ( (50*it.column))// + (50*(parent.column?parent.column:0))
                            : l.offsetY + parent.offsetY - ( (50*it.column))// - (50*(parent.column?parent.column:0))
                    : placing==='right'
                            ? parent.offsetY + ( (50*it.column))// + (50*(parent.column?parent.column:0))
                            : parent.offsetY - ( (50*it.column))// - (50*(parent.column?parent.column:0))
                );
                it.offsetX = (
                       l
                       ? l.offsetX + parent.offsetX + ( 50 * (it.columnIdx-1) )//+ (50*(parent.columIdx?parent.columIdx-1:0))
                       : parent.offsetX + ( 50 * (it.columnIdx-1) )//+ (50*(parent.columnIdx?parent.columIdx-1:0))
                );
                //debugger;
                if (!l) {
                    
                    if (!parent.parent) {
                        pl = {
                            offsetY : 0,
                            offsetX : 0,
                            offsetZ : 0,
                            zIndexOffset : 0,
                            rowCount : 1,
                            columnCount : 1
                        }
                    } else {
                        pl = levels['path '+parent.path];
                    }
                    
                    pl.columnCount = columnCount; // problem is here.. combined with the fact that this is a setTimeout()-curated loop
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
                
                var moreToCheck = true, checkCounter = 0, foundOverlappingItem = false;
                while (moreToCheck) {
                     if (checkCounter > 10) break;
                    it.offsetY = (
                        l
                        ? placing==='right'
                                ? l.offsetY + parent.offsetY +  (100*it.column)//+ (50*checkCounter)// + (50*(parent.column?parent.column:0))
                                : l.offsetY + parent.offsetY -  (100*it.column)//+ (50*checkCounter)// - (50*(parent.column?parent.column:0))
                        : placing==='right'
                                ? parent.offsetY +  (100*it.column)+ (50*checkCounter)// + (50*(parent.column?parent.column:0))
                                : parent.offsetY -  (100*it.column)+ (50*checkCounter)// - (50*(parent.column?parent.column:0))
                    );
                    it.offsetX = (
                        l
                        ? l.offsetX + parent.offsetX + ( 100 * (it.columnIdx-1) )//+ (50*checkCounter) )//+ (50*(parent.columIdx?parent.columIdx-1:0))
                        : parent.offsetX + ( 100 * (it.columnIdx-1))// + (50*checkCounter) )//+ (50*(parent.columnIdx?parent.columIdx-1:0))
                    );
                    it.offsetZ = (pl?pl.offsetZ+(checkCounter/3):(checkCounter/3));//checkCounter;
                   // if (placing==='right') placing='left'; else placing='right';

                    
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
                    //if (!foundOverlappingItem) debugger;
                    if (foundOverlappingItem) moreToCheck = true; else moreToCheck = false;
                    if (moreToCheck && Object.keys(levels).length===1) {
                        moreToCheck = false;
                    }
                            
                    checkCounter++;

                }
                
                
                it.model.position.x = it.offsetX;
                it.model.position.y = it.offsetY;
                it.model.position.z = -1 * ((it.level * 150) + (it.offsetZ * 150) + 70);

                it.zIndexOffset = zof;
                //$(it.b.el).fitText();
                
                t.resizeDoingIdx++;
                setTimeout (function(){t.onresize(t, levels)}, 10);
                
                clearTimeout (t.linedrawTimeout);
                t.linedrawTimeout = setTimeout(function() {
                    t.drawLines (t);
                }, 250);
                
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
