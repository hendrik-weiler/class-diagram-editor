if(!Editor) var Editor = {};

/**
 * The class canvas object
 *
 * @class Class
 * @author Hendrik Weiler
 * @extends Editor.CanvasObject
 * @namespace Editor
 */
Editor.Class = class extends Editor.CanvasObject {

    /**
     * Returns the type of the canvas object
     *
     * @memberOf Class
     * @type string
     * @var type
     */
    type = 'Class';

    /**
     * Returns the container rect element
     *
     * @memberOf Class
     * @var container
     * @type SVGRectElement
     */
    container = document.createElementNS("http://www.w3.org/2000/svg", 'rect');

    /**
     * Returns the properties rect element
     *
     * @memberOf Class
     * @var properties
     * @type SVGRectElement
     */
    properties = document.createElementNS("http://www.w3.org/2000/svg", 'rect');

    /**
     * Returns the text element
     *
     * @memberOf Class
     * @var textName
     * @type SVGTextElement
     */
    textName = document.createElementNS("http://www.w3.org/2000/svg", 'text');

    /**
     * Creates the appeareance of the canvas object
     *
     * @memberOf Class
     * @method createAppeareance
     */
    createAppeareance() {
        this.baseNode = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        this.baseNode.classList.add('class');

        this.properties.setAttributeNS(null,'height',10);
        this.properties.setAttributeNS(null,'y',30);
        this.properties.setAttributeNS(null,'x',0);

        this.textName.setAttributeNS(null,'y',10);
        this.textName.setAttributeNS(null,'x',0);

        this.baseNode.appendChild(this.container);
        this.baseNode.appendChild(this.textName);
        this.baseNode.appendChild(this.properties);
    }

    /**
     * Sets the position of the canvas object
     *
     * @memberOf Class
     * @method setPosition
     * @param number x The x position
     * @param number y The y position
     */
    setPosition(x,y) {
        this.baseNode.setAttributeNS(null, 'transform', "translate(" + x + " " + y + ")");
        this.x = x;
        this.y = y;
    }

    /**
     * Creates the properties inside of the class object
     *
     * @memberOf Class
     * @method fillInProperties
     */
    fillInProperties() {
        let i = 0,
            property,
            text,
            startY = 40,
            y = startY,
            textRect,
            properties = this.baseNode.querySelectorAll('.property');
        for(i=0; i < properties.length; ++i)  {
            properties[i].remove();
        }
        for(i=0;i < this.data.properties.length; ++i) {
            property = this.data.properties[i];
            text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
            text.classList.add('property');
            text.setAttributeNS(null, 'x', 5);
            text.innerHTML = '+ ' + property.visibility + ' ' + property.name;
            this.baseNode.appendChild(text);
            textRect = text.getBBox();
            if(i>0) {
                y += textRect.height + 5;
            }
            text.setAttributeNS(null, 'y', y);
        }
        this.properties.setAttributeNS(null, 'height', y);
    }

    /**
     * Resizes the width of the class object
     *
     * @memberOf Class
     * @method resizeWidth
     */
    resizeWidth() {
        let textNameRect = this.textName.getBBox(),
            properties = this.baseNode.querySelectorAll('.property'),
            methods = this.baseNode.querySelectorAll('.method'),
            i,
            widths = [],
            maxWidth;
        for(i=0; i < properties.length;++i) {
            widths.push(properties[i].getBBox().width);
        }
        for(i=0; i < methods.length;++i) {
            widths.push(methods[i].getBBox().width);
        }
        widths.push(textNameRect.width);
        maxWidth = widths.sort(function (a,b)  {
            return a - b;
        });
        this.width = maxWidth[maxWidth.length-1];
        this.setSize(this.width + 20,this.height);
    }

    fillInMethods() {
        let i = 0,
            method,
            text,
            height = parseInt(this.properties.getAttributeNS(null, 'height')),
            startY = parseInt(this.properties.getAttributeNS(null,'y')) + height + 10,
            y = startY,
            textRect,
            methods = this.baseNode.querySelectorAll('.method'),
            parameters;
        for(i=0; i < methods.length; ++i)  {
            methods[i].remove();
        }
        for(i=0;i < this.data.methods.length; ++i) {
            method = this.data.methods[i];
            parameters = method.parameters.split('\n');
            text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
            text.classList.add('method');
            text.setAttributeNS(null, 'x', 5);
            text.innerHTML = '+ ' + method.visibility + ' ' + method.name + '(' + parameters.join(', ') + ')';
            this.baseNode.appendChild(text);
            textRect = text.getBBox();
            if(i>0) {
                y += textRect.height + 5;
            }
            text.setAttributeNS(null, 'y', y);
        }
        this.height = y + 40;
        this.container.setAttributeNS(null, 'height', this.height);
    }

    /**
     * Updates the classes class name and inherited class name
     *
     * @memberOf Class
     * @method updateClassText
     */
    updateClassText()  {
        this.textName.innerHTML = this.data.name;
        if(this.data.inherit.length > 0) {
            this.textName.innerHTML += ' : ' + this.data.inherit;
        }
        let rect = this.textName.getBBox();
        this.textName.setAttributeNS(null,'x',this.width / 2 - rect.width / 2);
    }

    /**
     * Updates the canvas object
     *
     * @memberOf Class
     * @method update
     */
    update() {
        super.update();

        this.fillInProperties();
        this.fillInMethods();

        this.updateClassText();
        this.resizeWidth();
        this.updateClassText();
    }

    /**
     * Sets the size of the canvas object
     *
     * @memberOf Class
     * @method setSize
     * @param number width The width
     * @param number height The height
     */
    setSize(width, height) {
        this.container.setAttributeNS(null, 'width', width);
        this.container.setAttributeNS(null, 'height', height);
        this.properties.setAttributeNS(null,'width',width);
        this.width = width;
        this.height = height;
    }

}