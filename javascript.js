$(function(){
  // do something when page is done loading

  totalMinutes = parameterFromUrl('t')
  if (totalMinutes === undefined){
    totalMinutes = 10
  }
  startTimer(totalMinutes)

})

var startTime;

var startTimer = function(totalMinutes){
  var delay = 1000  // in milliseconds
  var talker = 'jack'
  var jenniferTime = (totalMinutes / 2) * 60 * 1000 // in milliseconds
  var jackTime = (totalMinutes / 2) * 60 * 1000 // in milliseconds
  var timeOfLastUpdate = null

  var subtractTime = function(){
    var now = Date.now()
    timeSinceLastUpdate = now - timeOfLastUpdate
    timeOfLastUpdate = now

    if (talker === 'jennifer'){
      jenniferTime -= timeSinceLastUpdate
    }else if (talker === 'jack'){
      jackTime -= timeSinceLastUpdate
    }else if (talker === 'both'){
      jenniferTime -= timeSinceLastUpdate/2
      jackTime -= timeSinceLastUpdate/2
    }

  }

  var display = function(){
    $('#jennifer-time').html(formattedTime(jenniferTime))
    $('#jack-time').html(formattedTime(jackTime))
    console.log('Jennifer has', jenniferTime / 1000)
    console.log('Jack has', jackTime / 1000)
  }

  var zeroPad = function(number){
    if (number.toString().length === 1){
      return '0' + number
    }else{
      return number
    }
  }

  var formattedTime = function(time){
    var totalSeconds = Math.ceil(time / 1000)
    var totalMinutes = Math.floor(totalSeconds / 60)
    var displaySeconds = totalSeconds % 60
    return totalMinutes + ':' + zeroPad(displaySeconds)
  }


  var initialize = function(){
    timeOfLastUpdate = Date.now()
    $jack = $('#jack')
    $jennifer = $('#jennifer')
    $both = $('#both')
    activeClass = 'active'

    var removeActiveClass = function(){
      $('.clickable').removeClass(activeClass)
    }

    var focusOnJack = function(){
      talker = 'jack'
      removeActiveClass()
      $jack.addClass(activeClass)
    }

    var focusOnJennifer = function(){
      talker = 'jennifer'
      removeActiveClass()
      $jennifer.addClass(activeClass)
    }

    var focusOnBoth = function(){
      talker = 'both'
      removeActiveClass()
      $both.addClass(activeClass)
    }

    $jack.on('click', focusOnJack)
    $jennifer.on('click', focusOnJennifer)
    $both.on('click', focusOnBoth)

  }


  var update = function(){
    subtractTime()
    display()
    setTimeout(update, delay)
    console.log('hello')
  }






  initialize()
  update()


}

var parameterFromUrl = function(key){
  // Source http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript/21152762#21152762
  var dict = {}
  var mapThis = function(item) {dict[item.split("=")[0]] = item.split("=")[1]}
  location.search.substr(1).split("&").forEach(mapThis)
  return dict[key]
}

