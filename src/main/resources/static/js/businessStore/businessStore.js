$(document).ready(() => {
    init();
    
    setTimeout(() => {
        const setStore = new StoreSet();
        setStore.list();
    }, 1000);
});