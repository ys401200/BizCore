document.addEventListener("DOMContentLoaded", () => {
	callerFun();
});

async function callerFun(){
	await promiseInit();
	const setGoal = new GoalSet();
	setGoal.list();
}

function gridGoalList(){
    let nowYear, url, method, data, type;
    nowYear = new Date();
    nowYear = nowYear.getFullYear();
    url = "/api/system/goal/" + nowYear;
    method = "get";
    type = "list";
    crud.defaultAjax(url, method, data, type, goalSuccessList, goalErrorList);

    let menu = [
		{
			"keyword": "add",
			"onclick": "goalInsert();"
		},
		{
			"keyword": "notes",
			"onclick": ""
		},
		{
			"keyword": "set",
			"onclick": ""
		},
	];

    plusMenuSelect(menu);
}

function goalSuccessList(result){
    console.log(result);
    let html = "", goalContent;
    goalContent = $(".goalContent");
    html = "<div class=\"goalGridHeader\">";
    html += "<div>담당자</div>";

    for(let i = 1; i <= 12; i++){
        html += "<div>" + i + "월</div>";
    }
    
    html += "<div>합계</div>";
    html += "</div>";
    html += "<div class=\"goalGridBody\">";

    for(let key1 in result){
        if(key1 !== "all"){
            for(let key2 in result[key1]){
                if(!storage.user[key2].resign){
                    let total = 0;
                    html += "<div class=\"goalBody\" data-key=\"" + key2 + "\">";
                    html += "<div class=\"goalBodyUser\">" + storage.user[key2].userName + "</div>";
                    for(let i = 0; i < result[key1][key2].length; i++){
                        if(result[key1][key2][i] == null){
                            html += "<div><input type=\"text\" data-index=\"" + (i+1) + "\" data-key=\"" + key2 + "\" onkeyup=\"goalKeyup(this)\" value=\"0\"></div>";
                        }else{
                            total += result[key1][key2][i];
                            html += "<div><input type=\"text\" data-index=\"" + (i+1) + "\" data-key=\"" + key2 + "\" onkeyup=\"goalKeyup(this)\" value=\"" + result[key1][key2][i] + "\"></div>";
                        }
                    }

                    if(total > 0){
                        html += "<div class=\"goalBodyUserTotal\">" + total.toLocaleString("en-US") + "</div>";
                    }else{
                        html += "<div class=\"goalBodyUserTotal\">0</div>";
                    }

                    html += "</div>";
                }
            }
        }
    }

    html += "<div class=\"goalBodyMonthContents\">";
    html += "<div>합계</div>";
    
    for(let i = 0; i < 12; i++){
        html += "<div class=\"goalBodyMonth\">0</div>";
    }

    html += "<div class=\"goalBodyMonthTotal\">0</div>";
    html += "</div>";
    html += "</div>";

    goalContent.html(html);

    setTimeout(() => {
        loadGoalTotal();
    }, 300);
}

function goalErrorList(){
    alert("리스트 불러오는 중 에러가 발생했습니다.");
}

function goalInsert(){
    let goalBodyItems, nowYear, url, method, type;
    nowYear = new Date();
    nowYear = nowYear.getFullYear();
    goalBodyItems = $(".goalBody");
    
    for(let t = 0; t < goalBodyItems.length; t++){
        let data = [];
        url = "/api/system/goal/" + nowYear + "/" + $(goalBodyItems[t]).data("key");

        for(let i = 0; i < $(goalBodyItems[t]).find("input").length; i++){
            data.push(parseInt($($(goalBodyItems[t]).find("input")[i]).val().replaceAll(",", "")));
        }
        
        method = "post";
        type = "insert";
        data = JSON.stringify(data);
	    data = cipher.encAes(data);
        
        crud.defaultAjax(url, method, data, type, goalSuccessInsert, goalErrorInsert);
    }

    setTimeout(() => {
        alert("등록되었습니다.");
        location.reload();
    }, 1000);
}

function goalSuccessInsert(){

}

function goalErrorInsert(){
    alert("등록 도중 에러가 발생했습니다.");
}

function goalKeyup(e){
    let thisEle = $(e), total, thisParent, temp = 0;
    thisParent = thisEle.parent().parent();
    total = thisParent.find(".goalBodyUserTotal");

    for(let i = 0; i < thisParent.find("input").length; i++){
        temp += parseInt($(thisParent.find("input")[i]).val().replaceAll(",", ""));
    }

    if(isNaN(temp)){
        total.html(0);
    }else{
        total.html(temp.toLocaleString("en-US"));
    }

    loadGoalTotal();
    inputNumberFormat(thisEle);
}

function loadGoalTotal(){
    let inputEle, goalBodyMonth, goalBodyMonthTotal, totalArray = [], total = 0;
    inputEle = $(".goalGridBody");
    goalBodyMonth = $(".goalContent .goalBodyMonthContents").find(".goalBodyMonth");
    goalBodyMonthTotal = $(".goalBodyMonthTotal");

    for(let i = 0; i < inputEle.find("input").length; i++){
        let temp = 0;

        for(let t = 0; t < inputEle.find("input[data-index=\"" + i + "\"\]").length; t++){
            temp += parseInt($(inputEle.find("input[data-index=\"" + i + "\"\]")[t]).val().replaceAll(",", ""));
            
            if(isNaN(temp)){
                totalArray[i-1] = 0;
            }else{
                totalArray[i-1] = temp;
            }
        }
    }

    for(let i = 0; i < goalBodyMonth.length; i++){
        $(goalBodyMonth[i]).html(totalArray[i].toLocaleString("en-US"));
        total += parseInt($(goalBodyMonth[i]).html().replaceAll(",", ""));
    }

    goalBodyMonthTotal.html(total.toLocaleString("en-US"));
}