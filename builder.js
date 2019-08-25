"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var memberType_1 = require("./memberType");
var Builder = /** @class */ (function () {
    function Builder() {
        this.template = {};
    }
    Builder.prototype.with = function (name, typeOrGenerator) {
        if (typeof name !== 'string') {
            throw new Error('"with" requires a valid name for the member.');
        }
        if (typeof typeOrGenerator === 'undefined') {
            throw new Error('"with" requires one of the MemberType enum values or a generator function as the second argument.');
        }
        return this.internalWith(name, typeOrGenerator);
    };
    Builder.prototype.objectFromTemplate = function (template, sequenceNo) {
        var result = {};
        for (var name in template) {
            if (template.hasOwnProperty(name)) {
                var element = template[name];
                result[name] = this.getValue(name, template[name], sequenceNo);
            }
        }
        return result;
    };
    Builder.prototype.getValue = function (name, typeOrGenerator, item) {
        if (typeof typeOrGenerator === 'function') {
            return typeOrGenerator(item);
        }
        if (typeOrGenerator === memberType_1.MemberType.Number) {
            return item;
        }
        if (typeOrGenerator === memberType_1.MemberType.String) {
            return name + ' ' + item.toString();
        }
        return new Date();
    };
    return Builder;
}());
exports.Builder = Builder;
