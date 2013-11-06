$().ready(function(){
  func = new Object({
      srodek: function(liczba){
          return parseInt(liczba)/2;
      },
      rand: function(min, max) {
            var argc = arguments.length;
                if (argc === 0) {
                    min = 0;
                    max = 2147483647;
                } else if (argc === 1) {
                    throw new Error('Funkcja wymaga podania obu argumentów min i max');
                }
            return Math.floor(Math.random() * (max - min + 1)) + min;
      },
      wstawObszar: function(){
          var width = 20;
          var height = 20;
          var left = func.rand(0, gra.scena.width-width);
          var obszar = $('<div />')
                          .addClass('obszar')
                          .css('top', '0px')
                          .css('left', left+'px')
                          .css('width', width+'px')
                          .css('height', height+'px')
                          ;
  
             newObszar = new Array();
             newObszar['id'] = 0;
             newObszar['handle'] = obszar;
             newObszar['width'] = width;
             newObszar['height'] = height;
             newObszar['y1'] = 0; //top1
             newObszar['y2'] = height; //top2
             newObszar['x1'] = left; //left1
             newObszar['x2'] = left+width; //left2
          
          //dodanie nowego obszaru do tablicy obszarów
          func.obszary.push(newObszar);
          
          //dodawanie nowego obszaru do sceny
          gra.handle.append(obszar);
      },
      obiektyPociski: [],
      obszary: new Array(),
      //jako parametr podajemy liczbę cykli po ilu ma się pojawić nowy obszar/asteroid
      showObszar: 5,
      licznikCykli: 0,
      szybkoscObszarow: 5,
      sprObszar: function(){
         var cykli = ++func.licznikCykli;
         if(cykli%func.showObszar === 0){
             func.wstawObszar();
         }
         
         //porusza obiektami/asteroidami
         for(i in func.obszary){
             var handle = func.obszary[i];
                handle.y1 += func.szybkoscObszarow;
                handle.y2 += func.szybkoscObszarow;
                if(handle.y2 >= 300){
                    //usuwa asteroide
                    handle.handle.remove();
                    func.obszary.splice(i, 1);
                }
                handle.handle.css('top', handle.y1+'px');
         }
         
         //porusza pociskami
         for(i in gra.sterowanie.strzelanie.strzaly){
            var handle = gra.sterowanie.strzelanie.strzaly[i];
                handle.top -= 5;
                if(handle.top <= 0){ 
                    //usuwa pocisk
                    handle.handle.remove();
                    gra.sterowanie.strzelanie.strzaly.splice(i, 1);
                }
                handle.handle.css('top', handle.top);
         }

         //sprawdza czy było trafienie
         for(i in func.obszary){
             var handleO = func.obszary[i];
             for(j in gra.sterowanie.strzelanie.strzaly){
                var handleS = gra.sterowanie.strzelanie.strzaly[j];
                    //sprawdza czy pocisk i asteroida są na tej samej wysokości
//                    console.log(handleO.y2+' == '+handleS.top);
                    if(handleO.y2 >= handleS.top){
//                        console.log('jest');
                        //sprawdza czy są na tej samej szerokości
//                        if(handleO.x1 <= handleS.left && handleO.x2 >= handleS.left){
//                        console.log(handleO.x1 +' <= '+ handleS.left);
                        if( parseInt(handleO.x1) <= parseInt(handleS.left) && parseInt(handleO.x2) >= parseInt(handleS.left) ){
//                            console.log('x1: '+handleO.x1, ' x2: '+handleO.x2+' left: '+handleS.left);
                            func.obszary.splice(i, 1);
                            gra.sterowanie.strzelanie.strzaly.splice(j, 1);
                            
                            handleO.handle.remove();
                            handleS.handle.remove();
                        }
                    }
             }
         }

      }
  });
  gra = new Object({
      handle: '',
      timerId: '',
      scena:{
          id: 'scena',
          width:300,
          height:300,
          widthSr: 150,
          heightSr: 150
      },
      timer: function(){
          func.sprObszar();
      },
      init: function(){
        //tworzy scenę
        gra.handle = $('#'+gra.scena.id);
        gra.handle.css('width',gra.scena.width+'px').css('height',gra.scena.height+'px');
        
        text = $('<div />')
                .css('width','100%')
                .css('text-align', 'center')
                .css('position', 'absolute')
                .css('bottom', '30px')
                .text('naciśnij "spację", aby rozpocząć grę');
        
        gra.handle.html(text);
        
        //wyznacz środki
        gra.scena.widthSr = func.srodek(gra.scena.width);
        gra.scena.heightSr = func.srodek(gra.scena.height);
        
        //dodanie akcji kliknięcia w spację
        $(document).bind('keypress', function (e) {
            if( (e.keyCode || e.which) === 32 ){
                gra.clear();
                $(document).unbind('keypress');
                gra.load();
            }
        });
      },
      load: function(){
            //załaduj statek
            gra.sterowanie.statek.handle = $('<div />')
                     .css('position', 'absolute')
                     .css('left', gra.scena.widthSr-5).css('width','10px').css('height', '20px').css('border', '1px solid black')
                     .css('top', '255px');
            gra.handle.html(gra.sterowanie.statek.handle);
            
            $(document).bind('keypress', function (e) {
//                console.log( (e.keyCode || e.which) );
                switch( (e.keyCode || e.which) ){
                    case 32:
                        //spacja
                        console.log('strzal 2');
                        gra.sterowanie.strzelanie.strzal();
                    break;
                    case 37:
                        //lewa strzałka
                        gra.sterowanie.statek.horyzontalnie('left', 3);
                    break;
                    case 39:
                        //prawa strzałka
                        gra.sterowanie.statek.horyzontalnie('right', 3);
                    break;
                    
                }
            });
            
            gra.timerId = setInterval("gra.timer()", 200);
      },
      start: function(){
          return;
      },
      sterowanie: {
          statek: {
              handle: '',
              horyzontalnie: function(strona, oIle){
                  var str = parseInt( gra.sterowanie.statek.handle.css('left') );
                  if( strona === 'left' && str > 0 ){
                      gra.sterowanie.statek.handle.css('left', (str-oIle) );
                  }else if( str < gra.scena.width-20 && strona === 'right' ){
                      gra.sterowanie.statek.handle.css('left', (str+oIle) );
                  }
              }
          },
          strzelanie: {
              idOstStrzalu: 0,
              //w tablicy strzaly liczba 0 na 
              strzaly: [],
              strzal: function(){
//                  console.log('strzal');
          
                  //tworzy na ekranie strzał
                    //uchwyt do statku
                  var statek = gra.sterowanie.statek.handle;
                    //środek statku pozwala precyzyjnie umieścić pocisk
                  var srodekStatku = func.srodek(statek.css('width'));
                  var positionX = parseInt(statek.css('left'));
                  var positionY = parseInt(statek.css('top'));
                    //tworzenie obiektu - nowy pocisk
                  var pocisk = $('<div />').addClass('pocisk')
                                           .css('top', positionY-1+'px')
                                           .css('left', positionX+srodekStatku)
                                           .html('&nbsp;');
                    //przygotowywanie handle pocisku do zapisu
                  ++gra.sterowanie.strzelanie.idOstStrzalu;
//                  var pociskObj = new Object({
//                     id: gra.sterowanie.strzelanie,
//                     handle: pocisk
//                  });
//                  var pociskObj = new Array(
//                     'id' => gra.sterowanie.strzelanie,
//                     'handle' => pocisk
//                  );
                  var pociskObj = new Array();
                     pociskObj['id'] = gra.sterowanie.strzelanie;
                     pociskObj['handle'] = pocisk;
                     pociskObj['top'] = positionY-1;
                     pociskObj['left'] = positionX+srodekStatku;
                    //zapisanie handle pocisku
//                  gra.sterowanie.strzelanie.strzaly
                  gra.sterowanie.strzelanie.strzaly.push(pociskObj);
                    //umieszczenie pocisku na scenie
                  gra.handle.append(pocisk);
//                    console.log(gra.sterowanie.strzelanie.strzaly);
//                    console.log(gra.sterowanie.strzelanie.strzaly[0]);
                    
//                    console.log('----------------');
//                    for(i in gra.sterowanie.strzelanie.strzaly){
//                        console.log('I: '+i);
//                        console.log(gra.sterowanie.strzelanie.strzaly[i]);
//                    }
                    
//                  var handStrzaly = gra.sterowanie.strzelanie.strzaly;
//                  var strzal = {'id':1, 'top':30, 'y':30, 'x':30}
////                  handStrzaly.push(strzal);
              }
          }
      },
      clear: function(){
        gra.handle.html('');
      }
  });
  
  gra.init();
//    $(document).bind('keypress', function (e) {
//        console.log(e.keyCode);  //or alert(e.which);
//
//    });
});