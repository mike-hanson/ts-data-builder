"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SingleObjectBuilder = /** @class */ (function () {
    // tslint:disable-next-line: callable-types
    function SingleObjectBuilder(ctor) {
        this.ctor = ctor;
        this.settters = [];
    }
    SingleObjectBuilder.prototype.build = function () {
        var result = new this.ctor();
        for (var _i = 0, _a = this.settters; _i < _a.length; _i++) {
            var setter = _a[_i];
            setter(result);
        }
        return result;
    };
    SingleObjectBuilder.prototype.with = function (setter) {
        this.settters.push(setter);
        return this;
    };
    return SingleObjectBuilder;
}());
exports.SingleObjectBuilder = SingleObjectBuilder;
