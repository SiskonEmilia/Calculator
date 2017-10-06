function deadLoop(){
  while(1);
}

setTimeout(function(){console.log("exe!")},1000);
deadLoop();