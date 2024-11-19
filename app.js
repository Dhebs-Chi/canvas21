// Get canvas and context
var canvas = document.getElementById('drawingCanvas');
var ctx = canvas.getContext('2d');
var shapeSelector = document.getElementById('shape');
var isDrawing = false;
var isDragging = false;
var dragPointIndex = null;
var startX = 0, startY = 0;
var vertices = [];
var selectedShape = 'rectangle';
// Update selected shape when dropdown changes
shapeSelector.addEventListener('change', function () {
    selectedShape = shapeSelector.value;
});
// Start drawing
canvas.addEventListener('mousedown', function (e) {
    if (isDragging)
        return;
    var offsetX = e.offsetX, offsetY = e.offsetY;
    // Check if clicking on a drag point
    dragPointIndex = getDragPointIndex(offsetX, offsetY);
    if (dragPointIndex !== null) {
        isDragging = true;
        return;
    }
    // Otherwise, start a new shape
    isDrawing = true;
    startX = offsetX;
    startY = offsetY;
    vertices = [];
});
// Draw shape dynamically
canvas.addEventListener('mousemove', function (e) {
    var offsetX = e.offsetX, offsetY = e.offsetY;
    if (isDragging && dragPointIndex !== null) {
        // Update position of dragged point
        vertices[dragPointIndex] = { x: offsetX, y: offsetY };
        redrawCanvas();
        return;
    }
    if (isDrawing) {
        var currentX = offsetX;
        var currentY = offsetY;
        // Handle rectangle specifically
        if (selectedShape === 'rectangle') {
            vertices = [
                { x: startX, y: startY },
                { x: currentX, y: startY },
                { x: currentX, y: currentY },
                { x: startX, y: currentY },
            ];
        }
        else {
            var width = currentX - startX;
            var height = currentY - startY;
            vertices = getShapeVertices(selectedShape, startX, startY, width, height);
        }
        redrawCanvas();
    }
});
// Stop drawing or dragging
canvas.addEventListener('mouseup', function () {
    isDrawing = false;
    isDragging = false;
    dragPointIndex = null;
});
// Get shape vertices based on type
function getShapeVertices(shape, x, y, width, height) {
    var centerX = x + width / 2;
    var centerY = y + height / 2;
    var radius = Math.min(Math.abs(width), Math.abs(height)) / 2;
    var vertices = [];
    var sides = getSides(shape);
    for (var i = 0; i < sides; i++) {
        var angle = ((2 * Math.PI) / sides) * i - Math.PI / 2;
        var px = centerX + radius * Math.cos(angle);
        var py = centerY + radius * Math.sin(angle);
        vertices.push({ x: px, y: py });
    }
    return vertices;
}
// Get the number of sides for the selected shape
function getSides(shape) {
    switch (shape) {
        case 'pentagon': return 5;
        case 'hexagon': return 6;
        case 'heptagon': return 7;
        case 'octagon': return 8;
        case 'nonagon': return 9;
        case 'decagon': return 10;
        default: return 4; // Default to rectangle
    }
}
// Redraw the canvas
function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (vertices.length > 0) {
        drawShape(vertices);
        drawDragPoints(vertices);
    }
}
// Draw the shape
function drawShape(vertices) {
    ctx.beginPath();
    vertices.forEach(function (vertex, index) {
        index === 0
            ? ctx.moveTo(vertex.x, vertex.y)
            : ctx.lineTo(vertex.x, vertex.y);
    });
    ctx.closePath();
    ctx.stroke();
}
// Draw drag points at each vertex
function drawDragPoints(vertices) {
    vertices.forEach(function (vertex) {
        ctx.beginPath();
        ctx.arc(vertex.x, vertex.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    });
}
// Get the index of the drag point being clicked
function getDragPointIndex(x, y) {
    for (var i = 0; i < vertices.length; i++) {
        var vertex = vertices[i];
        var distance = Math.sqrt(Math.pow(x - vertex.x, 2) + Math.pow(y - vertex.y, 2));
        if (distance <= 5) {
            return i;
        }
    }
    return null;
}
