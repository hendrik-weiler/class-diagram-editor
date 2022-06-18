if(!Editor) var Editor = {};

/**
 * The editors toolbox section
 *
 * @class Toolbox
 * @namespace Editor
 * @author Hendrik Weiler
 */
Editor.Toolbox = class {
    /**
     * The constructor
     *
     * @constructor
     * @method constructor
     * @memberOf Toolbox
     * @param object config The configuration object
     */
    constructor(config) {

        this.config = Object.assign({
            editor: document.body,
            toolbox : document.body,
            canvas : document.body,
            properties:document.body
        }, config);

    }

    /**
     * Adds a seperator to the toolbox
     *
     * @method addSeperator
     * @memberOf Toolbox
     */
    addSeperator() {
        let sep = document.createElement('div');
        sep.classList.add('seperator');
        this.config.toolbox.appendChild(sep);
    }

    /**
     * Adds a tool to the toolbox
     *
     * @param string name The name of the tool
     * @param string imgPath The path to the icon file
     * @param number type The identifier for the editor
     * @param Function onclick The onclick callback
     * @method addTool
     * @memberOf Toolbox
     */
    addTool(name,imgPath,type, onclick) {
        if(!onclick) onclick = null;
        let tool = document.createElement('div'),
            img = new Image;
        img.src = imgPath;
        img.title = name;
        tool.appendChild(img);
        tool.classList.add('tool');
        tool.dataset.type = type;
        tool.onclick = function (e) {
            if(onclick==null) {
                let tools = this.config.toolbox.querySelectorAll('.tool'),
                    i = 0;
                for(i; i < tools.length; ++i) {
                    tools[i].classList.remove('active');
                }
                e.currentTarget.classList.add('active');

                window.Editor.EditorGlobals.typeSelected = parseInt(e.currentTarget.dataset.type);
            } else {
                onclick(name, type);
            }
        }.bind(this);

        this.config.toolbox.appendChild(tool);
    }

}