"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var builder_1 = require("./builder");
var CollectionBuilder = /** @class */ (function (_super) {
    __extends(CollectionBuilder, _super);
    function CollectionBuilder(count) {
        var _this = _super.call(this) || this;
        _this.count = count;
        _this.nextBuilderSpecs = [];
        _this.allBuilderSpec = _this.createBuilderSpec(0);
        _this.currentBuilderSpec = _this.allBuilderSpec;
        return _this;
    }
    CollectionBuilder.prototype.fromTemplate = function (template) {
        this.template = template;
        this.allBuilderSpec.template = template;
        return this;
    };
    CollectionBuilder.prototype.build = function () {
        var size = this.size;
        var remainderBounds = [0, size];
        var result = [];
        if (this.firstBuilderSpec) {
            for (var i = 0; i < this.firstBuilderSpec.size; i++) {
                result[i] = this.objectFromTemplate(this.firstBuilderSpec.template, i + 1);
            }
            remainderBounds[0] = this.firstBuilderSpec.size;
        }
        if (this.nextBuilderSpecs.length) {
            var start = this.firstBuilderSpec.size;
            var end = 0;
            for (var _i = 0, _a = this.nextBuilderSpecs; _i < _a.length; _i++) {
                var spec = _a[_i];
                end = start + spec.size;
                for (var k = start; k < end; k++) {
                    result[k] = this.objectFromTemplate(spec.template, k + 1);
                }
                start = end;
            }
            remainderBounds[0] = end;
        }
        if (this.lastBuilderSpec) {
            var start = size - this.lastBuilderSpec.size;
            var end = size;
            for (var l = start; l < end; l++) {
                result[l] = this.objectFromTemplate(this.lastBuilderSpec.template, l + 1);
            }
            remainderBounds[1] = start;
        }
        for (var n = remainderBounds[0]; n < remainderBounds[1]; n++) {
            result[n] = this.objectFromTemplate(this.allBuilderSpec.template, n + 1);
        }
        return result;
    };
    Object.defineProperty(CollectionBuilder.prototype, "size", {
        get: function () {
            return this.count;
        },
        enumerable: true,
        configurable: true
    });
    CollectionBuilder.prototype.theFirst = function (num) {
        if (num === void 0) { num = 1; }
        this.firstBuilderSpec = this.createBuilderSpec(num);
        this.currentBuilderSpec = this.firstBuilderSpec;
        return this;
    };
    CollectionBuilder.prototype.theNext = function (num) {
        if (num === void 0) { num = 1; }
        this.throwIfFirstNotInitialised();
        this.throwIfLastInitialised();
        this.throwIfNextExceedsSize(num);
        var nextBuilderSpec = this.createBuilderSpec(num);
        this.nextBuilderSpecs.push(nextBuilderSpec);
        this.currentBuilderSpec = nextBuilderSpec;
        return this;
    };
    CollectionBuilder.prototype.theLast = function (num) {
        if (num === void 0) { num = 1; }
        this.throwIfLastExceedsSize(num);
        this.lastBuilderSpec = this.createBuilderSpec(num);
        this.currentBuilderSpec = this.lastBuilderSpec;
        return this;
    };
    CollectionBuilder.prototype.internalWith = function (name, typeOrGenerator) {
        this.currentBuilderSpec.template[name] = typeOrGenerator;
        return this;
    };
    CollectionBuilder.prototype.copyTemplate = function () {
        var copy = {};
        for (var name in this.template) {
            if (this.template.hasOwnProperty(name)) {
                copy[name] = this.template[name];
            }
        }
        return copy;
    };
    CollectionBuilder.prototype.createBuilderSpec = function (size) {
        return { size: size, template: this.copyTemplate() };
    };
    CollectionBuilder.prototype.firstBuilderSize = function () {
        if (!this.firstBuilderSpec) {
            return 0;
        }
        return this.firstBuilderSpec.size;
    };
    CollectionBuilder.prototype.sumOfNextBuilderSizes = function () {
        var sum = 0;
        for (var _i = 0, _a = this.nextBuilderSpecs; _i < _a.length; _i++) {
            var spec = _a[_i];
            sum += spec.size;
        }
        return sum;
    };
    CollectionBuilder.prototype.throwIfFirstNotInitialised = function () {
        if (!this.firstBuilderSpec) {
            throw new Error('A call to "theNext" must follow a call to "theFirst".');
        }
    };
    CollectionBuilder.prototype.throwIfLastInitialised = function () {
        if (this.lastBuilderSpec) {
            throw new Error('"theNext" cannot be used once "theLast" has been used.');
        }
    };
    CollectionBuilder.prototype.throwIfNextExceedsSize = function (n) {
        if (this.firstBuilderSize() + this.sumOfNextBuilderSizes() + n > this.size) {
            throw new Error('Cannot exceed bounds of original builder with "theNext".');
        }
    };
    CollectionBuilder.prototype.throwIfLastExceedsSize = function (n) {
        if (this.firstBuilderSize() + this.sumOfNextBuilderSizes() + n > this.size) {
            throw new Error('Cannot exceed bounds of original builder with "theLast".');
        }
    };
    return CollectionBuilder;
}(builder_1.Builder));
exports.CollectionBuilder = CollectionBuilder;
