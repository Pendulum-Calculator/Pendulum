const add = (x, y) => (+x) + (+y);
const subtract = (x, y) => (+x) - (+y);
const multiply = (x, y) => (+x) * (+y);
const divide = (x, y) => (+x) / (+y);
const sin = (x) => Math.sin(+x);
const cos = (x) => Math.cos(+x);
const validateNumbers = (x, y) => !(isNaN(x) || isNaN(y));

/**
 * Mathematical construct of vector
 * 
 * @param {*} x x component 
 * @param {*} y y component
 * @param {*} z z component
 */
class Vec {
    constructor(...components) {
        this.components = (components.length == 2) ? [components[0], components[1], 0] :
            (components.length == 1) ?
            (components[0] instanceof Array) ? components[0] : [components[0], 0, 0] :
            (components.length == 0) ? [0, 0, 0] :
            components;

        this.set = function (...components) {
            this.components = components;
            return this;
        }

        this.add = (b = new Vec(), holder = this) => {
            holder.set(this.x + b.x, this.y + b.y, this.z + b.z);
            return holder;
        }
        this.subtract = (b = new Vec(), holder = new Vec()) => {
            holder.set(this.x - b.x, this.y - b.y, this.z - b.z);
            return holder;
        }
        this.multiply = (c = 1, holder = this) => {
            holder.set(this.x * c, this.y * c, this.z * c);
            return holder;
        }
        this.dot = (b = new Vec()) => {
            return this.x * b.x + this.y * b.y + this.z * b.z;
        }
        this.cross = (b = new Vec(), holder = new Vec()) => {
            holder.set(this.y * b.z - this.z * b.y, this.z * b.x - this.x * b.z, this.x * b.y - this.y * b.x);
            return holder;
        }
        this.magnitude = () => Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        this.clone = (holder = new Vec()) => holder.set(this.x, this.y, this.z);
        this.THREE = () => new THREE.Vector3().set(this.x, this.y, this.z);
        this.toLatex = () => "<" + this.x + ", " + this.y + ", " + this.z + ">";
        this.normalize = (holder = this) => this.multiply(1 / this.magnitude(), holder);
    }
    get x() {
        return (this.components[0]) ? this.components[0] : 0;
    }
    get y() {
        return (this.components[1]) ? this.components[1] : 0;
    }
    get z() {
        return (this.components[2]) ? this.components[2] : 0;
    }
    set x(x) {
        this.components[0] = x;
    }
    set y(y) {
        this.components[1] = y;
    }
    set z(z) {
        this.components[2] = z;
    }
}

const DiffEqn = class {
    constructor(eqn = (t = 0, n = [new Vec()]) => new Vec(), order = 1) {
        this.order = order;
        this.ydirs = [new Vec()];
        this.eqn = (t = 0, n = this.ydirs) => eqn(t, n);
    }
    get y() {
        if (this.order == 0) {
            return this.eqn(t);
        } else {
            return this.ydirs[0];
        }
    }
}
class Euler {
    constructor(diffEqn = new DiffEqn(), dt = 0.01, startTime = 0, inits = [new Vec()]) {
        this.t = startTime;
        this.dt = dt;
        this.diffEqn = diffEqn;
        
        while (diffEqn.ydirs.length < diffEqn.order) diffEqn.ydirs.push(new Vec());
        for(var i in inits)
            inits[i].clone(diffEqn.ydirs[i]);
        this.que = 0;
        this.holder = new Vec();
    }
    step(dt = this.dt) {
        // console.log(this.diffEqn.hdir);
        for (var i = 0; i < this.diffEqn.order - 1; i++) {
            // console.log(this.diffEqn.ydirs);
            this.diffEqn.ydirs[i].add(this.diffEqn.ydirs[i + 1].multiply(dt, new Vec()));
        }
        this.t += dt;
        var dir = this.diffEqn.eqn(this.t, this.diffEqn.ydirs).clone(this.holder);
        // console.log(this.diffEqn.hdir);
        if (this.diffEqn.order - 1 >= 0) this.diffEqn.ydirs[this.diffEqn.order - 1].add(dir.multiply(dt));
    }
    y(t, target = new Vec()) {
        let lY, rY;
        if (t > this.t) {
            while (this.t < t) {
                lY = this.diffEqn.y;
                this.step(this.dt);
            }
            var domain = [this.t - this.dt, this.t];
            rY = this.diffEqn.y;
        } else {
            while (t < this.t) {
                rY = this.diffEqn.y;
                this.step(-this.dt);
            }
            var domain = [this.t, this.t + this.dt];
            lY = this.diffEqn.y;
        }
        return target.set(
            this.linearApprox(t, domain, [lY.x, rY.x]),
            this.linearApprox(t, domain, [lY.y, rY.y]),
            this.linearApprox(t, domain, [lY.z, rY.z])
        );
    }
    getSolution(bounded = true, domain = [-10, 10]) {
        if (bounded) {
            var posD = Math.ceil((domain[1] - this.t) / this.dt);
            var negD = Math.floor((this.t - domain[0]) / this.dt);
            var cacheP = new Array();
            var stampP = Array();
            var cacheN = new Array();
            var stampN = new Array();
            var solutions = new Array();
            var timeStamps = new Array();
            var ogState = this.states;
            for (var i = 0; i < posD; i++) {
                cacheP.push(this.diffEqn.y.clone());
                stampP.push(this.t);
                this.step(this.dt);
            }
            this.t = ogState.t;
            this.diffEqn.ydirs = ogState.dirs;
            for (var i = 0; i < negD; i++) {
                cacheN.push(this.diffEqn.y.clone());
                stampN.push(this.t);
                this.step(-this.dt);
            }

            for (var i = cacheN.length - 1; i > 0; i--) {
                solutions.push(cacheN[i]);
                timeStamps.push(stampN[i]);
            }
            for (var i = 0; i < cacheP.length; i++) {
                solutions.push(cacheP[i]);
                timeStamps.push(stampP[i]);
            }
            return (t, target = new Vec()) => {
                var t0 = timeStamps[0];
                var i0 = Math.floor((t - t0) / this.dt);
                if (i0 < 0) i0 = 0;
                if (i0 + 1 >= timeStamps.length) i0 = timeStamps.length - 2;
                var domain = [timeStamps[i0], timeStamps[i0 + 1]];
                var lY = solutions[i0],
                    rY = solutions[i0 + 1];
                return target.set(
                    this.linearApprox(t, domain, [lY.x, rY.x]),
                    this.linearApprox(t, domain, [lY.y, rY.y]),
                    this.linearApprox(t, domain, [lY.z, rY.z])
                );
            }
        } else return (t, target = new Vec()) => this.y(t, target);

    }
    linearApprox(t, domain = [0, timestep], range = [0, 0]) {
        return range[0] + (range[1] - range[0]) / (domain[1] - domain[0]) * (t - domain[0]);
    }

    get states() {
        var states = {
            t: this.t,
            dirs: [],
            hdir: 0
        };
        for (var i = 0; i < this.diffEqn.order; i++) {
            states.dirs.push(this.diffEqn.ydirs[i].clone());
        }
        states.hdir = this.diffEqn.eqn(this.t, this.diffEqn.ydirs).clone();
        return states;
    }
    set states(v) {
        this.t = v.t;
        for (var i = 0; i < this.diffEqn.order; i++) {
            v.dirs[i].clone(this.diffEqn.ydirs[i]);
        }
    }
}

class RK2 extends Euler {
    constructor(diffEqn = new DiffEqn(), dt = 0.1, startTime = 0, inits = [new Vec()]) {
        super(diffEqn, dt, startTime, inits);
    }
    step0(dt = this.dt) {
        var dir = this.diffEqn.eqn(this.t, this.diffEqn.ydirs).clone(this.holder);
        var dirs = this.diffEqn.ydirs;
        var holder = new Vec();
        var lev = this.diffEqn.order;
        for (var i = 0; i < lev - 2; i++) {
            dirs[i].add(dirs[i + 1].multiply(dt, holder)).
            add(dirs[i + 2].multiply(dt * dt * 0.5, holder));
        }
        if (lev - 2 >= 0) dirs[lev - 2].add(dirs[lev - 1].multiply(dt, holder))
            .add(dir.multiply(dt * dt * 0.5, holder));
        if (lev - 1 >= 0) dirs[lev - 1].add(dir.multiply(dt, holder));
        this.t += dt;
        return holder.set(dir.x, dir.y, dir.z);
    }
    step(dt = this.dt) {
        var s1 = this.states;
        this.step0(dt);
        var s2 = this.states;
        var lev = this.diffEqn.order;
        for (var i = 0; i < lev - 1; i++) {
            this.diffEqn.ydirs[i] = s1.dirs[i].add(s1.dirs[i + 1].add(s2.dirs[i + 1], this.holder).multiply(0.5 * dt));
        }
        var rk2 = s1.hdir.add(s2.hdir).multiply(0.5);
        if (lev - 1 >= 0) this.diffEqn.ydirs[lev - 1] = s1.dirs[lev - 1].add(rk2.multiply(dt));
    }
}

class RK4 extends Euler {
    constructor(diffEqn = new DiffEqn(), dt = 0.1, startTime = 0, inits = [new Vec()]) {
        super(diffEqn, dt, startTime, inits);
        this.s1 = this.s2 = this.s3 = this.s4 = undefined;
    }
    k1(dt = this.dt) {
        return this.states;
    }
    k2(dt = this.dt) {
        for (var i = 0; i < this.diffEqn.order - 1; i++)
            this.diffEqn.ydirs[i].add(
                this.diffEqn.ydirs[i + 1].multiply(dt / 2, this.holder)
            );
        if (this.diffEqn.order - 1 >= 0)
            this.diffEqn.ydirs[this.diffEqn.order - 1].add(
                this.s1.hdir.multiply(dt / 2, this.holder)
            );
        this.t+=dt / 2;
        return this.states;
    }
    k3(dt = this.dt) {
        this.states = this.s1;
        for (var i = 0; i < this.diffEqn.order - 1; i++)
            this.diffEqn.ydirs[i].add(
                this.s2.dirs[i + 1].multiply(dt / 2, this.holder)
            );
        if (this.diffEqn.order - 1 >= 0)
            this.diffEqn.ydirs[this.diffEqn.order - 1].add(
                this.s2.hdir.multiply(dt / 2, this.holder)
            );
        this.t+=dt / 2;
        return this.states;
    }
    k4(dt = this.dt) {
        this.states = this.s1;
        for (var i = 0; i < this.diffEqn.order - 1; i++)
            this.diffEqn.ydirs[i].add(
                this.s3.dirs[i + 1].multiply(dt, this.holder)
            );
        if (this.diffEqn.order - 1 >= 0)
            this.diffEqn.ydirs[this.diffEqn.order - 1].add(
                this.s3.hdir.multiply(dt, this.holder)
            );
        this.t+=dt;
        return this.states;
    }
    step(dt = this.dt) {
        this.s1 = this.k1();
        this.s2 = this.k2();
        this.s3 = this.k3();
        this.s4 = this.k4();
        this.states = this.s1;
        for (var i = 0; i < this.diffEqn.order - 1; i++)
            this.diffEqn.ydirs[i].add(
                this.s1.dirs[i + 1].multiply(dt).add
                (this.s2.dirs[i + 1].multiply(dt * 2)).add
                (this.s3.dirs[i + 1].multiply(dt * 2)).add
                (this.s4.dirs[i + 1].multiply(dt)).multiply
                (1/6));
        var order = this.diffEqn.order;
        if (order - 1 >= 0){
            this.diffEqn.ydirs[order - 1].add(
                this.s1.hdir.multiply(dt).add
                (this.s2.hdir.multiply(dt * 2)).add
                (this.s3.hdir.multiply(dt * 2)).add
                (this.s4.hdir.multiply(dt)).multiply
                (1/6));
        }
        this.t+=dt;
    }
}

function getMatrix(dimension, ranges = [
    [0, 1]
], counts = [10]) {
    var totalCount = 1;
    for (var i = 0; i < dimension; i++) {
        if (ranges[i] == undefined) ranges[i] = ranges[i - 1];
        if (counts[i] == undefined) counts[i] = counts[i - 1];
        totalCount *= counts[i];
    }
    var matrix = new Array(totalCount);
    stackMatrix(dimension, 0, ranges, counts, matrix, 0, []);
    return matrix;
}

function stackMatrix(dimension, level, ranges, counts, matrix, index, currentArray = []) {
    for (var i = 0; i < counts[level]; i++) {
        var component = (counts[level] != 1) ? i * (ranges[level][1] - ranges[level][0]) / (counts[level] - 1) + ranges[level][0] : 0;
        var nextArray = currentArray.slice(0);
        nextArray.push(component);
        if (level + 1 < dimension)
            index = stackMatrix(dimension, level + 1, ranges, counts, matrix, index, nextArray);
        else {
            matrix[index] = new Vec(nextArray);
            index++;
        }
    }
    return index;
}

function apply(func = (vec) => new Vec(), matrix = [new Vec()]) {
    for (var i = 0; i < matrix.length; i++) {
        matrix[i] = func(matrix[i]);
    }
    return matrix;
}

export {
    add,
    subtract,
    multiply,
    divide,
    sin,
    cos,
    validateNumbers,
    Vec,
    DiffEqn,
    Euler,
    RK2,
    RK4,
    getMatrix,
    apply,
}