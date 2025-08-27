// ---------THIS FILE IS THE AI ENHANCED VERSION OF THE DEFAULT EXAMPLE PROVIDED BY ZOHO---------
//<script src="https://static.zohocdn.com/catalyst/sdk/js/4.5.0/catalystWebSDK.js"></script>
function showProfile() {
  debugger;
  //The catalyst.auth.isUserAuthenticated() method allows only authenticated users, i.e., the users who are logged in, to access the pages
  //You can load this method in the body of your page to allow only authenticated users to access a particular page
  catalyst.auth
    .isUserAuthenticated()
    .then((result) => {
      //If the user is logged in, these contents of the page will be displayed to the user
      document.body.style.visibility = "visible";
      const first_name = "First Name: " + result.content.first_name;
      document.getElementById("fname").innerHTML = first_name;
      const last_name = "Last Name: " + result.content.last_name;
      document.getElementById("lname").innerHTML = last_name;
      const mailid = "Email Address: " + result.content.email_id;
      document.getElementById("mailid").innerHTML = mailid;
      const tzone = "Time Zone: " + result.content.time_zone;
      document.getElementById("tzone").innerHTML = tzone;
      const created_time = " Joined On: " + result.content.created_time;
      document.getElementById("ctime").innerHTML = created_time;
    })
    .catch((err) => {
      //If the user is not logged in, this will be displayed to the user and they will be redirected to the login page
      document.body.style.visibility = "visible";
      document.body.innerHTML = `
      <div class="container">
        <div class="card">
          <div class="profile-header">
            <div class="error-icon">
              <i class="fa fa-exclamation-triangle" style="font-size: 48px; color: #e53e3e;"></i>
            </div>
            <h1 class="page-title" style="color: #e53e3e;">Access Denied</h1>
          </div>
          
          <div class="profile-info">
            <div class="info-item" style="background: #fef5f5; border-left-color: #e53e3e;">
              <span class="info-label" style="color: #c53030;">Authentication Required</span>
              <p class="info-value" style="color: #2d3748;">You are not logged in. Please log in to continue.</p>
            </div>
            
            <div class="info-item" style="background: #f0fff4; border-left-color: #38a169;">
              <span class="info-label" style="color: #2f855a;">Redirecting...</span>
              <p class="info-value" style="color: #2d3748;">You will be redirected to the login page in <span id="countdown">5</span> seconds</p>
            </div>
          </div>
          
          <div class="logout-section">
            <button class="logout-btn" style="background: linear-gradient(135deg, #38a169 0%, #2f855a 100%);" onclick="window.location.href = buildRedirectURL('/__catalyst/auth/login')">
              <i class="fa fa-sign-in"></i> Go to Login
            </button>
          </div>
        </div>
      </div>
    `;

      // Countdown timer
      let countdown = 5;
      const countdownElement = document.getElementById("countdown");
      const timer = setInterval(() => {
        countdown--;
        if (countdownElement) {
          countdownElement.textContent = countdown;
        }
        if (countdown <= 0) {
          clearInterval(timer);
          window.location.href = buildRedirectURL("/__catalyst/auth/login");
        }
      }, 1000);
    });
}
function logout() {
  const redirectURL = buildRedirectURL("/__catalyst/auth/login");
  catalyst.auth.signOut(redirectURL);
}

function buildRedirectURL(path) {
  const hostname =
    location.hostname === "localhost" ? "localhost:3000" : location.hostname;
  const redirectURL = location.protocol + "//" + hostname + path;
  return redirectURL;
}
