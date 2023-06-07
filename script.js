$(document).ready(function() {
  const switchMap = {
    "Nmap": {"-sV": "Version detection", "-sC": "Script scan using the default set of scripts", "-Pn": "Treat all hosts as online", "-p": "Port selection"},
    "Ncat": {"-nvlp": "Verbose listening mode with local port"},
    "Curl": {},
    "FeroxBuster": {},
    "HashCat": {}
  };

  let selectedCommand = "";

  $('#command-selection').on('click', '.list-group-item', function() {
    selectedCommand = $(this).text();

    const switches = switchMap[selectedCommand] || {};

    $('#switch-selection-1').empty();

    for (const switchItem in switches) {
      $('#switch-selection-1').append('<div class="switch-group"><div class="custom-control custom-switch switch-button" id="' + switchItem + '">' + switchItem + '</div><div class="switch-description">' + switches[switchItem] + '</div></div>');
    }

    // Bind click event to switches
    $('.switch-button').click(function() {
      $(this).toggleClass('selected');
    });
  });

  $('#create-command-button').click(function() {
    let selectedSwitches = [];
    $('#switch-selection-1 .selected').each(function() {
      selectedSwitches.push($(this).attr('id'));
    });

    // Get the input values
    let targetIp = $('#target-ip').val();
    let targetPort = $('#target-port').val();
    let attackingIp = $('#attacking-ip').val();
    let attackingPort = $('#attacking-port').val();

    // Default command string
    let commandString = selectedCommand;

    // Additional logic sections based on selectedCommand
    switch (selectedCommand) {
      case "Nmap":
        if (selectedSwitches.includes("-p")) {
          // Remove "-p" from selectedSwitches
          selectedSwitches = selectedSwitches.filter(switchItem => switchItem !== "-p");
          // Append other switches and target IP first
          if (selectedSwitches.length > 0) {
            commandString = "nmap " + selectedSwitches.join(' ') + " " + targetIp;
          }
          // Append -p and target port last
          commandString += " -p " + targetPort;
        } else {
          // If -p is not selected, format is command + switches + target IP
          if (selectedSwitches.length > 0) {
            commandString = "nmap " + selectedSwitches.join(' ') + " " + targetIp;
          }
        }
        break;
      case "Ncat":
        commandString = "nc" + " " + selectedSwitches.join(' ') + " " + attackingPort;
        break;
      // Add logic sections for other commands here...
      default:
        break;
    }

    generateCommand(commandString);
  });

  function generateCommand(commandString) {  
    // Get the command output container
    let container = $('#code-output');

    // Remove old command if it exists
    let oldCommand = $('#generated-command');
    if (oldCommand.length) {
      oldCommand.remove();
    }

    // Create a new div with the command and append it to the container
    let commandDiv = $('<div></div>');
    commandDiv.attr('id', 'generated-command');
    commandDiv.text(commandString); // replace with your actual command text
    container.append(commandDiv);
  }

  $('#copy-to-clipboard').click(function() {
    let copyText = $('#generated-command');

    if (copyText.length) {
      // Create a temporary textarea to hold the content
      let tempElement = $('<textarea></textarea>');
      tempElement.val(copyText.text()); // Get the text content
      $('body').append(tempElement);

      /* Select the text field */
      tempElement.select();
      tempElement[0].setSelectionRange(0, 99999); /*For mobile devices*/

      /* Copy the text inside the text field */
      document.execCommand("copy");

      /* Alert the copied text */
      alert("Copied the text: " + tempElement.val());

      // Remove the temporary element
      tempElement.remove();
    } else {
      console.error("Element with id 'generated-command' not found");
    }
  });
});
