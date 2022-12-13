

document.addEventListener("DOMContentLoaded", () => {
	prepare = function(){
		EstimateSet = new EstimateSet();
		EstimateSet.setList();
	}
	
    init();

	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);
});