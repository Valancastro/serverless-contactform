$(function () {


    function fillInput() {

        $('.form-field input, textarea').on('input', function () {
            var input = $(this);
            var val = input.val();

            if (val !== "") {
                $(this).parents('.form-field').addClass('form-field--is-filled');

            } else {
                $(this).parents('.form-field').removeClass('form-field--is-filled');
            }
        });
    }
    fillInput();


    function onFocus() {

        $('.form-field').on('click', function () {
            $('.form-field').removeClass('form-field--is-active');
            $(this).addClass('form-field--is-active');
        });

    };
    onFocus();

    function tabFocus() {
        $('.form-field input, textarea').on('keydown', function (e) {
            if (e.which == 9) {
                $('.form-field').removeClass('form-field--is-active');
            }
        });
        $('input, textarea').on('focus', function () {
            $(this).parents('.form-field').addClass('form-field--is-active');
        });
    }
    tabFocus();

        //Name can't be blank
        $('#fullname, #contact textarea').on('input blur', function () {
            var input = $(this);
            var is_name = input.val();
            if (is_name) {
                input.removeClass("invalid").addClass("valid");
            } else {
                input.removeClass("valid").addClass("invalid");
            }
        });
    
        //Email must be an valid
        $('#email').on('input blur', function () {
            var input = $(this);
            var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            var is_email = re.test(input.val());
            if (is_email) {
                input.removeClass("invalid").addClass("valid");
            } else {
                input.removeClass("valid").addClass("invalid");
            }
        });

        //Email must be an valid

    $("#contact button").click(function (event) {
        var form_data = $("#contact input, #contact textarea");
        var error_free = true;
        form_data.each(function (idx, input){
            $(input).blur();
            var valid = $(input).hasClass("valid");
            var error_element = $(input).parents('.form-field').find("span.error, span.error_show");
            if (!valid) {
                error_element.removeClass("error").addClass("error_show");
                error_free = false;
            } else {
                error_element.removeClass("error_show").addClass("error");
            }

        });

        
        event.preventDefault();
        if (error_free) {
            
            $.ajax({ 
                type: 'POST',
                url: 'https://98qblz9bv4.execute-api.us-east-2.amazonaws.com/prod', 
                data:JSON.stringify({
                    "fullname": $("#fullname").val(),
                    "email": $("#email").val(),
                    "additionalInfo": $("#additionalInfo").val()
                }),
                crossDomain: true,
                dataType: 'json',
                contentType: 'application/json',
                success: function(data, textStatus, jqXHR){
                    alert("Successfully submitted");
                },
                error: function (jqXHR, textStatus, errorThrown){
                    alert("failure to submit")
                }
            });
        }
    });
});