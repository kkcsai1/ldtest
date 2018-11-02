'use strict';
/*
    List of all constants that are used in the app
*/

//LIVE
myApp.constant('AppConstants', {

	AZURE_CODE_ENABLE: true,
	CONSOLE_LOG_DEBUG: true,
	PPEDD_PEAR_GROUP_ENABLE: true,
	PEER_GROUP_SECURITY: true,
	PPEDD_MBM_DISABLE_FOR_COUNSELEE: false,
	NONPPEDD_TOP_ENGAGEMENT_DISABLE_FOR_COUNSELEE: false,
	JAVA_LAYER_ENABLED: true,
	JAVA_SERVICE_CALL: "/eygjava/gs",
	ODATA_VERSION: "odata/v2",
	//update start the below for Dev- RR -TODO
	// Uncomment below for Dev 
	/**
	METRICS_URL_AZURE: 'https://edwwebsvcs-dev.azurewebsites.net/Finance/GetLeadMetrics/ALL',
	TOP_ENGAGEMENTS_URL_AZURE: 'https://edwwebsvcs-dev.azurewebsites.net/Engagement/GetTopEngagements',
	PEER_AVERAGE: 'https://acemnuimtweb021.azurewebsites.net/Talent/GetPeerGroupAverage',
	AZURE_INSTANCE: 'https://login.microsoftonline.com/',
	AZURE_TENANT: '4667418b-7015-4ceb-b207-2193896769a8',
	AZURE_CLIENTID: '24605fd2-9bcf-4d8c-a24a-0da43231b143',
	TOP_ENGAGEMENT_HOURS_ROWS: 15,
	**/
	//*/
	//update end the below for UAT- RR- TODO

	//update start the below for UAT- RR -TODO
	//Uncomment below for UAT 
	/**
	METRICS_URL_AZURE: 'https://edwwebsvcs-uat.ey.com/Finance/GetLeadMetrics/ALL',
	TOP_ENGAGEMENTS_URL_AZURE: 'https://edwwebsvcs-uat.ey.com/Engagement/GetTopEngagements',
	PEER_AVERAGE: 'https://edwwebsvcs-uat.ey.com/Talent/GetPeerGroupAverage',
	AZURE_INSTANCE: 'https://login.microsoftonline.com/',
	AZURE_TENANT: 'eygs.onmicrosoft.com',
	AZURE_CLIENTID: 'b9d0c461-dfae-47f4-8f78-4dfdce54ae54',
	TOP_ENGAGEMENT_HOURS_ROWS: 15,
	**/
	//update end the below for UAT- RR- TODO

	//update start the below for Prod- RR -TODO
	/** Uncomment below for Prod	**/

	 METRICS_URL_AZURE : 'https://edwwebsvcs.ey.com/Finance/GetLeadMetrics/ALL',
	 TOP_ENGAGEMENTS_URL_AZURE: 'https://edwwebsvcs.ey.com/Engagement/GetTopEngagements',
	 AZURE_INSTANCE: 'https://login.microsoftonline.com/', 
	 AZURE_TENANT: '5b973f99-77df-4beb-b27d-aa0c70b8482c',
	 AZURE_CLIENTID: 'f05e766e-af3f-4a1a-b021-11c9ba9376ea',
	 PEER_AVERAGE: 'https://edwwebsvcs.ey.com/Talent/GetPeerGroupAverage',
	 TOP_ENGAGEMENT_HOURS_ROWS: 15,
	//update end the below for Prod- RR- TODO

	//OTHER
	HTTP_CONFIG: {
		withCredentials: true
	},

	//BREAK POINT WIDTH
	BREAK_POINT_WIDTH: 768,

	// Auto Save Time in milli seconds
	AUTO_SAVE_TIME: 600000,

	// String Length Restrictions
	GOALS_FOCUSAREA_TEXT_LENGTH: 150,
	GOALS_FOCUSAREA_COUNT: 10,
	GOALS_FOCUSAREA_ADDITIONAL_COUNT: 15,

	// String values for comparison or statuses
	FEEDBACK: "feedback",
	SELFASSESSMENT: "selfassmt",

	// FeedbackSubmissionTypes
	// Indicates feedback save/submit
	FBSAVE: "fbsave",
	FBSUBMIT: "fbsubmit",
	// Indicates sessment save/submit
	SELFSAVE: "selfsave",
	SELFSUBMIT: "selfsubmit",

	// CYCLE1_START_DATE: '2017-11-27T00:00:00.000',
	// CYCLE1_END_DATE: '2017-12-10T23:59:59.000',
	// CYCLE2_START_DATE: '2017-12-11T00:00:00.000',
	// CYCLE2_END_DATE: '2017-12-15T23:59:59.000',
	// CYCLE3_START_DATE: '2017-12-16T00:00:00.000',
	// CYCLE3_END_DATE: '2017-12-18T23:59:59.000',

	// CYCLE1_START_DATE: '2017-10-01T00:00:00.000',
	// CYCLE1_END_DATE: '2017-12-31T23:59:59.000',
	// CYCLE2_START_DATE: '2018-01-03T00:00:00.000',
	// CYCLE2_END_DATE: '2018-03-31T23:59:59.000',
	// CYCLE3_START_DATE: '2018-04-02T00:00:00.000',
	// CYCLE3_END_DATE: '2018-06-30T23:59:59.000',
	CYCLE1_START_DATE: '-10-01T00:00:00.000',
	CYCLE1_END_DATE: '-12-31T23:59:59.000',
	CYCLE2_START_DATE: '-01-03T00:00:00.000',
	CYCLE2_END_DATE: '-03-31T23:59:59.000',
	CYCLE3_START_DATE: '-04-02T00:00:00.000',
	CYCLE3_END_DATE: '-06-30T23:59:59.000',

	// Selected Financial Year in the dropdown
	SELECTED_YEAR: (function() {
		var curDate = new Date();
		if (curDate.getMonth() >= 6){
			var year = curDate.getFullYear() + 1;
			return "FY" + year.toString().substring(2,4);
		}else{
			return "FY" + curDate.getFullYear().toString().substring(2,4);
		}
	})(),
	GENERIC_CYCLE_DATES: {
		"FY18": [{
			"startDate": undefined,
			"endDate": undefined,
			"cycleDisplayName": "Year to date",
			"cycleDate": "0"
		}, {
			"startDate": "2017-10-01T00:00:00.000",
			"endDate": "2017-12-31T23:59:59.000",
			"cycleDisplayName": "Cycle 1",
			"cycleDate": "2"
		}, {
			"startDate": "2018-01-03T00:00:00.000",
			"endDate": "2018-03-31T23:59:59.000",
			"cycleDisplayName": "Cycle 2",
			"cycleDate": "3"
		}, {
			"startDate": "2018-04-09T00:00:00.000",
			"endDate": "2018-06-03T23:59:59.000",
			"cycleDisplayName": "Cycle 3",
			"cycleDate": "4"
		}],
		"FY19": [{
			"startDate": undefined,
			"endDate": undefined,
			"cycleDisplayName": "Year to date",
			"cycleDate": "0"
		}, {
			"startDate": "2018-07-12T00:00:00.000",
			"endDate": "2018-09-27T23:59:59.000",
			"cycleDisplayName": "Cycle 1",
			"cycleDate": "1"
		}, {
			"startDate": "2018-10-08T00:00:00.000",
			"endDate": "2018-12-24T23:59:59.000",
			"cycleDisplayName": "Cycle 2",
			"cycleDate": "2"
		}, {
			"startDate": "2019-01-08T00:00:00.000",
			"endDate": "2019-03-28T23:59:59.000",
			"cycleDisplayName": "Cycle 3",
			"cycleDate": "3"
		}, {
			"startDate": "2019-04-08T00:00:00.000",
			"endDate": "2019-06-27T23:59:59.000",
			"cycleDisplayName": "Cycle 4",
			"cycleDate": "4"
		}]
	},
	SECRET_KEY: "LEADDASHBOARD",
	YEAR_CONFIG: [{
		"value": "FY18",
		"displayName": "FY18",
		"selected": 1
	}],
	YEAR_HEAD: "20",
	//METRICS_GUI: '1000068',
	//METRICS_GUI: '1001733',
	//METRICS_GUI: '1007317',
	PPEDD_RATING_WEIGHT: {
		"high": "4",
		"medium": "2",
		"low": "1",
		"self": 1
	},
	NON_PPEDD_RATING_WEIGHT: {
		"high": "2",
		"standard": "1",
		"self": 1
	},
	// show logged in user report
	QRM_LINK: "https://app.powerbi.com/groups/me/apps/d39b5cbd-538e-4c71-a524-0dd5da0e2b8d/reports/8a14550b-8133-4e66-8b94-2c129871573e/ReportSection?filter=Employee/GUI eq 'REPLACEGUI'&domain_hint=ey.net&chromeless=true",
	//QRM_LINK : "https://app.powerbi.com/Redirect?action=OpenApp&appId=8083187d-bfbc-4df5-9637-5bd65df6f52e&ctid=5b973f99-77df-4beb-b27d-aa0c70b8482c",
	//show other users
	//QRM_LINK : "https://app.powerbi.com/groups/e97e301f-a03b-4583-9e4e-4425fa725e50/reports/db80083c-a436-41bd-ba40-3d2f367e09a8/ReportSection",
	PRIMARY_YEAR: 2018,
	// CYCLE_CONFIG: [{
	// 				"FY18" : [{
	// 				"cycleDate" : "0",
	// 				"cycleDisplayName" :"Year to date"
	// 				},
	// 				{
	// 					"cycleDate" : "1",
	// 					"cycleDisplayName" :"Cycle 1"
	// 				},
	// 				{
	// 					"cycleDate" : "2",
	// 					"cycleDisplayName" :"Cycle 2"
	// 				},
	// 				{
	// 					"cycleDate" : "3",
	// 					"cycleDisplayName" :"Cycle 3"
	// 			    }],
	// 			    "default" : [
	// 			    {
	// 				"cycleDate" : "0",
	// 				"cycleDisplayName" :"Year to date"
	// 				},
	// 				{
	// 					"cycleDate" : "1",
	// 					"cycleDisplayName" :"Cycle 1"
	// 				},
	// 				{
	// 					"cycleDate" : "2",
	// 					"cycleDisplayName" :"Cycle 2"
	// 				},
	// 				{
	// 					"cycleDate" : "3",
	// 					"cycleDisplayName" :"Cycle 3"
	// 			    }]
	// 			}],
	CYCLE_CONFIG: [{
		"cycleDate": "0",
		"cycleDisplayName": "Year to date"
	}, {
		"cycleDate": "1",
		"cycleDisplayName": "Cycle 1"
	}, {
		"cycleDate": "2",
		"cycleDisplayName": "Cycle 2"
	}, {
		"cycleDate": "3",
		"cycleDisplayName": "Cycle 3"
	}],
	DIVIDENT_FIVE: 5,
	DIVIDENT_SEVEN: 7,
	DIVIDENT_THREE: 3,
	DIVIDENT_EIGHT: 8,
	FORM_TYPE_A: {
		"0": "-18",
		"1": "-18",
		"2": "90",
		"3": "198"
	},
	FORM_TYPE_B: {
		"0": "-50",
		"1": "-50",
		"2": "20",
		"3": "90",
		"4": "162",
		"5": "230"
	},
	FORM_TYPE_C: {
		"0": "-50",
		"1": "-50",
		"2": "20",
		"3": "90",
		"4": "162",
		"5": "230",
		"6": "-18",
		"7": "90",
		"8": "198"
	},
	LANGUAGE_FEEDBACK_TEXT: [{
		"text": "swedish",
		"value": "Retroalimentación"
	}, {
		"text": "french",
		"value": "rétroaction"
	}, {
		"text": "japanese",
		"value": "Retroalimentación"
	}, {
		"text": "spanish",
		"value": "retroalimentación"
	}, {
		"text": "hebrew",
		"value": "משוב ל"
	}, {
		"text": "english",
		"value": "feedback"
	}],
	LANGUAGE_SELF_ASSESSMENT_TEXT: [{
		"text": "english",
		"value": "self-assessment"
	}],
	LANGUAGE_QERM_YEAR_END_TEXT: [{
		"text": "english",
		"value": "year-end q%26erm"
	}],
	LANGUAGE_INTERIM_TEXT: [{
		"text": "english",
		"value": "interim"
	}],
	LANGUAGE_FINALIZATION_TEXT: [{
		"text": "english",
		"value": "finalization"
	}],
	FEEDBACK_TEXT: "feedback",
	SELF_ASSESSMENT_TEXT: "self-assessment",
	QERM_YEAR_END_TEXT: "year-end",
	FINALIZATION_TEXT: "finalization",
	INTERIM_TEXT: "interim",
	SELF_ASSESSMENT_FORM_TYPE: [{
		"text": "english",
		"value": " a "
	}],
	YEAR_END_FORM_TYPE: [{
		"text": "english",
		"value": " a "
	}],
	SELF_ASSESSMENT_FORM_TYPE_TEXT: "1",
	YEAR_END_FORM_TYPE_TEXT: "2",
	FINAL_ASSESSMENT_CATEGORY_NAME: "Quality and effective risk management",
	WEBSERVICE_ENDPOINT: "https://javasecuity.net/service/",
	PEER_GROUP_MAPPING: [{
		"categoryName": "Quality, risk management & technical excellence leadership",
		"peerCategoryCode": "[AWF-Quality]"
	}, {
		"categoryName": "Quality, risk management & technical excellence",
		"peerCategoryCode": "[AWF-Quality]"
	}, {
		"categoryName": "Quality and effective risk management",
		"peerCategoryCode": "[AWF-Quality]"
	}, {
		"categoryName": "Client leadership",
		"peerCategoryCode": "[AWF-Client]"
	}, {
		"categoryName": "Team leadership",
		"peerCategoryCode": "[AWF-Team]"
	}, {
		"categoryName": "Personal leadership",
		"peerCategoryCode": "[AWF-Personal]"
	}, {
		"categoryName": "Engagement/project metrics",
		"peerCategoryCode": "[AWF-Engagement]"
	}, {
		"categoryName": "Recommendation",
		"peerCategoryCode": "[AWF-Recommendation]"
	}, {
		"categoryName": "Exceptional client service",
		"peerCategoryCode": "[AWF-ECS]"
	}, {
		"categoryName": "People engagement and teaming",
		"peerCategoryCode": "[AWF-PET]"
	}, {
		"categoryName": "Connected",
		"peerCategoryCode": "[AWF-Connected]"
	}, {
		"categoryName": "Responsive",
		"peerCategoryCode": "[AWF-Responsive]"
	}, {
		"categoryName": "Insightful",
		"peerCategoryCode": "[AWF-Insightful]"
	}, {
		"categoryName": "Right Mix",
		"peerCategoryCode": "[AWF-RightMix]"
	}, {
		"categoryName": "Teaming",
		"peerCategoryCode": "[AWF-Teaming]"
	}, {
		"categoryName": "Highest performing teams",
		"peerCategoryCode": "[AWF-HighestPerformingTeams]"
	}, {
		"categoryName": "Business leadership",
		"peerCategoryCode": "[AWF-Business]"
	}]

});