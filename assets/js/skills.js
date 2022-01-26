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
  $.each(social, function (i, link) {
    if (link.name) {
      dock.append(
        `
      <li class="li-${i + 2}">
        <div class="name">${link.name}</div>
        <img
          class="ico"
          src="/assets/img/social/${link.src}"
          alt="${link.name}"
        />
    </li>`
      );

      $(`.li-${i + 2}`).on("click", () => {
        var a = document.createElement("a");
        a.href = link.href;
        a.target = "_blank";
        a.click();
      });
    }
  });
});

social = [
  {
    name: "Linkedin",
    href: "https://www.linkedin.com/in/kaya-serhat/",
    src: "lin.svg",
  },
  {
    name: " Github",
    href: "https://github.com/serhatkaya",
    src: "github.svg",
  },
  {
    name: "Stackblitz",
    href: "https://stackblitz.com/@serhatkaya",
    src: "stackblitz.png",
  },
  {
    name: "npm",
    href: "https://www.npmjs.com/~serhatkaya",
    src: "npm.svg",
  },
  {
    name: "codepen",
    href: "https://codepen.io/serhatkaya",
    src: "codepen.svg",
  },
  {
    name: "DEV.TO",
    href: "https://dev.to/serhatkaya",
    src: "devto.svg",
  },
];
