module.exports = function customMappingFunction(explicit, implicit, path, reflection, context) {
    return explicit || implicit;
}
