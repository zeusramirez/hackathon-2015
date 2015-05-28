

var audioContext = new AudioContext();
navigator.webkitGetUserMedia({
"audio": true
}, function(stream) {
	mediaStreamSource = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 32;
    mediaStreamSource.connect(analyser);
    frequencyData = new Uint8Array(analyser.frequencyBinCount);
    
}, function(){ });
	
$(document).ready(function () {
	// we're ready to receive some data!
    // loop
    var box = $("#note");

    $( "#btn" ).click(startGame);

    $( "#pause").click(function() {
    	$("#background").stop(true, false);
    });
    
    function getPitch() {
        analyser.getByteFrequencyData(frequencyData);
        var maxVal = 0, maxIndex;
        for(var i  in frequencyData) {
            if(frequencyData[i]>128) {
              maxVal = frequencyData[i];
              maxIndex = i;
          }
        }
        
        return maxIndex;
    }
    
	function startGame() { 
	    var count = 0;
	    
        $( "#background" ).animate({
          left: "-4000",
        }, {
          duration: 35000,
          step: function( now, fx ) {
            var pitch = getPitch();
            if (count % 5 == 0){
                moveNote(pitch); 
            }

          	console.log("pitch -- " + pitch);
            console.log('step: --' + now);
            detectOverlapping();
            count++;
          },
          complete: function () {
            console.log('done');
          alert("You win");
      }
        });
	}
	
	function moveNote(val) {
	    var top = box.position().top + ((val > 4) ? -10: 10 );
	    if (top > 0 || top < $('#background').position().top) {
    	    box.css('top', top);
    	    //box.css('left', -1*$('#background').position().left+200);
	    }
	    box.css('left', -1*$('#background').position().left+200); // leave it!!

	}

    function getPositions(box) {
        var $box = $(box);
        var pos = $box.position();  // top, left
        var width = $box.width();
        var height = $box.height();
        return [ [ pos.left, pos.left + width ], [ pos.top, pos.top + height ] ];
    }
	

    function comparePositions(p1, p2) {
        var x1 = p1[0] < p2[0] ? p1 : p2;
        var x2 = p1[0] < p2[0] ? p2 : p1;
        return x1[1] > x2[0] || x1[0] === x2[0];
    }
    function isHorizontalCollision(box, div) {
        return (box[0] < div[0] && div[0] < box[1]) || (box[0] < div[1] && div[1] < box[1]);
    }
    function isVerticalCollision(box, div) {
        return (box[0] < div[0] && div[0] < box[1]) || (box[0] < div[1] && div[1] < box[1]);
    }
    function detectOverlapping() {
        // code that detects if the box overlaps with a moving box
        var boxPos = getPositions(box);
        boxPos[0][0] = boxPos[0][0] + ($('#background').position().left * -1);
        boxPos[0][1] = boxPos[0][1] + ($('#background').position().left * -1);
        
        
        $(".blk").each(function(i) {            
            var blockPos = getPositions(this);
        //  console.log(pos2);
        
            var collision = isHorizontalCollision(boxPos[0], blockPos[0]) && isVerticalCollision(boxPos[1], blockPos[1]);
        
        
        	console.log(isHorizontalCollision(boxPos[0], blockPos[0]));
        	console.log(isVerticalCollision(boxPos[1], blockPos[1]));

            // var horizontalMatch = comparePositions(pos[0], pos2[0]);
            // var verticalMatch = comparePositions(pos[1], pos2[1]);           
            var match = collision;
            console.log(match);
          if(match) {
//                $("#background").stop(true, false);
//              alert ("Game Over!")
//              $( "#background" ).removeAttr('style');
              console.log("COLLLIDED!!!!");
          }
        });
      
    }  
  
});
