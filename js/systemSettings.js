var SystemSettings = SystemSettings || {};

SystemSettings.standardMaterial = new THREE.ShaderMaterial( {

    uniforms: {
        texture:  { type: 't',  value: new THREE.ImageUtils.loadTexture( 'images/base.png' ) },
    },

    attributes: {
        velocity: { type: 'v3', value: new THREE.Vector3() },
        color:    { type: 'v4', value: new THREE.Vector3( 0.0, 0.0, 1.0, 1.0 ) },
        lifetime: { type: 'f', value: 1.0 },
        size:     { type: 'f', value: 1.0 },
    },

    vertexShader:   document.getElementById( 'vertexShader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentShader' ).textContent,

    blending:    Gui.values.blendTypes,
    transparent: Gui.values.transparent,
    depthTest:   Gui.values.depthTest,

} );

////////////////////////////////////////////////////////////////////////////////
// Basic system
////////////////////////////////////////////////////////////////////////////////

SystemSettings.basic = {

    // Particle material
    particleMaterial : SystemSettings.standardMaterial,

    // Initialization
    initializerFunction : SphereInitializer,
    initializerSettings : {
        sphere: new THREE.Vector4 ( 0.0, 0.0, 0.0, 10.0),
        color:    new THREE.Vector4 ( 1.0, 1.0, 1.0, 1.0 ),
        velocity: new THREE.Vector3 ( 0.0, 0.0, 0.0),
        lifetime: 1000000,
        size:     6.0,
    },

    // Update
    updaterFunction : EulerUpdater,
    updaterSettings : {
        externalForces : {
            gravity :     new THREE.Vector3( 0, 0, 0),
            attractors : [],
        },
        collidables: {},
    },

    // Scene
    maxParticles :  100,
    particlesFreq : 1000,
    createScene : function () {
      var plane_geo = new THREE.PlaneBufferGeometry( 1000, 1000, 1, 1 );
      //var phong = new THREE.MeshPhongMaterial( {color: 0x444444, emissive:0x442222, side: THREE.DoubleSide } );
      //var skyMaterial = new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture("sky_101.jpg"), side: THREE.DoubleSide });
      var skymat = new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture("sky_101.jpg"), side: THREE.DoubleSide });
      var sky = new THREE.Mesh(plane_geo, skymat);
      var downmat = new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture("streetdown.jpg"), side: THREE.DoubleSide });
      var plane = new THREE.Mesh( plane_geo, downmat );
      plane.rotation.x = -1.57;
      plane.position.y = -200;
      sky.rotation.x = -1.57;
      sky.position.y = 240;
      var sky2 = new THREE.Mesh(plane_geo, skymat);
      sky2.rotation.x = -3.14;
      sky2.position.z = 300;
      var sky3 = new THREE.Mesh(plane_geo, skymat);
      sky3.rotation.x = -3.14;
      sky3.rotation.y = -1.57;
      sky3.position.z = 200;
      sky3.position.x = -350;
      var sky4 = new THREE.Mesh(plane_geo, skymat);
      sky4.rotation.x = -3.14;
      sky4.rotation.y = 1.57;
      sky4.position.z = 240;
      sky4.position.x = 400;
      var sky5 = new THREE.Mesh(plane_geo, skymat);
      sky5.rotation.x = 3.14;
      sky5.position.z = -250;

      Scene.addObject( plane );

      Scene.addObject(sky);
      Scene.addObject(sky2);
      Scene.addObject(sky3);
      Scene.addObject(sky4);
      Scene.addObject(sky5);
      //Scene.addObject( tetrahedron);
    },
};


////////////////////////////////////////////////////////////////////////////////
// Attractor system
////////////////////////////////////////////////////////////////////////////////

SystemSettings.attractor = {

    // Particle material
    particleMaterial : SystemSettings.standardMaterial,

    // Initialization
    initializerFunction : SphereInitializer,
    initializerSettings : {
        sphere:   new THREE.Vector4 ( 0.0, 0.0, 0.0, 5.0),
        color:    new THREE.Vector4 ( 1.0, 1.0, 1.0, 1.0 ),
        velocity: new THREE.Vector3 ( 0.0, 0.0, 0.0),
        lifetime: 7,
        size:     6.0,
    },

    // Update
    updaterFunction : EulerUpdater,
    updaterSettings : {
        externalForces : {
            gravity :     new THREE.Vector3( 0, 0, 0),
            attractors : [ new THREE.Sphere( new THREE.Vector3(30.0, 30.0, 30.0), 15.0 ) ],
        },
        collidables: {},
    },

    // Scene
    maxParticles :  10000,
    particlesFreq : 1000,
    createScene : function () {
        var sphere_geo = new THREE.SphereGeometry( 1.0, 32, 32 );
        var plane_geo = new THREE.PlaneBufferGeometry( 1000, 1000, 1, 1 );
        var phong      = new THREE.MeshPhongMaterial( {color: 0x444444, emissive:0x442222, side: THREE.DoubleSide } );
        var sphere = new THREE.Mesh( sphere_geo, phong );
        var plane = new THREE.Mesh( plane_geo, phong );

        plane.rotation.x = -1.57;
        plane.position.y = 0;

        sphere.position.set (30.0, 30.0, 30.0);
        Scene.addObject( sphere );
        Scene.addObject( plane );
    }
};


SystemSettings.animated = {

    // Particle Material
    particleMaterial :  SystemSettings.standardMaterial,

    // Initializer
    initializerFunction : AnimationInitializer,
    initializerSettings : {
        position: new THREE.Vector3 ( 0.0, 60.0, 0.0),
        color:    new THREE.Vector4 ( 1.0, 1.0, 1.0, 1.0 ),
        velocity: new THREE.Vector3 ( 0.0, 0.0, -40.0),
        lifetime: 1.25,
        size:     2.0,
    },

    // Updater
    updaterFunction : EulerUpdater,
    updaterSettings : {
        externalForces : {
            gravity :     new THREE.Vector3( 0, 0, 0),
            attractors : [],
        },
        collidables: {
            bouncePlanes: [ {plane : new THREE.Vector4( 0, 1, 0, 0 ), damping : 0.8 } ],
        },
    },

    // Scene
    maxParticles:  20000,
    particlesFreq: 10000,
    createScene : function () {
        var plane_geo = new THREE.PlaneBufferGeometry( 1000, 1000, 1, 1 );
        var phong     = new THREE.MeshPhongMaterial( {color: 0x444444, emissive:0x444444, side: THREE.DoubleSide } );
        var plane = new THREE.Mesh( plane_geo, phong );
        plane.rotation.x = -1.57;
        plane.position.y = 0;

        Scene.addObject( plane );
    },

    // Animation
    // animatedModelName: "animated_models/horse.js",
    // animationLoadFunction : function( geometry ) {
    //
    //     mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0x606060, morphTargets: true, transparent:true, opacity:0.5 } ) );
    //     mesh.scale.set( 0.25, 0.25, 0.25 );
    //     // mesh.position.set( 0.0, 30.0, 0.0 );
    //     Scene.addObject( mesh );
    //     ParticleEngine.addMesh( mesh );
    //
    //     ParticleEngine.addAnimation( new THREE.MorphAnimation( mesh ) );
    // },

};

////////////////////////////////////////////////////////////////////////////////
// My System
////////////////////////////////////////////////////////////////////////////////

SystemSettings.mySystem = {

    // Particle Material
    particleMaterial :  SystemSettings.standardMaterial,

    // Initializer
    initializerFunction : VoidInitializer,
    initializerSettings : {},

    // Updater
    updaterFunction : VoidUpdater,
    updaterSettings : {},

    // Scene
    maxParticles:  1000,
    particlesFreq: 1000,
    createScene : function () {},

};
