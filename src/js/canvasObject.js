if(!Editor) var Editor = {};

/**
 * The base class for an object in the canvas
 *
 * @class CanvasObject
 * @author Hendrik Weiler
 * @namespace Editor
 */
Editor.CanvasObject = class {

    /**
     * Returns the type of the canvas object
     *
     * @type string
     * @var type
     * @memberOf CanvasObject
     */
    type = 'object';

    /**
     * Returns the width of the object
     *
     * @memberOf CanvasObject
     * @type number
     * @var width
     */
    width = 0;

    /**
     * Returns the height of the object
     *
     * @memberOf CanvasObject
     * @type number
     * @var height
     */
    height = 0;

    /**
     * Returns the x coordinate of the object
     *
     * @memberOf CanvasObject
     * @type number
     * @var x
     */
    x = 0;

    /**
     * Returns the y coordinate of the object
     *
     * @memberOf CanvasObject
     * @type number
     * @var y
     */
    y = 0;

    /**
     * Returns the custom data of the object
     *
     * @memberOf CanvasObject
     * @type object
     * @var data
     */
    data = {};

    /**
     * Returns the base node of the object
     *
     * @memberOf CanvasObject
     * @type HTMLElement
     * @var baseNode
     */
    baseNode = null;

    /**
     * The constructor
     *
     * @memberOf CanvasObject
     * @method constructor
     * @param object data The data object
     */
    constructor(data) {

        this.data = data;
    }

    /**
     * Creates the appeareance of the canvas object
     *
     * @memberOf CanvasObject
     * @method createAppeareance
     */
    createAppeareance() {

    }

    /**
     * Unselects the canvas object
     *
     * @memberOf CanvasObject
     * @method unselect
     */
    unselect() {
        this.baseNode.classList.remove('selected');
    }

    /**
     * Selects the canvas object
     *
     * @method select
     * @memberOf CanvasObject
     */
    select() {
        this.baseNode.classList.remove('selected');
        this.baseNode.classList.add('selected');
    }

    /**
     * Checks if the canvas object is selected or not
     *
     * @memberOf CanvasObject
     * @method isSelected
     * @returns boolean
     */
    isSelected() {
        return this.baseNode.classList.contains('selected');
    }

    /**
     * Sets the position of the canvas object
     *
     * @memberOf CanvasObject
     * @method setPosition
     * @param number x The x position
     * @param number y The y position
     */
    setPosition(x,y) {
        this.baseNode.setAttributeNS(null, 'x', x);
        this.baseNode.setAttributeNS(null, 'y', y);
        this.x = x;
        this.y = y;
    }

    /**
     * Sets the size of the canvas object
     *
     * @memberOf CanvasObject
     * @method setSize
     * @param number width The width
     * @param number height The height
     */
    setSize(width, height) {
        this.baseNode.setAttributeNS(null, 'width', width);
        this.baseNode.setAttributeNS(null, 'height', height);
        this.width = width;
        this.height = height;
    }

    /**
     * Updates the canvas object
     *
     * @memberOf CanvasObject
     * @method update
     */
    update() {
        this.setPosition(this.x, this.y);
        this.setSize(this.width, this.height);
    }

    /**
     * Renders the canvas object
     *
     * @memberOf CanvasObject
     * @method render
     */
    render() {
        this.createAppeareance();
        this.baseNode.classList.add('field');
        this.baseNode.__instance__ = this;
    }
}