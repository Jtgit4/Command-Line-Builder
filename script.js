// Nmap switch options
const nmapSwitches = [
  { value: "-sV", label: "-sV (Service Version Scan)" },
  { value: "-sC", label: "-sC (Script Scan)" },
  { value: "-oA", label: "-oA (Output to All Formats)" },
  { value: "-Pn", label: "-Pn (Disable Host Discovery)" },
  { value: "-p", label: "-p (Port Scan)" },
];


// Function to update the code description based on the selected command and switches
function updateCodeDescription(nmapSwitchButtons) {
  const codeDescription = document.getElementById("code-description");
  codeDescription.innerHTML = "";

  // Check if nmap tab is active
  if (document.getElementById("nmap").style.display === "block") {
    if (nmapSwitchButtons.length > 0) {
      codeDescription.textContent = "Nmap command with the following switches:";
      nmapSwitchButtons.forEach((button) => {
        const switchDescription = document.createElement("p");
        switchDescription.textContent = button.textContent;
        codeDescription.appendChild(switchDescription);
      });
    } else {
      codeDescription.textContent = "Performs a scan on the target IP and port using Nmap";
    }
  }
}

// JavaScript Code
function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

// Function to initialize switch buttons
function initSwitchButtons() {
  const switchButtons = document.querySelectorAll('.switch-button');

  switchButtons.forEach((button) => {
    button.addEventListener('click', () => {
      button.classList.toggle('selected');
    });
  });
}

// Function to generate the command based on the selected options
function generateCommand() {
  const targetIP = document.getElementById("target-ip").value;
  const targetPort = document.getElementById("target-port").value;

  // We find the selected tab using the 'active' class
  const activeTab = document.querySelector(".tablinks.active").innerText.toLowerCase();

  let command = "";

  if (activeTab === 'nmap') {
    command = "nmap ";
    
    const nmapSwitchButtons = document.querySelectorAll("#nmap .switch-button.selected");
    let portSwitch = false;

    nmapSwitchButtons.forEach((button) => {
      // Only add the -p switch value to command if it is not the -p switch
      if (button.dataset.switchValue !== "-p") {
        command += button.dataset.switchValue + " ";
      } else {
        portSwitch = true;
      }
    });

    // Add IP address and port in the correct position based on whether the -p switch is active
    if(portSwitch){
      command += targetIP + " ";
      command += "-p " + targetPort + " ";
    } else {
      command += targetIP + " ";
    }

    updateCodeDescription(nmapSwitchButtons);
  }

  // Similar conditions for other tools like Gobuster, FeroxBuster, etc., can be added here

  document.getElementById("generated-command").value = command;
}

window.onload = function() {
  // Initialize switch buttons when the page loads
  initSwitchButtons();
};

async function callChatGPT() {
  const command = document.getElementById("generated-command").value;
  const apiKey = document.getElementById("api-key").value;
  const url = 'https://api.openai.com/v1/chat/completions';
  const data = {
      prompt: command,
      max_tokens: 100
  };

  const response = await fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify(data)
  });

  const responseData = await response.json();

  if (response.ok) {
      document.getElementById("gpt-response").value = responseData.choices[0].text;
  } else {
      document.getElementById("gpt-response").value = 'Error: ' + responseData.error.message;
  }
}

function toggleChatGPTExplainer() {
  var explainerContent = document.querySelector('.chat-gpt-explainer-content');
  if (explainerContent.style.display === "none") {
    explainerContent.style.display = "block";
  } else {
    explainerContent.style.display = "none";
  }
}