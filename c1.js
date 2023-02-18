let frameCount = 0;
let calcTimes = 0;
let totalCount = 0;
let maxFps = -1;
let minFps = 999999999999999999999999999;
const ele_fps = document.getElementById("fps");
const ele_avefps = document.getElementById("avefps");
const ele_minFps = document.getElementById("minfps");
const ele_maxFps = document.getElementById("maxfps");
const ele_range = document.getElementById("range");
const ele_loopTimes = document.getElementById("loopTimes");
const ele_button_run = document.getElementById("button_run");
const ele_button_clear = document.getElementById("button_clear");

function AnimationCallback(){
    frameCount++;
    window.requestAnimationFrame(AnimationCallback);
}
window.requestAnimationFrame(AnimationCallback);

setInterval(()=>{
    appendFps(frameCount);
    frameCount = 0;
}, 1000);

appendFps = function (fps) {
    ele_fps.innerText = `当前FPS: ${fps}`;
    //只有正在运行时才计算
    if(Running){
        calcTimes++;
        totalCount += fps;
        ele_avefps.innerText = `平均FPS: ${(totalCount / calcTimes).toFixed(3)}`;
        if(fps < minFps){
            minFps = fps;
            ele_minFps.innerText = `最低FPS: ${minFps}`;
        }
        if(fps > maxFps){
            maxFps = fps;
            ele_maxFps.innerText = `最高FPS: ${maxFps}`;
        }
    }
};

ele_range.oninput = (event) => {
    let value = ele_range.value;
    ele_loopTimes.innerText = `循环次数: ${value}`;
}
ele_range.onchange = (event) => {
    let value = ele_range.value;
    Apply(value);
    ele_loopTimes.innerText = `循环次数: ${value}`;
}

function Apply(value){
    KERNEL = "float kernal(vec3 ver){\n" +
    "   vec3 a;\n" +
    "   float b,c,d,e;\n" +
    "   a=ver;\n" +
    `   for(int i=0;i<${value};i++){\n` +
    "       b=length(a);\n" +
    "       c=atan(a.y,a.x)*8.0;\n" +
    "       e=1.0/b;\n" +
    "       d=acos(a.z/b)*8.0;\n" +
    "       b=pow(b,8.0);\n" +
    "       a=vec3(b*sin(d)*cos(c),b*sin(d)*sin(c),b*cos(d))+ver;\n" +
    "       if(b>6.0){\n" +
    "           break;\n" +
    "       }\n" +
    "   }" +
    "   return 4.0-a.x*a.x-a.y*a.y-a.z*a.z;" +
    "}";
    gl.shaderSource(fragshader, FSHADER_SOURCE + KERNEL);
    gl.compileShader(fragshader);
    var infof = gl.getShaderInfoLog(fragshader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        var info = gl.getProgramInfoLog(shaderProgram);
        alert(infof + info);
    }
    glposition = gl.getAttribLocation(shaderProgram, 'position');
    glright = gl.getUniformLocation(shaderProgram, 'right');
    glforward = gl.getUniformLocation(shaderProgram, 'forward');
    glup = gl.getUniformLocation(shaderProgram, 'up');
    glorigin = gl.getUniformLocation(shaderProgram, 'origin');
    glx = gl.getUniformLocation(shaderProgram, 'x');
    gly = gl.getUniformLocation(shaderProgram, 'y');
    gllen = gl.getUniformLocation(shaderProgram, 'len');
}

ele_button_run.onclick = (event) => {
    if(Running){
        //暂停程序
        Running = false;
        ele_button_run.innerText = "运行";
    }else{
        //启动程序
        Running = true;
        ele_button_run.innerText = "暂停";
        frameCount = 0;
        window.requestAnimationFrame(ontimer);
    }
}

ele_button_clear.onclick = (event) => {
    calcTimes = 0;
    totalCount = 0;
    maxFps = -1;
    minFps = 999999999999999999999999999;
    ele_avefps.innerText = '平均FPS: 统计中';
    ele_maxFps.innerText = '最高FPS: 统计中';
    ele_minFps.innerText = '最低FPS: 统计中';
}

let result = true;
if(navigator.userAgent.toLowerCase().includes("Mobile")){
    result = window.confirm("您正在使用移动设备,可能会导致浏览器崩溃,是否仍要运行?");
}
if(result){
    ele_button_run.click();
}