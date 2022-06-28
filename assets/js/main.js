$(document).ready(function () {
  ("use strict");
  $(window).bind("resize", draggableHandler);
  var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
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

  function renderSkills() {
    $.each(skills, function (i, skill) {
      if (skill.alt) {
        terminal.append(
          `<a class="skill-line" id="skill-${i}" >- ${skill.alt} <img class="skill" src="/assets/svg/skills/${skill.src}"/> \n </a>`
        );
        $(`#skill-${i}`).on("click", function () {
          var a = document.createElement("a");
          a.href = skill.href;
          a.target = "_blank";
          a.click();
        });
      }
    });
  }

  function renderExperiences() {
    terminal.append(
      `<table border="1" id="experienceTable">
            <thead>
              <tr>
                <th>Company</th>
                <th>Title</th>
                <th>Location</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
      ` + "\n"
    );
    const experienceTable = $("#experienceTable tbody");
    $.each(experiences, function (i, experience) {
      experienceTable.append(`
      <tr>
        <td>${experience.company}</td>
        <td>${experience.title}</td>
        <td>${experience.location}</td>
        <td>${experience.date}</td>
      `);
    });
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
    link.href = "/assets/resume.pdf";
    link.download = "resume.pdf";
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
  terminal.on("click", function () {
    $("#hiddenText").focus();
    $("#hiddenText").click();
  });

  var dateLabel = $("#date");
  var prompt = "➜";
  var path = "~";

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
      description: "List of skills.",
      function: renderSkills,
    },
    {
      name: "experience",
      description: "List of experiences.",
      function: renderExperiences,
    },
    {
      name: "contact",
      description: "Send me a message.",
      function: contact,
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
    setTimeout(() => {
      terminal.animate({ scrollTop: terminal.prop("scrollHeight") }, 1000);
    }, 10);
  }

  var emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

  function contact(args) {
    if (args.length < 2) {
      terminal.append(`Usage: contact &lt;email&gt; &lt;message&gt; \n`);
    } else {
      const email = args[0];
      const message = args.slice(0).join(" ");
      if (!emailRegex.test(email)) {
        terminal.append(`Please provide a valid e-mail address. \n`);
      } else {
        var fd = new FormData();
        fd.append("_replyto", email);
        fd.append("message", message);
        $.ajax({
          method: "post",
          processData: false,
          contentType: false,
          headers: {
            accept: " application/json, text/plain, */*",
          },
          cache: false,
          data: fd,
          enctype: "multipart/form-data",
          url: "https://formspree.io/f/mqkwjppn",
          success: function (response) {
            terminal.append(
              "I got your message, I will get to back you soon. \n"
            );
            displayPrompt();
          },
        });
      }
    }
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
  intro();
  clue();
  displayPrompt();
});

var skills = [
  {
    href: "https://docs.microsoft.com/tr-tr/dotnet/csharp/",
    src: "csharp-original.svg",
    alt: "C#",
    skill: true,
  },
  {
    href: "https://www.javascript.com/",
    src: "javascript-original.svg",
    alt: "javascript",
    skill: true,
  },
  {
    href: "https://www.typescriptlang.org/",
    src: "typescript-original.svg",
    alt: "typescript",
    skill: true,
  },
  {
    href: "https://html.com/",
    src: "html5-original-wordmark.svg",
    alt: "HTML",
    skill: true,
  },
  {
    href: "https://www.w3.org/Style/CSS/Overview.en.html",
    src: "css3-original-wordmark.svg",
    alt: "CSS",
    skill: true,
  },
  {
    href: "https://sass-lang.com/",
    src: "sass-original.svg",
    alt: "Sass",
    skill: true,
  },
  {
    href: "https://dotnet.microsoft.com/en-us/",
    src: "netcore.svg",
    alt: ".NETCore",
    skill: true,
  },
  {
    href: "https://angular.io/",
    src: "angular.svg",
    alt: "Angular",
    skill: true,
  },
  {
    href: "https://vuejs.org/",
    src: "vuejs-original-wordmark.svg",
    alt: "VueJs",
    skill: true,
  },
  {
    href: "https://expressjs.com/",
    src: "express-original-wordmark.svg",
    alt: "expressjs",
    skill: true,
  },
  {
    href: "https://nestjs.com/",
    src: "nestjs.svg",
    alt: "NestJS",
    skill: true,
  },
  {
    href: "https://nodejs.org/en/",
    src: "nodejs-original-wordmark.svg",
    alt: "NodeJS",
    skill: true,
  },
  {
    href: "https://d3js.org/",
    src: "d3js-original.svg",
    alt: "d3js",
    skill: true,
  },
  {
    href: "https://jquery.com/",
    src: "jquery-vertical.svg",
    alt: "jQuery",
    skill: true,
  },
  {
    href: "https://www.rabbitmq.com/",
    src: "rabbitmq.svg",
    alt: "RabbitMQ",
    skill: true,
  },
  {
    href: "https://www.linux.org/",
    src: "linux-original.svg",
    alt: "Linux",
    skill: true,
  },
  {
    href: "https://git-scm.com/",
    src: "git.svg",
    alt: "git",
    skill: true,
  },
  {
    href: "https://www.docker.com/",
    src: "docker-original-wordmark.svg",
    alt: "docker",
    skill: true,
  },
];

var experiences = [
  {
    title: "IT Technician",
    date: "March 2016, April 2016",
    company: "Plymouth Argyle Football Club",
    location: "Plymouth, United Kingdom",
  },
  {
    title: "Fullstack Developer",
    date: "March 2021, January 2022",
    company: "Amatis Software Engineering",
    location: "Izmir, Turkey",
  },
  {
    title: "Software Developer",
    date: "January 2022, Present",
    company: "Emakina",
    location: "Izmir, Turkey",
  },
];
