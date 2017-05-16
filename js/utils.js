
////////////////////////////////////////////////////////////////////////////////
// Utility function to accessing correct element in arrays                    //
////////////////////////////////////////////////////////////////////////////////
function getRandomArbitrary(min, max) {
  return (Math.random() * (max - min)) + min;
}

function getElement ( i, attrib ) {
    if ( attrib.itemSize === 1 ) {

        return attrib.array[i];

    } else if ( attrib.itemSize === 3 ) {

        return new THREE.Vector3( attrib.array[ 3 * i     ],
                                  attrib.array[ 3 * i + 1 ],
                                  attrib.array[ 3 * i + 2 ] );

    } else if ( attrib.itemSize === 4 ) {

        return new THREE.Vector4( attrib.array[ 4 * i     ],
                                  attrib.array[ 4 * i + 1 ],
                                  attrib.array[ 4 * i + 2 ],
                                  attrib.array[ 4 * i + 3 ] );

    } else {

        console.log( "Not handled attribute size for attribute: ", attrib );
        return undefined;

    }
};

function getGridElement ( i, j, width, attrib ) {
    var idx = j * width + i;
    if ( attrib.itemSize === 1 ) {

        return attrib.array[idx];

    } else if ( attrib.itemSize === 3 ) {

        return new THREE.Vector3( attrib.array[ 3 * idx     ],
                                  attrib.array[ 3 * idx + 1 ],
                                  attrib.array[ 3 * idx + 2 ] );

    } else if ( attrib.itemSize === 4 ) {

        return new THREE.Vector4( attrib.array[ 4 * idx     ],
                                  attrib.array[ 4 * idx + 1 ],
                                  attrib.array[ 4 * idx + 2 ],
                                  attrib.array[ 4 * idx + 3 ] );

    } else {

        console.log( "Not handled attribute size for attribute: ", attrib );
        return undefined;

    }
};

function setElement ( i, attrib, val ) {
    if ( attrib.itemSize === 1 ) {

        attrib.array[i] = val;

    } else if ( attrib.itemSize === 3 ) {

        attrib.array[ 3 * i     ] = val.x;
        attrib.array[ 3 * i + 1 ] = val.y;
        attrib.array[ 3 * i + 2 ] = val.z;

    } else if ( attrib.itemSize === 4 ) {

        attrib.array[ 4 * i     ] = val.x;
        attrib.array[ 4 * i + 1 ] = val.y;
        attrib.array[ 4 * i + 2 ] = val.z;
        attrib.array[ 4 * i + 3 ] = val.w;

    } else {

        console.log( "Not handled attribute size for attribute: ", attrib );
        return undefined;

    }
}

function setGridElement ( i, j, width, attrib, val ) {
    var idx = j * width + i;
    if ( attrib.itemSize === 1 ) {

        attrib.array[idx] = val;

    } else if ( attrib.itemSize === 3 ) {

        attrib.array[ 3 * idx     ] = val.x;
        attrib.array[ 3 * idx + 1 ] = val.y;
        attrib.array[ 3 * idx + 2 ] = val.z;

    } else if ( attrib.itemSize === 4 ) {

        attrib.array[ 4 * idx     ] = val.x;
        attrib.array[ 4 * idx + 1 ] = val.y;
        attrib.array[ 4 * idx + 2 ] = val.z;
        attrib.array[ 4 * idx + 3 ] = val.w;

    } else {

        console.log( "Not handled attribute size for attribute: ", attrib );
        return undefined;

    }
}

function killPartilce ( i, partilceAttributes, alive ) {
    alive[i] = false;
    setElement( i, partilceAttributes.position, new THREE.Vector3(-1e9) );
}

function cohesion (i, particleAttributes) {
    var pc_j = new THREE.Vector3(0.0, 0.0, 0.0);
    for (var j = 0; j < particleAttributes.position.length; j++) {
        if (j !== i) {
            pc_j = pc_j.add(getElement(j, particleAttributes.position));
        }
    }

    pc_j = pc_j.divideScalar(particleAttributes.position.length - 1);

    // pc_j = boid_centroid;
    return pc_j.clone().sub(getElement(i, particleAttributes.position)).divideScalar(100.0);
   // return mark.clone().sub(getElement(i, particleAttributes.position)).divideScalar(100.0);
}

function wander (i, particleAttributes) {
  // 200 determines how frequent the new point is calculated
  if (frameCounter % 200 == 0) {
    // console.log("New point to wander to.");

    // Check that the new point isn't too far from the previous existing point, to avoid huge forces / speeds
    var prev_point = new THREE.Vector3(boid_centroid.x, boid_centroid.y, boid_centroid.z);
    var isFar = true;

    while (isFar) {
      // Bounds are -500,500 because the plane is 1000x1000 width by height, centered at the origin
      // UPDATE: don't set to -500,500, because boids will fly off far away
      var nx = getRandomArbitrary(-50,50);
      var nz = getRandomArbitrary(-50,50);

      boid_centroid.x = nx;
      boid_centroid.z = nz;

      if (boid_centroid.distanceTo(prev_point) < 30) isFar = false;
    }
    // console.log(boid_centroid.x, boid_centroid.y, boid_centroid.z);
  }
  return boid_centroid.clone().sub(getElement(i, particleAttributes.position)).divideScalar(100.0);
  //return boid_centroid;

}

function seek (i, particleAttributes) {
    //console.log(mark);
    return mark.clone().sub(getElement(i, particleAttributes.position)).divideScalar(100.0);

    // var desired_vel = mark.clone().sub(getElement(i, particleAttributes.position));
    // var steer = desired_vel.clone().sub(getElement(i, particleAttributes.velocity))
    //return steer;
}
function flee (i, particleAttributes) {
    return mark.clone().sub(getElement(i, particleAttributes.position)).divideScalar(-100.0);
}
function separation (i, particleAttributes) {
    //var DIST_THING = 1.0;
    // var c = new THREE.Vector3(0.0, 0.0, 0.0);
    // for (var j = 0; j < particleAttributes.position.length; j++) {
    //     if (j !== i) {
    //         if (getElement(j, particleAttributes.position).distanceTo(getElement(i, particleAttributes.position)) < DIST_THING)
    //             c = c.sub(getElement(i, particleAttributes.position).clone().sub(getElement(j, particleAttributes.position)));
    //     }
    // }
    // return c;
    var tot = new THREE.Vector3(0, 0, 0);
    var count = 0;
    var desiredsep = 2000.0;
    for (var j = 0; j < particleAttributes.position.length; j++) {
      var d = getElement(j, particleAttributes.position).distanceTo(getElement(i, particleAttributes.position));
      if (d < desiredsep) {
        var diff = new THREE.Vector3().subVectors(getElement(i, particleAttributes.position), getElement(j, particleAttributes.position));
        diff = diff.normalize();
        diff = diff.divideScalar(d);
        tot = tot.add(diff);
        count++;
      }
    }
    if (count > 0) {
      tot = tot.divideScalar(count);
    }
    if (song) {
      var amp = analyzer.getLevel();
      tot.multiplyScalar(-10 * amp);
    }
    else {
      tot.multiplyScalar(-2);
    }
    return tot;
}

function alignment (i, particleAttributes) {
    var DIST_THING = 5.0;
    var count = 0;
    var pv_j = new THREE.Vector3(0.0, 0.0, 0.0);
    for (var j = 0; j < particleAttributes.velocity.length; j++) {
        if (j !== i) {
            if (getElement(j, particleAttributes.position).distanceTo(getElement(i, particleAttributes.position)) < DIST_THING) {
                pv_j = pv_j.add(getElement(j, particleAttributes.velocity));
                count++;
            }
        }
    }
    if (count > 0 ) return pv_j.divideScalar(100000.0);
    else return new THREE.Vector3(0,0,0);

    return pv_j.clone().sub(getElement(i, particleAttributes.velocity)).divideScalar(20.0);
    // var neighbordist = 50;
    // var sum = new THREE.Vector3(0,0,0);
    // var count = 0;
    // for (var j = 0; j < particleAttributes.position.length; j++) {
    //   var d = getElement(j, particleAttributes.position).distanceTo(getElement(i, particleAttributes.position));
    //   if (d < neighbordist) {
    //     sum = sum.add(getElement(j, particleAttributes.velocity));
    //     count++;
    //   }
    // }
    // if (count > 0) {
    //   sum = sum.divideScalar(count);
    // }
    // else {
    //   return new THREE.Vector3();
    // }
}
