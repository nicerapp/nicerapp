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
        this.ld = {};
   
        this.items = [{
            name : 'backgrounds'
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
        this.initializeItems (this, this.items, this.data, 0, 1);

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
        //if (intersects[0]) {
        for (var i=0; i<intersects.length; i++) {
            var model = intersects[i].object.parent.parent.parent.parent.parent.parent;
            model = model.parent.parent;
            //console.log (model.it.name);
            //debugger;
            //model.rotation.x += 0.015;
            //model.rotation.y += 0.02;
        }
        
        t.renderer.render( t.scene, t.camera );
    }
    
    initializeItems (t, items, data, parent, level) {
        if (!t.ld[level]) t.ld[level] = { parent : parent, initItemsDoingIdx : 0 };
        if (!t.ld[level].keys) t.ld[level].keys = Object.keys(data);
        if (t.ld[level].initItemsDoingIdx >= t.ld[level].keys.length) return false;
        
        if (!t.ld[level].levelIdx) t.ld[level].levelIdx = 0;
        if (!t.path) t.path = '';
        t.parent = parent;
         
        while (t.ld[level].initItemsDoingIdx < t.ld[level].keys.length) {
            var itd = data[t.ld[level].keys[t.ld[level].initItemsDoingIdx]];
            if (typeof itd == 'object') {
                var path2 = (t.path==='')?'':t.path+',';
                path2+=t.parent;
                if (!t.ld[level+1]) t.ld[level+1] = {
                    parent : t.ld[level].initItemsDoingIdx,
                    path : path2,
                    initItemsDoingIdx : 0,
                    levelIdx : 0,
                    keys : Object.keys(itd)
                };
                
                var it = {
                    level : level,
                    name : t.ld[level].keys[t.ld[level].initItemsDoingIdx],
                    levelIdx : t.ld[level].levelIdx,
                    parent : t.ld[level].parent,
                    children : [],
                    path : t.ld[level].path
                }
                items[items.length] = it;
                t.ld[level+1].initItemsDoingIdx++;
                t.ld[level+1].levelIdx++;
                debugger;
                
                t.loader.load( '/nicerapp/3rd-party/3D/models/folder icon/scene.gltf', function ( gltf, it ) {
                    gltf.scene.scale.setScalar (20);
                    
                    t.scene.add (gltf.scene);
                    it.model = gltf.scene;
                    it.model.it = it;
                    
                    t.updateTextureEncoding(t, gltf.scene);
                    //setTimeout (function() {
                    
                        debugger;
                        t.initializeItems (t, items, itd, t.ld[level].initItemsDoingIdx, level + 1);
                    //}, 100);
                    
                    //t.ld[level].initItemsDoingIdx++;
                    //t.levelIdx++;
                    /*t.initializeItems (t, items, data, parent, level, levelIdx, initItemsDoingIdx, path);
                    */
                    
                    
                }, function ( xhr ) {
                    console.log( 'model "folder icon" : ' + ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
                }, function ( error ) {
                    console.error( error );
                }, it );
            } 
            t.ld[level].initItemsDoingIdx++;
            t.ld[level].levelIdx++;
            
            clearTimeout (t.onresizeTimeout);
            t.onresizeTimeout = setTimeout(function() {
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
                columnCount = Math.floor((width-(50/3)) / 50),
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
                l = null;//levels['path '+it.path];
                it.childrenPlacement = placing;
                it.columnIdx = columnIdx;
                it.column = column;
                it.offsetY = (
                    it.level === 1
                    ? (100 + 20) * it.levelIdx
                    : l
                        ? it.level === 2
                            ? placing==='right'
                                ? l.offsetX + parent.offsetX + ( (20*it.column)) 
                                : l.offsetX + parent.offsetX - ( (20*it.column)) 
                            : placing==='right'
                                ? l.offsetX + parent.offsetX + ( (20*it.column)) + (40/2)
                                : l.offsetX + parent.offsetX - ( (20*it.column)) - (40/2)
                        : it.level === 2
                            ? placing==='right'
                                ? parent.offsetY + ( (20*it.column)) 
                                : parent.offsetY - ( (20*it.column)) 
                            : placing==='right'
                                ? parent.offsetY + ( (20*it.column)) + (40/2)
                                : parent.offsetY - ( (20*it.column)) - (40/2)
                );
                it.offsetX = (
                    it.level === 1
                    ? 0
                    : it.level === 2
                        ? parent.offsetX + ( (100) * it.columnIdx )
                         : parent.offsetX + ( (100) * (it.columnIdx-1) )+ (70)
                );
                
                if (!l) {
                    if (!parent) {
                        pl = {
                            offsetX : 0,
                            offsetY : 0,
                            zIndexOffset : 0
                        }
                    } else {
                        pl = levels['path '+parent.path];
                    }
                    
                    var zof = pl.zIndexOffset + 1;
                    levels['path '+it.path] = jQuery.extend({}, pl);
                    levels['path '+it.path].offsetX = it.offsetX;
                    levels['path '+it.path].offsetY = it.offsetY;
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
                it.model.position.z = -1 * it.level * 100;
                //if (it.level===1) $(it.b.el).css({display:'flex'});
                //$(it.b.el).fitText();
                
                t.resizeDoingIdx++;
                setTimeout (function(){t.onresize(t, levels)}, 10);
            }
        }
    }

    
    /*
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
                //it.label = $(it.b.el).children('a').html();
                //it.pul = $(it.li).parents('ul')[0];
                
                /*$(it.pul).children('li').each(function(idx,li) {
                    if (it.li === li) {
                        it.levelIdx = idx;
                    }
                });*/
                
                /*
                var 
                parent = t.items[it.parent],
                l = levels['path '+it.path];
                
                
                
                placing = 'right',
                right = (bw - jQuery(it.b.el).offset().left /* - (100 * 0.7)* / - (parent ? parent.offsetX : 100)),
                left = jQuery(it.b.el).offset().left + (parent ? parent.offsetX : 100);
                
                if (left > right) placing = 'left';
                if (placing=='left') var width = left; else var width = right;
                * /
                var width = $(t.el).width(), placing = 'left';

                var
                columnCount = Math.floor((width-(50/3)) / 50),
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
                    it.level === 1
                    ? (100 + 20) * it.levelIdx
                    : l
                        ? it.level === 2
                            ? placing==='right'
                                ? l.offsetX + parent.offsetX + ( (20*it.column)) 
                                : l.offsetX + parent.offsetX - ( (20*it.column)) 
                            : placing==='right'
                                ? l.offsetX + parent.offsetX + ( (20*it.column)) + (100/2)
                                : l.offsetX + parent.offsetX - ( (20*it.column)) - (100/2)
                        : it.level === 2
                            ? placing==='right'
                                ? parent.offsetX + ( (20*it.column)) 
                                : parent.offsetX - ( (20*it.column)) 
                            : placing==='right'
                                ? parent.offsetX + ( (20*it.column)) + (100/2)
                                : parent.offsetX - ( (20*it.column)) - (100/2)
                );
                it.offsetY = (
                    it.level === 1
                    ? 0
                    : it.level === 2
                        ? parent.offsetY + ( (30) * it.columnIdx )
                         : parent.offsetY + ( (30) * (it.columnIdx-1) )+ (70)
                );
                
                if (!l) {
                    if (!parent) {
                        pl = {
                            offsetX : 0,
                            offsetY : 0,
                            zIndexOffset : 0
                        }
                    } else {
                        pl = levels['path '+parent.path];
                    }
                    
                    var zof = pl.zIndexOffset + 1;
                    levels['path '+it.path] = jQuery.extend({}, pl);
                    levels['path '+it.path].offsetX = pl.offsetX;
                    levels['path '+it.path].offsetY = pl.offsetY;
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
                });* /
                it.model.position.x = it.offsetX;
                it.model.position.y = it.offsetY;
                it.model.position.z = it.level * 100;
                //if (it.level===1) $(it.b.el).css({display:'flex'});
                //$(it.b.el).fitText();
                
                t.resizeDoingIdx++;
                setTimeout (function(){t.onresize(t, levels)}, 10);
            }
        }
    }*/
       
    
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
