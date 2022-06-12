if(!window.PropertiesDefinition) window.PropertiesDefinition = {};

PropertiesDefinition.Text = {
    label : 'Text',
    fields : {
        text : {
            type : 'textarea',
            label : 'Text'
        },
        size : {
            type : 'select',
            label : 'Font size',
            choices : [12,14,16,20,24,28,32,36,54,72]
        }
    }
}