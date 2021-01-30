jsem.physics = jsem.p = {};
jsem.physics.waves = jsem.p.w = {
    types : [ 'transverse', 'longitudinal', 'mixed' ]
};

jsem.physics.waves.transversal = {
    mechanical : { 
        about : 'used for calculations concerning spring wires and cord wires',
        speed : function (fs,m,l) {
            /* fs : the tensular force in the wire 
             * m  : the mass of the wire
             * l  : the length of the wire
             */
            return Math.sqrt ( fs / (m/l) );
        }
    },
    water : {
    }
};
jsem.p.w.t = jsem.p.w.transversal;
jsem.p.w.t.m = jsem.p.w.t.mechanical;
jsem.p.w.t.w = jsem.p.w.t.water;

jsem.physics.waves.longitudinal = {
    
    
};

jsem.physics.waves.waveLength = function (waveSpeed, vibrationTime) {
    return waveSpeed * vibrationTime;
}

