class Canvas {

    width = 0;

    height = 0;

    svg = document.createElementNS('http://www.w3.org/2000/svg','svg');

    canvas = document.createElementNS('http://www.w3.org/2000/svg','rect');

    canvasResizer = document.createElementNS('http://www.w3.org/2000/svg','rect');

    zoomGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");

    selector = document.createElementNS("http://www.w3.org/2000/svg", "rect");

    relationObjects = document.createElementNS("http://www.w3.org/2000/svg", "g");

    canvasObjects = document.createElementNS("http://www.w3.org/2000/svg", "g");

    lineSelector = document.createElementNS("http://www.w3.org/2000/svg", "line");

    mousePressed = false;

    startX = 0;

    startY = 0;

    dragStartX = 0;

    dragStartY = 0;

    endX = 0;

    endY = 0;

    selectedFields = [];

    currentSelected = null;

    mouseIsDraging = false;

    zoomLevel = 1;

    constructor(config) {

        this.config = Object.assign({
            editor: document.body,
            toolbox : document.body,
            canvas : document.body,
            properties:document.body
        }, config);

        this.relationObjects.classList.add('relations');
        this.canvasObjects.classList.add('objects');
        this.zoomGroup.classList.add('zoom');
        this.canvas.classList.add('canvas-field');
        this.canvasResizer.classList.add('canvas-resizer');
        this.config.canvas.tabIndex = 9999;
    }

    setZoom(zoomLevel) {
        this.zoomLevel = zoomLevel;
        this.zoomGroup.setAttributeNS(null, 'transform', 'scale(' + this.zoomLevel + ')');
        let width = parseInt(this.canvas.getAttributeNS(null,'width')),
            height = parseInt(this.canvas.getAttributeNS(null,'height')),
            newWidth = (width * this.zoomLevel),
            newHeight = (height * this.zoomLevel);
        this.svg.setAttributeNS(null, 'width',newWidth + 100 );
        this.svg.setAttributeNS(null, 'height',newHeight + 100);
    }

    zoomIn() {
        this.zoomLevel += 0.5;
        if(this.zoomLevel > 4) {
            this.zoomLevel = 4;
        }
        this.setZoom(this.zoomLevel);
    }

    zoomOut() {
        this.zoomLevel -= 0.5;
        if(this.zoomLevel < 0.5) {
            this.zoomLevel = 0.5;
        }
        this.setZoom(this.zoomLevel);
    }

    deselectAll() {
        let fields = this.zoomGroup.querySelectorAll('.field'),
            i = 0,
            field;
        for(i; i < fields.length; ++i) {
            field = fields[i].__instance__;
            field.unselect();
        }
    }

    isSelecting(e, useOriginal) {
        if(!useOriginal) useOriginal = false;
        let fields = this.canvasObjects.querySelectorAll('.field'),
            relationFields = this.relationObjects.querySelectorAll('.field'),
            i = 0,
            field,
            toolboxRect = this.config.toolbox.getBoundingClientRect(),
            client = this.getPressPositions(e);

        if(useOriginal) {
            client = {
                x : e.clientX,
                y : e.clientY
            }
        }

        for(i; i < fields.length; ++i) {
            field = fields[i].__instance__;
            if(client.x > field.x && client.x < field.x + field.width + toolboxRect.width
            && client.y > field.y && client.y < field.y + field.height) {
                return field;
            }
        }
        for(i=0; i < relationFields.length; ++i) {
            field = relationFields[i].__instance__;
            if(client.x > field.x && client.x < field.x + field.width + toolboxRect.width
                && client.y > field.y && client.y < field.y + field.height) {
                return field;
            }
        }
        return null;
    }

    isSelectingFromSelector() {
        let fields = this.zoomGroup.querySelectorAll('.field'),
            i = 0,
            field,
            toolboxRect = this.config.toolbox.getBoundingClientRect(),
            selectorData = this.getSelectorData(),
            selection = [];
        for(i; i < fields.length; ++i) {
            field = fields[i].__instance__;
            if(field.x > selectorData.x && selectorData.x + field.width + toolboxRect.width < selectorData.x + selectorData.width
                && field.y > selectorData.y && selectorData.y + field.height < selectorData.y + selectorData.height) {
                selection.push(field);
            }
        }
        return selection;
    }

    drawSelector() {
        let xDiff = this.endX - this.startX,
            yDiff = this.endY - this.startY,
            x,
            y,
            width,
            height,
            toolboxRect = this.config.toolbox.getBoundingClientRect();

        if(xDiff < 0) {
            x = this.startX + xDiff;
            width = -xDiff;
        } else {
            x = this.startX;
            width = xDiff;
        }
        if(yDiff < 0) {
            y = this.startY + yDiff;
            height = -yDiff;
        } else {
            y = this.startY;
            height = yDiff;
        }

        this.selector.setAttributeNS(null, "x", x);
        this.selector.setAttributeNS(null, "y", y);
        this.selector.setAttributeNS(null, "width", width);
        this.selector.setAttributeNS(null, "height", height);
        if(!this.selector.classList.contains('show')) {
            this.selector.classList.add('show');
        }
    }

    drawLineSelector() {
        let xDiff = this.endX - this.startX,
            yDiff = this.endY - this.startY,
            x1,
            y1,
            x2,
            y2,
            toolboxRect = this.config.toolbox.getBoundingClientRect();

        x2 = this.startX + xDiff;
        x1 = this.startX;

        y2 = this.startY + yDiff;
        y1 = this.startY;

        this.lineSelector.setAttributeNS(null, "x1", x1);
        this.lineSelector.setAttributeNS(null, "y1", y1);
        this.lineSelector.setAttributeNS(null, "x2", x2);
        this.lineSelector.setAttributeNS(null, "y2", y2);
        if(!this.lineSelector.classList.contains('show')) {
            this.lineSelector.classList.add('show');
        }
    }

    resetSelector() {
        this.selector.setAttributeNS(null, "x", 0);
        this.selector.setAttributeNS(null, "y", 0);
        this.selector.setAttributeNS(null, "width", 0);
        this.selector.setAttributeNS(null, "height", 0);
    }

    getSelectorData() {
        return {
            x : parseInt(this.selector.getAttributeNS(null, 'x')),
            y : parseInt(this.selector.getAttributeNS(null, 'y')),
            width : parseInt(this.selector.getAttributeNS(null, 'width')),
            height : parseInt(this.selector.getAttributeNS(null, 'height'))
        }
    }

    getLineSelectorData() {
        return {
            x1 : parseInt(this.lineSelector.getAttributeNS(null, 'x1')),
            y1 : parseInt(this.lineSelector.getAttributeNS(null, 'y1')),
            x2 : parseInt(this.lineSelector.getAttributeNS(null, 'x2')),
            y2 : parseInt(this.lineSelector.getAttributeNS(null, 'y2')),
        }
    }

    getRelationConnection() {
        let lineSelData = this.getLineSelectorData(),
            class1 = this.isSelecting({
                clientY : lineSelData.y1,
                clientX : lineSelData.x1
            },true),
            class2 = this.isSelecting({
                clientY : lineSelData.y2,
                clientX : lineSelData.x2
            },true);
        return {
            success : class1 != null && class2 != null && class1 !== class2,
            class1 : class1,
            class2 : class2
        }
    }

    hideSelector() {
        this.selector.classList.remove('show');
    }

    hideLineSelector() {
        this.lineSelector.classList.remove('show');
    }

    mouseDown(e) {
        let client = this.getPressPositions(e),
            canvasResizerRect = this.canvasResizer.getBBox();
        // selection
        this.startX = this.dragStartX = client.x;
        this.startY = this.dragStartY = client.y;

        let selectedField = this.isSelecting(e);
        if(selectedField && EditorGlobals.typeSelected==0) {
            this.currentSelected  = selectedField;
            this.mouseIsDraging = true;
        } else {
            this.currentSelected = null;
        }

        // canvas resizer
        if(this.startX > canvasResizerRect.x && this.startX < canvasResizerRect.x + canvasResizerRect.width
            && this.startY > canvasResizerRect.y && this.startY < canvasResizerRect.y + canvasResizerRect.height) {
            this.currentSelected = 'canvas';
            this.mouseIsDraging = true;
        }

        this.mousePressed = true;
    }

    updateRelations() {
        let fields = this.relationObjects.querySelectorAll('.field'),
            i = 0,
            field;
        for(i; i < fields.length; ++i) {
            field = fields[i].__instance__;
            field.update();
        }
    }

    mouseMove(e) {

        let client = this.getPressPositions(e);
        this.endX = client.x;
        this.endY = client.y;

        if(this.mouseIsDraging && this.currentSelected == 'canvas') {
            this.setCanvasSize(
                (this.width + client.x - this.startX) * this.zoomLevel,
                (this.height + client.y - this.startY) * this.zoomLevel
            );
            //this.config.canvas.scrollTop = this.config.canvas.scrollHeight;
            //this.config.canvas.scrollLeft = this.config.canvas.scrollWidth;
            this.setZoom(this.zoomLevel);
            return;
        }

        if(this.mouseIsDraging && EditorGlobals.typeSelected==0) {

            if(this.selectedFields.length > 1) {
                let xDiff = this.endX - this.startX,
                    yDiff = this.endY - this.startY,
                    i = 0,
                    field;

                for(i; i < this.selectedFields.length; ++i) {
                    field = this.selectedFields[i];
                    field.setPosition(field.x + xDiff, field.y + yDiff);
                }

                this.updateRelations();

                this.startX = this.endX;
                this.startY = this.endY;
            } else {
                let xDiff = this.endX - this.startX,
                    yDiff = this.endY - this.startY;

                this.currentSelected.setPosition(this.currentSelected.x + xDiff, this.currentSelected.y + yDiff);

                this.updateRelations();
                this.startX = this.endX;
                this.startY = this.endY;
            }
            return;
        }

        // selection
        if(EditorGlobals.typeSelected==0 && this.mousePressed) {
            this.drawSelector();
        }
        // relation selector
        if(EditorGlobals.typeSelected==2 && this.mousePressed) {
            this.drawLineSelector();
        }
    }

    getPressPositions(e) {
        let toolboxRect = this.config.toolbox.getBoundingClientRect();
        return {
            x: ((e.clientX - toolboxRect.width + this.config.canvas.scrollLeft) / this.zoomLevel),
            y: ((e.clientY + this.config.canvas.scrollTop) / this.zoomLevel)
        };
    }

    mouseUp(e) {
        this.mousePressed = false;
        this.hideSelector();
        this.hideLineSelector();

        let client = this.getPressPositions(e);
        this.endX = client.x;
        this.endY = client.y;

        if(this.currentSelected == 'canvas') {
            this.currentSelected = null;
            this.mouseIsDraging = false;
            this.width = parseInt(this.canvas.getAttributeNS(null,'width'));
            this.height = parseInt(this.canvas.getAttributeNS(null,'height'));
            return;
        }

        if(this.dragStartX == this.endX
            && this.dragStartY == this.endY
            && EditorGlobals.typeSelected==0) {
            if(e.ctrlKey) {
                if(this.currentSelected.isSelected()) {
                    let i = 0,
                        field,
                        newSelected = [];
                    for(i; i < this.selectedFields.length; ++i) {
                        field = this.selectedFields[i];
                        if(field !== this.currentSelected) {
                            newSelected.push(field);
                        }
                    }
                    this.selectedFields = newSelected;
                    if(this.selectedFields.length==0) {
                        this.mouseIsDraging = false;
                        return;
                    } else {
                        this.currentSelected = this.selectedFields[0];
                    }
                } else {
                    this.selectedFields.push(this.currentSelected);
                }
                this.deselectAll();
                for(let i = 0; i < this.selectedFields.length; ++i) {
                    this.selectedFields[i].select();
                }
            } else {
                if(this.currentSelected) {
                    this.selectedFields = [this.currentSelected];
                    this.currentSelected.select();
                }
            }
            this.mouseIsDraging = false;
        }

        if(this.mouseIsDraging) {
            this.mouseIsDraging = false;
            return;
        }

        if(EditorGlobals.typeSelected==0) {
            let selectedField = this.isSelecting(e);
            this.config.editorInstance.properties.showDeselect();
            this.deselectAll();
            if(selectedField) {
                for(let i=0; i < this.selectedFields.length; ++i) {
                    this.selectedFields[i].select();
                }
                this.config.editorInstance.properties.showProperties(selectedField);
                return;
            }
        }

        let selectorData = this.getSelectorData();
        // selection end
        if(EditorGlobals.typeSelected==0) {
            this.selectedFields = this.isSelectingFromSelector();
            this.resetSelector();
            console.log(this.selectedFields)
            this.deselectAll();
            for(let i=0; i < this.selectedFields.length; ++i) {
                this.selectedFields[i].select();
            }
        }
        // create class
        if(EditorGlobals.typeSelected==1) {
            let classObj = new Class({
                name : 'Class',
                inherit : '',
                properties: [],
                methods : [],
                description: ''
            });
            classObj.render();
            classObj.setPosition(client.x, client.y);
            this.addCanvasObject(1, classObj);
            classObj.update();
        }
        // create relation
        if(EditorGlobals.typeSelected==2) {
            let relation = this.getRelationConnection();
            if(relation.success) {
                let relationObj = new Relation({
                    label : '',
                    class1 : relation.class1,
                    class2: relation.class2
                });
                relationObj.render();
                this.addCanvasObject(0, relationObj);
                relationObj.update();

            }
        }
        // create text
        if(EditorGlobals.typeSelected==3) {
            let textObj = new Text({
                text : 'Text',
                size: 14
            }),
            toolboxRect = this.config.toolbox.getBoundingClientRect();
            textObj.render();
            textObj.setPosition(client.x, client.y);
            this.addCanvasObject(1, textObj);
            textObj.update();
            this.config.editorInstance.properties.showProperties(textObj);
        }
    }

    addCanvasObject(type, instance) {
        // relation
        if(type == 0) {
            this.relationObjects.appendChild(instance.baseNode);
        }
        // canvas object
        if(type==1) {
            this.canvasObjects.appendChild(instance.baseNode);
        }
    }

    removeRelationsFromClass(field) {
        let relations = this.relationObjects.querySelectorAll('.field'),
            i = 0,
            relation;
        for(i; i < relations.length; ++i)  {
            relation = relations[i].__instance__;
            if(relation.data.class1 === field
            || relation.data.class2 === field) {
                relation.baseNode.remove();
            }
        }
    }

    keyUp(e) {

        // delete
        if(e.keyCode == 46) {
            // delete multiple selection
            if(this.selectedFields.length > 1) {
                let i = 0,
                    field;
                for(i; i < this.selectedFields.length; ++i) {
                    field = this.selectedFields[i];
                    this.removeRelationsFromClass(field);
                    field.baseNode.remove();
                }
                this.config.editorInstance.properties.showDeselect();
            // delete current selected
            } else {
                if(this.currentSelected) {
                    if(this.currentSelected instanceof Relation) {
                        this.currentSelected.baseNode.remove();
                    } else {
                        this.removeRelationsFromClass(this.currentSelected);
                        this.currentSelected.baseNode.remove();
                    }
                    this.config.editorInstance.properties.showDeselect();
                }
            }

        }

    }

    setCanvasSize(width, height) {
        let newWidth = (width / this.zoomLevel),
            newHeight = (height / this.zoomLevel);
        this.canvas.setAttributeNS(null, 'width', newWidth);
        this.canvas.setAttributeNS(null,'height', newHeight);
        this.canvasResizer.setAttributeNS(null, 'x', newWidth - 5);
        this.canvasResizer.setAttributeNS(null, 'y', newHeight - 5);
        this.canvasResizer.setAttributeNS(null, 'width', 10);
        this.canvasResizer.setAttributeNS(null, 'height', 10);
        this.setZoom(this.zoomLevel);
    }

    setEvents() {
        this.config.canvas.addEventListener('mousedown', this.mouseDown.bind(this), false);
        this.config.canvas.addEventListener('mousemove', this.mouseMove.bind(this), false);
        this.config.canvas.addEventListener('mouseup', this.mouseUp.bind(this), false);
        this.config.canvas.addEventListener("contextmenu", e => e. preventDefault());
        this.config.canvas.addEventListener('keyup', this.keyUp.bind(this), false);
    }

    init() {
        this.config.canvas.appendChild(this.svg);
        let rect =  this.config.canvas.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
        this.svg.appendChild(this.zoomGroup);
        this.zoomGroup.appendChild(this.canvas);
        this.zoomGroup.appendChild(this.canvasResizer);
        this.setCanvasSize(this.width, this.height);
        this.zoomGroup.appendChild(this.relationObjects);
        this.zoomGroup.appendChild(this.canvasObjects);
        this.zoomGroup.appendChild(this.selector);
        this.zoomGroup.appendChild(this.lineSelector);
        this.selector.classList.add('selector');
        this.lineSelector.classList.add('lineSelector');
        this.setEvents();
    }

}