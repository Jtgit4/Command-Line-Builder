$(document).ready(function() {
  const switchMap = {
    "Nmap": ["-sV", "-sC", "-Pn"],
    "Ncat": ["-nvlp"],
    "Curl": [],
    "FeroxBuster": [],
    "HashCat": []
  };

  let selectedCommand = "";

  $('#command-selection').on('click', '.list-group-item', function() {
    console.log("Button clicked!");

    selectedCommand = $(this).text();

    const switches = switchMap[selectedCommand] || [];

    $('#switch-selection-1').empty();

    for (let i = 0; i < switches.length; i++) {
      $('#switch-selection-1').append('<div class="custom-control custom-switch"><input type="checkbox" class="custom-control-input" id="switch' + i + '"><label class="custom-control-label" for="switch' + i + '">' + switches[i] + '</label></div>');
    }
  });

  $('#create-command-button').click(function() {
    let selectedSwitches = [];
    $('#switch-selection-1 .custom-control-input:checked').each(function() {
      selectedSwitches.push($(this).next('label').text());
    });

    let commandString = selectedCommand + " " + selectedSwitches.join(' ');

    // Additional logic sections based on selectedCommand
    switch (selectedCommand) {
      case "Nmap":
        if (selectedSwitches.includes("-Pn")) {
          commandString += "";
        }
        // Add more logic sections for Nmap if needed
        break;
      case "Ncat":
        // Add logic sections for Ncat
        break;
      case "Curl":
        // Add logic sections for Curl
        break;
      case "FeroxBuster":
        // Add logic sections for FeroxBuster
        break;
      case "HashCat":
        // Add logic sections for HashCat
        break;
      default:
        break;
    }

    $('#code-output').text(commandString);
  });
});
