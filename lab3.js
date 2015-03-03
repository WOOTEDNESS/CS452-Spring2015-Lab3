var gl;
var points;


var axis = 0;//creates flexability for  axis choice;
var xAxis = 0;
var yAxis = 1;

var mvMatrix = mat4();
var pMatrix = mat4();
var uMVMatrix, uPMatrix;

var theta = [0,0,0];


var thetaLoc;

window.onload = function init()
{
	var canvas = document.getElementById( "gl-canvas" );
	gl = WebGLUtils.setupWebGL( canvas );
	if ( !gl ) { alert( "WebGL isn't available" ); }

	points = new Float32Array([
							   // Front face
					             0.0,  1.0,  0.0,
					            -1.0, -1.0,  1.0,
					             1.0, -1.0,  1.0,

					            // Right face
					             0.0,  1.0,  0.0,
					             1.0, -1.0,  1.0,
					             1.0, -1.0, -1.0,

					            // Back face
					             0.0,  1.0,  0.0,
					             1.0, -1.0, -1.0,
					            -1.0, -1.0, -1.0,

					            // Left face
					             0.0,  1.0,  0.0,
					            -1.0, -1.0, -1.0,
					            -1.0, -1.0,  1.0,

							   //front flipped
							   	 0.0, -1.0,  0.0,
					           	-1.0, -1.0,  1.0,
					             1.0, -1.0,  1.0,

							   //bacl flipped
							   	 0.0, -1.0,  0.0,
					             1.0, -1.0, -1.0,
					            -1.0, -1.0, -1.0,

							   //right flipped
							     0.0, -1.0,  0.0,
					             1.0, -1.0,  1.0,
					             1.0, -1.0, -1.0,

							   //left flipped
							     0.0, -1.0,  0.0,
					            -1.0, -1.0, -1.0,
					            -1.0, -1.0,  1.0
								]);

	colors = new Float32Array([ 
			// Front face
            1.0, 0.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0,

            // Right face
            1.0, 0.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            0.0, 1.0, 0.0, 1.0,

            // Back face
            1.0, 0.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0,

            // Left face
            1.0, 0.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            0.0, 1.0, 0.0, 1.0
							  ]);

	//
	// Configure WebGL
	//
	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 0.5, 0.5, 0.5, 1.0 );
	gl.enable(gl.DEPTH_TEST);
	// Load shaders and initialize attribute buffers

	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	
	gl.useProgram(program);

	// Load the data into the GPU
	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId);
	gl.bufferData( gl.ARRAY_BUFFER, points, gl.STATIC_DRAW ); 
	bufferId.itemSize = 8;
	bufferId.numItems = 24;
	// Associate our shader variables with our data buffer
	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );
	//make a buffer for the colors
	var colorBufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferId);
	gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
	//Associcate color form html 
	var vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor,4,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(vColor);
	//Associate perspective matrix and modelview matrix and theta with html file
	uPMatrix = gl.getUniformLocation(program, "uPMatrix");
    uMVMatrix = gl.getUniformLocation(program, "uMVMatrix");
    thetaLoc = gl.getUniformLocation(program, "theta"); 
	document.onkeydown = function(event) { HandleKeys(event);};

	render();
};

//var theta = 0;
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

function render()
{
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	//needs a perspective matrix as well.
	eye = vec3(0.0,0.0,0.0);// placement of the eye 

	mvMatrix = lookAt(eye, at, up);
	pMatrix = perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);

	if(HandleKeys(event) == 37 || HandleKeys(event) == 38)
	{
		theta[axis] += 1.5
	}
	else if (HandleKeys(event) == 39 || HandleKeys(event) == 40)
	{
		theta[axis] -= 1.5
	}

	gl.uniform3fv(thetaLoc, theta);//connects to html

	gl.uniformMatrix4fv(uPMatrix, false, pMatrix);
    gl.uniformMatrix4fv(uMVMatrix, false, mvMatrix);

	gl.drawArrays(gl.TRIANGLES, 0, bufferId.numItems);
	requestAnimFrame(render);
} 
function HandleKeys(event)
{
	if (event.keyCode == 37)//left arrow key
	{
		axis = yAxis;
		console.log("left arrow pressed")
		
	}
	else if (event.keyCode == 39)//right arrow key
	{
		axis = yAxis;
		console.log("right arrow pressed")
		
	}
	else if (event.keyCode == 38)//up arrow key
	{
		axis = xAxis;
		console.log("up arrow pressed")
		
	}
	else if (event.keyCode == 40)//down arrow key
	{
		axis = xAxis;
		console.log("down arrow pressed")
		
	}
}







