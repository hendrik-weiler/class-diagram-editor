if(!PropertiesDefinition) var PropertiesDefinition = {};

/**
 * The definition of the text element
 *
 * @class Text
 * @namespace PropertiesDefinition
 * @type object
 */
PropertiesDefinition.Text = {
    /**
     * Returns the label of the properties object
     *
     * @var label
     * @type string
     * @memberOf Text
     */
    label : 'Text',
    /**
     * Returns the fields of the element
     *
     * @var fields
     * @type object
     * @memberOf Text
     */
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