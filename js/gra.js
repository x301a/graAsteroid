$().ready(function(){
  func = new Object({
      srodek: function(liczba){
          return parseInt(liczba)/2;
      },
      obszar: ['x', 'y'],
      sprObszar: function(){
//          func.obszar['y'] = '';
//          func.obszar['y'].push('asdasd');
//          func.obszar['x'] = '';
          
//          for(var i=0; i<func.obszar['y'].length; i++){
//              
//          }
          for(x in func.obszar['y']){
              
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
          widthSr: 0,
          heightSr: 0
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
                     .css('bottom', '30px');
            gra.handle.html(gra.sterowanie.statek.handle);
            
            $(document).bind('keypress', function (e) {
//                console.log( (e.keyCode || e.which) );
                switch( (e.keyCode || e.which) ){
                    case 32:
                        //spacja
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
              strzal: function(){
                  console.log('strzal');
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