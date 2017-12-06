//Grab the articles as a json
$.getJSON("/articles", function (data) {
    //for each one
    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<p>");
    }
});

//when user clicks a P tag
$(document).on("click", "p", function () {
    //empty the notes from the note section
    $("#notes").empty();
    //save Id from p tag
    var thisID = $(this).attr("data-id");

    //make call for article
    $.ajax({
            method: "GET",
            url: "/articles/" + thisID
        })

        //add note info onto the page
        .done(function (data) {
            console.log(data);
            //title of article
            $("#notes").append("<h2>" + data.title + "</h2>");
            //input to enter new title
            $("#notes").append("<input id='titleinput' name='title' >");
            //text are to add new note to body
            $("#notes").append("<textarea id='bodyimput' name='body'></textarea>");
            //button to submit new note with id of article saved to it
            $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
            // If there's a note in the article
            if (data.note) {
                // Place the title of the note in the title input
                $("#titleinput").val(data.note.title);
                // Place the body of the note in the body textarea
                $("#bodyinput").val(data.note.body);

                data.note.forEach(function (note) {
                    $("#notes").append("<br/>" + note.title + ': ' + note.body + "<br/>")
                })
            }
        });
});
