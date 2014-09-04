var datum = require('datumbox').factory("e90268ce5fb18c91ce9d1f9f9e30673e");

datum.genderDetection("How much is a LV bag", function(err, data) {
    if ( err )
        return console.log(err);

    console.log(data);  // Remarks here.
});

