function createTable() {
  const classList = [
    ["row1__col1", "row1__col2", "row1__col3"], // row 1
    ["row2__col1", "row2__col2", "row2__col3"], // row 2
    ["row3__col1", "row3__col2", "row3__col3"], // row 3
  ];
  var html = classList
    .map((element, index) => {
      return `<ul class="table__row row${index + 1}">
      ${element
        .map((childElement, childIndex) => {
          return `<li class="table__col ${childElement}"><span></span></li>`;
        })
        .join("")}
        </ul>`;
    })
    .join("");

  // append table to html src
  $(".table__game").append(html);
}

function handleClickCol() {
  var countTurn = 0;
  $("body").on("click", ".table__col", function () {
    const colSpan = this.querySelector("span");
    if (colSpan.innerText == "") {
      countTurn % 2 != 0
        ? (colSpan.innerText = "o")
        : (colSpan.innerText = "x");
      countTurn++;
    }
    checkResult(countTurn);
  }); // bind event click
}

function checkResult(countTurn) {
  const winner = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6],
  ];
  const list_col = [...$(".table__col")];
  let list_X = [];
  let list_O = [];
  list_col.forEach((element, index) => {
    if (element.querySelector("span").innerText == "x") {
      list_X.push(index);
    }
    if (element.querySelector("span").innerText == "o") {
      list_O.push(index);
    }
  });
  list_X.sort();
  list_O.sort();

  // check winner
  checkX = false;
  checkO = false;
  list_result_X = [];
  list_result_O = [];
  winner.forEach((e, index) => {
    if (compareArr(list_X, e)) {
      checkX = true;
      list_result_X = [...e];
    }
    if (compareArr(list_O, e)) {
      checkO = true;
      list_result_O = [...e];
    }
  });
  if (checkX) {
    $("h1").text("X chiến thắng !");
    fireworks("HAPPY", list_result_X);
    return;
  } else if (checkO) {
    $("h1").text("O chiến thắng !");
    fireworks("HAPPY", list_result_O);
    return;
  } else if (countTurn == 9) {
    $("h1").text("Hòa ^^");
    fireworks("HAPPY");
  }
}

function compareArr(check_arr, target_arr) {
  count = 0;
  check_arr.forEach((e) => {
    target_arr.forEach((child) => {
      if (e == child) {
        count++;
      }
    });
  });
  return count == 3 ? true : false;
}

// handle reload game btn
function reload() {
  $("button").click(() => {
    window.location.reload();
  });
}
reload();

// animation
function fireworks(WINNER, winnerId) {
  let chars, particles, canvas, ctx, w, h, current;
  let duration = 5000;
  let str = [WINNER, WINNER, WINNER, WINNER];

  init();
  resize();
  requestAnimationFrame(render);
  addEventListener("resize", resize);

  function makeChar(c) {
    let tmp = document.createElement("canvas");
    let size = (tmp.width = tmp.height = w < 400 ? 200 : 300);
    let tmpCtx = tmp.getContext("2d");
    tmpCtx.font = "bold " + size + "px Arial";
    tmpCtx.fillStyle = "white";
    tmpCtx.textBaseline = "middle";
    tmpCtx.textAlign = "center";
    tmpCtx.fillText(c, size / 2, size / 2);
    let char2 = tmpCtx.getImageData(0, 0, size, size);
    let char2particles = [];
    for (var i = 0; char2particles.length < particles; i++) {
      let x = size * Math.random();
      let y = size * Math.random();
      let offset = parseInt(y) * size * 4 + parseInt(x) * 4;
      if (char2.data[offset]) char2particles.push([x - size / 2, y - size / 2]);
    }
    return char2particles;
  }

  function init() {
    canvas = document.createElement("canvas");
    document.body.append(canvas);
    document.body.style.margin = 0;
    document.body.style.overflow = "hidden";
    document.body.style.background = "black";
    ctx = canvas.getContext("2d");
  }

  function resize() {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
    particles = innerWidth < 400 ? 55 : 99;
  }

  function makeChars(t) {
    let actual = parseInt(t / duration) % str.length;
    if (current === actual) return;
    current = actual;
    chars = [...str[actual]].map(makeChar);
  }

  function render(t) {
    makeChars(t);
    requestAnimationFrame(render);
    ctx.fillStyle = "#00000010";
    ctx.fillRect(0, 0, w, h);
    chars.forEach((pts, i) => firework(t, i, pts));
  }

  function firework(t, i, pts) {
    t -= i * 200;
    let id = i + chars.length * parseInt(t - (t % duration));
    t = (t % duration) / duration;
    let dx = ((i + 1) * w) / (1 + chars.length);
    dx += Math.min(0.33, t) * 100 * Math.sin(id);
    let dy = h * 0.5;
    dy += Math.sin(id * 4547.411) * h * 0.1;
    if (t < 0.33) {
      rocket(dx, dy, id, t * 3);
    } else {
      explosion(pts, dx, dy, id, Math.min(1, Math.max(0, t - 0.33) * 2));
    }
  }

  function rocket(x, y, id, t) {
    ctx.fillStyle = "white";
    let r = 2 - 2 * t + Math.pow(t, 15 * t) * 16;
    y = h - y * t;
    circle(x, y, r);
  }

  function explosion(pts, x, y, id, t) {
    let dy = t * t * t * 20;
    let r = Math.sin(id) * 1 + 3;
    r = t < 0.5 ? (t + 0.5) * t * r : r - t * r;
    ctx.fillStyle = `hsl(${id * 55}, 55%, 55%)`;
    pts.forEach((xy, i) => {
      if (i % 20 === 0)
        ctx.fillStyle = `hsl(${id * 55}, 55%, ${
          55 + t * Math.sin(t * 55 + i) * 45
        }%)`;
      circle(t * xy[0] + x, h - y + t * xy[1] + dy, r);
    });
  }

  function circle(x, y, r) {
    ctx.beginPath();
    ctx.ellipse(x, y, r, r, 0, 0, 6.283);
    ctx.fill();
  }

  if (winnerId) {
    [...$("li")].forEach((element, index) => {
      winnerId.forEach((childElement) => {
        if (index == childElement) {
          element.style.background = "rgba(21, 132, 36, 0.823)";
        }
      });
    });
  }
}
