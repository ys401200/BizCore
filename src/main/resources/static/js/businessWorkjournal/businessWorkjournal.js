document.addEventListener("DOMContentLoaded", () => {
	callerFun();
});

async function callerFun(){
	await promiseInit();
	let workJournalSet = new WorkJournalSet();
    workJournalSet.journalChange();
}