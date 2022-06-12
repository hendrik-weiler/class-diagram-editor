class Toolbox {
    constructor(config) {

        this.config = Object.assign({
            editor: document.body,
            toolbox : document.body,
            canvas : document.body,
            properties:document.body
        }, config);

    }

    addSeperator() {
        let sep = document.createElement('div');
        sep.classList.add('seperator');
        this.config.toolbox.appendChild(sep);
    }

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

                EditorGlobals.typeSelected = parseInt(e.currentTarget.dataset.type);
            } else {
                onclick(name, type);
            }
        }.bind(this);

        this.config.toolbox.appendChild(tool);
    }

}