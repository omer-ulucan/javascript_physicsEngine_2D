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
        this.x = x;
        this.y = y;
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
        ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    display() {
        this.vel.drawVect(this.x, this.y, 10, 'green');
        this.acc.drawVect(this.x, this.y, 100, 'blue');
    }
}

const keyControl = (b) => {
    canvas.addEventListener('keydown', (e) => {
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
    
    canvas.addEventListener('keyup', (e) => {
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
    
    b.vel = b.vel.add(b.acc);
    b.vel = b.vel.mult(1-friction);

    b.x += b.vel.x;
    b.y += b.vel.y;
}

const mainLoop = () => {
    ctx.clearRect(0,0, canvas.clientWidth, canvas.clientHeight);
    BALLZ.forEach((b) => {
        b.drawball();
        if(b.player) {
            keyControl(b);
        }
        b.display();
    })
    requestAnimationFrame(mainLoop);
}

let Ball1 = new Ball(200,200,30,"red");
Ball1.player = true;

requestAnimationFrame(mainLoop);




