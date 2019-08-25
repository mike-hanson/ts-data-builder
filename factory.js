"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var collectionBuilder_1 = require("./collectionBuilder");
var singleObjectBuilder_1 = require("./singleObjectBuilder");
var Factory = /** @class */ (function () {
    function Factory() {
    }
    Factory.prototype.createNew = function (ctor) {
        return new singleObjectBuilder_1.SingleObjectBuilder(ctor);
    };
    Factory.prototype.createListOfSize = function (size) {
        return new collectionBuilder_1.CollectionBuilder(size);
    };
    return Factory;
}());
exports.Factory = Factory;
