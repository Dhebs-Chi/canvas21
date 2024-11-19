
    // Define the types for points and shapes
    interface Point {
        x: number;
        y: number;
    }

    // Get canvas and context
    const canvas = document.getElementById('drawingCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const shapeSelector = document.getElementById('shape') as HTMLSelectElement;

    let isDrawing = false;
    let isDragging = false;
    let dragPointIndex: number | null = null;
    let startX = 0, startY = 0;
    let vertices: Point[] = [];
    let selectedShape: string = 'rectangle';

    // Update selected shape when dropdown changes
    shapeSelector.addEventListener('change', () => {
        selectedShape = shapeSelector.value;
    });

    // Start drawing
    canvas.addEventListener('mousedown', (e: MouseEvent) => {
        if (isDragging) return;

        const { offsetX, offsetY } = e;

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
    canvas.addEventListener('mousemove', (e: MouseEvent) => {
        const { offsetX, offsetY } = e;

        if (isDragging && dragPointIndex !== null) {
            // Update position of dragged point
            vertices[dragPointIndex] = { x: offsetX, y: offsetY };
            redrawCanvas();
            return;
        }

        if (isDrawing) {
            const currentX = offsetX;
            const currentY = offsetY;

            // Handle rectangle specifically
            if (selectedShape === 'rectangle') {
                vertices = [
                    { x: startX, y: startY },
                    { x: currentX, y: startY },
                    { x: currentX, y: currentY },
                    { x: startX, y: currentY },
                ];
            } else {
                const width = currentX - startX;
                const height = currentY - startY;
                vertices = getShapeVertices(selectedShape, startX, startY, width, height);
            }
            redrawCanvas();
        }
    });

    // Stop drawing or dragging
    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
        isDragging = false;
        dragPointIndex = null;
    });

    // Get shape vertices based on type
    function getShapeVertices(shape: string, x: number, y: number, width: number, height: number): Point[] {
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        const radius = Math.min(Math.abs(width), Math.abs(height)) / 2;
        const vertices: Point[] = [];

        const sides = getSides(shape);
        for (let i = 0; i < sides; i++) {
            const angle = ((2 * Math.PI) / sides) * i - Math.PI / 2;
            const px = centerX + radius * Math.cos(angle);
            const py = centerY + radius * Math.sin(angle);
            vertices.push({ x: px, y: py });
        }

        return vertices;
    }

    // Get the number of sides for the selected shape
    function getSides(shape: string): number {
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
    function redrawCanvas(): void {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (vertices.length > 0) {
            drawShape(vertices);
            drawDragPoints(vertices);
        }
    }

    // Draw the shape
    function drawShape(vertices: Point[]): void {
        ctx.beginPath();
        vertices.forEach((vertex, index) => {
            index === 0
                ? ctx.moveTo(vertex.x, vertex.y)
                : ctx.lineTo(vertex.x, vertex.y);
        });
        ctx.closePath();
        ctx.stroke();
    }

    // Draw drag points at each vertex
    function drawDragPoints(vertices: Point[]): void {
        vertices.forEach((vertex) => {
            ctx.beginPath();
            ctx.arc(vertex.x, vertex.y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = 'red';
            ctx.fill();
            ctx.closePath();
        });
    }

    // Get the index of the drag point being clicked
    function getDragPointIndex(x: number, y: number): number | null {
        for (let i = 0; i < vertices.length; i++) {
            const vertex = vertices[i];
            const distance = Math.sqrt(
                Math.pow(x - vertex.x, 2) + Math.pow(y - vertex.y, 2)
            );

            if (distance <= 5) {
                return i;
            }
        }
        return null;
    }

