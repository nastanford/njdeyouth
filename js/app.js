$(function(){
   var sections = $('section')
     , nav = $('nav')
     , nav_height = nav.outerHeight();

   nav.find('a').on('click', function () {
     var $el = $(this)
       , id = $el.attr('href');

     $('html, body').animate({
       scrollTop: $(id).offset().top - nav_height
    }, 550);

     return false;
   });

   $('#submit-email').on('click', function(e){
      e.preventDefault();
      var $contactForm = $('.contact_form');
      var $alert = $('.contact_form .alert');

      $alert.removeClass('alert-danger').removeClass('alert-success');
      $alert.html('Sending message...').addClass('alert-info').css('opacity', 1.0).css('visibility', 'visible');

      var name = $('#name').val();
      var email = $('#email').val();
      var message = $('#message').val();

      if(name === '' || email === '' || message === '' ) {
         $alert.html("Oops, looks like you're missing a required field.").removeClass('alert-info').addClass('alert-danger');

         setTimeout(function() {
            $alert.css('visibility', 'hidden');
         }, 2500);

      } else {

         $.ajax({
            url: "//formspree.io/njdeyouthdept@gmail.com",
            method: "POST",
            data: {name: name, email: email, message: message},
            dataType: "json"
         });

         $('#name').val('');
         $('#email').val('');
         $('#message').val('');

         $alert.removeClass('alert-info').removeClass('alert-danger').removeClass('alert-success');
         $alert.html('Message Sent').addClass('alert-success').css('opacity', 1.0).css('visibility', 'visible');
         setTimeout(function() {
            $alert.css('visibility', 'hidden');
         }, 2500);
      }

   });

});
