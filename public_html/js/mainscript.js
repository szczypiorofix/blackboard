// ######### VARIABLES #########
var mouseIsDown = false;
var px = 0, py = 0;
var mx = 0, my = 0, mpx = 0, mpy = 0;

// ######### CANVAS #########
var Canvas = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    marginLeft: 0,
    marginTop: 0,
    init: function() {
        this.canvas = document.getElementById("blackboardcanvas");
        this.ctx = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.marginLeft = this.canvas.offsetLeft;
        this.marginTop = this.canvas.offsetTop;
    }
};

// ######### BLACKBOARD #########
var Blackboard = {
    width: 0,
    height: 0,
    fieldToSend : []
};

// ######### FILL BLACKBOARD WITH DATA FROM SERVER #########
function fillBlackboard() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            console.log('LOADING BLACKBOARD - OK');
            //console.log(this.response);
            var parsed = JSON.parse(this.response);
            //console.log(parsed);
            if (parsed.length === 0) {
                console.log('Request : clearing canvas.');
                Canvas.ctx.clearRect(0, 0, Canvas.width, Canvas.height);
            }
            Canvas.ctx.beginPath();
            Canvas.ctx.lineWidth=2;
            Canvas.ctx.strokeStyle = '#eeeeee';
            for (i = 0; i < parsed.length; i++) {
                Canvas.ctx.moveTo(parsed[i][0].x, parsed[i][0].y);
                for (j = 0; j < parsed[i].length; j++) {
                    Canvas.ctx.lineTo(parsed[i][j].x, parsed[i][j].y);
                }  
                Canvas.ctx.stroke();
            }                        
        }
    };
    xmlhttp.open("POST", "./getinfo.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("task=get");
}

// ######### GET MOUSE POSITION #########
function getMousePos(canvas, evt) {                
    var rect = canvas.getBoundingClientRect();
    return {
      x: Math.round(evt.clientX - rect.left),
      y: Math.round(evt.clientY  - rect.top)
    };
}

// ######### ADD SOME LISTENERS #########
function addListeners() {
    
    // ######### 'CLEAN BLACKBOARD' BUTTON #########
    document.getElementById('clearblackboard').addEventListener('click', function(evt) {
        Canvas.ctx.clearRect(0, 0, Canvas.width, Canvas.height);
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
               console.log(this.responseText);
            }
        };
        xmlhttp.open("POST", "./getinfo.php", true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send("task=clear");
    });

    // ######### MOUSE LISTENERS #########
    Canvas.canvas.addEventListener('mousemove', function(evt) {
        var mousePos = getMousePos(Canvas.canvas, evt);
        if (mouseIsDown) {
            Canvas.ctx.beginPath();
            Canvas.ctx.lineWidth=2;
            Canvas.ctx.strokeStyle = '#eeeeee';
            Blackboard.fieldToSend.push({x : mousePos.x, y : mousePos.y});
            Canvas.ctx.moveTo(px, py);
            Canvas.ctx.lineTo(mousePos.x, mousePos.y);
            Canvas.ctx.stroke();
            px = mousePos.x;
            py = mousePos.y;
        }
    }, false);

    Canvas.canvas.addEventListener('mousedown', function(evt) {
            var mousePos = getMousePos(Canvas.canvas, evt);
            mouseIsDown = true;
            px = mousePos.x;
            py = mousePos.y;
        }, false);

    Canvas.canvas.addEventListener('mouseup', function(evt) {
        var mousePos = getMousePos(Canvas.canvas, evt);
        mouseIsDown = false;
        px = mousePos.x;
        py = mousePos.y;
        //console.log(Blackboard.fieldToSend);
        //console.log(JSON.stringify(Blackboard.fieldToSend));

        if (Blackboard.fieldToSend.length > 0) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                   //console.log(this.responseText);
                }
            };
            xmlhttp.open("POST", "./getinfo.php", true);
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            var simplePoints = simplify(Blackboard.fieldToSend, 1, false);
            xmlhttp.send("task=add&array="+JSON.stringify(simplePoints));
            console.log('Simplify off:');
            console.log(Blackboard.fieldToSend);
            console.log('Simplify on:');
            console.log(simplePoints);
            Blackboard.fieldToSend = [];
            fillBlackboard();
        }
    }, false);

    // ######### TOUCH SUPPORT #########
    Canvas.canvas.addEventListener("touchstart", function (event) {
        //console.log('x: ' + event.touches[0].pageX + ', y: ' + event.touches[0].pageY);
        event.preventDefault();
        var touches = event.changedTouches;
        
        if (touches.length === 1) {
            console.log(touches[0].pageX +":"+touches[0].pageY);
        }
        //console.log(event.touches[0].pageX +":" +event.touches[0].pageY);
        mpx = Math.round(touches[0].pageX - Canvas.marginLeft);
        mpy = Math.round(touches[0].pageY - Canvas.marginTop);
        //console.log(mpx +":" +mpy);
    }, false);

    Canvas.canvas.addEventListener("touchmove", function (event) {
        //console.log('x: ' + event.touches[0].pageX + ', y: ' + event.touches[0].pageY);
        event.preventDefault();
        var touches = event.changedTouches;
        mx = Math.round(touches[0].pageX - Canvas.marginLeft);
        my = Math.round(touches[0].pageY - Canvas.marginTop);
        //console.log(mx+":"+my);
        Canvas.ctx.beginPath();
        Canvas.ctx.lineWidth=2;
        Canvas.ctx.strokeStyle = '#eeeeee';
        Blackboard.fieldToSend.push({x : mx, y : my});
        Canvas.ctx.moveTo(mpx, mpy);
        Canvas.ctx.lineTo(mx, my);
        Canvas.ctx.stroke();
        mpx = mx;
        mpy = my;
    }, false);

    Canvas.canvas.addEventListener("touchend", function (event) {
        event.preventDefault();
        var touches = event.changedTouches;
        console.log(touches.length);

        if (Blackboard.fieldToSend.length > 0 && touches.length === 1) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                   //console.log(this.responseText);
                }
            };
            xmlhttp.open("POST", "./getinfo.php", true);
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            var simplePoints = simplify(Blackboard.fieldToSend, 1, false);
            xmlhttp.send("task=add&array="+JSON.stringify(simplePoints));
            console.log('Simplify off:');
            console.log(Blackboard.fieldToSend);
            console.log('Simplify on:');
            console.log(simplePoints);
            Blackboard.fieldToSend = [];
            fillBlackboard();
        }
    }, false);
}

// ######### ON LOAD #########
window.onload = function() {
    Canvas.init();
    addListeners();

    fillBlackboard();
    setInterval(fillBlackboard, 5000);
};


