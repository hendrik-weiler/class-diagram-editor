if(!Editor) var Editor = {};

/**
 * The main editor class
 *
 * @author Hendrik Weiler
 * @namespace Editor
 * @class Editor
 */
Editor.Editor = class {

    /**
     * The constructor
     *
     * @param object config The configuration object
     * @memberOf Editor
     * @constructor
     * @method constructor
     */
    constructor(config) {

        /**
         * Returns the configuration object
         *
         * @var config
         * @type object
         * @memberOf Editor
         */
        this.config = Object.assign({
            editorInstance : this,
            editor : document.body,
            toolbox : document.body,
            canvas : document.body,
            properties:document.body
        }, config);

        /**
         * Returns the properties instance
         *
         * @var properties
         * @type Properties
         * @memberOf Editor
         */
        this.properties = new Editor.Properties(this.config);

        /**
         * Returns the toolbox instance
         *
         * @var toolbox
         * @type Toolbox
         * @memberOf Editor
         */
        this.toolbox = new Editor.Toolbox(this.config);

        /**
         * Returns the canvas instance
         *
         * @var canvas
         * @type Canvas
         * @memberOf Editor
         */
        this.canvas = new Editor.Canvas(this.config);

        let propertiesRect = this.config.properties.getBoundingClientRect(),
            toolboxRect = this.config.toolbox.getBoundingClientRect();
        this.config.canvas.style.width = window.innerWidth - propertiesRect.width - toolboxRect.width + 'px';
    }

    /**
     * Exports the diagram to a svg
     *
     * @method exportSVG
     * @memberOf Editor
     */
    async exportSVG() {
        let link = document.createElement('a'),
            svgClone = this.canvas.svg.cloneNode(true),
            style = document.createElement('style'),
            svgString,
            exportCSS = await fetch('css/export.css'),
            exportCSSContent = await exportCSS.text(),
            selector = svgClone.querySelector('.selector'),
            lineSelector = svgClone.querySelector('.lineSelector'),
            zoom = svgClone.querySelector('.zoom');
        zoom.setAttributeNS(null,'transform','scale(1)');
        selector.remove();
        lineSelector.remove();
        style.innerHTML = exportCSSContent;
        svgClone.appendChild(style);
        svgString = new XMLSerializer().serializeToString(svgClone);
        link.download = 'export.svg';
        link.href = 'data:image/svg+xml;base64,' + btoa(svgString);
        link.click();
    }

    /**
     * Exports the diagram to a javascript file
     *
     * @method exportAsJS
     * @memberOf Editor
     */
    exportAsJS() {
        let link = document.createElement('a'),
            fields = this.canvas.canvasObjects.querySelectorAll('.field'),
            i = 0,
            j,
            field,
            fieldData,
            property,
            classDef,
            method,
            descriptionSplit,
            jsData = [];
        for(i; i < fields.length; ++i) {
            field = fields[i].__instance__;
            if(field instanceof Editor.Class) {
                fieldData = field.data;
                if(fieldData.description.length > 0) {
                    jsData.push('/**');
                    descriptionSplit = fieldData.description.split("\n");
                    for(j=0; j < descriptionSplit.length; ++j) {
                        jsData.push('* ' + descriptionSplit[j]);
                    }
                    jsData.push('*/');
                }
                classDef = 'class ' + fieldData.name.replaceAll(' ','_');
                if(fieldData.inherit.length > 0) {
                    classDef += ' extends ' + fieldData.inherit.replaceAll(' ','_');
                }
                classDef += ' {';
                jsData.push(classDef);
                jsData.push('');
                for(j=0; j < fieldData.properties.length; ++j) {
                    property = fieldData.properties[j];
                    if(property.description.length > 0) {
                        jsData.push('\t/**');
                        descriptionSplit = property.description.split("\n");
                        for(j=0; j < descriptionSplit.length; ++j) {
                            jsData.push('\t* ' + descriptionSplit[j]);
                        }
                        jsData.push('\t*/');
                    }
                    if(property.visibility == 'private') {
                        jsData.push("\t#" + property.name.replaceAll(' ','_') + ' = "";');
                    } else {
                        jsData.push("\t" + property.name.replaceAll(' ','_') + ' = "";');
                    }
                    jsData.push('');
                }
                jsData.push('');
                for(j=0; j < fieldData.methods.length; ++j) {
                    method = fieldData.methods[j];
                    if(method.description.length > 0) {
                        jsData.push('\t/**');
                        descriptionSplit = method.description.split("\n");
                        for(j=0; j < descriptionSplit.length; ++j) {
                            jsData.push('\t* ' + descriptionSplit[j]);
                        }
                        jsData.push('\t*/');
                    }
                    jsData.push("\t" + method.name.replaceAll(' ','_') + '() {');
                    jsData.push('\t\t');
                    jsData.push('\t}');
                    jsData.push('');
                }
                jsData.push('');
                jsData.push('}');
                jsData.push('');
            }
        }
        link.download = 'export.js';
        link.href = 'data:application/javascript;base64,' + btoa(jsData.join("\n"));
        link.click();
    }

    /**
     * Builds the user interface
     *
     * @memberOf Editor
     * @method buildUI
     */
    buildUI() {
        this.toolbox.addTool("Selection","img/cursor.svg",0);

        this.toolbox.addTool("Class","img/class.svg",1);

        this.toolbox.addTool("Relation","img/relation.svg",2);

        this.toolbox.addTool("Text","img/text.svg",3);

        this.toolbox.addSeperator();

        this.toolbox.addTool("Export as SVG","img/export-svg.svg",40, function (name,type) {
            this.exportSVG();
        }.bind(this));

        this.toolbox.addTool("Export as JavaScript","img/export-js.svg",41, function (name,type) {
            this.exportAsJS();
        }.bind(this));

        this.toolbox.addSeperator();

        this.toolbox.addTool("Zoom in","img/zoom-in.svg",42, function (name,type) {
            this.canvas.zoomIn();
        }.bind(this));

        this.toolbox.addTool("Zoom out","img/zoom-out.svg",43, function (name,type) {
            this.canvas.zoomOut();
        }.bind(this));
    }

    /**
     * Renders the editor
     *
     * @memberOf Editor
     * @method render
     */
    render() {
        this.buildUI();
        this.canvas.init();
        this.properties.showDeselect();
    }
}