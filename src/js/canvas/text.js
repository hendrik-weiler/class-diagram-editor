if(!Editor) var Editor = {};

/**
 * The text canvas object
 *
 * @class Text
 * @author Hendrik Weiler
 * @extends Editor.CanvasObject
 * @namespace Editor
 */
Editor.Text = class extends Editor.CanvasObject {

    /**
     * Returns the type of the canvas object
     *
     * @type string
     * @var type
     * @memberOf Text
     */
    type = 'Text';

    /**
     * Creates the appeareance of the canvas object
     *
     * @memberOf Text
     * @method createAppeareance
     */
    createAppeareance() {
        this.baseNode = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        this.baseNode.classList.add('text');
    }

    /**
     * Resizes to fit the text
     *
     * @memberOf Text
     * @method autoResize
     */
    autoResize() {
        let rect = this.baseNode.getBBox();
        this.setSize(rect.width, rect.height);
    }

    /**
     * Sets the position of the canvas object
     *
     * @memberOf Text
     * @method setPosition
     * @param number x The x position
     * @param number y The y position
     */
    setPosition(x, y) {
        this.baseNode.setAttributeNS(null, 'transform', 'translate(' + x + ' ' + y + ')');
        this.x = x;
        this.y = y;
    }

    /**
     * Sets the text
     *
     * @memberOf Text
     * @method fillText
     */
    fillText() {
        let textSplit = this.data.text.split("\n"),
            i = 0,
            tSpan;
        this.baseNode.innerHTML = '';
        this.baseNode.setAttributeNS(null, 'font-size', this.data.size);
        for(i; i < textSplit.length; ++i) {
            tSpan = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
            tSpan.setAttributeNS(null, 'x', 0);
            tSpan.setAttributeNS(null, 'dy', '1.2em');
            tSpan.innerHTML = textSplit[i];
            this.baseNode.appendChild(tSpan);
        }
    }

    /**
     * Updates the canvas object
     *
     * @memberOf Text
     * @method update
     */
    update() {
        this.setPosition(this.x, this.y);
        this.fillText();
        this.autoResize();
    }
}