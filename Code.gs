function baseworkFunction() {
  //Folowing two lines of code are written to write head information to sheet in one go.
  var header = [], subHeader = [];
  header.push(["क्र.", "कर्मचारी क्रमांक", "कर्मचारी का नाम", "माह में उपस्थिति", "कार्यालय में निर्धारीत समय पर उपस्थिति (समयनिष्ठा)", "समयोपरि उपस्थिति", "आचरण एवं व्यवहार", "", "", "शिकायत/ कारण बताओ सूचना पत्रों की संख्या", "सौंपे गए कार्यों का विवरण", "विशेष कर्तव्यस्थ अधिकारी (जहाँ लागू हो) / शाखा प्रमुख की टिप /अनुशंसा"]);
  subHeader.push(["", "", "", "", "", "", "सहकर्मियों के साथ", "उच्च अधिकारियों के साथ", "विद्यार्थियों/ आगंतुकों के साथ", "", "", ""]);

  var data = SpreadsheetApp.getActiveSheet().getDataRange().getValues();
  var employeeCode = "";
  var employeeName = "";
  
  var weekDays = data[6].filter(Boolean);
  var satIndex = [];
  var sunIndex = [];
  var workIndex = [];
  
  for(i=1; i<weekDays.length; i++) {                              //Code to find index of Saturdays and Sundays
    if(weekDays[i].toString().split(" ")[1].trim() === "S")
      sunIndex.push(i);
    else if(weekDays[i].toString().split(" ")[1].trim() === "St") 
      satIndex.push(i);
    else
      workIndex.push(i);
  }
  
  for(i=8; i<770;) {                                         //Currently it is till 20th record, make it to length for final code
    var regExp = new RegExp("epartment","g");
    var index;
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var deptSheet;
    if(data[i].toString().match(regExp)) {
      if(i !== 8) {
        deptSheet.getRange(index + 3,1,5,5).merge().setBorder(true,true,true,true,true,true);
        deptSheet.getRange(index + 3,6,5,5).merge().setBorder(true,true,true,true,true,true);
        deptSheet.getRange(index + 3,11,5,2).merge().setBorder(true,true,true,true,true,true);
        deptSheet.getRange(index + 3,1).setValue("स्थापना लिपिक \n (हस्ताक्षर)").setHorizontalAlignment("center");
        deptSheet.getRange(index + 3,6).setValue("विशेष कर्तव्यस्थ अधिकारी \n (हस्ताक्षर)").setHorizontalAlignment("center");
        deptSheet.getRange(index + 3,11).setValue("विभाग प्रमुख/ शाखा प्रमुख \n (हस्ताक्षर)").setHorizontalAlignment("center");
      }
      deptSheet = ss.insertSheet(data[i].toString().split(':')[1].replaceAll(',',''));//create a new sheet with the department name
      deptSheet.getRange(1,1,1,12).setValues(header).setBorder(true,true,true,true,true,true).setHorizontalAlignment("center");
      deptSheet.getRange(2,1,1,12).setValues(subHeader).setBorder(true,true,true,true,true,true).setHorizontalAlignment("center");
      deptSheet.getRange(1,1,2,6).mergeVertically().setBorder(true,true,true,true,true,true);
      deptSheet.getRange(1,10,2,3).mergeVertically().setBorder(true,true,true,true,true,true);
      deptSheet.getRange(1,7,1,3).mergeAcross().setBorder(true,true,true,true,true,true).setHorizontalAlignment("center");
      deptSheet.setRowHeight(1,50);
      deptSheet.setRowHeight(2,50);
      deptSheet.setColumnWidth(1,30);
      deptSheet.setColumnWidth(2,65);
      deptSheet.setColumnWidth(3,200);
      deptSheet.setColumnWidth(4,65);
      deptSheet.setColumnWidth(5,65);
      deptSheet.setColumnWidth(6,65);
      deptSheet.setColumnWidth(7,65);
      deptSheet.setColumnWidth(8,65);
      deptSheet.setColumnWidth(9,65);
      deptSheet.setColumnWidth(10,65);
      deptSheet.setColumnWidth(11,200);
      deptSheet.setColumnWidth(12,200);
      index = 1; 
      i += 2;
    }
    else {
      var employeeData = [];
      var employeeAttendance = [];
      var employeeExtraAttendance = [];
      
      employeeCode = data[i].filter(Boolean)[1];
      employeeName = data[i].filter(Boolean)[3];
      const workResults = data[i+1].filter(Boolean).filter((e, i) => workIndex.includes(i));
      employeeAttendance = employeeAttendance.concat(workResults);
      const satResults = data[i+1].filter(Boolean).filter((e, i) => satIndex.includes(i));
      employeeAttendance = employeeAttendance.concat(satResults[0]);
      employeeAttendance = employeeAttendance.concat(satResults[3]);
      if(satResults.length == 5)
       employeeAttendance = employeeAttendance.concat(satResults[4]);
      employeeExtraAttendance = employeeExtraAttendance.concat(satResults[1]);
      employeeExtraAttendance = employeeExtraAttendance.concat(satResults[2]);
      const sunResults = data[i+1].filter(Boolean).filter((e, i) => sunIndex.includes(i));
      employeeExtraAttendance = employeeExtraAttendance.concat(sunResults);
      
      var cleanedData = data[i+2].filter(Boolean);
      for(j=0; j<data[i+1].filter(Boolean).length; j++) {
        if(data[i+1].filter(Boolean)[j] === "A")
          cleanedData.splice(j, 0, "A");
      }
      
      var workTimeData = cleanedData.filter((e, i) => workIndex.includes(i));
      const satTimeData = cleanedData.filter((e, i) => satIndex.includes(i));
      console.log("Work index : " + workIndex);
      console.log("Before Work Data : " + workTimeData);
      workTimeData = workTimeData.concat(satTimeData[0]);
      workTimeData = workTimeData.concat(satTimeData[3]);
      if(satTimeData.length == 5)
        workTimeData = workTimeData.concat(satTimeData[4]);
      console.log("After Work Data : " + workTimeData);
      var workTimeResults = workTimeData.filter((value) => {
        var timeA = new Date();
        timeA.setHours(value.split(":")[0], value.split(":")[1], "00");
        var timeB = new Date();
        timeB.setHours("10", "30", "00");                                     //Cut-off time value. Currently set to 10:30 AM.
        if(timeA <= timeB) 
          return true;
        else
          return false;
      });

      employeeData.push(
        [
          index.toString(), 
          employeeCode, 
          employeeName, 
          (( employeeAttendance.filter(item => (item !== "A") && (item !== "Status")).length * 100 ) / employeeAttendance.length ).toFixed(2) + " %", 
          (( workTimeResults.length * 100 ) / employeeAttendance.length ).toFixed(2) + " %", 
          ( employeeExtraAttendance.filter(item => (item !== "A") && (item !== "Status"))).length
        ]);
      deptSheet.getRange(index + 2,1,1,6).setValues(employeeData).setHorizontalAlignment("center").setVerticalAlignment("top");
      //Code to insert drop down list for behaviour
      deptSheet.getRange(index + 2,7,1,3).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['खराब', 'सामान्य', 'अच्छा', 'बहुत अच्छा'])).setVerticalAlignment("top");
      deptSheet.getRange(index + 2,10,1,1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['0', '1', '2', '>2'])).setVerticalAlignment("top");
      deptSheet.setRowHeight(index + 2, 100);
      deptSheet.getRange(index + 2,1,1,12).setBorder(true,true,true,true,true,true);
      index += 1;
      i += 6;
    }
  }
}
