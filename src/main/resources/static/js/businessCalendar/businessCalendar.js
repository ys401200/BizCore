$(document).ready(() => {
	init();

	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);
    calendar();
});

function calendar(){
    let date = new Date();
    let y = date.getFullYear();
    let m = date.getMonth();
    let d = date.getDate();
    let theDate = new Date(y, m, 1);
    let theDay = theDate.getDay();
    let last = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if(y % 4 && y % 100 != 0 || y % 400 === 0){
        lastDate = last[1] = 29;
    }

    var lastDate = last[m];
    let row = Math.ceil((theDay + lastDate)/7);
    let calendar = "";
    let dNum = 1;

    for(let i = 1; i < row; i++){
        calendar += "<tr>";
        for(let k = 1; k <= 7; k++){
            if(i == 1 && k <= theDay || dNum > lastDate){
                calendar += "<td> &nbsp; </td>";
            }else{
                let tdClass = "";
                if(dNum == d){
                    tdClass = "today";
                }else{
                    tdClass = "";
                }

                if(k == 1){
                    tdClass += "sun";
                }

                calendar += "<td class='"+tdClass+"'>" + "<strong class='date'>" + dNum + "</strong>" + "<ul class='scheduleRw'>" + "<li class='closed'><a href='#' class='eModal'>10:00 ~ 11:00</a></li>" + "<li class='open'><a href='#' class='eModal'>10:00 ~ 11:00</a></li>" + "<li class='closed'><a href='#' class='eModal'>10:00 ~ 11:00</a></li>" + "</ul>" + "</td>";
                dNum++;
            }
        }

        calendar += "</tr>";
    }

    $("#calendarBody").append(calendar);
}