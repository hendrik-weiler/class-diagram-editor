if(!Editor) var Editor = {};

/**
 * Returns the global variables for the editor
 *
 * @type object
 * @class EditorGlobals
 * @namespace Editor
 */
Editor.EditorGlobals = {
    /**
     * Returns the selected tool number
     *
     * @var typeSelected
     * @type number
     * @memberOf EditorGlobals
     */
    typeSelected : -1,
    /**
     * Returns the editor instance
     *
     * @var editorInstance
     * @type Editor
     * @memberOf EditorGlobals
     */
    editorInstance: null
}