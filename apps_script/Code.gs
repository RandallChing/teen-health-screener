function doGet() {
  // 1. Grab the email of the user opening the app
  var userEmail = Session.getActiveUser().getEmail();
  
  // 2. Write their email to the Apps Script Executions Log for audit trails
  console.log("Screener loaded by: " + userEmail);
  
  // 3. Serve the HTML file
  return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('Teen Health Screener')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}
