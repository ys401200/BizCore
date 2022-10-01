let util;

util = {
    "grid":(container, headerData, tableData, firstIsIndex, clickEventHandler, sortEventHandler) => {
        let html, x1, x2, data;

        // Verify input element/data
        if(container == undefined){
            console.log("[util.grid] Grid table container is Empty.");
            return false;
        }else if(!util.type(container).includes("Element")){
            console.log("[util.grid] Container is Not Html Element.");
            return false;
        }else if(util.type(headerData) !== "Array" || util.type(tableData) !== "Array"){
            console.log("[util.grid] Header data and/or table data is Not Array.");
            return false;
        }

        // 배열의 첫 값이 이벤트를 위한 인덱스인지 여부에 대한 변수 검증
        if(!(firstIsIndex === true || firstIsIndex === false))  firstIsIndex = false;

        // Create hader
        html = "<div>"; // Start header
        for(x1 = 0 ; x1 < headerData.length ; x1++) html += ("<div" + (sortEventHandler === undefined ? "" : " onclick=\"" + sortEventHandler + "(this)\"") + ">" + headerData[x1] + "</div>");
        html += ("</div>"); // End header

        // start table content
        for(x1 = 0 ; x1 < tableData.length ; x1++){ // start for(x1) / level 1
            html += ("<div" + (firstIsIndex ? " data-id=\"" + tableData[x1][0] + "\"" : "") + (clickEventHandler === undefined ? "" : " onclick=\"" + clickEventHandler + "(this)\"") + ">"); // start row
            for(x2 = (firstIsIndex ? 1 : 0) ; x2 < tableData.length + (firstIsIndex ? 1 : 0) ; x2++){ // start for(x2) / level 2
                data = tableData[x1][x2];
                data = data === undefined ? "" : data;
                html += ("<div>" + data + "</div"); // This is a each cell
            } // End of for(x2) / level 2
            html += ("</div>"); // end row
        } // End of for(x1) / level 1

        container.innerHTML = html;
        return true;
    }, // End of util.grid()
    "type":(obj) => {
        return obj == undefined ? obj : Object.prototype.toString.call(obj).slice(8, -1);
    }, // End of util.classType()
    "":undefined,
    "":undefined
}