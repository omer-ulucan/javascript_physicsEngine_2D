const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const BALLZ = [];

let LEFT, RIGHT, UP, DOWN;
let friction = 0.1;

class Ball {
    constructor(x, y, r, color) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color;
        this.vel_x=0;
        this.vel_y=0;
        this.acc_x=0;
        this.acc_y=0;
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
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.acc_x*100, this.y + this.acc_y*100);
        ctx.strokeStyle = 'green';
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.vel_x*10, this.y + this.vel_y*10);
        ctx.strokeStyle = 'blue';
        ctx.stroke();
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
        b.acc_x = -b.acceleration;
    }
    if(UP) {
        b.acc_y = -b.acceleration;
    }
    if(RIGHT) {
        b.acc_x = b.acceleration;
    }
    if(DOWN) {
        b.acc_y = b.acceleration;
    }
    if(!UP && !DOWN) {
        b.acc_y = 0;
    }
    if(!LEFT && !RIGHT) {
        b.acc_x = 0;
    }
    b.vel_x += b.acc_x;
    b.vel_y += b.acc_y;

    b.vel_x *= (1-friction);
    b.vel_y *= (1-friction);

    b.x += b.vel_x;
    b.y += b.vel_y;
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




