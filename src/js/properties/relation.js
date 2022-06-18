if(!PropertiesDefinition) var PropertiesDefinition = {};

/**
 * The definition of the relation element
 *
 * @class Relation
 * @namespace PropertiesDefinition
 * @type object
 */
PropertiesDefinition.Relation = {
    /**
     * Returns the label of the properties object
     *
     * @var label
     * @type string
     * @memberOf Relation
     */
    label : 'Relation',
    /**
     * Returns the fields of the element
     *
     * @var fields
     * @type object
     * @memberOf Relation
     */
    fields : {
        label : {
            type : 'text',
            label : 'Label'
        }
    }
}