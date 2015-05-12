$(function(){
  // do something when page is done loading

  totalMinutes = parameterFromUrl('t')
  if (totalMinutes === undefined){
    totalMinutes = 10
  }
  startTimer(totalMinutes)

})


var startTimer = function(totalMinutes){
  var minutesToAdd = 5
  var longClickTime = 1000 // in milliseconds
  var singlePeriod = 1000  // in milliseconds
  var doublePeriod = singlePeriod * 2
  var period // Will be set to either singlePeriod or doublePeriod
  var talker = ''
  var jenniferTime = (totalMinutes / 2) * 60 * 1000 // in milliseconds
  var jackTime = (totalMinutes / 2) * 60 * 1000 // in milliseconds
  var timeOfLastUpdate = null
  var buttonIsDown = false

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
    var sign, totalSeconds, totalMinutes, displaySeconds

    if (time < 0){
      sign = '-'
      time = -time
    }else{
      sign = ''
    }

    totalSeconds = Math.ceil(time / 1000)
    totalMinutes = Math.floor(totalSeconds / 60)
    displaySeconds = totalSeconds % 60
    return sign + totalMinutes + ':' + zeroPad(displaySeconds)
  }

  var addMoreTime = function(){
    var millisecondsToAdd = minutesToAdd * 60 * 1000
    jenniferTime += millisecondsToAdd
    jackTime += millisecondsToAdd
    display()
  }



  var initialize = function(){
    var $jack = $('#jack')
    var $jennifer = $('#jennifer')
    var $both = $('#both')
    var $more = $('#more')
    var $body = $('body')
    var activeClass = 'active'

    var removeActiveClass = function(){
      $('.clickable').removeClass(activeClass)
    }

    var focusOnJack = function(){
      talker = 'jack'
      period = singlePeriod
      removeActiveClass()
      $jack.addClass(activeClass)
    }

    var focusOnJennifer = function(){
      talker = 'jennifer'
      period = singlePeriod
      removeActiveClass()
      $jennifer.addClass(activeClass)
    }

    var focusOnBoth = function(){
      talker = 'both'
      period = doublePeriod
      removeActiveClass()
      $both.addClass(activeClass)
    }

    var addMoreTimeIfButtonStillDown = function(){
      if (buttonIsDown === true){
        addMoreTime()
        setTimeout(addMoreTimeIfButtonStillDown, longClickTime)
      }
    }

    var moreTimeButtonDown = function(){
      var originalButtonIsDown = buttonIsDown
      buttonIsDown = true

      if (originalButtonIsDown === false){
        // prevent double-calling this by checking whether button was already down
        // (mousedown and touchstart will both activate this in Android)
        setTimeout(addMoreTimeIfButtonStillDown, longClickTime)
      }
    }

    var moreTimeButtonUp = function(){
      buttonIsDown = false
    }


    timeOfLastUpdate = Date.now()

    $jack.on('click', focusOnJack)
    $jennifer.on('click', focusOnJennifer)
    $both.on('click', focusOnBoth)

    // iOS browser (safari) does not recognize mousedown, so adding touchstart
    $more.on('mousedown touchstart', moreTimeButtonDown)
    // Android browser appears not issue mouseup, so adding touchend
    $body.on('mouseup touchend', moreTimeButtonUp)

  }



  var update = function(){
    subtractTime()

    if( buttonIsDown === false){
      // Only call display() here when button is not down
      // This eliminates double display() calls which appear confusing
      display()
    }

    setTimeout(update, period)
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

