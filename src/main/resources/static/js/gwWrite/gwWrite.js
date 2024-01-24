document.addEventListener("DOMContentLoaded", () => {
	  callerFun();
});

async function callerFun(){
	await promiseInit();
    const setGwWrite = new GwWriteSet();
    setGwWrite.getformList();
}