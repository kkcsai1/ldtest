'use strict';
myApp.value('AppMessages',{
    NOT_AUTHORIZED: "You are not authorized to view this page. <div>Return to <span class='hyperlink return-top-home' ng-click=redirectTo('home')>home</span> page</div>",
    SERVERERROR_HEADER: "Looks like something went wrong.",
    SERVERERROR_MSG: "We track these errors automatically, but if the problem persists feel free to contact us. In the meantime, try refreshing.",
    DASHBOARD_MESSAGES : {
    			"ERROR" : {
    				"MULTIPLE_FORMS" : "There seems to be multiple forms available for the user.",
    				"NO_RESULTS_FROM_FORM_FIRST_PART" :"No Feedback forms were found for ",
    				"NO_RESULTS_FROM_FORM_SECOND_PART" :"",
    				"GOALS_NOT_APPROVED" :"Please have your goals approved by your LEAD Reviewer, and then log back in to view your Dashboard.",
    				"SOMETHING_WENT_WRONG" :"Communication with service failed, Please try again.",
    				"INTERNAL_SERVER_ERROR" : "Server encountered an unexpected condition, Please try again.",
    				"SOME_EXCEPTION_OCCURRED" : "Some exception occurred, Please try again."
    			},
    			"SUCCESS" :{
    				
    			}
    },
    MBMNODATA : "No data available at this time.",
    TOPENGHOURS_NODATA : "No data.",
    COMING_SOON : "Coming soon.",
    NO_TALENT_METRICS : "No Peer group average was found for User: REPLACEGUI for the year : REPLACEYEAR",
    PEER_INTERNAL_SERVICE_ERROR : "Internal Communication Failure – Please open an Support incident through your local support contacts with the Error ID :"
});