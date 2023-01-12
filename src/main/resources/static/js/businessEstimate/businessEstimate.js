document.addEventListener("DOMContentLoaded", () => {
	prepare = function(){
		EstimateSet = new EstimateSet();
		EstimateSet.list();
	}
	
    init();

	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);
});