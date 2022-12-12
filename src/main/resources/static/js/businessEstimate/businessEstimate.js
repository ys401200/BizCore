

document.addEventListener("DOMContentLoaded", () => {
	prepare = function(){
		EstimateSet = new EstimateSet();
	}
	
    init();

	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);
});