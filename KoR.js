//dummy docdata
var docData = {
    round_1: "round A finale women",
    time_1: "11u00",
    name_1: "player A langere naam",
    name_2: "player B",
    shirt_1: "red",
    shirt_2: "green",
    country_1: "066-germany",
    country_2: "189-austria",
    scorett_1s: "0",
    scorett_2s: "0",
    scorebd_1s: "17",
    scorebd_2s: "20",
    scoresq_1s: "0",
    scoresq_2s: "0",
    scorete_1s: "0",
    scorete_2s: "0"
};
var undo_highlight_timeout_ft;
var next_sport_timeout_ft;

function myscript() {

//================================================================================


    function cleanScoreBoard() {
        clearTimeout(undo_highlight_timeout_ft);
        clearTimeout(next_sport_timeout_ft);
        $(".player1, .player2").removeClass('highlight undo__highlight player__score--show player__score--currentSport');
    }

// function to update score and highlight when needed
    function updateScore(playerSelector, scoreSelector, newScore) {
        var scoreElem = $(playerSelector + scoreSelector);
        scoreElem.addClass('player__score--show');
        if (scoreElem.text() != newScore) {
            var previousScore = scoreElem.text();
            scoreElem.text(newScore);

            var previousScoreInt = parseInt(previousScore, 10);
            var newScoreInt = parseInt(newScore, 10);

            // highlight when score increased
            if (!isNaN(previousScore) && !isNaN(newScore) && newScoreInt > previousScoreInt) {
                scoreElem.addClass('highlight');
                $(playerSelector + '.player__grid__row').addClass('highlight');

                // clear highlight after a few seconds
                undo_highlight_timeout_ft = setTimeout(function() {
                    scoreElem.addClass('undo__highlight');
                    $(playerSelector + '.player__grid__row').addClass('undo__highlight');
                }, 3500);

                return true;
            }
        }
        return false;
    }

// check if a sport is finished
    function sportFinished(player1ScoreSelector, player2ScoreSelector, isHighlighting) {
        var player1Score = parseInt($(player1ScoreSelector).text(), 10);
        var player2Score = parseInt($(player2ScoreSelector).text(), 10);

        if (isNaN(player1Score)) {
            player1Score = 0;
        }
        if (isNaN(player2Score)) {
            player2Score = 0;
        }

        var delta = Math.abs(player1Score - player2Score);
        var sportFinished = player1Score >= 21 && delta > 1 || player2Score >= 21 && delta > 1

        if (!sportFinished || isHighlighting) {
            $(player1ScoreSelector).addClass('player__score--currentSport');
            $(player2ScoreSelector).addClass('player__score--currentSport');
        }

        return sportFinished;
    }

    function updateSport(scoreSelector, docDataSelector, nextSportCallback) {
        // clear previous current sport and highlights
        $('.player1, .player2').removeClass('highlight undo__highlight player__score--currentSport');

        // update scores
        var p1Highlights = updateScore('.player1', scoreSelector, docData[docDataSelector + '_1s']);
        var p2Highlights = updateScore('.player2', scoreSelector, docData[docDataSelector + '_2s']);
        var isHighlighting = p1Highlights || p2Highlights;

        if (sportFinished('.player1' + scoreSelector,'.player2' + scoreSelector, isHighlighting)) {
            if (isHighlighting) {
                next_sport_timeout_ft = setTimeout(nextSportCallback, 6000);
            } else {
                nextSportCallback();
            }
        }
    }

// update entire scoreboard
    function updateScoreBoard() {
        $('.scoreboard').toggleClass('scoreboard--matchNotStarted', !isMatchStarted());

        // update fields with form data
        $('.header__title').text(docData['round_1']);
        $('.header__time').text(docData['time_1']);
        $('.player1.player__name').text(docData['name_1']);
        $('.player2.player__name').text(docData['name_2']);
        $('.player1.player__shirt path').css({stroke: docData['shirt_1']});
        $('.player2.player__shirt path').css({stroke: docData['shirt_2']});
        $('.player1 .player__flag__image').attr("src", "http://data.8wr.io/sba/11/flags/" + docData['country_1'] + ".png");
        $('.player2 .player__flag__image').attr("src", "http://data.8wr.io/sba/11/flags/" + docData['country_2'] + ".png");

        // update fields for pre match.
        $('.footer_vs_player1__name').text(docData['name_1']);
        $('.footer_vs_player2__name').text(docData['name_2']);
        $('.footer_vs_player1__flag').attr("src", "http://data.8wr.io/sba/11/flags/" + docData['country_1'] + ".png");
        $('.footer_vs_player2__flag').attr("src", "http://data.8wr.io/sba/11/flags/" + docData['country_2'] + ".png");

        var tennisCallback = function() { updateSport('.player__score__te', 'scorete'); };
        var squashCallback = function() { updateSport('.player__score__sq', 'scoresq', tennisCallback); };
        var badmintonCallback = function() { updateSport('.player__score__bd', 'scorebd',  squashCallback); };
        updateSport('.player__score__tt', 'scorett',  badmintonCallback);

        updateFooterText();

        // show scoreboard
        $('.scoreboard').addClass('scoreboard--visible');
    }

    // check if match has started
    function isMatchStarted() {
        var player1Score = parseInt(docData['scorett_1s'], 10);
        var player2Score = parseInt(docData['scorett_2s'], 10);
        return !isNaN(player1Score) && !isNaN(player2Score) && (player1Score > 0 || player2Score > 0);
    }

    function updateFooterText() {
        if (!isMatchStarted()) {
            $('.footer').text('VS.');
            return
        }

        var player1ScoreTT = getInt($('.player1.player__score__tt').text());
        var player2ScoreTT = getInt($('.player2.player__score__tt').text());
        var player1ScoreBAD = getInt($('.player1.player__score__bd').text());
        var player2ScoreBAD = getInt($('.player2.player__score__bd').text());
        var player1ScoreSQ = getInt($('.player1.player__score__sq').text());
        var player2ScoreSQ = getInt($('.player2.player__score__sq').text());
        var player1ScoreTE = getInt($('.player1.player__score__te').text());
        var player2ScoreTE = getInt($('.player2.player__score__te').text());

        var deltaTT = player1ScoreTT - player2ScoreTT;
        var deltaBAD = player1ScoreBAD - player2ScoreBAD;
        var deltaSQ = player1ScoreSQ - player2ScoreSQ;
        var deltaTE = player1ScoreTE - player2ScoreTE;
        var gameDelta = deltaTT + deltaBAD + deltaSQ + deltaTE;

        // squash finished
        if ((player1ScoreSQ >= 21 || player2ScoreSQ >= 21) && (Math.abs(deltaSQ) > 1)) {

            return
        }

       // squash not finished yet
        if (gameDelta === 0) {  $('.footer').text('Equal number of total points'); }
        else if (gameDelta > 0) { $('.footer').text($('.player1.player__name').text() + ' leads by ' + gameDelta); }
        else { $('.footer').text($('.player2.player__name').text() + ' leads by ' + Math.abs(gameDelta)); }

    }

    function getInt(score) {
        var scoreInt = parseInt(score, 10);
        if (isNaN(scoreInt)){
            return 0;
        }
        return scoreInt
    }

// remove previous animations and status
    cleanScoreBoard();

// Update scoreboard with new data

    updateScoreBoard();


//================================================================================


}

$(document).ready(function() {
    myscript()
});

// simulate score change after 4s
setTimeout(function() {docData['scorett_2s'] = "1"; myscript(); }, 3000);
setTimeout(function() {docData['scorett_1s'] = "1"; myscript(); }, 13000);
setTimeout(function() {docData['scorett_1s'] = "2"; myscript(); }, 23000);
setTimeout(function() {docData['scorett_1s'] = "21"; myscript(); }, 33000);
setTimeout(function() {docData['scorebd_1s'] = "1"; myscript(); }, 43000);
setTimeout(function() {docData['scorebd_1s'] = "2"; myscript(); }, 43000);
