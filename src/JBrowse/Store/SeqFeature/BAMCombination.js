define([
		'dojo/_base/declare',
		'JBrowse/Store/SeqFeature/CombinationBase'
		],

		function(
			declare,
			CombinationBaseStore
		) {

	return declare([CombinationBaseStore], {

		// An implementation of the CombinationBaseStore which works with BAM features.  Currently, the only supported option is
		// a straight concatenation of the features of two stores. 

		// This combination store doesn't need to convert between spans and features, so these two functions are essentially irrelevant.
		createFeatures: function(spans) {
			return spans;
		},
		
		toSpan: function(features, query) {
			return features;
		},
		
		// Only one supported operation - array concatenation
		opSpan: function(op, span1, span2, query) {
			if(op == "U") { 
				return span1.concat(span2); 
			}
			console.error("invalid operation");
			return undefined;
		},
		
		// only sets the featureDensity of the resulting feature set.
		_setGlobalStats: function() {
			this.globalStats.featureDensity = this._treeFeatureDensity(this.opTree);
			this._deferred.stats.resolve(true);
		},

		// Traverses the opTree adding featureDensities to obtain a final featureDensity.
		_treeFeatureDensity: function(opTree) {
			if(opTree.isLeaf()) {
				return opTree.get().globalStats.featureDensity;
			}
			return (opTree.leftChild ? this._treeFeatureDensity(opTree.leftChild) : 0)
			+ (opTree.rightChild ? this._treeFeatureDensity(opTree.rightChild) : 0);
		}

	});


});