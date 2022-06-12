if(!window.PropertiesDefinition) window.PropertiesDefinition = {};

PropertiesDefinition.Class = {
    label : 'Class',
    fields : {
        name : {
            type : 'text',
            label : 'Name of the class'
        },
        inherit : {
            type : 'text',
            label : 'Inherits class'
        },
        description : {
            type : 'textarea',
            label : 'Description'
        },
        properties : {
            type : 'list',
            fields : [
                {
                    label : 'Name',
                    type: 'text',
                    name : 'name'
                },
                {
                    label : 'Visibility',
                    type : 'select',
                    defaultValue : 'public',
                    choices : ['private','protected','public'],
                    name : 'visibility'
                },
                {
                    label : 'Description',
                    type : 'textarea',
                    name : 'description'
                }
            ],
            label : 'Properties'
        },
        methods : {
            type : 'list',
            fields : [
                {
                    label : 'Name',
                    type: 'text',
                    name : 'name'
                },
                {
                    label : 'Parameters',
                    type: 'textarea',
                    name : 'name'
                },
                {
                    label : 'Visibility',
                    type : 'select',
                    defaultValue : 'public',
                    choices : ['private','protected','public'],
                    name : 'visibility'
                },
                {
                    label : 'Description',
                    type : 'textarea',
                    name : 'description'
                }
            ],
            label : 'Methods'
        }
    }
}