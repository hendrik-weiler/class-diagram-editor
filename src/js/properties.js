if(!Editor) var Editor = {};

/**
 * Handles the properties panel
 *
 * @author Hendrik Weiler
 * @class Properties
 * @namespace Editor
 */
Editor.Properties = class {

    /**
     * The constructor
     *
     * @memberOf Properties
     * @method constructor
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
     * Create a textarea property
     *
     * @param CanvasObject field The field
     * @param object fieldDef The field definition object
     * @param string name The field name
     * @param HTMLElement fieldsNode The container for properties
     * @memberOf Properties
     * @method insertTextareaProperty
     */
    insertTextareaProperty(field, fieldDef, name, fieldsNode) {
        let container = document.createElement('div'),
            label = document.createElement('label'),
            input = document.createElement('textarea');

        container.appendChild(label);
        container.appendChild(input);

        label.innerHTML = fieldDef.label;
        input.oninput = function (e) {
            field.data[name] = e.currentTarget.value;
            this.updateCanvas(field);
        }.bind(this);
        input.value = field.data[name];

        fieldsNode.appendChild(container);
    }

    /**
     * Create a text property
     *
     * @param CanvasObject field The field
     * @param object fieldDef The field definition object
     * @param string name The field name
     * @param HTMLElement fieldsNode The container for properties
     * @memberOf Properties
     * @method insertTextProperty
     */
    insertTextProperty(field, fieldDef, name, fieldsNode) {
        let container = document.createElement('div'),
            label = document.createElement('label'),
            input = document.createElement('input');

        input.type = 'text';

        container.appendChild(label);
        container.appendChild(input);

        label.innerHTML = fieldDef.label;
        input.oninput = function (e) {
            field.data[name] = e.currentTarget.value;
            this.updateCanvas(field);
        }.bind(this);
        input.value = field.data[name];

        fieldsNode.appendChild(container);
    }

    /**
     * Create a select property
     *
     * @param CanvasObject field The field
     * @param object fieldDef The field definition object
     * @param string name The field name
     * @param HTMLElement fieldsNode The container for properties
     * @memberOf Properties
     * @method insertSelectProperty
     */
    insertSelectProperty(field, fieldDef, name, fieldsNode) {
        let container = document.createElement('div'),
            label = document.createElement('label'),
            input = document.createElement('select');

        container.appendChild(label);
        container.appendChild(input);

        let j = 0,
            choice,
            value;

        for(j; j < fieldDef.choices.length; ++j) {
            value = fieldDef.choices[j];
            choice = document.createElement('option');
            choice.value = value;
            choice.innerHTML = value;
            input.appendChild(choice);
        }

        label.innerHTML = fieldDef.label;
        input.oninput = function (e) {
            field.data[name] = e.currentTarget.value;
            this.updateCanvas(field);
        }.bind(this);
        input.value = field.data[name];

        fieldsNode.appendChild(container);
    }

    /**
     * Updates the canvas
     *
     * @param CanvasObject field The field instance
     * @memberOf Properties
     * @method updateCanvas
     */
    updateCanvas(field) {
        field.update();
        this.config.editorInstance.canvas.updateRelations();
    }

    /**
     * Updates the value of a field property of a list property (panel)
     *
     * @memberOf Properties
     * @method updateListData
     * @param CanvasObjebct field The canvas element instance
     * @param string property The property name of the element
     * @param string listProperty The list property name
     * @param string value The value to set
     * @param number index The list properties index number
     */
    updateListData(field, property, listProperty, value, index) {
        if(typeof field.data[property] != "undefined") {
            if(typeof field.data[property][index] != "undefined") {
                if(typeof field.data[property][index][listProperty] != "undefined") {
                    field.data[property][index][listProperty] = value;
                    this.updateCanvas(field);
                } else {
                    console.log('ListProperty "' + listProperty + '" not found from index "' + index + '" in property "' + property + '".');
                }
            } else {
                console.log('Index not found "' + index + '" from property "' + property + '".');
            }
        } else {
            console.log('Field property "' + property + '" not found.');
        }
    }

    /**
     * Generates a list entry and returns its data object for the list
     *
     * @param listContainer The list container node
     * @param field The field instance
     * @param fields The fields definition
     * @param name The property name
     * @returns object
     * @memberOf Properties
     * @method generateListEntry
     */
    generateListEntry(listContainer, field, fields, name) {
        let container = document.createElement('div'),
            entries = listContainer.querySelectorAll('.entry'),
            index = entries.length,
            removeBtn = document.createElement('a'),
            i = 0,
            fieldDescription,
            obj = {};

        removeBtn.dataset.index = index;
        removeBtn.innerHTML = 'Delete';
        removeBtn.href = '#';
        removeBtn.onclick = function (e) {
            e.preventDefault();
            let entry = listContainer.querySelector('.entry[data-index="' + e.currentTarget.dataset.index + '"]'),
                entries,
                i = 0,
                j,
                newDataList = [],
                newIndex,
                elms,
                listEntry;
            entry.remove();
            entries = listContainer.querySelectorAll('.entry');
            for(i; i < field.data[name].length; ++i) {
                listEntry = field.data[name][i];
                if(i != index) {
                    newIndex = newDataList.length;
                    newDataList.push(listEntry);
                    elms = entries[newIndex].querySelectorAll('[data-index]');
                    for(j=0; j < elms.length; ++j) {
                        elms[j].dataset.index = newIndex;
                    }
                }
            }

            field.data[name] = newDataList;
            this.updateCanvas(field);
        }.bind(this);

        container.appendChild(removeBtn);

        container.classList.add('entry');
        container.dataset.index = index;
        for(i; i < fields.length; ++i) {
            fieldDescription = fields[i];
            let fieldContainer = document.createElement('div'),
                label = document.createElement('label'),
                input;
            container.classList.add('field');
            obj[fieldDescription.name] = '';
            label.innerHTML = fieldDescription.label;
            if(fieldDescription.type == 'text') {
                input = document.createElement('input');
                input.dataset.index = index;
                input.dataset.name = fieldDescription.name;
                input.type = 'text';
                input.oninput = function (e) {
                    this.updateListData(
                        field,
                        name,
                        e.currentTarget.dataset.name,
                        e.currentTarget.value,
                        e.currentTarget.dataset.index
                    );
                }.bind(this);

                fieldContainer.appendChild(label);
                fieldContainer.appendChild(input);
            }
            if(fieldDescription.type == 'textarea') {
                input = document.createElement('textarea');
                input.dataset.index = index;
                input.dataset.name = fieldDescription.name;
                input.oninput = function (e) {
                    this.updateListData(
                        field,
                        name,
                        e.currentTarget.dataset.name,
                        e.currentTarget.value,
                        e.currentTarget.dataset.index
                    );
                }.bind(this);

                fieldContainer.appendChild(label);
                fieldContainer.appendChild(input);
            }
            if(fieldDescription.type == 'select') {
                input = document.createElement('select');
                input.dataset.index = index;
                input.dataset.name = fieldDescription.name;
                input.oninput = function (e) {
                    this.updateListData(
                        field,
                        name,
                        e.currentTarget.dataset.name,
                        e.currentTarget.value,
                        e.currentTarget.dataset.index
                    );
                }.bind(this);

                let j = 0,
                    choice,
                    value;

                for(j; j < fieldDescription.choices.length; ++j) {
                    value = fieldDescription.choices[j];
                    choice = document.createElement('option');
                    choice.value = value;
                    choice.innerHTML = value;
                    input.appendChild(choice);
                }

                input.value = fieldDescription.defaultValue;
                obj[fieldDescription.name] = input.value;

                fieldContainer.appendChild(label);
                fieldContainer.appendChild(input);
            }
            container.appendChild(fieldContainer);
        }
        listContainer.appendChild(container);

        return obj;
    }

    /**
     * Fills the inputs of a list property entry
     *
     * @memberOf Properties
     * @method fillListEntry
     * @param HTMLElement listContainer The list property container node
     * @param number index The list property index number
     * @param array fields A list of fields definitions
     * @param object listData The field instances data property
     */
    fillListEntry(listContainer, index, fields, listData) {
        let obj = listData[index],
            i = 0,
            fieldDefinition,
            entryContainer = listContainer.querySelector('.entry[data-index="' + index + '"]'),
            input;
        for(i; i < fields.length; ++i) {
            fieldDefinition = fields[i];
            if(fieldDefinition.type == 'text') {
                input = entryContainer.querySelector('input');
                input.value = obj[fieldDefinition.name];
            }
            if(fieldDefinition.type == 'textarea') {
                input = entryContainer.querySelector('textarea');
                input.value = obj[fieldDefinition.name];
            }
            if(fieldDefinition.type == 'select') {
                input = entryContainer.querySelector('select');
                input.value = obj[fieldDefinition.name];
            }
        }
    }

    /**
     * Create a list property
     *
     * @param CanvasObject field The field
     * @param object fieldDef The field definition object
     * @param string name The field name
     * @param HTMLElement fieldsNode The container for properties
     * @memberOf Properties
     * @method insertListProperty
     */
    insertListProperty(field, fieldDef, name, fieldsNode) {
        let container = document.createElement('div'),
            label = document.createElement('label'),
            listContainer = document.createElement('div'),
            addEntryBtn = document.createElement('button'),
            i = 0,
            obj;

        listContainer.classList.add('list');
        addEntryBtn.innerHTML = 'Add entry';
        addEntryBtn.onclick = function () {
            obj = this.generateListEntry(listContainer, field, fieldDef.fields, name);
            field.data[name].push(obj);
        }.bind(this);

        container.appendChild(label);
        container.appendChild(listContainer);
        container.appendChild(addEntryBtn);

        label.innerHTML = fieldDef.label;
        for(i; i < field.data[name].length; ++i) {
            this.generateListEntry(listContainer, field, fieldDef.fields, name);
            this.fillListEntry(listContainer, i, fieldDef.fields, field.data[name]);
        }

        fieldsNode.appendChild(container);
    }

    /**
     * Shows the deselect screen
     *
     * @memberOf Properties
     * @method showDeselect
     */
    showDeselect() {
        this.config.properties.innerHTML = `
            <p>Please select an object to edit</p>
        `;
    }

    /**
     * Shows the properties of a field
     *
     * @memberOf Properties
     * @method showProperties
     * @param CanvasObject field The canvas element instance
     */
    showProperties(field) {
        let definition = PropertiesDefinition[field.type],
            markup = `
                <h2></h2>
                <div class="fields"></div>
            `,
            label,
            fields,
            name,
            fieldDef;

        this.config.properties.innerHTML = markup;

        label = this.config.properties.querySelector('h2');
        fields = this.config.properties.querySelector('.fields');

        label.innerHTML = definition.label;

        for (name in definition.fields) {
            fieldDef  = definition.fields[name];
            if(fieldDef.type == 'text') {
                this.insertTextProperty(field, fieldDef, name, fields);
            }
            if(fieldDef.type == 'textarea') {
                this.insertTextareaProperty(field, fieldDef, name, fields);
            }
            if(fieldDef.type == 'list') {
                this.insertListProperty(field, fieldDef, name, fields);
            }
            if(fieldDef.type == 'select') {
                this.insertSelectProperty(field, fieldDef, name, fields);
            }
        }
    }
}