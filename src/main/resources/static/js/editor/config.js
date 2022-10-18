CKEDITOR.editorConfig = function(config) {
	for(let key in ckeditor.config){
		config[key] = ckeditor.config[key];
	}
};
