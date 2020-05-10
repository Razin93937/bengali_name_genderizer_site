var name_f;
var name;
var requestURL = "https://razin93937.pythonanywhere.com/";
// var requestURL = "http://127.0.0.1:5000/";

$(document).ready(function () {
    name_f = document.getElementById("name_input");

    $("#model_selection").change(function () {
        if ($("#model_selection").find(":selected").val() == "2") {
            // when full_name is selected
            $("#col1").hide(); // hide name column
            $("#verdict_box").hide(); // hide final verdict box
            $("#rows").empty(); // empty the table
            predict_full_name()
        } else {
            // when word-wise is selected
            $("#col1").show(); // show name column
            $("#verdict_box").show(); // show final verdict box
            $("#rows").empty(); //empty the table
            predict_word_wise();
        }
    });
})

$(document).on('click', '#submit', function (evt) {
    evt.preventDefault(); // prevent it from submitting default
    name = name_f.value;

    //check if name is entered, if not show alert

    if (name == "") {
        $("#alert").show();
    } else {
        var selection = $("#model_selection").find(":selected").val();
        if (selection == "1") {
            predict_word_wise();
        } else {
            // if full name model is selected
            predict_full_name();

        }
    }
});

function predict_full_name() {
    $.post(requestURL + "full_name/", { 'f_name': name }, function (data) {
        $("#alert").hide();
        $("#rows").empty();
        $("#rows").append("<tr id='row1'></tr>");
        $("#row1").append("<td>" + data['verdict'] + "</td>");
        $("#row1").append("<td>" + (data['confidence'] * 100 - 50) * 2 + "%</td>");
    }, "json");
}

function predict_word_wise() {
    $.post(requestURL + "name/", { 'f_name': name }, function (data) {
        $("#alert").hide();
        $("#rows").empty();

        // iterate through words and display in table

        for (let i = 0; i < Object.keys(data['children']).length; i++) {
            child = data['children'][i];
            $("#rows").append("<tr id='row" + i + "'></tr>");

            $("#row" + i).append("<td>" + child['word'] + "</td>");
            $("#row" + i).append("<td>" + child['gender'] + "</td>");
            $("#row" + i).append("<td>" + child['confidence'] + "</td>");
        }

        // if name has only 1 word, don't show final verdict

        if (Object.keys(data['children']).length > 1) {
            if (data['verdict'] != "") {
                $("#verdict").text(name + " is probably a " + data['verdict'] + " name");
            } else {
                $("#verdict").text("Cannot conclude gender of " + name);
            }
        } else {
            $("#verdict").text("Enter full name for overall verdict");
        }

    }, "json");
}