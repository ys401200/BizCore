document.addEventListener("DOMContentLoaded", () => {
	callerFun();
});

async function callerFun(){
	await promiseInit();
	const setGwHome = new GwHomeSet();
	setGwHome.drawGwDiv();

	// window.onresize = function () { $(".waitCard").css("font-size", ((window.innerWidth - 320) / 100) + "px") }
	window.onresize = function () {
		// $(".waitCard").css("font-size", ((window.innerWidth - 320) / 100) + "px") 
	
	
		if ($(".card").css("width").split("p")[0] < 762) {
		  console.log("확인1");
		  $(".card").css("grid-template-columns", "repeat(4, 1fr)");
		} else if ($(".card").css("width").split("p")[0] < 1016) {
		  console.log("확인2");
		  $(".card").css("grid-template-columns", "repeat(5, 1fr)");
		} else if ($(".card").css("width").split("p")[0] < 1270) {
		  console.log("확인3");
		  $(".card").css("grid-template-columns", "repeat(6, 1fr)");
		} else if ($(".card").css("width").split("p")[0] > 1270) {
		  console.log("확인4");
		  $(".card").css("grid-template-columns", "repeat(7, 1fr)");
		} else if ($(".card").css("width").split("p")[0] > 1440) {
		  console.log("확인4");
		  $(".card").css("grid-template-columns", "repeat(8, 1fr)");
		}
	
		// if ($(".waitDiv").css("width").split("p")[0] < 762) {
		//   $(".waitDiv").css("grid-template-columns", "repeat(3, 1fr)");
		// } else if ($(".waitDiv").css("width").split("p")[0] < 1016) {
		//   $(".waitDiv").css("grid-template-columns", "repeat(4, 1fr)");
		// } else if ($(".waitDiv").css("width").split("p")[0] < 1270) {
		//   $(".waitDiv").css("grid-template-columns", "repeat(5, 1fr)");
		// } else if ($(".waitDiv").css("width").split("p")[0] > 1270) {
		//   $(".waitDiv").css("grid-template-columns", "repeat(6, 1fr)");
		// }
	
	  }
}
