var gctx;
var gactx;
var bctx;
var bactx;
var pause;
var coeff;
var cinput;
var pt;
var paused;

function init() {
    var g = document.querySelector("#graph");
    var ga = document.querySelector("#gaxes");
    var b = document.querySelector("#bifur");
    var ba = document.querySelector("#baxes");

    cinput = document.querySelector("#coefficient");
    cinput.onkeypress = checkReturn;
    ptinput = document.querySelector("#point");
    ptinput.onkeypress = checkReturn;

    var pinput = document.querySelector("#pause");
    pinput.onclick = function() {
	paused = ! paused;
	if (paused) {
	    pinput.innerHTML = "Resume";
	} else {
	    pinput.innerHTML = "Pause";
	}
	    
	return false;
    };
    var sinput = document.querySelector("#step");
    sinput.onclick = doStep;

    gctx = g.getContext("2d");
    gactx = ga.getContext("2d");
    bctx = b.getContext("2d");
    bactx = ba.getContext("2d");

    bactx.save();
    drawAxes(bactx,-.1,1.1,.1,-.1,1.1,.1);
    bactx.restore();

    bctx.save();

    var ret = drawAxes(bctx,-.1,1.1,.1,-.1,1.1,.1);
    var sx = ret[0];
    var sy = ret[1];
    bctx.fillStyle = "rgba(200,200,200,255)";
    var npt;
    for (var c = 0; c<4; c += .01) {
	npt = .7;
	for (var i=0; i<1000; i++) {
	    npt = c*npt*(1-npt);	
	}
	for (var i=0; i<100; i++) {
	    bctx.beginPath();
	    bctx.arc(sx*c/4,sy*npt,.5,0,2*Math.PI);
	    bctx.fill();
	    npt = c*npt*(1-npt);	
	}
    }
    bctx.restore();
    
    setInterval(draw,50);
    reset();
}

window.onload = init;

function draw() {
    if (paused) {
	return;
    }
    doStep();
}

function doStep () {
    var sx,sy,npt;
    var ptrad = 3;
    gctx.save();
    gactx.save();
    gctx.save();
    gctx.setTransform(1,0,0,1,0,0);
    gctx.fillStyle = "rgba(255,255,255,.01)";
    gctx.fillRect(0,0,gctx.canvas.width,gctx.canvas.height);
    gctx.restore();
    
    var ret = transform(gctx,-.1,1.1,.1,-.1,1.1,.1);
    transform(gactx,-.1,1.1,.1,-.1,1.1,.1);
    sx = ret[0];
    sy = ret[1];

    gactx.beginPath();
    gactx.arc(sx*pt,0,ptrad,0,2*Math.PI);
    gactx.fill();

    npt = coeff*pt*(1-pt);
    
    gctx.beginPath();
    gctx.arc(sx*npt,sy*npt,ptrad,0,2*Math.PI);
    gctx.fill();

    gctx.beginPath();
    gctx.arc(sx*pt,sy*npt,ptrad,0,2*Math.PI);
    gctx.fill();

    gctx.beginPath();
    gctx.moveTo(sx*pt,sy*pt);
    gctx.lineTo(sx*pt,sy*npt);
    gctx.lineTo(sx*npt,sy*npt);
    gctx.stroke();

    pt = npt;
    
    gactx.restore();
    gctx.restore();
}

function reset() {
    var ret,sx,sy,npt;
    var ptrad = 1;

    clear(gactx);
    clear(gctx);
/*    clear(bactx);
    clear(bctx); */
    
    coeff = cinput.value;
    pt = ptinput.value;

    bactx.save();

    ret = transform(bactx,-.1,1.1,.1,-.1,1.1,.1);
    sx = ret[0];
    sy = ret[1];

    npt = pt;
    for (var i=0; i<1000; i++) {
	npt = coeff*npt*(1-npt);	
    }
    for (var i=0; i<100; i++) {
	bactx.beginPath();
	bactx.arc(sx*coeff/4,sy*npt,ptrad,0,2*Math.PI);
	bactx.fill();
	npt = coeff*npt*(1-npt);	
    }
    
    bactx.restore();

    gactx.save();
    ret = drawAxes(gactx,-.1,1.1,.1,-.1,1.1,.1);
    sx = ret[0];
    sy = ret[1];
    
    gactx.beginPath();
    gactx.moveTo(-.5*sx,-.5*sx);
    gactx.lineTo(sx,sy);
    gactx.stroke();

    gactx.beginPath();
    gactx.moveTo(0,0);
    gactx.quadraticCurveTo(sx*1/2,coeff*sy/2,sx*1,0);
    gactx.stroke();
    gactx.restore();
}

function clear(c) {
    c.save();
    c.setTransform(1,0,0,1,0,0);
    c.clearRect(0,0,c.canvas.width,c.canvas.height);
    c.restore();
}

function checkReturn(e) {
    if(e && e.keyCode == 13)
    {
	reset();
        return false;
    }
}

function transform(c,lx,ux,dx,ly,uy,dy) {
    var height = c.canvas.height;
    var width = c.canvas.width;
    c.translate(0,height);
    c.scale(1,-1);
    
    var sy = height/(uy - ly);
    var sx = width/(ux - lx);
    
    c.translate(-sx*lx,-sy*ly);
    return [sx,sy];
}

function drawAxes(c,lx,ux,dx,ly,uy,dy) {
    var i,j,n,sx,sy;

    var ret = transform(c,lx,ux,dx,ly,uy,dy);
    sx = ret[0];
    sy = ret[1];

    c.beginPath();
    c.moveTo(sx*lx,0);
    c.lineTo(sx*ux-2*c.lineWidth,0);
    c.stroke();
    
    c.save();
    c.translate(sx*ux,0);
    arrowHead(c,3);
    c.restore();

    c.beginPath();
    c.moveTo(0,sy*ly);
    c.lineTo(0,sy*uy-2*c.lineWidth);
    c.stroke();
    
    c.save();
    c.translate(0,sy*uy);
    c.rotate(Math.PI/2);
    arrowHead(c,3);
    c.restore();

    n = ux/dx;
    for (var i=1; i<n; i++) {
	c.beginPath();
	c.moveTo(sx*dx*i,0);
	c.lineTo(sx*dx*i,-10);
	c.stroke();
    }
    n = uy/dy;
    for (var i=1; i<n; i++) {
	c.beginPath();
	c.moveTo(0,sy*dy*i);
	c.lineTo(-10,sy*dy*i);
	c.stroke();
    }
    return [sx,sy];
}

function arrowHead(c,s) {
    var lw = c.lineWidth;
    var fc = c.fillStyle;
    c.fillStyle = c.strokeStyle;
    c.beginPath();
    c.moveTo(-4*s*lw,0);
    c.lineTo(-4*s*lw,2*s*lw);
    c.quadraticCurveTo(-2*s*lw,.5*s*lw,0,0);
    c.quadraticCurveTo(-2*s*lw,-.5*s*lw,-4*s*lw,-2*s*lw);
    c.lineTo(-4*s*lw,0);
    c.fill();
    c.fillStyle = fc;
}

function stuff() {
    c.beginPath();
    c.moveTo(-10+lx*s,0);
    c.lineTo(ux*s + 10,0);
    c.stroke();
    c.beginPath();
    var tm;
    c.fillStyle = 'black';
    for (var i=0; i<b.length;i++) {
        c.moveTo(b[i].lower*s,0);
        c.lineTo(b[i].lower*s,5);
        tm = c.measureText(b[i].lower);
        c.fillText(b[i].lower,b[i].lower*s-tm.width/2,14);
    }
    c.moveTo(b[b.length-1].upper*s,0);
    c.lineTo(b[b.length-1].upper*s,5);
    tm = c.measureText(b[b.length-1].upper);
    c.fillText(b[b.length-1].upper,b[b.length-1].upper*s-tm.width/2,14);
    c.stroke()
}
