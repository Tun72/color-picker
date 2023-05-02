// Global Variable
const colors = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const allSliders = document.querySelectorAll(".slider");
const currentHex = document.querySelectorAll(".color h2");
const copyContainer = document.querySelector(".copy-container");
const controls = document.querySelectorAll(".controls");
const generate = document.querySelector(".generate");
const save = document.querySelector(".save");
const library = document.querySelector(".library");
// container

let initialColors;
// event

sliders.forEach((slider) => {
  slider.addEventListener("input", hslControl);
});

colors.forEach((color, index) => {
  color.addEventListener("change", () => {
    updateText(index);
  });
});

currentHex.forEach((header, index) => {
  header.addEventListener("click", () => {
    coptToClip(index);
  });
});

controls.forEach((el, index) => {
  // console.log(el);
  const child = el.querySelectorAll("button");
  child[0].addEventListener("click", () => {
    sliderShow(index);
  });

  child[1].addEventListener("click", function () {
    LockTheColor(child[1], index);
  });
});

generate.addEventListener("click", function () {
  setHexColor();
});

allSliders.forEach((el, index) => {
  const btn = el.querySelector("button");
  btn.addEventListener("click", () => {
    sliderRemove(index);
  });
});

// Functions

const generateHax = () => {
  return chroma.random();
};

const setHexColor = () => {
  initialColors = [];
  colors.forEach((col, index) => {
    let randomColor = generateHax();

    if (currentHex[index].classList.contains("locked")) {
      initialColors.push(currentHex[index].innerText);
      return;
    }
    initialColors.push(randomColor.hex());
    col.style.backgroundColor = randomColor;
    col.children[0].innerText = randomColor;
    // check

    checkContracts(randomColor, col.children[0]);

    // initial color
    const icons = controls[index].querySelectorAll("button");
    checkContracts(randomColor, icons[0]);
    checkContracts(randomColor, icons[1]);

    const sliders = col.querySelectorAll(".slider input");
    const saturation = sliders[2];
    const brightness = sliders[1];
    const hue = sliders[0];
    setRangeColor(randomColor, saturation, brightness, hue);
  });

  resultRange();
};
setHexColor();

// check contract
function checkContracts(color, text) {
  const luminance = chroma(color).luminance();
  if (luminance > 0.5) {
    text.style.color = "black";
  } else {
    text.style.color = "white";
  }
}

function setRangeColor(color, saturation, brightness, hue) {
  const noSat = color.set("hsl.s", 0);
  const fullSat = color.set("hsl.s", 1);
  const scaleSat = chroma.scale([noSat, color, fullSat]);

  const midBright = color.set("hsl.l", 0.5);
  const scaleBright = chroma.scale(["black", midBright, "white"]);

  saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(
    0
  )}, ${scaleSat(1)})`;
  brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBright(
    0
  )}, ${scaleBright(0.5)}, ${scaleBright(1)})`;
  hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;
}

function hslControl(e) {
  const index =
    e.target.getAttribute("data-bright") ||
    e.target.getAttribute("data-sat") ||
    e.target.getAttribute("data-hue");
  let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
  const saturation = sliders[2];
  const brightness = sliders[1];
  const hue = sliders[0];

  // chroma က color black and white တေ ကို saturation /brightness/ hue ထည့်လို့မရဘူး
  //   so we use color from initial instance of h2
  const bgColor = initialColors[index];

  let color = chroma(bgColor)
    .set("hsl.s", saturation.value)
    .set("hsl.l", brightness.value)
    .set("hsl.h", hue.value);
  colors[index].style.backgroundColor = color;

  setRangeColor(color, saturation, brightness, hue);
}

function updateText(index) {
  const activeColor = colors[index];
  const text = currentHex[index];

  const color = chroma(activeColor.style.backgroundColor);
  const icons = activeColor.querySelectorAll(".controls button");

  text.innerText = color.hex();
  checkContracts(color, icons[0]);
  checkContracts(color, icons[1]);
  checkContracts(color, text);
}

function resultRange() {
  const sliders = document.querySelectorAll(".slider input");
  sliders.forEach((slider, index) => {
    if (slider.name === "hue") {
      const hueColor = initialColors[slider.getAttribute("data-hue")];
      const hueValue = chroma(hueColor).hsl()[0];
      slider.value = Math.floor(hueValue);
    }
    if (slider.name === "brightness") {
      const brightColor = initialColors[slider.getAttribute("data-bright")];
      const brightValue = chroma(brightColor).hsl()[2];
      slider.value = Math.floor(brightValue * 100) / 100;
    }
    if (slider.name === "saturation") {
      const satColor = initialColors[slider.getAttribute("data-sat")];
      const satValue = chroma(satColor).hsl()[1];
      slider.value = Math.floor(satValue * 100) / 100;
    }
  });
}

function closePopup(className, element) {
  console.log(element);
  element.addEventListener("transitionend", () => {
    element.classList.remove(className);
    // console.log("hello");
  });
}

function coptToClip(index) {
  // console.log(header);
  const el = document.createElement("textarea");
  el.value = currentHex[index].innerText;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  copyContainer.classList.add("active-div");
  closePopup("active-div", copyContainer);
}

function sliderShow(index) {
  allSliders[index].classList.toggle("active");
}

function sliderRemove(index) {
  allSliders[index].classList.remove("active");
}

function LockTheColor(element, index) {
  currentHex[index].classList.toggle("locked");
  // console.log(currentHex, index);
  element.children[0].classList.toggle("fa-lock-open");
  element.children[0].classList.toggle("fa-lock");
  // console.log("hello");
}

// SAVE PART

const saveContainer = document.querySelector(".save-container");
const closeSave = document.querySelector(".close-save");
const submitSave = document.querySelector(".submit-save");
const saveInput = document.querySelector(".save-popup input");

save.addEventListener("click", function () {
  saveContainer.classList.add("active-div");
});

closeSave.addEventListener("click", function () {
  saveContainer.classList.remove("active-div");
});

submitSave.addEventListener("click", function () {
  let name = saveInput.value;
  if (name != "") {
    const data = {
      name,
      initialColors,
    };
    let colors = JSON.parse(localStorage.getItem("colors")) || [];
    colors.push(data);
    localStorage.setItem("colors", JSON.stringify(colors));
    saveInput.value = "";
    saveContainer.classList.remove("active-div");
  }
});

// Library
const libraryContainer = document.querySelector(".library-container");
const closeLibrary = document.querySelector(".close-library");
const libraryPopup = document.querySelector(".library-popup");

library.addEventListener("click", function () {
  libraryContainer.classList.add("active-div");
  let colors = localStorage.getItem("colors");
  colors = JSON.parse(colors);

  let name, colorDiv, selectBtn, showDiv;
  let colorAllDiv = document.createElement("div");
  colorAllDiv.classList.add("all-color-div");
  colors.forEach((item) => {
    name = document.createElement("h3");
    name.innerText = item.name;
    colorDiv = document.createElement("div");
    colorDiv.classList.add("colordiv");
    item.initialColors.forEach((col) => {
      let color = document.createElement("div");
      color.classList.add("colors-div");
      color.style.backgroundColor = col;
      colorDiv.appendChild(color);
    });

    selectBtn = document.createElement("button");
    selectBtn.classList.add("select-btn");
    selectBtn.innerText = "Select";

    colorDiv.appendChild(selectBtn);

    showDiv = document.createElement("div");
    showDiv.classList.add("show-div");
    showDiv.appendChild(name);
    showDiv.appendChild(colorDiv);

    colorAllDiv.appendChild(showDiv);
  });
  libraryPopup.appendChild(colorAllDiv);

  let selectButton = document.querySelectorAll(".select-btn");
  console.log(selectButton);

  selectButton.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      showColorsFromLibrary(index);
    })
  });
});

closeLibrary.addEventListener("click", function () {
  libraryContainer.classList.remove("active-div");
  libraryPopup.querySelector('.all-color-div').remove();
});

function showColorsFromLibrary(index) {
  initialColors = JSON.parse(localStorage.getItem("colors"))[index].initialColors;
  colors.forEach((col, index) => {
   
    col.style.backgroundColor = initialColors[index];
    col.children[0].innerText = initialColors[index];
    // check

    checkContracts(initialColors[index], col.children[0]);

    // initial color
    const icons = controls[index].querySelectorAll("button");
    checkContracts(initialColors[index], icons[0]);
    checkContracts(initialColors[index], icons[1]);

    const sliders = col.querySelectorAll(".slider input");
    const saturation = sliders[2];
    const brightness = sliders[1];
    const hue = sliders[0];
    setRangeColor(chroma(initialColors[index]), saturation, brightness, hue);
  });
  resultRange();
}
