class Slider{
  constructor(selector, options = {}){
    this.slider = document.querySelector(selector);
    this.options = {
      interval: null,
      intervalMove: options.intervalMove || 2000,
      infinite: options.hasOwnProperty('infinite') ? options.infinite : true,
      controls: options.hasOwnProperty('controls') ? options.controls : true,
      controlsPosition: options.controlsPosition || 'inside' // inside or outside
    },
    this.move = this.move.bind(this);
    this.contador =  0;
    this.itemsCount = this.slider.querySelectorAll(".container > *").length;
    this.start();
    
    if (this.options.controls) {
      this.buildControls()
    }
  }
  start(){
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
    for (let i = 0; i < this.itemsCount; i++) {
      var control = document.createElement("li");
      if(i == 0) control.classList.add("active");
      this.slider.querySelector(".controls ul").appendChild(control);
    }
  }
  resetIndicator(){
    this.slider.querySelectorAll(".controls li.active")
      .forEach(element => {
        element.classList.remove("active");
      });
  }
}

