/*
 * In this file you can specify all sort of updaters
 *  We provide an example of simple updater that updates pixel positions based on initial velocity and gravity
 */

////////////////////////////////////////////////////////////////////////////////
// Collisions
////////////////////////////////////////////////////////////////////////////////

var Collisions = Collisions || {};
var maxVelocity = 50.0;

Collisions.BouncePlane = function ( particleAttributes, alive, delta_t, plane,damping ) {
    var positions    = particleAttributes.position;
    var velocities   = particleAttributes.velocity;

    for ( var i = 0 ; i < alive.length ; ++i ) {

        if ( !alive[i] ) continue;
        // ----------- STUDENT CODE BEGIN ------------
        var pos = getElement( i, positions );
        var vel = getElement( i, velocities );

        setElement( i, positions, pos );
        setElement( i, velocities, vel );
        // ----------- STUDENT CODE END ------------
    }
};

Collisions.SinkPlane = function ( particleAttributes, alive, delta_t, plane  ) {
    var positions   = particleAttributes.position;

    for ( var i = 0 ; i < alive.length ; ++i ) {

        if ( !alive[i] ) continue;
        // ----------- STUDENT CODE BEGIN ------------
        var pos = getElement( i, positions );

        // ----------- STUDENT CODE END ------------
    }
};

Collisions.BounceSphere = function ( particleAttributes, alive, delta_t, sphere, damping ) {
    var positions    = particleAttributes.position;
    var velocities   = particleAttributes.velocity;

    for ( var i = 0 ; i < alive.length ; ++i ) {

        if ( !alive[i] ) continue;
        // ----------- STUDENT CODE BEGIN ------------
        var pos = getElement( i, positions );
        var vel = getElement( i, velocities );


        setElement( i, positions, pos );
        setElement( i, velocities, vel );
        // ----------- STUDENT CODE END ------------
    }
}

////////////////////////////////////////////////////////////////////////////////
// Null updater - does nothing
////////////////////////////////////////////////////////////////////////////////

function VoidUpdater ( opts ) {
    this._opts = opts;
    return this;
};

VoidUpdater.prototype.update = function ( particleAttributes, initialized, delta_t ) {
    //do nothing
};

////////////////////////////////////////////////////////////////////////////////
// Euler updater
////////////////////////////////////////////////////////////////////////////////

function EulerUpdater ( opts ) {
    this._opts = opts;
    return this;
};


EulerUpdater.prototype.updatePositions = function ( particleAttributes, alive, delta_t ) {
    var positions  = particleAttributes.position;
    var velocities = particleAttributes.velocity;

    for ( var i  = 0 ; i < alive.length ; ++i ) {
        if (i === 0 && boidType === 2) {
            setElement(i, positions, mark);
            continue;
        }
        if ( !alive[i] ) continue;

        var p = getElement( i, positions );
        var v = getElement( i, velocities );
        p.add( v.clone().multiplyScalar( delta_t ) );
        setElement( i, positions, p );
    }
};

EulerUpdater.prototype.updateVelocities = function ( particleAttributes, alive, delta_t ) {
    var positions = particleAttributes.position;
    var velocities = particleAttributes.velocity;
    var gravity = this._opts.externalForces.gravity;
    var attractors = this._opts.externalForces.attractors;

    // if (song) {
    //     console.log(waveAnalyze[0]);
    // }

    for ( var i = 0 ; i < alive.length ; ++i ) {
        if ( !alive[i] ) continue;

        if (i === 0 && boidType === 2) {
            continue;
        }
        // ----------- STUDENT CODE BEGIN ------------
        var p = getElement( i, positions );
        var v = getElement( i, velocities );
        // now update velocity based on forces...
        v = v.add(gravity.clone().multiplyScalar(delta_t));
        if (boidType === 0) {
            v = v.add(cohesion(i, particleAttributes));
            v = v.add(separation(i, particleAttributes));
            v = v.add(alignment(i, particleAttributes));
        }
        else if (boidType === 1) {
            v = v.add(wander(i, particleAttributes));
            v = v.add(separation(i, particleAttributes));
            v = v.add(alignment(i, particleAttributes));
        }
        else if (boidType === 2) {
            v = v.add(seek(i, particleAttributes));
            v = v.add(separation(i, particleAttributes));
            v = v.add(alignment(i, particleAttributes));
        }
        else if (boidType === 3) {
            v = v.add(flee(i, particleAttributes));
            v = v.add(separation(i, particleAttributes));
            v = v.add(alignment(i, particleAttributes));
        }

        if (v.length() >= maxVelocity) {
            v = maxVelocity;
        }

        setElement( i, velocities, v );
        // ----------- STUDENT CODE END ------------
    }

};

EulerUpdater.prototype.updateColors = function ( particleAttributes, alive, delta_t ) {
    var colors    = particleAttributes.color;
    var pos = particleAttributes.position;

    for ( var i = 0 ; i < alive.length ; ++i ) {

        if ( !alive[i] ) continue;

        if (i === 0 && boidType === 2){
            var c = getElement( i, colors );
            c.x = 1.0;
            c.y = 1.0;
            c.z = 1.0;
            setElement(i, colors, c);
            continue;
        }

        // ----------- STUDENT CODE BEGIN ------------
        var c = getElement( i, colors );
        var p = getElement( i, pos);
        if (song) {
          var amp = analyzer.getLevel();
          c.x = p.x * amp;
          c.y = p.y * amp;
          c.z = p.z * amp;
        }

        setElement( i, colors, c );
        // ----------- STUDENT CODE END ------------
    }
};

EulerUpdater.prototype.updateSizes= function ( particleAttributes, alive, delta_t ) {
    var sizes    = particleAttributes.size;
    //console.log("TOKEN" + token);
    for ( var i = 0 ; i < alive.length ; ++i ) {

        if ( !alive[i] ) continue;
        // ----------- STUDENT CODE BEGIN ------------
        var s = getElement( i, sizes );

        if (i === 0 && boidType === 2) {
            setElement(i, sizes, s * 3);
            continue;
        }

        if (song) {
            if (token === 0) {
                var amp = analyzer.getLevel();
                s = 5.0 + 100*(amp);
          }
            else if (token === 1) {
                var freq = waveAnalyze[i*10];
                s = 5.0 + 100*(freq)
                console.log("FREQ " + freq);
                console.log("S " + s)
            }
        }

        setElement( i, sizes, s );
        // ----------- STUDENT CODE END ------------
    }

};

EulerUpdater.prototype.updateLifetimes = function ( particleAttributes, alive, delta_t) {
    var positions     = particleAttributes.position;
    var lifetimes     = particleAttributes.lifetime;

    for ( var i = 0 ; i < alive.length ; ++i ) {

        if ( !alive[i] ) continue;

        var lifetime = getElement( i, lifetimes );

        if ( lifetime < 0 ) {
            killPartilce( i, particleAttributes, alive );
        } else {
            setElement( i, lifetimes, lifetime - delta_t );
        }
    }

};

EulerUpdater.prototype.collisions = function ( particleAttributes, alive, delta_t ) {
    if ( !this._opts.collidables ) {
        return;
    }
    if ( this._opts.collidables.bouncePlanes ) {
        for (var i = 0 ; i < this._opts.collidables.bouncePlanes.length ; ++i ) {
            var plane = this._opts.collidables.bouncePlanes[i].plane;
            var damping = this._opts.collidables.bouncePlanes[i].damping;
            Collisions.BouncePlane( particleAttributes, alive, delta_t, plane, damping );
        }
    }

    if ( this._opts.collidables.sinkPlanes ) {
        for (var i = 0 ; i < this._opts.collidables.sinkPlanes.length ; ++i ) {
            var plane = this._opts.collidables.sinkPlanes[i].plane;
            Collisions.SinkPlane( particleAttributes, alive, delta_t, plane );
        }
    }

    if ( this._opts.collidables.spheres ) {
        for (var i = 0 ; i < this._opts.collidables.spheres.length ; ++i ) {
            Collisions.Sphere( particleAttributes, alive, delta_t, this._opts.collidables.spheres[i] );
        }
    }
};

EulerUpdater.prototype.update = function ( particleAttributes, alive, delta_t ) {
    // Update frameCounter globally
    frameCounter++;



        if (mark) {
          Scene._objects[1].position = mark;
          // console.log(Scene._objects);
        }

    this.updateLifetimes( particleAttributes, alive, delta_t );
    this.updateVelocities( particleAttributes, alive, delta_t );
    this.updatePositions( particleAttributes, alive, delta_t );

    this.collisions( particleAttributes, alive, delta_t );

    this.updateColors( particleAttributes, alive, delta_t );
    this.updateSizes( particleAttributes, alive, delta_t );

    // tell webGL these were updated
    particleAttributes.position.needsUpdate = true;
    particleAttributes.color.needsUpdate = true;
    particleAttributes.velocity.needsUpdate = true;
    particleAttributes.lifetime.needsUpdate = true;
    particleAttributes.size.needsUpdate = true;

}
