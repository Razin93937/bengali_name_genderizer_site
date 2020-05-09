var name_f;

$(document).ready(function () {
    name_f = document.getElementById("name_input");
    $("#alert").hide();
})

$(document).on('click', '#submit', function (evt) {
    evt.preventDefault();
    var name = name_f.value;
    if (name == "") {
        $("#alert").show();
    }
    else {
        var requestURL = "https://razin93937.pythonanywhere.com/guess/";
        $.post(requestURL, { 'f_name': name }, function (data) {
            $("#alert").hide();
            $("#rows").empty();
            for (let i = 0; i < Object.keys(data['children']).length; i++) {
                child = data['children'][i];
                $("#rows").append("<tr id='row" + i + "'></tr>");

                $("#row" + i).append("<td>" + child['word'] + "</td>");
                $("#row" + i).append("<td>" + child['gender'] + "</td>");
                $("#row" + i).append("<td>" + child['confidence'] + "</td>");
            }


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
});