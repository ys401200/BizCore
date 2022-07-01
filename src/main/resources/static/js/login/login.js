function loginSessionClick(e){
	if($(e).attr("class") !== "active"){
		$(e).removeAttr("class");
		$(e).attr("class", "active");
	}else{
		$(e).removeAttr("class");
	}
}

function loginSubmit(){
	let form = $("#loginForm")[0];
	let formData = new FormData(form);
	
	$.ajax({
		url: "/api/user/login",
		method: "post",
		data: formData,
		dataType: "json",
		cache: false,
		contentType: false,
		processData: false,
		success:function(data){
			location.reload();
		},
		error:function(){
			alert("정보를 다시 확인하여주십시오.");
			locaion.reload();
		}
	})
}