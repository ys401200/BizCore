$(document).ready(() => {
    init();
    
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

    gridGoalList();
});

function gridGoalList(){
    let html = "", goalContent;
    goalContent = $(".goalContent");

    
    $.ajax({
        url: "/api/system/goal/2022",
        method: "get",
        dataType: "json",
        contentType: "text/plain",
        success: (result) => {
            result = cipher.decAes(result.data);
            result = JSON.parse(result);

            html = "<div>담당사원</div>";

            for(let key in result){
                console.log(key);
            }

            console.log(result);
            html += "<div>합계</div>";
        }
    })

}