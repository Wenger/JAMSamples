jdata{
	struct weather{
		int date;
		int highTemperature;
		int lowTemperature;
		float humidity;
		float wind;
		char* airQuality;
		char* UV;
	} MTLWeather as logger;

	stats as flow with statsFunc of MTLWeather; 
}

/* The flow comes 
 *
 */
function statsFunc(inputFlow){
	return inputFlow.discretize(1, 31);
}

stats.setTerminalFunction(function(f){

	console.log("**********************************Monthly Statistics**********************************");
	//f.shouldCache = false; // this line will make week1.count() be 0
	var month = f.selectFlatten();
	console.log("Monthly hot days:", hotDays(month).count());
	month.count();
	prettyPrint(month);
	
	console.log("**********************************Weekly Statistics***********************************");
	console.log("***************************************Week 1*****************************************");
	
	var week1 = weeklyStats(f, 1);
	f.count();

	console.log("week1 hot days:", hotDays(week1).count());
	week1.count();
	prettyPrint(week1);
	

	console.log("***************************************Week 2*****************************************");
	
	var week2 = weeklyStats(f, 2);
	f.count();

	console.log("week2 hot days:", hotDays(week2).count());
	week2.count();
	prettyPrint(week2);
	

	console.log("***************************************Week 3*****************************************");
	
	var week3 = weeklyStats(f, 3);
	f.count();

	console.log("week3 hot days:", hotDays(week3).count());
	week3.count();
	prettyPrint(week3);
	

	console.log("***************************************Week 4*****************************************");
	
	var week4 = weeklyStats(f, 4);
	f.count();

	console.log("week4 hot days:", hotDays(week4).count());
	week4.count();
	prettyPrint(week4);
	

	console.log("***************************************periodStats: Date 20-25*****************************************");
	
	var period = periodStats(f, 19, 25);
	f.count();

	console.log("Period hot days:", hotDays(period).count());
	period.count();
	prettyPrint(period);

	console.log("***************************************highTemperature: low to high*****************************************");

	f.count();
	var byHighTemp = incOrderBy(f, "highTemperature");
	prettyPrint(byHighTemp);

	console.log("***************************************humidity: high to low*****************************************");

	f.count();
	var byHumidity = decOrderBy(f, "humidity");
	prettyPrint(byHumidity);

	console.log("***************************************Collect lowTemperature: low to high*****************************************");
	
	f.count();
	var byLowTemp = incOrderByProp(f, "lowTemperature");
	console.log(byLowTemp.collect());

	console.log("***************************************Week 1 temperature in Fahrenheit*****************************************");

	week1.count();
	var week1Fahrenheit = toFahrenheit(week1);
	prettyPrint(week1Fahrenheit);
});

(function poll(){
    if( MTLWeather.size() < 1 ){
        console.log("waiting for a C-node");
        setTimeout(poll, 2000);
    }
    else
        stats.startPush();
})();

// @ args: a dicretized flow that has been flattened
function prettyPrint(flattenedFlow){
	
	var size1 = String("|  highTemperature  ").length,
		size2 = String("|  lowTemperature  ").length,
		size3 = String("|  humidity  ").length,
		size4 = String("|  wind  ").length,
		size5 = String("|  airQuality  ").length,
		size6 = String("|  UV  ").length,
		size7 = String("|  Date  |").length;

	console.log("|  Date  |  highTemperature  |  lowTemperature  |  humidity  |  wind  |  airQuality  |  UV  |");

	flattenedFlow.foreach(function(weather){
		if(weather.data != undefined || weather.data != null) weather = weather.data;
		var sizeDiff;

		var s7 = "|  "+String(weather.date);
		sizeDiff = size7-s7.length+1;
		for(var i=0;i<sizeDiff;i++){
			s7+=" ";
		}

		var s1 = "|  "+String(weather.highTemperature);
		sizeDiff = size1-s1.length+1;
		for(var i=0;i<sizeDiff;i++){
			s1+=" ";
		}
		

		var s2 = "|  "+String(weather.lowTemperature);
		sizeDiff = size2-s2.length+1;
		for(i=0;i<sizeDiff;i++){
			s2+=" ";
		}

		var s3 = "|  "+String(weather.humidity);
		sizeDiff = size3-s3.length+1;
		for(i=0;i<sizeDiff;i++){
			s3+=" ";
		}

		var s4 = "|  "+String(weather.wind);
		sizeDiff = size4-s4.length+1;
		for(i=0;i<sizeDiff;i++){
			s4+=" ";
		}

		var s5 = "|  "+String(weather.airQuality);
		sizeDiff = size5-s5.length+1;
		for(i=0;i<sizeDiff;i++){
			s5+=" ";
		}

		var s6 = "|  "+String(weather.UV);
		sizeDiff = size6-s6.length+1;
		for(i=0;i<sizeDiff;i++){
			s6+=" ";
		}
		s6+="|";

		console.log(s7+s1+s2+s3+s4+s5+s6);
	});
};

/************FUNCTIONS FOR STATISTICS*************/

// @ args: a discretized flow that has been flattened
// @ returns: a finite flattened flow containing data in flattenedFlow whose [hightTemperature] attribute >= 35
function hotDays(flattenedFlow){
	return flattenedFlow.where((entry) => entry.data.highTemperature>=35); 
};

// @ args: 
// discretizedFlow: a discretized flow that has NOT been flattened
// n: an integer indicates the index of the intended week
// @ returns: a finite flattened flow containing data from the n-th week in discretizedFlow
var weeklyStats = function(discretizedFlow, n){

    var startingDate = (n-1)*7;
	var endingDate = startingDate+7;

	return discretizedFlow.selectFlatten().range(startingDate, endingDate);
};

// @ args: 
// discretizedFlow: a discretized flow that has NOT been flattened
// startingDate: the starting date of the intended period (inclusive)
// endingDate: the ending date of the intended period (exclusive)
// @ returns: a finite flattened flow containing data from the period [startingDate, endingDate) in discretizedFlow
var periodStats = function(discretizedFlow, startingDate, endingDate){
	return discretizedFlow.selectFlatten().range(startingDate, endingDate);
};

// @ args:
// flattendFlow: a discretized flow that has been flattened
// property: a string indicating the property to order by
// @ returns: a finite flattened flow containing all data from flattenedFlow incrementally ordered by property
var incOrderBy = function(discretizedFlow, property){

	return discretizedFlow.selectFlatten().select(entry => entry.data).orderBy(function(a, b){
		if(a[property] < b[property])
			return -1;
		if(a[property] > b[property])
			return 1;
		return 0;
	});
};

// @ args:
// flattendFlow: a discretized flow that has been flattened
// property: a string indicating the property to order by
// @ returns: a finite flattened flow containing all data from flattenedFlow decrementally ordered by property
var decOrderBy = function(discretizedFlow, property){

	return discretizedFlow.selectFlatten().select(entry => entry.data).orderBy(function(a, b){
		if(a[property] < b[property])
			return 1;
		if(a[property] > b[property])
			return -1;
		return 0;
	});
};

// @ args:
// flattendFlow: a discretized flow that has been flattened
// property: a string indicating the property to order by
// @ returns: a finite flattened flow containing all data[property] from flattenedFlow that is incrementally ordered
var incOrderByProp = function(discretizedFlow, property){
	
	var propertyFlow = discretizedFlow.selectFlatten().select(entry => entry.data).select(function(weather){ 
		return weather[property];
	});

	return propertyFlow.orderBy();
};

// @ args:
// flattendFlow: a discretized flow that has been flattened
// property: a string indicating the property to order by
// @ returns: a finite flattened flow containing all data[property] from flattenedFlow that is decrementally ordered
var decOrderByProp = function(flattenedFlow, property){
	
	var propertyFlow = flattenedFlow.select(entry => entry.data).select(function(weather){ 
		return weather[property];
	});

	return propertyFlow.orderBy(function(a,b){
		if(a<b) return 1;
		if(a>b) return -1;
		return 0;
	});
};

// @ args: a discretized flow that has been flattened
// @ returns: a finite flattened flow containing all data from flattenedFlow with [highTemperature] and [lowTemperature] converted to Fahrenheit
var toFahrenheit = function(flattenedFlow){

	return flattenedFlow.select(function(entry){
		entry.data.highTemperature = entry.data.highTemperature*1.8 + 32;
		entry.data.lowTemperature = entry.data.lowTemperature*1.8 + 32;
		return entry;
	});
};

// returns a flow contains both the low and high temperature
// that is incrementally ordered
// var incOrderByTemp = function(inputFLow){

// 	return inputFLow.selectExpand(function(weather){
// 		return [weather.lowTemperature, weather.highTemperature];
// 	}).orderBy();
// };

// var max = function(inputFLow, property){
// 	var propertyFlow = inputFLow.select(function(weather){
// 		return weather[property];
// 	});

// 	return propertyFlow.max();
// };

// var min = function(inputFLow, property){
// 	var propertyFlow = inputFLow.select(function(weather){
// 		return weather[property];
// 	});

// 	return propertyFlow.min();
// };

// var average = function(inputFLow, property){
// 	var propertyFlow = inputFLow.select(function(weather){
// 		return weather[property];
// 	});

// 	return propertyFlow.average();
// };