$(document).ready(function () {
  "use strict";
  $(window).bind("resize", draggableHandler);
  var days = ["Sun.", "Mon.", "Tue.", "Wed.", "Thu", "Fri.", "Sat."];
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  var currentdate = new Date();
  var dateInterval = setInterval(function () {
    setDate();
  }, 1000);

  var draggableEnabled = false;
  draggableHandler();

  function draggableHandler() {
    if (checkWindowSizeForMaximize()) {
      if (draggableEnabled) {
        $("#terminal-window").draggable("destroy");
        $(".window").removeAttr("style");
        draggableEnabled = false;
      }
    } else {
      if (!draggableEnabled) {
        $("#terminal-window")
          .draggable({
            containment: "body",
            scroll: false,
            handle: ".handle",
          })
          .css({ top: "0", left: "33vw" });
        draggableEnabled = true;
      }
    }
  }

  // UTILITY
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // END UTILITY

  // COMMANDS
  function clear() {
    terminal.text("");
  }

  function setDate() {
    currentdate = new Date();
    dateLabel.html(
      days[currentdate.getDay()] +
        " " +
        currentdate.getDate() +
        " " +
        months[currentdate.getMonth()] +
        " " +
        `0${currentdate.getHours()}`.slice(-2) +
        ":" +
        `${currentdate.getMinutes()}` +
        ":" +
        `0${currentdate.getSeconds()}`.slice(-2)
    );
  }

  function skills() {
    if (!checkWindowSizeForMaximize()) {
      cleanUpBeforeProcessCmd();
      $("body").append(
        '<script id="skills-js" defer src="/assets/js/skills.js"></script>'
      );
    }
  }

  function cleanUpBeforeProcessCmd() {
    $("#skills-js").remove();
    $(".dock").remove();
  }

  function help() {
    $.each(commands, (i, command) => {
      terminal.append(
        `${command.name} ${command.usage ? `(${command.usage})` : ""}- ${
          command.description
        } \n`
      );
    });
  }

  function resume() {
    var link = document.createElement("a");
    link.href = "/assets/serhatkaya.pdf";
    link.download = "serhatkaya.pdf";
    link.dispatchEvent(new MouseEvent("click"));
  }
  function intro() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/intro.html", false);
    xhr.send(null);

    if (xhr.status === 200) {
      terminal.append("\n" + xhr.response + "\n");
    }
  }

  function echo(args) {
    var str = args.join(" ");
    terminal.append(str + "\n");
  }

  function fortune() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.quotable.io/random", false);
    xhr.send(null);

    if (xhr.status === 200) {
      const r = JSON.parse(xhr.response);
      terminal.append(
        r.content +
          "\n" +
          `&emsp;&emsp;&emsp;<strong>- ${r.author}</strong>` +
          "\n"
      );
    } else {
      terminal.append(
        `<strong style="color:red;">Error while getting random quote.</strong>\n`
      );
    }
  }
  // END COMMANDS

  var title = $(".title");
  var terminal = $(".terminal");
  var dateLabel = $("#date");
  var prompt = "➜";
  var path = "~";
  var container = $(".container");

  var commandHistory = [];
  var historyIndex = 0;

  var command = "";
  var commands = [
    {
      name: "clear",
      description: "Clears the terminal.",
      function: clear,
    },
    {
      name: "help",
      description: "Get help about terminal commands.",
      function: help,
    },
    {
      name: "fortune",
      function: fortune,
      description: "Random quote from random person.",
    },
    {
      name: "echo",
      usage: "echo 'text'",
      description: "Print a text.",
      function: echo,
    },
    {
      name: "intro",
      description: "Prints intro text.",
      function: intro,
    },
    {
      name: "resume",
      description: "Download the resume.",
      function: resume,
    },
    {
      name: "skills",
      description: "View skills.",
      function: skills,
    },
  ];

  function processCommand() {
    var isValid = false;

    // Create args list by splitting the command
    // by space characters and then shift off the
    // actual command.
    var checkedCommand = strip_tags(command);
    var args = checkedCommand.split(" ");
    var cmd = args[0];
    args.shift();

    // Iterate through the available commands to find a match.
    // Then call that command and pass in any arguments.
    for (var i = 0; i < commands.length; i++) {
      if (cmd === commands[i].name) {
        // cleanUpBeforeProcessCmd();
        commands[i].function(args);
        isValid = true;
        break;
      }
    }

    // No match was found...
    if (!isValid) {
      terminal.append("zsh: command not found: " + command + "\n");
      clue();
    }

    // Add to command history and clean up.
    commandHistory.push(command);
    historyIndex = commandHistory.length;
    command = "";
    terminal.animate({ scrollTop: $(document).height() }, 1000);
  }

  function strip_tags(str, allow) {
    //to prevent xss attack.
    allow = (
      ((allow || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []
    ).join("");

    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
    var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
    return str.replace(commentsAndPhpTags, "").replace(tags, function ($0, $1) {
      return allow.indexOf("<" + $1.toLowerCase() + ">") > -1 ? $0 : "";
    });
  }

  function displayPrompt() {
    terminal.append('<span class="prompt">' + prompt + "</span> ");
    terminal.append('<span class="path">' + path + "</span> ");
  }

  // Delete n number of characters from the end of our output
  function erase(n) {
    command = command.slice(0, -n);
    terminal.html(terminal.html().slice(0, -n));
  }

  function clearCommand() {
    if (command.length > 0) {
      erase(command.length);
    }
  }

  function appendCommand(str) {
    terminal.append(str);
    command += str;
  }

  function clue() {
    terminal.append("Type help to view available commands.\n");
  }

  function checkWindowSizeForMaximize() {
    return window.matchMedia("(max-width: 1023px)").matches;
  }

  $(document).keydown(function (e) {
    e = e || window.event;
    var keyCode = typeof e.which === "number" ? e.which : e.keyCode;

    // BACKSPACE
    if (
      keyCode === 8 &&
      e.target.tagName !== "INPUT" &&
      e.target.tagName !== "TEXTAREA"
    ) {
      e.preventDefault();
      if (command !== "") {
        erase(1);
      }
    }

    // UP or DOWN
    if (keyCode === 38 || keyCode === 40) {
      e.preventDefault();
      // Move up or down the history
      if (keyCode === 38) {
        // UP
        historyIndex--;
        if (historyIndex < 0) {
          historyIndex++;
        }
      } else if (keyCode === 40) {
        // DOWN
        historyIndex++;
        if (historyIndex > commandHistory.length - 1) {
          historyIndex--;
        }
      }

      // Get command
      var cmd = commandHistory[historyIndex];
      if (cmd !== undefined) {
        clearCommand();
        appendCommand(cmd);
      }
    }
  });

  $(document).keypress(function (e) {
    // Make sure we get the right event
    e = e || window.event;
    var keyCode = typeof e.which === "number" ? e.which : e.keyCode;

    // Which key was pressed?
    switch (keyCode) {
      // ENTER
      case 13: {
        terminal.append("\n");
        processCommand();
        displayPrompt();
        break;
      }
      default: {
        appendCommand(String.fromCharCode(keyCode));
      }
    }
  });

  // Set the window title
  title.text("serhatkaya@mac: ~ (zsh)");

  // Get the date for our fake last-login
  var currentdate = new Date().toString();
  currentdate = currentdate.substr(0, currentdate.indexOf("GMT") - 1);

  // Display last-login and promt
  terminal.append("Last login: " + currentdate + " on ttys000\n");
  clue();
  displayPrompt();
});
