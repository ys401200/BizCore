$(document).ready(() => {
    init();
    
	setTimeout(() => {
		const setSales = new SalesSet();
		setSales.list();
	}, 1000);
});