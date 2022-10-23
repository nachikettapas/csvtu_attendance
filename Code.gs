function baseworkFunction() {
  //Folowing two lines of code are written to write head information to sheet in one go.
  var header = [], subHeader = [];
  header.push(["क्र.", "कर्मचारी क्रमांक", "कर्मचारी का नाम", "माह में उपस्थिति", "कार्यालय में निर्धारीत समय पर उपस्थिति (समयनिष्ठा)", "समयोपरि उपस्थिति", "आचरण एवं व्यवहार", "", "", "शिकायत/ कारण बताओ सूचना पत्रों की संख्या", "सौंपे गए कार्यों का विवरण", "विशेष कर्तव्यस्थ अधिकारी (जहाँ लागू हो) / शाखा प्रमुख की टिप /अनुशंसा"]);
  subHeader.push(["", "", "", "", "", "", "सहकर्मियों के साथ", "उच्च अधिकारियों के साथ", "विद्यार्थियों/ आगंतुकों के साथ", "", "", ""]);

  var data = SpreadsheetApp.getActiveSheet().getDataRange().getValues();
  var employeeCode = "";
  var employeeName = "";
  
  var weekDays = data[6].filter(Boolean);
  var extraIndex = [];
  var workIndex = [];
  
  for(i=1; i<weekDays.length; i++) {                              //Code to find index of Saturdays and Sundays
    if(weekDays[i].toString().split(" ")[1].trim() === "S")
      extraIndex.push(i);
    else if(weekDays[i].toString().split(" ")[1].trim() === "St") {
      var num = weekDays[i].toString().split(" ")[0].trim();
      if( ( parseInt( num ) >= 8 && parseInt( num ) <= 15 ) || ( parseInt( num ) >= 15 && parseInt( num ) <= 22 ) ) 
        extraIndex.push(i);
      else
        workIndex.push(i);
    }
    else
      workIndex.push(i);
  }
  
  for(i=8; i<data.length;) {                                         //Currently it is till 20th record, make it to length for final code
    var regExp = new RegExp("epartment","g");
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var index, deptSheet;

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
      console.log("Value of I : " + i);
    }
    else {
      //Following variable is used to push data to excel at once.
      var employeeData = [];

      employeeCode = data[i].filter(Boolean)[1];
      employeeName = data[i].filter(Boolean)[3];
      employeeAttendance = data[i+1].filter(Boolean).filter((e, i) => workIndex.includes(i));
      employeeExtraAttendance = data[i+1].filter(Boolean).filter((e, i) => extraIndex.includes(i));
      
      //Following code takes care of any merged cells
      var cleanedData = data[i+2].filter(Boolean);
      for(j=0; j<data[i+1].filter(Boolean).length; j++) {
        if(data[i+1].filter(Boolean)[j] === "A")
          cleanedData.splice(j, 0, "A");
      }
      
      workTimeData = cleanedData.filter(Boolean).filter((e, i) => workIndex.includes(i));
      var employeeTimeAttendance = workTimeData.filter((value) => {
        var timeA = new Date();
        timeA.setHours(value.split(":")[0], value.split(":")[1], "00");
        var timeB = new Date();
        timeB.setHours("10", "30", "00");                                     //Cut-off time value. Currently set to 10:30 AM.
        if(timeA <= timeB) 
          return true;
        else
          return false;
      });
      employeeExtraTimeAttendance = cleanedData.filter(Boolean).filter((e, i) => extraIndex.includes(i));
      
      employeeData.push([
          index.toString(), 
          employeeCode, 
          employeeName, 
          (( employeeAttendance.filter(item => (item !== "A") ).length * 100 ) / employeeAttendance.length ).toFixed(2) + " %", 
          (( employeeTimeAttendance.length * 100 ) / employeeAttendance.length ).toFixed(2) + " %", 
          ( employeeExtraAttendance.filter(item => (item !== "A") )).length
        ]);
      deptSheet.getRange(index + 2,1,1,6).setValues(employeeData).setHorizontalAlignment("center").setVerticalAlignment("top");
      //Code to insert drop down list for behaviour
      deptSheet.getRange(index + 2,7,1,3).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['खराब', 'सामान्य', 'अच्छा', 'बहुत अच्छा'])).setVerticalAlignment("top");
      deptSheet.getRange(index + 2,10,1,1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['0', '1', '2', '>2'])).setVerticalAlignment("top");
      deptSheet.setRowHeight(index + 2, 100);
      deptSheet.getRange(index + 2,1,1,12).setBorder(true,true,true,true,true,true);
      index += 1;
      i += 6;
      console.log("Value of I : " + i);
    }
  }
  //Code to print for last page
  deptSheet.getRange(index + 3,1,5,5).merge().setBorder(true,true,true,true,true,true);
  deptSheet.getRange(index + 3,6,5,5).merge().setBorder(true,true,true,true,true,true);
  deptSheet.getRange(index + 3,11,5,2).merge().setBorder(true,true,true,true,true,true);
  deptSheet.getRange(index + 3,1).setValue("स्थापना लिपिक \n (हस्ताक्षर)").setHorizontalAlignment("center");
  deptSheet.getRange(index + 3,6).setValue("विशेष कर्तव्यस्थ अधिकारी \n (हस्ताक्षर)").setHorizontalAlignment("center");
  deptSheet.getRange(index + 3,11).setValue("विभाग प्रमुख/ शाखा प्रमुख \n (हस्ताक्षर)").setHorizontalAlignment("center");
}
