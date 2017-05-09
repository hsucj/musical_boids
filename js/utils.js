
////////////////////////////////////////////////////////////////////////////////
// Utility function to accessing correct element in arrays                    //
////////////////////////////////////////////////////////////////////////////////
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



    return pc_j.clone().sub(getElement(i, particleAttributes.position)).divideScalar(100.0);
}

function separation (i, particleAttributes) {
    var DIST_THING = 10.0;
    var c = new THREE.Vector3(0.0, 0.0, 0.0);
    for (var j = 0; j < particleAttributes.position.length; j++) {
        if (j !== i) {
            if (getElement(j, particleAttributes.position).distanceTo(getElement(i, particleAttributes.position)) < DIST_THING) 
                c = c.sub(getElement(i, particleAttributes.position).clone().sub(getElement(j, particleAttributes.position)));
        }
    }
    return c;
}

function alignment (i, particleAttributes) {
    var DIST_THING = 10.0;
    var pv_j = new THREE.Vector3(0.0, 0.0, 0.0);
    for (var j = 0; j < particleAttributes.velocity.length; j++) {
        if (j !== i) {
            if (getElement(j, particleAttributes.position).distanceTo(getElement(i, particleAttributes.position)) < DIST_THING) {
                pv_j = pv_j.add(getElement(j, particleAttributes.velocity));
            }
        }
    }

    pv_j = pv_j.divideScalar(particleAttributes.velocity.length - 1);

    return pv_j.clone().sub(getElement(i, particleAttributes.velocity)).divideScalar(8.0);
}

