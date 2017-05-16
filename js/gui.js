"use strict";

var Gui = Gui || {};

// list of presets available in the GUI
Gui.sceneList = [];

Gui.windowSizes = [ "full","400x400","600x400","600x600","800x600","800x800" ];

Gui.blendTypes = [ "Normal", "Additive" ];

//Gui.particleSystems = [ "basic", "fountainBounce", "fountainSink", "attractor", "animated", "cloth", "mySystem" ];

Gui.textures = [ "blank", "base", "fire", "smoke", "spark", "sphere", "smoke" , "riley", "andy", "szymon", "amit"];

Gui.music = ["symphony.mp3", "justForASecond.mp3", "Meanwhile.mp3", "The_Real_Slim_Shady.mp3", "Man_in_the_Mirror.mp3"];

Gui.audioOption = ["amplitude", "frequency"];

Gui.boidBehavior = ["flock", "wander", "seek", "flee", "evade", "pursue"];


// due to a bug in dat GUI we need to initialize floats to non-interger values (like 0.5)
// (the variable Gui.defaults below then carries their default values, which we set later)
Gui.values = {
    windowSize:  Gui.windowSizes[0],
    reset:       function () {},
    stopTime:    function () {},
    guiToBatch : function() {},
    blendTypes:  Gui.blendTypes[0],
    textures:    Gui.textures[1],
    systems:     "basic",
    audioOption: Gui.audioOption[0],
    boidBehavior: Gui.boidBehavior[0],
    music:       Gui.music[0],
    depthTest:   true,
    transparent: true,
    sorting:     true,
    changeColor: true,
    changeSize: true,
};

// defaults only hold actual mesh modifiers, no display
Gui.defaults = { };

Gui.alertOnce = function( msg ) {
    var mainDiv = document.getElementById('main_div');
    mainDiv.style.opacity = "0.3";
    var alertDiv = document.getElementById('alert_div');
    alertDiv.innerHTML = '<p>'+msg + '</p><button id="ok" onclick="Gui.closeAlert()">ok</button>';
    alertDiv.style.display = 'inline';
};

Gui.closeAlert = function () {
    var mainDiv = document.getElementById('main_div');
    mainDiv.style.opacity = "1";
    var alertDiv = document.getElementById('alert_div');
    alertDiv.style.display = 'none';
};

Gui.toCommandString = function () {
    var url = '';
    for ( var prop in Gui.defaults ) {
        if( Gui.values[prop] !== undefined && Gui.values[prop] !== Gui.defaults[prop]) {
            url += "&";
            var val = Gui.values[prop];

            if( !isNaN(parseFloat(val)) && val.toString().indexOf('.')>=0 ) {
                val = val.toFixed(2);
             }
            url += prop + "=" + val;
        }
    }
    return url;
}

Gui.init = function ( meshChangeCallback, controlsChangeCallback, displayChangeCallback ) {
    // create top level controls
    var gui     = new dat.GUI( { width: 300 } );
    var size    = gui.add( Gui.values, 'windowSize', Gui.windowSizes ).name("Window Size");
    var gToB    = gui.add( Gui.values, 'guiToBatch' );

    // gui controls are added to this object below
    var gc = {};
    gc.stopTime  = gui.add( Gui.values, 'stopTime' ).name( "Pause" );
    gc.reset     = gui.add( Gui.values, 'reset' ).name("Reset");

    // gc.systems   = gui.add( Gui.values, 'systems', Gui.particleSystems ).name("ParticleSystems");
    gc.music       = gui.add(Gui.values, 'music', Gui.music).name("Music");

    gc.audioOption = gui.add(Gui.values, 'audioOption', Gui.audioOption).name("Audio Option");

    //BOID BEHAVIOR SECTION
    var boid = gui.addFolder( "BOID BEHAVIOR");
    gc.boidBehavior = boid.add(Gui.values, 'boidBehavior', Gui.boidBehavior).name("Boid Behavior");
    // gc.boidBehavior
    var disp = gui.addFolder( "DISPLAY OPTIONS");
    gc.blends    = disp.add( Gui.values, 'blendTypes', Gui.blendTypes ).name("Blending Types");
    gc.textures  = disp.add( Gui.values, 'textures', Gui.textures ).name("Textures");

    gc.transp    = disp.add( Gui.values, 'transparent' ).name("Transparent");
    gc.sort      = disp.add( Gui.values, 'sorting' ).name("Sorting");

    gc.changeSize = disp.add( Gui.values, 'changeSize').name("Change size");
    gc.changeColor = disp.add( Gui.values, 'changeColor').name("Change color");

    // REGISTER CALLBACKS FOR WHEN GUI CHANGES:
    size.onChange( Renderer.onWindowResize );

    gc.stopTime.onChange( ParticleEngine.pause );
    gc.reset.onChange( ParticleEngine.restart );

    gc.blends.onChange( function( value ) {
        var emitters = ParticleEngine.getEmitters();
        var blendType;
        if ( value == "Normal" ) {
            var blendType = THREE.NormalBlending;
        } else if ( value == "Additive" ) {
            var blendType = THREE.AdditiveBlending;
        } else {
            console.log( "Blend type unknown!" );
            return;
        }
        for ( var i = 0 ; i < emitters.length ; i++ ) {
            emitters[i]._material.blending = blendType ;
        }
    } );

    gc.textures.onChange( function( value ) {
        var emitters = ParticleEngine.getEmitters();
        for ( var i = 0 ; i < emitters.length ; i++ ) {
            emitters[i]._material.uniforms.texture.value = new THREE.ImageUtils.loadTexture( 'images/' + value + '.png' );
            emitters[i]._material.needsUpdate  = true;
        }
    } );

    gc.audioOption.onChange( function (value) {
        if (value === Gui.audioOption[0]) {
            token = 0;
        }
        else if (value === Gui.audioOption[1]) {
            token = 1;
        }
        ParticleEngine.restart();
    });

    gc.boidBehavior.onChange( function( value ) {
        if (value === Gui.boidBehavior[0]) {
            boidType = 0;
        }
        else if (value === Gui.boidBehavior[1]) {
            boidType = 1;
        }
        else if (value === Gui.boidBehavior[2]) {
            boidType = 2;
            mark = new THREE.Vector3(0.0, 0.0, 0.0);
        }
        else if (value === Gui.boidBehavior[3]) {
            boidType = 3;
        }
        else if (value === Gui.boidBehavior[4]) {
            boidType = 4;
        }
        else if (value === Gui.boidBehavior[5]) {
            boidType = 5;
        }
        ParticleEngine.restart();
    });

    // gc.systems.onChange( function(value) {
    //     var settings = SystemSettings[value];
    //     Main.particleSystemChangeCallback ( settings );
    // } );

    gc.music.onChange( function(value) {
        song.stop();
        var strSong = '../music/' + value;
        song = p5.prototype.loadSound(strSong, function(song) {
        console.log("Song is changed.");
        console.log(song);
        // song.setVolume(0.5);
        song.play();
        });
        analyzer = new p5.Amplitude();
        analyzer.setInput(song);
        fft = new p5.FFT();
        fft.setInput(song);
        ParticleEngine.restart();

    });

    gc.changeColor.onChange( function(value) {

    });

    gc.changeSize.onChange( function(value) {

    });

    gc.transp.onChange( function( value ) {
        var emitters = ParticleEngine.getEmitters();
        for ( var i = 0 ; i < emitters.length ; i++ ) {
            emitters[i]._material.transparent = value;
            emitters[i]._material.needsUpdate  = true ;
        }
    });

    gc.sort.onChange( function( value ) {
        var emitters = ParticleEngine.getEmitters();
        for ( var i = 0 ; i < emitters.length ; i++ ) {
            emitters[i]._sorting = value;
        }
    });

    gToB.onChange( function() {
        var url = 'batch.html?system=' + Gui.values.systems;
        url += '&texture='+Gui.values.textures;
        url += '&blending='+Gui.values.blendTypes;

        url += '&transparent='+Gui.values.transparent;
        url += '&sorting='+Gui.values.sorting;
        url += '&size='+Gui.values.windowSize;
        window.open( url );
    } );
};


// non-implemented alert functionality
Gui.alertOnce = function( msg ) {
    var mainDiv = document.getElementById('main_div');
    mainDiv.style.opacity = "0.3";
    var alertDiv = document.getElementById('alert_div');
    alertDiv.innerHTML = '<p>'+ msg + '</p><button id="ok" onclick="Gui.closeAlert()">ok</button>';
    alertDiv.style.display = 'inline';
};

Gui.closeAlert = function () {
    var mainDiv = document.getElementById('main_div');
    mainDiv.style.opacity = "1";
    var alertDiv = document.getElementById('alert_div');
    alertDiv.style.display = 'none';
};
