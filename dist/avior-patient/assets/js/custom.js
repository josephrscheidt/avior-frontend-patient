	$(document).ready(function () {
		//alert("1");
		        $("#sidebar").mCustomScrollbar({
		            theme: "minimal"
		        });

		        $('#dismiss, .overlay').on('click', function () {
		            // hide sidebar
		            $('#sidebar').removeClass('active');
		            // hide overlay
		            $('.overlay').removeClass('active');
		        });

		        $('#sidebarCollapse').on('click', function () {
		            // open sidebar
		            $('#sidebar').addClass('active');
		            // fade in the overlay
		            $('.overlay').addClass('active');
		            $('.collapse.in').toggleClass('in');
		            $('a[aria-expanded=true]').attr('aria-expanded', 'false');
		        });
		    });

	$(document).ready(function () {

	  window.onload = function onLoad() {
      var progressBar = 
        new ProgressBar.Circle('#progress', {
          color: '#0392CF',
          strokeWidth: 2,
          duration: 2000, // milliseconds
          easing: 'easeInOut'
        });

        var data = 3,
            result = parseFloat(1/parseFloat(data));

            result  = result.toFixed(4); 


      progressBar.animate(result); // percent
    };

  });