const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const BALLZ = [];

let LEFT, RIGHT, UP, DOWN;
let friction = 0.1;

class Vector {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        return new Vector(this.x+v.x, this.y+v.y);
    }
    subtr(v) {
        return new Vector(this.x-v.x, this.y-v.y);
    }
    mag() {
        return Math.sqrt(this.x**2 + this.y**2);
    }
    mult(n) {
        return new Vector(this.x*n, this.y*n);
    }

    normal(){
        return new Vector(-this.y, this.x).unit();
    }

    unit() {
        if(this.mag() === 0) {
            return new Vector(0,0);
        } else {
            return new Vector(this.x/this.mag(), this.y/this.mag());
        }
    }

    static dot(v1, v2) {
        return v1.x*v2.x + v1.y*v2.y;
    }

    drawVect(start_x, start_y, n, color) {
        ctx.beginPath();
        ctx.moveTo(start_x, start_y);
        ctx.lineTo(start_x + this.x*n, start_y + this.y*n);
        ctx.strokeStyle = color;
        ctx.stroke();
    }
}

class Ball {
    constructor(x, y, r, color) {
        this.pos = new Vector(x, y);  // this.x yerine this.pos kullanılmalı
        this.r = r;
        this.color = color;
        this.vel = new Vector(0,0);
        this.acc = new Vector(0,0);
        this.acceleration = 1;
        this.player = false;
        BALLZ.push(this);
    }
    drawball(){
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2*Math.PI);
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    display() {
        this.vel.drawVect(550, 400, 10, 'green');
        this.acc.unit().drawVect(550, 400, 50, 'blue');
        ctx.beginPath();
        ctx.arc(550, 400, 50, 0, 2*Math.PI);
        ctx.strokeStyle = 'black';
        ctx.stroke();
    }
    reposition() {
        this.acc = this.acc.unit().mult(this.acceleration);  // b.acceleration yerine this.acceleration
        this.vel = this.vel.add(this.acc);  // b.acc yerine this.acc
        this.vel = this.vel.mult(1-friction);
        this.pos = this.pos.add(this.vel);  // b.vel yerine this.vel
    }
     
}

const keyControl = (b) => {
    document.addEventListener('keydown', (e) => {  // canvas yerine document kullanılmalı
        if(e.key === 'ArrowLeft') {
            LEFT=true;
        }
        if(e.key === 'ArrowRight') {
            RIGHT=true;
        }
        if(e.key === 'ArrowUp') {
            UP=true;
        }
        if(e.key === 'ArrowDown') {
            DOWN=true;
        }
    });
    
    document.addEventListener('keyup', (e) => {  // canvas yerine document kullanılmalı
        if(e.key === 'ArrowLeft') {
            LEFT=false;
        }
        if(e.key === 'ArrowRight') {
            RIGHT=false;
        }
        if(e.key === 'ArrowUp') {
            UP=false;
        }
        if(e.key === 'ArrowDown') {
            DOWN=false;
        }
    });
    
    if(LEFT) {
        b.acc.x = -b.acceleration;
    }
    if(UP) {
        b.acc.y = -b.acceleration;
    }
    if(RIGHT) {
        b.acc.x = b.acceleration;
    }
    if(DOWN) {
        b.acc.y = b.acceleration;
    }
    if(!UP && !DOWN) {
        b.acc.y = 0;
    }
    if(!LEFT && !RIGHT) {
        b.acc.x = 0;
    }
}

const round = (number, precision) => {
    let factor = 10**precision;
    return Math.round(number*factor)/factor;
}

const coll_det_bb = (b1, b2) => {
    if(b1.r + b2.r >= b2.pos.subtr(b1.pos).mag()) {  // b2/pos yerine b2.pos kullanılmalı
        return true;
    } else {
        return false;  // else bloğu ve return false eklendi
    }
}

const pen_res_bb = (b1, b2) => {
    let dist = b1.pos.subtr(b2.pos);
    let pen_depth = b1.r + b2.r - dist.mag();
    let pen_res = dist.unit().mult(pen_depth/2);  // pen_depth'i 2'ye bölerek her topu yarı mesafe kadar hareket ettiriyoruz
    b1.pos = b1.pos.add(pen_res);
    b2.pos = b2.pos.add(pen_res.mult(-1));
}

const coll_res_bb = (b1, b2) => {
    let normal = b1.pos.subtr(b2.pos).unit();
    let relVel = b1.vel.subtr(b2.vel);
    let sepVel = Vector.dot(relVel, normal);
    let new_sepVel = -sepVel;
    let sepVelVec = normal.mult(new_sepVel);

    b1.vel = b1.vel.add(sepVelVec);
    b2.vel = b2.vel.add(sepVelVec.mult(-1));
}

function momentum_display() {
    let momentum = Ball1.vel.add(Ball2.vel).mag();
    ctx.fillStyle = 'black';  // Metin rengi için fillStyle eklendi
    ctx.font = '16px Arial';  // Metin fontu için font eklendi
    ctx.fillText(`Momentum: ${round(momentum, 4)}`, 10, 30);  // Koordinatlar değiştirildi
}

const mainLoop = () => {
    ctx.clearRect(0,0, canvas.width, canvas.height);  // clientWidth ve clientHeight yerine width ve height kullanılmalı
    BALLZ.forEach((b, index) => {
        b.drawball();
        if(b.player) {
            keyControl(b);
        }
        for(let i=index+1;i<BALLZ.length; i++) {
            if(coll_det_bb(BALLZ[index], BALLZ[i])) {
                pen_res_bb(BALLZ[index], BALLZ[i]);
                coll_res_bb(BALLZ[index], BALLZ[i]);
            }
        }
        b.display();
        b.reposition();
    });
    momentum_display();
    requestAnimationFrame(mainLoop);
}

let Ball1 = new Ball(200,200,30,"red");
let Ball2 = new Ball(300, 250, 40, "blue");
Ball1.player = true;

requestAnimationFrame(mainLoop);