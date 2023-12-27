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
    this.setIDReferences()
    this.start();
    this.startFirstTime = true;
    this.bindEvents();
    
  }
  setIDReferences(){
    Array.from(this.slider.querySelectorAll(".container > .slide__element"))
      .forEach((element, i) =>{
        element.setAttribute('data-slider-position', i +1);
      })
  }
  start(){
    if (this.options.infinite) {
      this.container.prepend(this.container.lastElementChild);
      this.counter = 1;
      this.moveTo(this.counter);
    }
    this.setInterval();
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
      this.moveTo(this.counter);
      this.container.style.transition = `${this.animation}`
    }
    
  }
  moveTo(index){
    let translateX = index * 100;
    this.container.style.transform = "translateX(-"+ translateX + "%)";
    let positionToActive = Number(this.container.children[index].getAttribute("data-slider-position"))
    this.handleChangeDot(positionToActive)
    this.isInTransition = false
  }

  handleChangeDot(positionToActive){
    this.resetIndicator();
    this.slider.querySelector(".controls li:nth-child("+ (positionToActive) + ")").classList.add("active")
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
      if (this.isInTransition) return
      else if(e.target.matches(".dot")) {
        let index = this.getIndex(e.target);
        let currentPosition= this.getIndex(e.target);
        currentPosition++
        if (this.container.children[this.counter].getAttribute("data-slider-position") == currentPosition) {
          return
        }
        this.reorderSliderAscent(index)
        setTimeout(() => {
          this.moveTo(this.counter);
          this.container.style.transition = `${this.animation}`
        }, 1);
      }
      else if (e.target.closest(".arrow_left")) {
        this.restartInterval();
        this.counter--;
        this.container.style.transition = `${this.animation}`
        this.moveTo(this.counter);
      }
      else if (e.target.closest(".arrow_right")) {
        console.log(e.target)
        this.restartInterval();
        this.counter++;
        this.container.style.transition = `${this.animation}`
        this.moveTo(this.counter);
      }
      
    });

    this.container.addEventListener('transitionstart', () => {
      this.isInTransition = true
    })
    this.container.addEventListener('transitionend', () => {
      if (this.options.infinite) {
        if (this.counter === this.sliderElementsCount - 1 || this.counter === 0) {
          this.reorderSlides();
          this.moveTo(this.counter);
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
    if (this.counter === this.sliderElementsCount - 1) {
      this.counter--;
      this.container.appendChild(this.container.firstElementChild)
    }
    else if (this.counter === 0){
      this.counter++;
      this.container.prepend(this.container.lastElementChild)
    }
    this.container.style.transition = "none"
    
  }
  alerts(){
    if (this.options.animationTime >= this.options.intervalMove) {
      return alert("The propiety animationTime is greater than intervalMove. This not possible.")
    }
  }
  reorderSliderAscent(positionDot){
    let contadorAux = 1
    this.container.querySelectorAll(".slide__element").forEach((element, position) => {
      var sliderChildPosition = element.getAttribute("data-slider-position")
      if (contadorAux != sliderChildPosition) {
        this.container.appendChild(element)
        this.counter--
        if (this.counter < 0) {
          this.counter = this.sliderElementsCount -1
        }
        this.moveTo(this.counter)
        return
      }
      contadorAux++;
    });
    this.counter = positionDot    
  }
}

