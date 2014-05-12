/*jslint node: true */
/*jslin nomen: true */
'use strict';

exports.authorize = function (moves) {
    return function (req, res) {
        moves.authorize({
            scope: ['activity', 'location'],
            state: '123'
        }, res);
    };
};
exports.token = function (moves, MovesUser) {
    return function (req, res) {
        moves.token(req.query.code, function (error, response, body) {
            var parsedBody = JSON.parse(body);
            var movesUser = new MovesUser({
                userId: 'adams',
                refreshToken: parsedBody.refresh_token,
                accessToken: parsedBody.access_token
            });
            console.log(parsedBody);

            movesUser.save(function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('movesUser: ' + movesUser.accessToken + " saved.");
                    res.redirect("/");
                }
            });
        });
    };
};
