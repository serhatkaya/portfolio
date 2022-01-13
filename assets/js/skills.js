$(document).ready(function () {
  $(`<div class="dock"><div class="dock-container">`).insertBefore(
    "#jquery-js"
  );
  dock = $(".dock-container");
  dock.append(`
  <li class="li-1">
    <div class="name">Terminal</div>
    <img
     class="ico"
     src="/assets/svg/terminal-1.svg"
    />
  </li>`);
  $.each(skills, function (i, skill) {
    if (skill.skill) {
      dock.append(
        `
      <li class="li-${i + 2}">
        <div class="name">${skill.alt}</div>
        <img
          class="ico"
          src="/assets/svg/skills/${skill.src}"
          alt="${skill.alt}"
        />
    </li>`
      );

      $(`.li-${i + 2}`).on("click", () => {
        var a = document.createElement("a");
        a.href = skill.href;
        a.target = "_blank";
        a.click();
      });
    }
  });
});

skills = [
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
    skill: false,
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
    skill: false,
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
  {
    skill: false,
  },
];
