"use strict";
import "../../node_modules/jstodotxt/jsTodoExtensions.js";

function RecExtension() {
	this.name = "rec";
}
RecExtension.prototype = new TodoTxtExtension();
RecExtension.prototype.parsingFunction = function(line) {
	var rec = null;
	var recRegex = /rec:(\+?[0-9]*[hbdwmy])/;
	var matchRec = recRegex.exec(line);
	if ( matchRec !== null ) {
		rec = matchRec[1];
		return [rec, line.replace(recRegex, ''), matchRec[1]];
	}
	return [null, null, null];
};

function SugarDueExtension() {
	this.name = "due";
}
SugarDueExtension.prototype = new TodoTxtExtension();
SugarDueExtension.prototype.parsingFunction = function (line) {

	var relativeDateRegEx = /due:(\d+[dwm])/;
	var relativeDatMatch = relativeDateRegEx.exec(line)

	if ( relativeDatMatch !== null) {
		var dueDate = resolveRelativeDate(relativeDatMatch[1]);

		return [dueDate, line.replace(relativeDateRegEx, ''), dueDate.toISOString().split('T')[0]];
	}
	else
	{
		var dueDate = null;
		var indexDueKeyword = line.indexOf("due:");
	
		// Find keyword due
		if (indexDueKeyword >= 0) {
			var stringAfterDue = line.substr(indexDueKeyword + 4)
			var words = stringAfterDue.split(" ");
			var match = null;
	
			// Try to parse a valid date until the end of the text
			for (var i = Math.max(5, words.length); i > 0; i--) {
				match = words.slice(0, i).join(" ");
				dueDate = Sugar.Date.create(match, {future: true});
				if (Sugar.Date.isValid(dueDate)) {
					return [dueDate, line.replace("due:" + match, ''), Sugar.Date.format(dueDate, '%Y-%m-%d')];
				}
			}
		}
	}
	return [null, null, null];
};

function ThresholdExtension() {
	this.name = "t";
}
ThresholdExtension.prototype = new TodoTxtExtension();
ThresholdExtension.prototype.parsingFunction = function (line) {

	var relativeDateRegEx = /t:(\d+[dwm])/;
	var relativeDatMatch = relativeDateRegEx.exec(line)

	if ( relativeDatMatch !== null) {
		var thresholdDate = resolveRelativeDate(relativeDatMatch[1]);

		return [thresholdDate, line.replace(relativeDateRegEx, ''), thresholdDate.toISOString().split('T')[0]];
	}
	else {
		var thresholdDate = null;
		var thresholdRegex = /t:([0-9]{4}-[0-9]{1,2}-[0-9]{1,2})\s*/;
		var matchThreshold = thresholdRegex.exec(line);
		if ( matchThreshold !== null ) {
			var datePieces = matchThreshold[1].split('-');
			thresholdDate = new Date( datePieces[0], datePieces[1] - 1, datePieces[2] );
			return [thresholdDate, line.replace(thresholdRegex, ''), matchThreshold[1]];
		}
	}
	return [null, null, null];
};

function resolveRelativeDate(relativeDate) {
    var unit = relativeDate.slice(-1);
    var increment = parseInt(relativeDate.slice(0, -1));

    var date = new Date();

    if(unit === "d") {
        date.setDate(date.getDate() + increment);
    }
    else if(unit === "w") {
        date.setDate(date.getDate() + increment * 7);
    }
    else if(unit === "m") {
        date.setMonth(date.getMonth() + 1);
    }

    return date
}

export { RecExtension, SugarDueExtension, ThresholdExtension };
