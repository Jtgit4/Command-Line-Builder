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
/*  const codeDescription = document.getElementById("code-description");
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
*/
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

    // Remove the "active" class from all tool buttons
    document.querySelectorAll('.tablinks').forEach(button => button.classList.remove('active'));

    // Add the "active" class to the clicked tool button
    evt.currentTarget.classList.add('active');
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
  // Get the selected tool
  const tool = document.querySelector('.tablinks.active').getAttribute('data-tool');

  // Get the active switch buttons for the selected tool
  const activeSwitches = Array.from(document.querySelectorAll(`.switch-button[data-tool="${tool}"].selected`));

  // Generate the switches string
  const switches = activeSwitches.map(button => button.getAttribute('data-switch-value')).join(' ');

  // Get the target IP and port, and the attacking IP and port
  const targetIP = document.getElementById('target-ip').value;
  const targetPort = document.getElementById('target-port').value;
  const attackingIP = document.getElementById('attacking-ip').value;
  const attackingPort = document.getElementById('attacking-port').value;

  let command;

  // Generate the command based on the selected tool
  switch (tool) {
    case 'nmap':
      command = `nmap ${switches}`;
      if(targetIP){
        command += ` ${targetIP}`;
        if(targetPort) command += `:${targetPort}`;
      }
      break;
    case 'ncat':
      command = `nc ${switches}`;
      if(attackingPort){
        command += ` ${attackingPort}`;
      }
      break;
  }

  // Set the command in the textarea
  document.getElementById('generated-command').value = command;
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

function switchTool() {
  const tool = this.value;

  // Get all switch buttons
  const switchButtons = document.querySelectorAll('.switch-button');

  // Switch tool when a radio button is selected
  document.querySelectorAll('input[name="tool"]').forEach(radioButton => {
    radioButton.addEventListener('change', switchTool);
  });

  // Show or hide each switch button depending on the selected tool
  switchButtons.forEach(button => {
    if (button.getAttribute('data-tool') === tool) {
      button.parentElement.style.display = 'block';
    } else {
      button.parentElement.style.display = 'none';
      button.classList.remove('active'); // Deselect the switch
    }
  });
}


function toggleSwitch(button) {
  button.classList.toggle('active');
}
