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
            offsetX : 0,
            offsetY : 0,
            path : ''
        }];
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, $(el).width() / $(el).height(), 0.1, 10 * 1000 );
        

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
        
        if (t.mouse.x!==0 || t.mouse.y!==0) {        
            t.raycaster.setFromCamera (t.mouse, t.camera);
            
            const intersects = t.raycaster.intersectObjects (t.scene.children, true);
            //if (intersects[0]) {
            for (var i=0; i<intersects.length; i++) {
                var p = intersects[i].object;
                //debugger;
                while (p) {
                    p = p.parent;
                    if (p && p.it) {
                        t.hoverOverName = p.it.name;
                        //debugger;
                    }
                }
                $('#site3D_label').css({display:'flex'});
                //console.log (model.it.name);
                //model.rotation.x += 0.015;
                //model.rotation.y += 0.02;
            }
            if (!intersects[0]) {
                $('#site3D_label').fadeOut();
            } else {
                var model = intersects[0].object.parent.parent.parent.parent.parent.parent;
                model.rotation.y += 0.02;
            }
        }

        
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
                p0 = t.ld2[level].path,
                p1 = p0.indexOf(',')!==-1?p0.substr(0, p0.lastIndexOf(',')):'',
                p2 = p0.indexOf(',')!==-1?parseInt(p0.substr(p0.lastIndexOf(',')+1, p0.length-p0.lastIndexOf(',')-1)+1):p0,
                path2 = !t.items[parent]||t.items[parent].path===''?''+parent:t.items[parent].path+','+parent,
                it = {
                    level : levelDepth,
                    name : t.ld2[level].keys[t.ld2[level].initItemsDoingIdx],
                    idx : items.length,
                    path : path2,//p1,
                    levelIdx : t.ld2[level].levelIdx,
                    parent : parent,//p2,//.substr(t.ld2[level].path.lastIndexOf(',')),
                    offsetX : 0,
                    offsetY : 0
                };
                if (it.name=='dogs' || it.name=='simple') debugger;
                
                items[items.length] = it;
                t.ld2[level].initItemsDoingIdx++;
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
                
                //debugger;
                clearTimeout (t.onresizeTimeout);
                t.loader.load( '/nicerapp/3rd-party/3D/models/folder icon/scene.gltf', function ( gltf, cd) {
                    gltf.scene.scale.setScalar (10);
                    t.scene.add (gltf.scene);
                    cd.it.model = gltf.scene;
                    cd.it.model.it = cd.it;
                    cd.t.updateTextureEncoding(t, gltf.scene);
                    //setTimeout (function() {
                    var
                    newLevel = (
                        Object.keys(t.ld2).length > 1
                        ? parseInt(Object.keys(t.ld2).reduce(function(a, b){ return t.ld2[a] > t.ld2[b] ? a : b }))+1
                        : 2
                    );
                    cd.level = newLevel;
                    //debugger;
                    cd.t.initializeItems (cd.t, cd.items, cd.itd, cd.it.idx, newLevel, cd.levelDepth, cd.path);
                    
                    //}, 250);
                }, function ( xhr ) {
                    console.log( 'model "folder icon" : ' + ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
                }, function ( error ) {
                    console.error( error );
                },  cd );
            } 
            t.ld2[level].initItemsDoingIdx++;
            //t.ld2[level].levelIdx++;
            
            clearTimeout (t.onresizeTimeout);
            t.onresizeTimeout = setTimeout(function() {
                //debugger;
                t.onresize (t);
            }, 500);
        }
        

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
                if (!it.parent) {
                    t.resizeDoingIdx++;
                    setTimeout (function(){t.onresize(t, levels)}, 10);
                    return false;
                }
                //it.label = $(it.b.el).children('a').html();
                //it.pul = $(it.li).parents('ul')[0];
                
                /*$(it.pul).children('li').each(function(idx,li) {
                    if (it.li === li) {
                        it.levelIdx = idx;
                    }
                });*/
                
                var 
                parent = t.items[it.parent],
                l = levels['path '+it.path];
                /*
                placing = 'right',
                right = (bw - jQuery(it.b.el).offset().left /* - (100 * 0.7)* / - (parent ? parent.offsetX : 100)),
                left = jQuery(it.b.el).offset().left + (parent ? parent.offsetX : 100);
                
                if (left > right) placing = 'left';
                if (placing=='left') var width = left; else var width = right;
                */
                var width = $(t.el).width(), placing = 'left';

                var
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
                } else if (columnCount > rowCount) {
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
                it.offsetX = (
                    l
                    ? it.level === 2
                        ? placing==='right'
                            ? l.offsetX + parent.offsetX + ( (50*it.column)) 
                            : l.offsetX + parent.offsetX - ( (50*it.column)) 
                        : placing==='right'
                            ? l.offsetX + parent.offsetX + ( (50*it.column)) + (40/2)
                            : l.offsetX + parent.offsetX - ( (50*it.column)) - (40/2)
                    : it.level === 2
                        ? placing==='right'
                            ? parent.offsetX + ( (50*it.column)) 
                            : parent.offsetX - ( (50*it.column)) 
                        : placing==='right'
                            ? parent.offsetX + ( (50*it.column)) + (40/2)
                            : parent.offsetX - ( (50*it.column)) - (40/2)
                );
                it.offsetY = (
                       l
                       ? l.offsetY + parent.offsetY + ( 50 * (it.columnIdx-1) )+ 20
                       : parent.offsetY + ( 50 * (it.columnIdx-1) )+ 20
                );
                
                if (!l) {
                    if (!parent.parent) {
                        pl = {
                            offsetX : 0,
                            offsetY : 0,
                            zIndexOffset : 0,
                            rowCount : 1,
                            columnCount : 1
                        }
                    } else {
                        pl = levels['path '+parent.path];
                    }
                    
                    pl.columnCount = columnCount;
                    pl.rowCount = rowCount;
                
                    var zof = pl.zIndexOffset + 1;
                    levels['path '+it.path] = jQuery.extend({}, pl);
                    
                    var moreToCheck = true;
                    while (moreToCheck) {
                        /*
                        levels['path '+it.path].offsetX = pl.offsetX + (
                            Math.random() > 0.5
                            ? Math.floor(Math.random() * 200)
                            : -1 * Math.floor(Math.random() * 200)
                        );
                        levels['path '+it.path].offsetY = pl.offsetY+ (
                            Math.random() > 0.5
                            ? Math.floor(Math.random() * 200)
                            : -1 * Math.floor(Math.random() * 200)
                        );*/
                        pl.offsetX = levels['path '+it.path].offsetX + (
                            Math.random() > 0.5
                            ? Math.floor(Math.random() * pl.columnCount * 100)
                            : -1 * Math.floor(Math.random() * pl.columnCount * 100)
                        );
                        pl.offsetY = levels['path '+it.path].offsetY+ (
                            Math.random() > 0.5
                            ? Math.floor(Math.random() * pl.rowCount * 100)
                            : -1 * Math.floor(Math.random() * pl.rowCount* 100)
                        );
                        for (var p1 in levels) {
                            var 
                            l1 = pl,//levels['path '+it.path],
                            l2 = levels[p1];
                            if (moreToCheck) moreToCheck = (
                                l1.offsetX > l2.offsetX 
                                || l1.offsetX < l2.offsetX + (l2.columnCount*75)
                            );
                            if (moreToCheck) moreToCheck = (
                                l1.offsetY > l2.offsetY
                                || l1.offsetY < l2.offsetY + (l2.rowCount*75)
                            );
                        }
                        // if (moreToCheck) { /* success = true for the Math.random() offsetX and offsetY */ }
                        if (moreToCheck===false) moreToCheck = true; else moreToCheck = false;
                    }
                    levels['path '+it.path].zIndexOffset = zof;
                    l = levels['path '+it.path];
                };
                it.zIndex = (100 * 1000) + l.zIndexOffset;

                /*
                $(it.b.el).css({
                    display : 'none',
                    left : it.offsetX,
                    top : it.offsetY,
                    zIndex : it.zIndex,
                    display : (it.level===1?'flex':'none')
                });*/
                it.model.position.x = it.offsetX;
                it.model.position.y = it.offsetY;
                it.model.position.z = -1 * it.level * 150;
                //if (it.level===1) $(it.b.el).css({display:'flex'});
                //$(it.b.el).fitText();
                
                t.resizeDoingIdx++;
                setTimeout (function(){t.onresize(t, levels)}, 10);
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
        
        this.updateEnvironment(this);
        
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
