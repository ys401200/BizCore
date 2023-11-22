// document.addEventListener("DOMContentLoaded", () => {
// 	prepare = function(){
// 		EstimateSet = new EstimateSet();
// 		EstimateSet.list();
// 	}
	
//     init();

// 	setTimeout(() => {
// 		$("#loadingDiv").hide();
// 		$("#loadingDiv").loading("toggle");
// 	}, 300);
// });

document.addEventListener("DOMContentLoaded", () => {
	callerFun();
});

async function callerFun(){
	await promiseInit();
	let estimateSet = new EstimateSet();
	estimateSet.list();
}