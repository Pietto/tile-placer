<!DOCTYPE html>
<html>
    <head>
        <title>tileplacer</title>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="css/app.css">
    </head>
    <body>

        <h1>Tileplacer, alpha 0</h1>

        <div id='playfield'>
            <div id="zoom">
                <script>
                    var height = 5;
                    var width = 5 ;
                    for(i=0; i<height; i++){
                        document.write('<div id="block">');
                        for(a=0; a<width; a++){
                            count = i*5;
                            count = count + a;
                            document.write('<div id="'+ count +'" class="choice"></div>');
                        }
                        document.write('</div>');
                    }

                </script>
            </div>
        </div>

        <div class="choice">
            <script>
                for(i=0; i<3; i++){
                    var choices = 6;
                    var a = Math.floor(Math.random()*choices)*1;
                    document.write("<div id='"+ a +"' class='tile' draggable='true' style='background-image:url(tiles/alpha0/tile_" + a + ".png);'></div>");
                }
            </script>
        </div>
    </body>

    <script src="js/tilelogic.js"></script>
</html>