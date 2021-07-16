(function () {
  function _slideShow(options) {
    if (!options.el) {
      throw new Error("el is empty");
    }
    const defaultOpts = {
      boxSize: {
        width: 0,
        height: 0,
      },
      container: null,
      items: [],
      sliderIndex: 0,
      speed: 500,
      autoPlay: false,
      useDots: false,
    }
    this.options = Object.assign(defaultOpts, options);
    this.init();
  }

  _slideShow.prototype = {
    init: function () {
      var { el, autoPlay } = this.options;

      //
      this.isAciveBtns = true;


      //calculate boxsize
      this.options.boxSize.width = parseInt(window.getComputedStyle(el).width) - 100;
      this.options.boxSize.height = 300;


      this.draw();
      this.setEventListener();
      if (autoPlay) {
        this.play();
      }
    },
    draw: function () {
      var { el, boxSize, items, useDots } = this.options;
      el.classList.add("my-slider");

      var prevBtn = document.createElement("button");
      prevBtn.className = "prev-btn";
      prevBtn.innerHTML = "<";
      el.appendChild(prevBtn);
      this.prevBtn = prevBtn;

      var nextBtn = document.createElement("button");
      nextBtn.className = "next-btn";
      nextBtn.innerHTML = ">";
      el.appendChild(nextBtn);
      this.nextBtn = nextBtn;

      var box = document.createElement("div");
      box.className = "my-slider-box";


      var boxContainer = document.createElement("div");
      boxContainer.className = "my-slider-container";
      box.appendChild(boxContainer);
      this.options.container = boxContainer;
      const boxContainerWidth = boxSize.width * (items.length + 3);
      boxContainer.style.width = `${boxContainerWidth}px`;
      boxContainer.style.height = `${boxSize.height}px`;

      const itemElements = items.map((i, index) => {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        var div = document.createElement("div");
        div.innerHTML = i;
        div.className = "slide-item";
        div.style.width = `${boxSize.width}px`;
        // div.style.left = `${index * boxSize.width}px`;
        div.style['background-color'] = `#${randomColor}`;
        return div
      })
      boxContainer.append(...itemElements);
      this.boxContainer = boxContainer;
      el.appendChild(box);


      boxContainer.appendChild(itemElements[0].cloneNode(true));
      boxContainer.insertBefore(itemElements[itemElements.length - 1].cloneNode(true), itemElements[0]);

      this.currentPosition = -boxSize.width;
      boxContainer.style.transform = `translateX(${this.currentPosition}px)`;

      if (useDots) {
        this.drawDot();
      }
    },
    drawDot() {
      var { el, items } = this.options;
      var dotContainer = document.createElement("div");
      dotContainer.className = "dot-container";
      var dots = [];
      for (let item in items) {
        var dot = document.createElement("div");
        dot.className = "dot";
        dots.push(dot);
        // dotContainer.appendChild(dot);
      }
      dots[0].classList.add("active");
      dotContainer.append(...dots);
      el.appendChild(dotContainer);

      this.dots = dots;
    },
    setEventListener: function () {
      var { useDots } = this.options;

      const self = this;
      this.prevBtn.addEventListener("click", function (e) {
        // console.log(e);
        self.moveLeft();
      });

      this.nextBtn.addEventListener("click", function (e) {
        // console.log(e);
        self.moveRight();
      });

      this.options.container.addEventListener('transitionend', this.checkIndex.bind(this));

      if (useDots) {
        for (let dot of this.dots) {
          dot.addEventListener("click", function (e) {
            const target = e.target;
            const index = this.dots.indexOf(target);
            if (this.options.sliderIndex != index) {
              this.moveTo(index);
            }
          }.bind(this))
        }
      }
    },
    play: function () {
      var { container, boxSize, sliderIndex, items, speed } = this.options;
    },
    moveTo: function (toIdx) {
      // if (!this.isAciveBtns) {
      //   return;
      // }
      // this.isAciveBtns = false;

      var { container, boxSize, sliderIndex, items, speed } = this.options;
      container.style['transition'] = `transform ease ${speed}ms`;

      const movePos = -((toIdx + 1) * boxSize.width);
      // console.log(movePos, this.currentPosition);
      container.style.transform = `translateX(${movePos}px)`;
      this.options.sliderIndex = toIdx;
      this.currentPosition = movePos;
    },
    moveLeft: function () {
      if (!this.isAciveBtns) {
        return;
      }
      this.isAciveBtns = false;
      var { container, boxSize, sliderIndex, items, speed } = this.options;
      console.log("moveLeft");

      container.style['transition'] = `transform ease ${speed}ms`;

      const movePos = this.currentPosition + boxSize.width;
      container.style.transform = `translateX(${movePos}px)`;
      --this.options.sliderIndex;

      this.currentPosition = movePos;
    },
    moveRight: function () {
      if (!this.isAciveBtns) {
        return;
      }
      this.isAciveBtns = false;
      var { container, boxSize, sliderIndex, items, speed } = this.options;
      console.log("moveRight");

      container.style['transition'] = `transform ease ${speed}ms`;

      const movePos = this.currentPosition - boxSize.width;
      container.style.transform = `translateX(${movePos}px)`;
      ++this.options.sliderIndex;

      this.currentPosition = movePos;
    },

    checkIndex: function () {
      console.log("checkIndex");
      var { container, sliderIndex, items, boxSize, useDots } = this.options;

      container.style.removeProperty('transition');
      if (sliderIndex == -1) {
        const movePos = -(items.length * boxSize.width);
        container.style.transform = `translateX(${movePos}px)`;
        this.options.sliderIndex = items.length - 1;
        this.currentPosition = movePos;
      } else if (sliderIndex == items.length) {
        const movePos = -(boxSize.width);
        container.style.transform = `translateX(${movePos}px)`;
        this.options.sliderIndex = 0;
        this.currentPosition = movePos;
      }


      if (useDots) {
        for (let dot of this.dots) {
          dot.classList.remove("active");
        }
        console.log(this.options.sliderIndex);
        this.dots[this.options.sliderIndex].classList.add("active");
      }

      this.isAciveBtns = true;
    }
  }


  window.slideShow = _slideShow;
})();