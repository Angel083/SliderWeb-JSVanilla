class Slider{
  constructor(selector, options = {}){
    this.slider = document.querySelector(selector);
    this.container = this.slider.querySelector(".container");
    this.options = {
      intervalMove: options.intervalMove || 2000,
      autoPlay: options.hasOwnProperty('autoPlay') ? options.autoPlay : true,
      infinite: options.hasOwnProperty('infinite') ? options.infinite : true,
      controls: options.hasOwnProperty('controls') ? options.controls : true,
      animationTime: options.animationTime || 300, // inside or outside
      animationType: options.animationType || 'ease-in-out', // inside or outside
      controlsPosition: options.controlsPosition || 'inside' // inside or outside
    },
    this.animation = `transform ${this.options.animationTime}ms ${this.options.animationType}`
    this.move = this.move.bind(this);
    this.interval = null;
    this.isInTransition = false

    this.counter =  0;
    this.counterCurrent =  0;
    this.sliderElementsCount = this.slider.querySelectorAll(".container > .slide__element").length;

    // Alertar por errores
    this.alerts()

    if (this.options.controls) {
      if (this.options.controlsPosition == "outside") {
        this.slider.classList.add("outside")
      }
      this.buildControls()
    }
    this.start();
    this.startFirstTime = true;
    this.bindEvents();
    
  }
  start(){
    if (this.options.infinite) {
      this.counter = 1
      this.moveTo(1);
      this.container.prepend(this.container.lastElementChild)
    }
    this.setInterval()
  }
  setInterval() {
    if (!this.options.autoPlay) return
    this.interval = window.setInterval(this.move, this.options.intervalMove);
  }
  move(){
    if (!this.isInTransition) {
      this.isInTransition = true
      this.counter++;
      if (!this.options.infinite) {
        if (this.counter > this.sliderElementsCount - 1) return
      }
      // if (this.counter > this.sliderElementsCount - 1) this.counter = 0
      this.isInTransition = true
      this.moveTo(this.counter);
      this.container.style.transition = `${this.animation}`
    }
    // console.log(this.isInTransition)
    
  }
  moveTo(index){
    let translateX = index * 100;
    this.slider.querySelector(".container").style.transform = "translateX(-"+ translateX + "%)";
    this.resetIndicator();
    this.slider.querySelector(".controls li:nth-child("+ (index + 1) + ")").classList.add("active")
  }
  buildControls(){
    var listDots = document.createElement("ul");
    listDots.classList.add("dots")
    this.slider.querySelector(".controls").appendChild(listDots);
    for (let i = 0; i < this.sliderElementsCount; i++) {
      var control = document.createElement("li");
      control.classList.add("dot")
      if(i == 0) control.classList.add("active");
      this.slider.querySelector(".controls .dots").appendChild(control);
    }

    // var arrowContainer = document.createElement("div");
    // arrowContainer.classList.add("arrow__container")
    const middleContent = this.slider.children[0].clientHeight / 2 ;
    var arrowLeft = document.createElement("span");
    arrowLeft.classList.add("arrow_left");
    arrowLeft.innerHTML = `<i class="fa-solid fa-chevron-left"></i>`;
    arrowLeft.style.top = "calc("+ middleContent + "px )"

    var arrowRight = document.createElement("span");
    arrowRight.innerHTML = `<i class="fa-solid fa-chevron-right"></i>`;
    arrowRight.classList.add("arrow_right");
    arrowRight.style.top = "calc("+ middleContent + "px)"


    this.slider.querySelector(".controls").appendChild(arrowLeft);
    this.slider.querySelector(".controls").appendChild(arrowRight);

  }
  resetIndicator(){
    this.slider.querySelectorAll(".controls li.active")
      .forEach(element => {
        element.classList.remove("active");
      });
  }

  bindEvents(){
    this.slider.addEventListener('click', (e) => {
      console.log(this.isInTransition)
      if (this.isInTransition) return
      else if(e.target.matches(".dot")) {
        let index = this.getIndex(e.target)
        this.counter = index
        console.log(index)
        this.restartInterval();
        this.moveTo(index);
      }
      else if (e.target.closest(".arrow_left")) {
        this.restartInterval();
        this.counter--;
        this.moveTo(this.counter);
      }
      else if (e.target.closest(".arrow_right")) {
        this.restartInterval();
        this.counter++;
        this.moveTo(this.counter);
      }
      this.container.style.transition = `${this.animation}`
      
    });

    this.container.addEventListener('transitionstart', () => {
      this.isInTransition = true
    })
    this.container.addEventListener('transitionend', () => {
      if (this.options.infinite) {
        if (this.counter === this.sliderElementsCount - 1 || this.counter === 0) {
          this.reorderSlides();
        }
      }
      this.isInTransition = false
    })
  }
  getIndex(dot){
    var children = dot.parentNode.children;
    for (let i = 0; i < children.length; i++) {
      if (children[i] == dot) return i 
    }
  }
  restartInterval(){
    if (this.interval) {
        window.clearInterval(this.interval);
        this.setInterval();
    }
  }
  reorderSlides() {
    this.isInTransition = true
    this.container.style.transition = "none"
    if (this.counter === this.sliderElementsCount - 1) {
      this.counter--;
      console.log();
      this.container.appendChild(this.container.firstElementChild)
    }
    else if (this.counter === 0){
      this.counter++;
      this.container.prepend(this.container.lastElementChild)
    }
    this.moveTo(this.counter);
  }
  alerts(){
    if (this.options.animationTime >= this.options.intervalMove) {
      return alert("The propiety animationTime is greater than intervalMove. This not possible.")
    }
  }
}

