var name;
var requestURL = "https://razin93937.pythonanywhere.com/";
// var requestURL = "http://127.0.0.1:5000/";

$(document).ready(function () {
    update_selection();
    if (name != "") $("#name_input").val(name);
    $("#model_selection").change(function () {
        update_selection();
    });
})

$(document).on('click', '#submit', function (evt) {
    evt.preventDefault(); // prevent it from submitting default
    name = $("#name_input").val();

    //check if name is entered, if not show alert

    if (name == "") {
        $("#alert").show();
    } else {
        var selection = $("#model_selection").find(":selected").val();
        if (selection == "2") {
            update_selection();
            predict_word_wise();
        } else {
            // if full name model is selected
            update_selection();
            predict_full_name();

        }
    }
});

function predict_full_name() {
    $.post(requestURL + "full_name/", { 'f_name': name }, function (data) {
        $("#alert").hide();
        $("#rows").empty();
        $("#rows").append("<tr id='row1'></tr>");
        $("#row1").append("<td>" + name + "</td>");
        $("#row1").append("<td>" + data['verdict'] + "</td>");
        $("#row1").append("<td>" + ((data['confidence'] * 100 - 50) * 2).toFixed(2) + "%</td>");
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
            $("#row" + i).append("<td>" + (child['confidence']).toFixed(2) + "%</td>");
        }
    }, "json");
}

function update_selection() {
    if ($("#model_selection").find(":selected").val() == "1") {
        // when full_name is selected
        $("#rows").empty(); // empty the table
        if (name != "") predict_full_name();
    } else {
        // when word-wise is selected
        $("#rows").empty(); //empty the table
        if (name != "") predict_word_wise();
    }
}