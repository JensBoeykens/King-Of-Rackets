$('#players_1').text(docData['players_1'] + ' (' + docData['ranking_1'] + ')');

$('.rectangle.p1').children().removeClass().addClass('rectangle--icon rectanglecolor--' + docData['color_1']);

$('#players_2').text(docData['players_2'] + ' (' + docData['ranking_2'] + ')');
$('.rectangle.p2').children().removeClass().addClass('rectangle--icon rectanglecolor--' + docData['color_2']);

$('#round').text(docData['round_1'] );

$('#TT_1s').text(docData['TT_1s']);
$('#TT_2s').text(docData['TT_2s']);

$('#BAD_1s').text(docData['BAD_1s']);
$('#BAD_2s').text(docData['BAD_2s']);

$('#SQ_1s').text(docData['SQ_1s']);
$('#SQ_2s').text(docData['SQ_2s']);

$('#TEN_1s').text(docData['TEN_1s']);
$('#TEN_2s').text(docData['TEN_2s']);

var tt_delta = docData['TT_1s'] - docData['TT_2s']
var bad_delta = docData['BAD_1s'] - docData['BAD_2s']
var sq_delta = docData['SQ_1s'] - docData['SQ_2s']
var tt_p1 = docData['TT_1s']
var tt_p2 = docData['TT_2s']
var sq_p1 = docData['SQ_1s']
var sq_p2 = docData['SQ_2s']
var ten_p1 = docData['TEN_1s']
var ten_p2 = docData['TEN_2s']

var ten_delta = docData['TEN_1s'] - docData['TEN_2s']
var total_delta = tt_delta + bad_delta + sq_delta + ten_delta
var abs_squash_delta = Math.abs(sq_delta)
var abs_ten_delta = Math.abs(ten_delta)
var abs_total_delta = Math.abs(total_delta)
var delta_after_squash = tt_delta + bad_delta + sq_delta

if ((sq_p1 >= 21 || sq_p2 >= 21) && (abs_squash_delta > 1)) {
    squash_ended = 'yes';
} else {
    squash_ended = 'no';
}

if ((ten_p1 >= 21 || ten_p2 >= 21) && (abs_ten_delta > 1))  {
    ten_ended = 'yes';
}
else {
    ten_ended = 'no';
}

var leader = 'initial - leader'
var trailer = 'initial - trailer'
if (total_delta > 0) {
    leader = docData['players_1'];
    trailer = docData['players_2'];
}
else if (total_delta < 0) {
    leader = docData['players_2'];
    trailer = docData['players_1'];
}
else {leader = 'Draw - no leader'; trailer = 'Draw - no leader';}

if (delta_after_squash > 0) {
    leader_after_squash = docData['players_1'];
    trailer_after_squash = docData['players_2'];
}
else if (delta_after_squash < 0) {
    leader_after_squash = docData['players_2'];
    trailer_after_squash = docData['players_1'];
}
else {leader_after_squash = 'Draw - no leader'; trailer_after_squash = 'Draw - no leader';}

var pretennis = 'Match to start';

if (tt_p1 == 0 && tt_p2 == 0)
{pretennis = 'Match to start..';}
else if (total_delta != 0)
{pretennis = leader + ' leads by ' + abs_total_delta ;}
else if (total_delta == 0)
{pretennis = 'Equal number of total points'}

var duringtennis = 'Initial after squash';

if (squash_ended == 'yes')
{
    var total_delta_after_sq = tt_delta + bad_delta + sq_delta;
    var abs_tot_delta_after_sq = Math.abs(total_delta_after_sq);
    if (leader_after_squash == docData['players_1'] )
    {leader_points = ten_p1;
        trailer_points = ten_p2;}
    else {leader_points = ten_p2;
        trailer_points = ten_p1;}

    var points_needed = 21 - abs_tot_delta_after_sq + 1;
    var gummyarm_points = 21 - abs_tot_delta_after_sq;

    if ((ten_ended == 'yes' && total_delta == 0))
    {end_with_gummyarm = 'yes';
    }
    else if (ten_ended == 'yes' && abs_ten_delta > 2
        && (leader_points > points_needed || trailer_points > 21 ))
    {end_with_gummyarm = 'end'}
    else {end_with_gummyarm = 'no' }

    if (abs_tot_delta_after_sq > 21)
    {duringtennis = leader + ' wins by ' + abs_total_delta;}
    else if (abs_tot_delta_after_sq == 0)
    {duringtennis = 'Tennis is the decider: Draw after squash';}
    else if (abs_tot_delta_after_sq <= 2)
    {duringtennis = 'Tennis is the decider: ' + leader + ' leads by ' + abs_tot_delta_after_sq + ' after squash';}
    else if (leader_points < points_needed && ten_ended == 'no') {
        duringtennis = leader_after_squash + ' needs ' + points_needed + ' to win';
    }
    else if (leader_points >= points_needed) {
        duringtennis = leader_after_squash + ' wins (needed ' + points_needed + ' points)';
    }
    else if (end_with_gummyarm == 'yes' && total_delta == 0)
    {duringtennis = 'Gummyarm decides the match!!';
    }
    else if (end_with_gummyarm == 'end' && total_delta > 0)
    {duringtennis = docData['players_1'] + ' wins with Gummyarm!';
    }
    else if (end_with_gummyarm == 'end' && total_delta < 0)
    {duringtennis = docData['players_2'] + ' wins with Gummyarm!';
    }
    else if (leader_points < points_needed && ten_ended == 'yes') {
        duringtennis = trailer_after_squash + ' wins (needed to keep ' + leader_after_squash + ' under ' + gummyarm_points + ')';
    }
};

if (squash_ended == 'no') {
    $('#summary').text(pretennis);
} else {
    $('#summary').text(duringtennis);
};

/*
for testing purposes
$('#players_2').text(
 + squash_ended + ' ' + abs_squash_delta + pretennis + duringtennis);
*/

/*

$('#players_2').text(squashended + pretennis + duringtennis);

$('#summary').text('King of Rackets - '
				   + docData['players_1'] + ' '
				   + docData['ranking_1'] + ' vs '
				   + docData['players_2'] + ' '
				   + docData['ranking_2']
				  );

*/
