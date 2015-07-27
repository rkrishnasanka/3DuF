var appRoot = "../../app/";
var should = require("should");
var Parameters = require(appRoot + "core/parameters");
var Parameter = require(appRoot + "core/parameter");
var Features = require(appRoot + "core/features");
var Params = require(appRoot + "core/params");

var Channel = Features.Channel;

var FloatValue = Parameters.FloatValue;
var IntegerValue = Parameters.IntegerValue;
var PointValue = Parameters.PointValue;
var BooleanValue = Parameters.BooleanValue;
var StringValue = Parameters.StringValue;

var values;
var unique;
var heritable;

function initValues(){
	values = {
		"flo": 12.3,
		"int": 13,
		"poi": [0,0],
		"boo": true,
		"str": "foobar"
	};
	unique = {
		"flo": FloatValue.typeString(),
		"int": IntegerValue.typeString()
	};
	heritable = {
		"poi": PointValue.typeString(),
		"boo": BooleanValue.typeString(),
		"str": StringValue.typeString()
	};
}

describe("Params", function() {
	describe("#getParameter", function(){
		beforeEach(function(){
			initValues();
		});
		it("should return the correct parameter when given a valid key", function(){
			let params = new Params(values, unique, heritable);
			let p = params.getParameter("boo");
			(p instanceof Parameter).should.equal(true);
			p.value.should.equal(true);
			p.type.should.equal(BooleanValue.typeString());
		});
		it("should throw an error for an invalid key", function(){
			let params = new Params(values, unique, heritable);
			(function(){let p = params.getParameter("invalidKey")}).should.throwError();
		});
	});
	describe("#init", function(){
		beforeEach(function(){
			initValues();
		});
		it("can be initialized with known-good values and types", function(){
			let params = new Params(values, unique, heritable);
			params.getValue("flo").should.be.approximately(12.3, .0001);
			params.getValue("str").should.equal("foobar");
			params.getParameter("boo").type.should.equal(BooleanValue.typeString());
		});
		it("cannot be initialized if unique values are missing", function(){
			delete values["flo"];
			(function(){
				let params = new Params(values, unique, heritable);
			}).should.throwError();
		});
		it("cannot be initialized if a value is of the wrong type", function(){
			values["flo"] = [0,0];
			(function(){
				let params = new Params(values, unique, heritable);
			}).should.throwError();
			values["flo"] = 12.3;
			values["boo"] = 24;
			(function(){
				let params = new Params(values, unique, heritable);
			}).should.throwError();
		});
	});
    describe("#toJSON", function() {
    	beforeEach(function(){
			initValues();
		});
        it("can produce JSON without errors", function(){
        	let params = new Params(values, unique, heritable);
        	let json = params.toJSON();
        	json["flo"].should.be.approximately(12.3, .0001);
        	json["str"].should.equal("foobar");
        });
    });
    
    describe("#fromJSON", function() {
    	beforeEach(function(){
			initValues();
		});
		
        it("should convert valid JSON to a Params object of the correct type", function(){
        	let json = values; // they happen to be the same structure!
        	let params = Params.fromJSON(json, unique, heritable);
        	params.getValue("boo").should.equal(true);
        	params.getParameter("str").type.should.equal(StringValue.typeString());
        });
       
        it("should not allow fromJSON to be called without unique and heritable types", function(){
			(function(){
				let params = new Params(values, unique);
			}).should.throwError();
			(function(){
				let params = new Params(values, heritable);
			}).should.throwError();
			(function(){
				let params = new Params(values);
			}).should.throwError();
        });
        
        it("should be able to re-create a Params object from the output of toJSON", function(){
        	let params = new Params(values, unique, heritable);
        	let json = params.toJSON();
        	let newParams = Params.fromJSON(json, unique, heritable);
        	newParams.getValue("boo").should.equal(true);
        	newParams.getParameter("str").type.should.equal(StringValue.typeString());
        });
    });
});



