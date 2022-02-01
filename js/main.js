(function () {
  "use strict";

  const els = {
    //   initElements is a static method in Page Factory class.
    // Using the initElements method, one can initialize all the web
    // elements located by @FindBy annotation.
    //   @FindBy: An annotation used in Page Factory to locate and declare
    // web elements using different locators.Below is an example of
    // declaring an element using @FindBy
    s: initElements("s"),
    m: initElements("m"),
    h: initElements("h"),
  };
  function initElements(type) {
    const els = [{}, {}];
    if (!["s", "m", "h"].includes(type)) return els;
    const target = document.querySelector(`.flip-clock-${type}`);
    if (!target) return els;
    let el;
    el = els[0];
    el.digit = target.querySelector(".digit-left");
    el.card = el.digit.querySelector(".card");
    el.cardFaces = el.card.querySelectorAll(".card-face");
    el.cardFaceA = el.cardFaces[0];
    el.cardFaceB = el.cardFaces[1];
    el = els[1];
    el.digit = target.querySelector(".digit-right");
    el.card = el.digit.querySelector(".card");
    el.cardFaces = el.card.querySelectorAll(".card-face");
    el.cardFaceA = el.cardFaces[0];
    el.cardFaceB = el.cardFaces[1];
    return els;
  }
  (function runClock() {
    const date = new Date();
    const now = {
      h: date.getHours(),
      m: date.getMinutes(),
      s: date.getSeconds(),
    };
    now.h = now.h < 10 ? `0${now.h}` : `${now.h}`;
    now.m = now.m < 10 ? `0${now.m}` : `${now.m}`;
    now.s = now.s < 10 ? `0${now.s}` : `${now.s}`;
    now.h0 = now.h[0];
    now.h1 = now.h[1];
    now.m0 = now.m[0];
    now.m1 = now.m[1];
    now.s0 = now.s[0];
    now.s1 = now.s[1];
    console.log(
      `${now.h0} ${now.h1} : ${now.m0} ${now.m1} : ${now.s0} ${now.s1}`
    );
    //The Object.keys() method returns an array of a given object's own
    // enumerable property names, iterated in the same order that a normal
    // loop would.
    for (const t of Object.keys(els)) {
      for (const i of ["0", "1"]) {
        const curr = now[`${t}${i}`];
        let next = +curr + 1;
        if (t === "h") {
          if (i === "0") next = next < 3 ? `${next}` : "0";
          if (i === "1") next = next < 4 ? `${next}` : "0";
        }
        if (t === "m") {
          if (i === "0") next = next < 6 ? `${next}` : "0";
          if (i === "1") next = next < 10 ? `${next}` : "0";
        }
        if (t === "s") {
          if (i === "0") next = next < 6 ? `${next}` : "0";
          if (i === "1") next = next < 10 ? `${next}` : "0";
        }
        const el = els[t][i];
        if (el && el.digit) {
          //   The Element.before() method inserts a set of Node or
          // DOMString objects in the children list of this Element's
          //   parent, just before this Element
          if (!el.digit.dataset.digitBefore) {
            el.digit.dataset.digitBefore = curr;
            el.cardFaceA.textContent = el.digit.dataset.digitBefore;
            el.digit.dataset.digitAfter = next;
            el.cardFaceB.textContent = el.digit.dataset.digitAfter;
          } else if (el.digit.dataset.digitBefore !== curr) {
            el.card.addEventListener(
              "transitionend",
              function () {
                el.digit.dataset.digitBefore = curr;
                el.cardFaceA.textContent = el.digit.dataset.digitBefore;
                //   The cloneNode() method of the Node interface returns a
                // duplicate of the node on which this method was called. Its
                // parameter controls if the subtree contained in a node is
                // also cloned or not.
                const cardClone = el.card.cloneNode(true);
                cardClone.classList.remove("flipped");
                //   The replaceChild() method of the Node element replaces
                // a child node within the given(parent) node.
                el.digit.replaceChild(cardClone, el.card);
                el.card = cardClone;
                el.cardFaces = el.card.querySelectorAll(".card-face");
                el.cardFaceA = el.cardFaces[0];
                el.cardFaceB = el.cardFaces[1];
                el.digit.dataset.digitAfter = next;
                el.cardFaceB.textContent = el.digit.dataset.digitAfter;
              },
              {
                once: true,
              }
            );
            if (!el.card.classList.contains("flipped")) {
              el.card.classList.add("flipped");
            }
          }
        }
      }
    }
    // The global setTimeout() method sets a timer which executes a function
    // or specified piece of code once the timer expires.
    setTimeout(runClock, 1000);
  })();
})();
