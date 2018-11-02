function initModel() {
	var sUrl = "/sap_hcmcloud_core_odata/odata/v2/";
	oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
	
	
	userApiModel = new sap.ui.model.json.JSONModel("/services/userapi/currentUser");
	//sap.ui.getCore().setModel(userApiModel , "userapi");

//	oModel.read("/User('1133940')?format=JSON")
	
}