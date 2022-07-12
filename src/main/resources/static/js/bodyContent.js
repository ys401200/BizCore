$(document).ready(init)

// Initializing Page
function init(){
	setTimeout(() => {
		$("#loadingDiv").hide();
		$("#loadingDiv").loading("toggle");
	}, 300);

	
	$("#sideMenu").find("ul:not(#panel) li a").click(function(){
		if($(this).attr("class") !== "active"){
			$(this).next().attr("class", "active");
			$(this).find("#slideSpan").text("-");
			$(this).attr("class", "active");
		}else{
			$(this).removeAttr("class");
			$(this).next().removeAttr("class");
			$(this).find("#slideSpan").text("+");
		}
	});
	rootMenuActive();
	readyTopPageActive();
	menuActive();
	getNoticeList();
} // End of init()

//페이징될 때 header, sideMenu active를 위한 함수
function rootMenuActive(){
	let i = null, pathName = null, fullStr = null, firstStr = null, lastStr = null, strLength = null, sideMenu = null, mainTopMenu = null;
	
	pathName = $("#pathName").val();
	mainTopMenu = $("#mainTopMenu");

	if(pathName === "root"){
		mainTopMenu.find("ul li button").removeAttr("class");
		mainTopMenu.find("ul li button[data-keyword='business']").attr("class", "active");
	}
}

function menuActive(){
	let i = null, pathName = null, fullStr = null, firstStr = null, lastStr = null, strLength = null, sideMenu = null, mainTopMenu = null;
	
	pathName = $("#pathName").val();
	mainTopMenu = $("#mainTopMenu");
	sideMenu = $("#sideMenu");
	strLength = pathName.length;
	i = 0;
	if(pathName !== "root"){
		while(i <= strLength){
			fullStr = pathName.charAt(i);
	
			if(fullStr == fullStr.toUpperCase()){
				firstStr = pathName.substring(0, i).toLowerCase();
				lastStr = pathName.substring(i, strLength).toLowerCase();
				
				mainTopMenu.find("ul li button").removeAttr("class");
				mainTopMenu.find("ul li button[data-keyword='"+firstStr+"']").attr("class", "active");

				sideMenu.find("ul[id='"+firstStr+"']").attr("class", "active");
				sideMenu.find("ul[id='"+firstStr+"'] li #panel li a[href='"+"/"+firstStr+"/"+lastStr+"']").parents("#panel").prev().attr("class", "active");
				sideMenu.find("ul[id='"+firstStr+"'] li #panel li a[href='"+"/"+firstStr+"/"+lastStr+"']").parents("#panel").attr("class", "active");
				sideMenu.find("ul[id='"+firstStr+"'] li #panel li a[href='"+"/"+firstStr+"/"+lastStr+"']").attr("class", "active");
				// sideMenu.find("ul").not("#panel").find("li a").removeAttr("class");
				// sideMenu.find("ul").not("#panel").find("li a #slideSpan").text("+");
				// sideMenu.find("ul").not("#panel").find("li a #slideSpan").css("font-size", "");
				// sideMenu.find("ul").not("#panel").find("li a #slideSpan").css("font-size", "30px");
				// sideMenu.find("ul #panel").hide();
	
				// sideMenu.find("ul[id='"+firstStr+"']").attr("class", "active");
				// sideMenu.find("ul[id='"+firstStr+"'] li a").next().attr("class", "active");
				// sideMenu.find("ul[id='"+firstStr+"'] li #panel li a[href='"+"/"+firstStr+"/"+lastStr+"']").attr("class", "active");
				// sideMenu.find("ul[id='"+firstStr+"'] li #panel li a[href='"+"/"+firstStr+"/"+lastStr+"'] #slideSpan").text("-");
				// sideMenu.find("ul[id='"+firstStr+"'] li #panel li a[href='"+"/"+firstStr+"/"+lastStr+"'] #slideSpan").css("font-size", "");
				// sideMenu.find("ul[id='"+firstStr+"'] li #panel li a[href='"+"/"+firstStr+"/"+lastStr+"'] #slideSpan").css("font-size", "47px");
				// sideMenu.find("ul[id='"+firstStr+"']").show();
				// sideMenu.find("ul[id='"+firstStr+"'] a.active").parent().prop("style", "background: linear-gradient(to bottom, #ffffff 95%, #302D81 5%); cursor: pointer;");
				
				// if(sideMenu.find("ul[id='"+firstStr+"'] a.active").parent().parent().attr("id") !== "panel"){
				// 	sideMenu.find("ul[id='"+firstStr+"'] a.active").parent().parent().find("span").css("color", "");
				// 	sideMenu.find("ul[id='"+firstStr+"'] a.active").parent().parent().find("span").css("color", "#302D81");
				// 	sideMenu.find("ul[id='"+firstStr+"'] a.active").parent().parent().find("img").prop("src", $(this).find("img").prop("src").replace(".png", "_hover.png"));
				// }else{
				// 	sideMenu.find("ul[id='"+firstStr+"'] a.active").css("color", "");
				// 	sideMenu.find("ul[id='"+firstStr+"'] a.active").css("color", "#302D81");
				// }
	
				// sideMenu.find("ul[id='"+firstStr+"'] li #panel li a[href='"+"/"+firstStr+"/"+lastStr+"']").parents("#panel").show();
	
				break;
			}
	
			i++;
		}
	}
}

function bodyTopPageClick(e){
	let id = $(e).attr("data-keyword");
	
	$("#mainTopMenu ul li button").removeAttr("class");
	$(e).attr("class", "active");
	
	$("#sideMenu").find("ul").not("#panel").removeAttr("class");
	$("#sideMenu").find("#" + id).attr("class", "active");
}

function readyTopPageActive(){
	let sideMenu = null, mainTopMenu = null;

	mainTopMenu = $("#mainTopMenu");
	sideMenu = $("#sideMenu");

	mainTopMenu.find("ul li button").each(function(index, item){
		if($(item).attr("class") === "active"){
			sideMenu.find("ul").not("[id='"+$(item).attr("data-keyword")+"']").removeAttr("class");
			sideMenu.find("ul[id='"+$(item).attr("data-keyword")+"']").attr("class", "active");
		}
	});
}

function getNoticeList(){
	let url;

	url = apiServer + "/api/notice";

	$.ajax({
		"url": url,
		"method": "get",
		"dataType":"json",
		"cache": false,
		success:(data) => {
			let list;
			if(data.result === "ok"){
				list = cipher.decAes(data.data);
				list = JSON.parse(list);
			}else{
				alert("?");
			}
		}
	})
} // End of getNoticeList()
