class Slider{
  constructor(selector, options = {}){
    this.slider = document.querySelector(selector);
    this.options = {
      intervalMove: options.intervalMove || 2000,
      autoPlay: options.hasOwnProperty('autoPlay') ? options.autoPlay : true,
      infinite: options.hasOwnProperty('infinite') ? options.infinite : true,
      controls: options.hasOwnProperty('controls') ? options.controls : true,
      controlsPosition: options.controlsPosition || 'inside' // inside or outside
    },
    this.move = this.move.bind(this);
    this.interval = null,

    this.contador =  0;
    this.itemsCount = this.slider.querySelectorAll(".container > *").length;
    if (this.options.controls) {
      if (this.options.controlsPosition == "outside") {
        this.slider.classList.add("outside")
      }
      this.buildControls()
    }
    this.start();
    this.bindEvents();
    
  }
  start(){
    if (!this.options.autoPlay) return
    this.interval = window.setInterval(this.move, this.options.intervalMove);
  }
  move(){
    this.contador++;
    if (!this.options.infinite) {
      if (this.contador > this.itemsCount - 1) return
    }
    if (this.contador > this.itemsCount - 1) this.contador = 0
    this.moveTo(this.contador);
  }
  moveTo(index){
    let left = index * 100;
    this.slider.querySelector(".container").style.left = "-" + left + "%";
    this.resetIndicator();
    this.slider.querySelector(".controls li:nth-child("+ (index + 1) + ")").classList.add("active")
  }
  buildControls(){
    var listDots = document.createElement("ul");
    listDots.classList.add("dots")
    this.slider.querySelector(".controls").appendChild(listDots);
    for (let i = 0; i < this.itemsCount; i++) {
      var control = document.createElement("li");
      control.classList.add("dot")
      if(i == 0) control.classList.add("active");
      this.slider.querySelector(".controls .dots").appendChild(control);
    }
  }
  resetIndicator(){
    this.slider.querySelectorAll(".controls li.active")
      .forEach(element => {
        element.classList.remove("active");
      });
  }

  bindEvents(){
    this.slider.addEventListener('click', (e) => {
      if (e.target.matches(".dot")) {
        let index = this.getIndex(e.target)
        this.contador = index 
        this.restartInterval();
        this.moveTo(index);
      }
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
       this.start();
    }
  }
}

