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

            for(let t = 1; t <= 12; t++){
                html += "<div>" + t + "월</div>";
            }
            
            html += "<div>합계</div>";

            for(let key in result.VTEKMANG){
                html += "<div>" + storage.user[key].userName + "</div>";
                console.log(result.VTEKMANG[key]);
                for(let i = 0; i < result.VTEKMANG[key].length; i++){
                    if(result.VTEKMANG[key][i] == null){
                        html += "<div>0</div>";
                    }else{
                        html += "<div>" + result.VTEKMANG[key][i] + "</div>";
                    }
                }
                html += "<div></div>";
            }

            goalContent.html(html);
        }
    });
}